import { HomelyFeature } from '../db';
import { mqttClient } from '../utils/mqtt';
import { logger } from '../utils/logger';

/**
 * Publishes all entities where published is false to mqtt, and marks them as published.
 */
export const createEntitiesMqtt = async () => {
  const newFeatures = await HomelyFeature.findAll({
    where: { published: false },
    include: {
      all: true,
    },
  });
  newFeatures.forEach((d) => {
    const homelyDevice = d.device!.toJSON();
    const device = {
      ids: [homelyDevice.id],
      name: homelyDevice.name,
      sw_version: 1,
      model: homelyDevice.modelName,
      manufacturer: 'Homely',
      hw_version: 1,
      suggested_area: homelyDevice.location,
    };
    const {
      unique_id,
      name,
      device_class,
      unit_of_measurement,
      state_class,
      command_topic,
      config_topic,
      availability_topic,
      state_topic,
      entity_category,
    } = d.toJSON();
    mqttClient.publish(
      d.config_topic,
      JSON.stringify({
        device,
        unique_id,
        name: `${homelyDevice.name} - ${name}`,
        device_class,
        unit_of_measurement,
        state_class,
        command_topic,
        config_topic,
        availability_topic,
        state_topic,
        entity_category,
      }),
      {
        qos: 2,
        retain: true,
      },
      async () => {
        d.setDataValue('published', true);
        try {
          await d.save();
          logger.debug(`Marked ${d.name} as published`);
        } catch {
          logger.error(`Failed to mark ${d.name} as published`);
        }
      }
    );
  });
};
