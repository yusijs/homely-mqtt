import fetch from 'node-fetch';
import { Home, HomelyLocation } from '../models/home';
import io from 'socket.io-client';
import { HomelySocket } from '../models/homely-socket';
import { authenticator } from './auth';
import { logger } from '../utils/logger';
import config from 'config';
import { Config } from '../models/config';
import { HomelyDevice, HomelyFeature } from '../db';
import { publish } from '../entities/publish-entity-changes';
import { HomelyAlarmStateToHomeAssistant } from '../models/alarm-state';

const uri = `https://${config.get<Config['homely']['host']>(
  'homely.host'
)}/homely`;
const wsUri = `wss://${config.get<Config['homely']['host']>('homely.host')}`;

/**
 * GET an API path with the current token. If Homely rejects the token (401),
 * log in again and retry once.
 * @param path
 */
async function authorizedGet(path: string) {
  const get = async () => {
    const token = await authenticator.getToken();
    return await fetch(`${uri}${path}`, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });
  };
  let res = await get();
  if (res.status === 401) {
    logger.warn(`Homely rejected the token for ${path}, logging in again`);
    authenticator.invalidate();
    res = await get();
  }
  if (res.status >= 400) {
    const err = await res.text();
    throw new Error(err);
  }
  return res;
}

/**
 * Get all locations for the authenticated user.
 */
export async function locations(): Promise<Array<HomelyLocation>> {
  const res = await authorizedGet('/locations');
  return await res.json();
}

/**
 * Get all details for a location, including devices & sensor states.
 * @param locationId
 */
export async function home(locationId: string): Promise<Home> {
  const res = await authorizedGet(`/home/${locationId}`);
  return await res.json();
}

const RECONNECT_MIN_MS = 5_000;
const RECONNECT_MAX_MS = 5 * 60_000;
const reconnectTimers = new Map<string, ReturnType<typeof setTimeout>>();
const reconnectDelays = new Map<string, number>();

/**
 * Reconnect to the websocket after a delay that doubles on every failed
 * attempt (up to 5 minutes), so a Homely outage doesn't cause a tight loop.
 * Only one reconnect per location is pending at a time.
 * @param locationId
 * @param reason
 */
function scheduleReconnect(locationId: string, reason: string) {
  if (reconnectTimers.has(locationId)) {
    return;
  }
  const delay = reconnectDelays.get(locationId) ?? RECONNECT_MIN_MS;
  reconnectDelays.set(locationId, Math.min(delay * 2, RECONNECT_MAX_MS));
  logger.info(
    `[WS] Reconnecting to homely in ${Math.round(delay / 1000)}s (${reason})`
  );
  reconnectTimers.set(
    locationId,
    setTimeout(() => {
      reconnectTimers.delete(locationId);
      listenToSocket(locationId).catch((e) => {
        logger.error(`[WS] Reconnect failed: ${e}`);
        scheduleReconnect(locationId, 'reconnect failed');
      });
    }, delay)
  );
}

/**
 * Listen to websocket events from homely updating the state of devices
 * @param locationId
 */
export async function listenToSocket(locationId: string) {
  const token = await authenticator.getToken();
  const socket = io(
    `${wsUri}?locationId=${locationId}&token=Bearer ${token.access_token}`,
    {
      reconnection: false,
      transports: ['websocket'],
      autoConnect: true,
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${token.access_token}`,
          },
        },
      },
    }
  );
  socket.on('connect', () => {
    logger.info('[WS] Connected to homely');
    reconnectDelays.delete(locationId);
  });
  // With reconnection disabled, a failed connect never emits 'disconnect', so
  // without this the live updates would silently stop for good
  socket.on('connect_error', (err: unknown) => {
    logger.error(`[WS] Connection error: ${err}`);
    socket.close();
    if (/401|unauthori[sz]ed/i.test(String(err))) {
      authenticator.invalidate();
    }
    scheduleReconnect(locationId, 'connection error');
  });
  socket.on('error', (err: unknown) => {
    logger.error(`[WS] Error: ${err}`);
  });
  socket.on('disconnect', (e: string) => {
    logger.warn(`[WS] Disconnected from homely socket: ${e}`);
    if (e === 'io server disconnect') {
      // Homely ended the session, typically because the token is no longer valid
      authenticator.invalidate();
    }
    scheduleReconnect(locationId, e);
  });
  socket.on('event', async function (data: HomelySocket) {
    logger.trace(data);
    logger.debug(`Got ${data.type} event from homely ws-api`);
    switch (data.type) {
      case 'device-state-changed':
        const unit = data.data;
        const device = await HomelyDevice.findOne({
          where: { id: unit.deviceId },
        });
        if (!device) {
          logger.warn(`Device not found: ${unit.deviceId}`);
          return;
        }
        logger.debug(`Device found: ${device.name}`);
        try {
          for (const c of unit.changes) {
            const feature = await HomelyFeature.findOne({
              where: { device_id_suffix: `${device.id}_${c.stateName}` },
            });
            if (!feature) {
              logger.warn(
                `[WS] Feature ${c.feature} -> ${c.stateName} not found for device: ${device.name}`
              );
              logger.debug(device);
              logger.debug(
                `Query by ${device.id}_${c.stateName} returned 0 results`
              );
              return;
            }
            logger.info(
              `[WS] Updating state for ${feature.name} to ${c.value}`
            );
            const stateTopic = feature.state_topic;
            publish(stateTopic, c.value);
          }
        } catch (ex) {
          logger.error(`Failed to update state for device ${device.name}`);
          logger.error(ex);
          logger.error(`Details: ${JSON.stringify(unit, null, 2)}`);
        }
        break;
      case 'alarm-state-changed':
        const gatewayDevice = await HomelyDevice.findOne({
          where: { modelId: 'Gateway', homeId: data.data.locationId },
          include: { all: true, nested: true },
        });
        if (!gatewayDevice) {
          logger.warn(
            `Gateway device not found for location ${data.data.locationId}`
          );
          return;
        }
        logger.debug(gatewayDevice.toJSON());
        if (!gatewayDevice.features) {
          logger.warn(`Gateway device has 0 features ${data.data.locationId}`);
          return;
        }
        const feature = gatewayDevice.features[0];
        if (!feature) {
          logger.warn(
            `Gateway feature not found for location ${data.data.locationId}`
          );
          return;
        }
        const stateTopic = feature.state_topic;
        const state = HomelyAlarmStateToHomeAssistant[data.data.state];
        publish(stateTopic, state);
        break;
      default:
        logger.warn(
          `Unknown event type ${
            (data as { type: string }).type
          }, see payload below:`
        );
        logger.warn(data);
    }
  });
}
