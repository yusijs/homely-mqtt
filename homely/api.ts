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

const uri = `https://${config.get<Config['homely']['host']>(
  'homely.host'
)}/homely`;
const wsUri = `wss://${config.get<Config['homely']['host']>('homely.host')}`;

/**
 * Get all locations for the authenticated user.
 */
export async function locations(): Promise<Array<HomelyLocation>> {
  const token = await authenticator.getToken();
  const res = await fetch(`${uri}/locations`, {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
  });
  return await res.json();
}

/**
 * Get all details for a location, including devices & sensor states.
 * @param locationId
 */
export async function home(locationId: string): Promise<Home> {
  const token = await authenticator.getToken();
  const res = await fetch(`${uri}/home/${locationId}`, {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
  });
  return await res.json();
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
  socket.on('connect_error', logger.error);
  socket.on('error', logger.error);
  socket.on('disconnect', (e: string) => {
    logger.warn(`[WS] Disconnected from homely socket: ${e}`);
    logger.info('[WS] Reconnecting to homely...');
    listenToSocket(locationId).catch((e) => logger.error(e));
  });
  socket.on('event', async function (data: HomelySocket) {
    logger.trace(data);
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
          logger.info(`[WS] Updating state for ${feature.name} to ${c.value}`);
          const stateTopic = feature.state_topic;
          publish(stateTopic, c.value);
        }
        break;
      default:
        logger.warn(`Unknown event type ${data.type}`);
        logger.warn(data);
    }
  });
}
