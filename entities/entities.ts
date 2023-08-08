import { HomelyFeature } from '../db';
import { logger } from '../utils/logger';
import { InferCreationAttributes } from 'sequelize';

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
        if (
          (a === null || a === undefined) &&
          (b === null || b === undefined)
        ) {
          return true;
        }
        return a === b;
      });
      if (allSame) {
        logger.info(`Nothing changed`);
      } else {
        logger.info(`Change detected:`);
        logger.info({ existingJson, feature });
        await exists.update({ ...feature, published: false });
        await exists.save();
      }
    } else {
      try {
        await HomelyFeature.create(feature);
      } catch (ex) {
        logger.error(ex);
      }
    }
  }
};
