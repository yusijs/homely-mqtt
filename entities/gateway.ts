import { Device, Home } from '../models/home';
import * as crypto from 'crypto';
import { HomelyFeature } from '../db';
import { logger } from '../utils/logger';

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
    command_topic: `homely/${homeData.gatewayserial}/armed/command`,
    availability_topic: `homely/${homeData.gatewayserial}/availability`,
    config_topic: `homeassistant/alarm_control_panel/${homeData.gatewayserial}/config`,
    state_topic: `homely/${homeData.gatewayserial}/armed/state`,
  } as HomelyFeature;
  logger.debug({ gatewayDevice: device, gatewaySensor: feature });
  return { device, feature };
};
