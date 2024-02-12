import { Device, Home } from '../models/home';
import { sensors } from '../sensors';
import { getValueByPath } from '../utils/get-value-by-path';
import { logger } from '../utils/logger';
import { HomelyFeature } from '../db';
import { SensorWithName } from '../sensors/model';
import { InferCreationAttributes } from 'sequelize';
import config from 'config';
import { Config } from '../models/config';

const configTopic =
  config.get<Config['mqtt']>('mqtt').topicPrefixes?.config ?? 'homeassistant';
const stateTopic =
  config.get<Config['mqtt']>('mqtt').topicPrefixes?.state ?? 'homely';

// Capitalizes the first letter of a string to make device-names more human-readable
export const capitalize = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : 'NOT_AVAILABLE';

/**
 * Iterates over all devices in a home and looks for matching sensors as defined in {@link sensors}
 * @returns an array of {@link HomelyFeature} that is used to create entities in Home Assistant
 * @param home
 */
export const discover = (
  home: Home
): Array<InferCreationAttributes<HomelyFeature> & { online: boolean }> => {
  const { devices } = home;
  const matched = devices.map((dev) => ({
    device: dev,
    sensors: discoverDevice(dev),
  }));
  return matched.flatMap((m) => {
    return m.sensors.map((s) => {
      const device_class =
        s.deviceClass ??
        (s.getDeviceClass ? s.getDeviceClass(m.device) : undefined);
      const topicBase = `${stateTopic}/${m.device.id}`;
      return {
        id: s.id,
        device_id: m.device.id,
        device_id_suffix: `${m.device.id}_${s.deviceSuffix ?? s.name}`,
        path: s.path,
        format: s.format,
        unit: s.unit,
        type: s.type,
        device_class,
        online: m.device.online,
        icon: s.icon,
        state_class: s.stateClass,
        entity_category: s.entityCategory,
        name: capitalize(s.name).replace(/_/g, ' '),
        config_topic: `${configTopic}/${s.type}/${m.device.id}/${s.name}/config`,
        availability_topic: `${topicBase}/online`,
        state_topic: `${topicBase}/${s.name}/state`,
      } as InferCreationAttributes<HomelyFeature> & { online: boolean };
    });
  });
};

/**
 * Iterates over all sensors and looks for a match in the device features
 * @returns an array of {@link SensorWithName} that is used to create entities in Home Assistant
 * @param device
 */
export const discoverDevice = (device: Device) => {
  const { features } = device;
  return sensors
    .map((s) => {
      const hasValue = getValueByPath(features, s.path) ?? null;
      if (hasValue !== null) {
        logger.debug(`Matched ${device.id} on ${device.name} with ${s.path}`);
        let name: string;
        if ('name' in s) {
          name = s.name;
        } else {
          name = s.getName(device);
        }
        return {
          ...s,
          name,
          id: `${device.id}_${name}`,
        } as unknown as SensorWithName<unknown>;
      }
      return null;
    })
    .filter((n) => n !== null) as Array<SensorWithName<unknown>>;
};
