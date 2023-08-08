import { Device } from '../models/home';
import { HomelyDevice } from '../db';
import { logger } from '../utils/logger';

/**
 * Create (new) devices in the database
 * @param devices
 */
export const createDevices = async (devices: Array<Device>) => {
  for (const device of devices) {
    const { online, features, ...rest } = device;
    const [, created] = await HomelyDevice.findOrCreate({
      where: { id: device.id },
      defaults: rest,
    });
    if (created) {
      logger.debug(`Created ${device.id}`);
    } else {
      logger.debug(`Device ${device.id} already exists`);
    }
  }
};
