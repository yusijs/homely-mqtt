import { logger } from '../utils/logger';
import { getValueByPath } from '../utils/get-value-by-path';
import { mqttClient } from '../utils/mqtt';
import { InferCreationAttributes } from 'sequelize';
import { HomelyFeature } from '../db';
import { Device } from '../models/home';

/**
 * Publishes the state of all discovered devices to MQTT
 * @param discoveredDevices
 * @param devices
 */
export const publishEntityChanges = async (
  discoveredDevices: Array<InferCreationAttributes<HomelyFeature>>,
  devices: Array<Device>
) => {
  for (const feature of discoveredDevices) {
    const device = devices.find((d) => d.id === feature.device_id);
    if (!device) {
      logger.fatal(`Missing device ${feature.device_id}`);
      process.exit();
    }
    const value = getValueByPath(device?.features, feature.path) as unknown as
      | string
      | number
      | boolean;
    logger.info(`Publishing state for ${feature.name}`);
    publish(feature.state_topic, value);
  }
};

/**
 * Publishes a value to MQTT. Converts boolean values to ON/OFF to work out of the box with Home Assistant
 * @param stateTopic
 * @param value
 */
export const publish = (
  stateTopic: string,
  value: string | boolean | number
) => {
  if (value !== undefined && value !== null) {
    if (typeof value === 'boolean') {
      value = value ? 'ON' : 'OFF';
    }
    mqttClient.publish(stateTopic, String(value), {
      qos: 1,
      retain: true,
    });
  }
};
