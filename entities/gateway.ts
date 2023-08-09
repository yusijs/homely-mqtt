import { Device, Home } from '../models/home';
import * as crypto from 'crypto';
import { HomelyFeature } from '../db';
import { logger } from '../utils/logger';
import { Config } from '../models/config';
import config from 'config';

const configTopic =
  config.get<Config['mqtt']>('mqtt').topicPrefixes?.config ?? 'homeassistant';
const stateTopic =
  config.get<Config['mqtt']>('mqtt').topicPrefixes?.config ?? 'homely';

/**
 * Create the gateway (alarm-panel) device
 * @param homeData
 */
export const gateway = (homeData: Home) => {
  const device = {
    id: homeData.locationId,
    homeId: homeData.locationId,
    location: homeData.name,
    modelId: 'Gateway',
    modelName: 'Gateway',
    name: 'Gateway',
    serialNumber: homeData.gatewayserial,
    online: true,
    features: {},
  } as Device;
  const baseId = `${homeData.gatewayserial}_alarm`;
  const feature = {
    id: crypto.createHash('md5').update(baseId).digest('hex'),
    device_id: device.id,
    device_id_suffix:
      crypto.createHash('md5').update(baseId).digest('hex') + '_alarm',
    path: 'root',
    format: 'string',
    type: 'alarm_control_panel',
    device_class: 'alarm_control_panel',
    name: 'Gateway',
    command_topic: `${stateTopic}/${homeData.gatewayserial}/armed/command`,
    availability_topic: `${stateTopic}/${homeData.gatewayserial}/availability`,
    config_topic: `${configTopic}/alarm_control_panel/${homeData.gatewayserial}/config`,
    state_topic: `${stateTopic}/${homeData.gatewayserial}/armed/state`,
  } as HomelyFeature;
  logger.debug({ gatewayDevice: device, gatewaySensor: feature });
  return { device, feature };
};
