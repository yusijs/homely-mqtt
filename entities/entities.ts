import { HomelyFeature } from '../db';
import { logger } from '../utils/logger';
import { InferCreationAttributes } from 'sequelize';

/**
 * Creates or updates entities in the database. If the entity already exists, it will be updated if any of the properties have changed.
 * @param discoveredDevices
 * @param gatewayFeature
 */
export const getAndCreateEntities = async (
  discoveredDevices: Array<InferCreationAttributes<HomelyFeature>>,
  gatewayFeature: HomelyFeature
) => {
  for (const feature of [...discoveredDevices, gatewayFeature]) {
    const exists = await HomelyFeature.findOne({
      where: { device_id_suffix: feature.device_id_suffix },
    });
    if (exists) {
      logger.debug(`Feature ${exists.id} already exists, upserting...`);
      const {
        createdAt,
        unique_id,
        published,
        unit_of_measurement,
        updatedAt,
        ...existingJson
      } = exists.toJSON();
      const allSame = Object.keys(existingJson).every((k) => {
        const a = existingJson[k as keyof typeof existingJson];
        const b = feature[k as keyof typeof existingJson];
        // null and undefined are considered equal
        if (
          (a === null || a === undefined) &&
          (b === null || b === undefined)
        ) {
          return true;
        }
        return a === b;
      });
      if (allSame) {
        logger.debug(`Nothing changed for ${feature.name}`);
      } else {
        logger.info(`Change detected for ${feature.name}, updating...`);
        logger.debug({ existingJson, feature });
        await exists.update({ ...feature, published: false });
        await exists.save();
      }
    } else {
      try {
        logger.debug(`Creating feature ${feature.name}: 
        
        ${JSON.stringify(feature, null, 2)}`);
        await HomelyFeature.create(feature);
      } catch (ex) {
        logger.error(ex);
      }
    }
  }
};
