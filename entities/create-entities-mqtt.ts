import { HomelyFeature } from '../db';
import { mqttClient } from '../utils/mqtt';
import { logger } from '../utils/logger';
import config from 'config';
import { Config } from '../models/config';

const prefix = config.get<Config['mqtt']>('mqtt').entityPrefix;

/**
 * Publishes all entities where published is false to mqtt, and marks them as published.
 */
export const createEntitiesMqtt = async () => {
  const newFeatures = await HomelyFeature.findAll({
    include: {
      all: true,
    },
  });
  for await (const { value: d, done } of staggerEntities(newFeatures)) {
    if (done) break;
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
    const mqttPayload = {
      device,
      unique_id,
      name: `${prefix ? `${prefix} ` : ''}${name}`,
      device_class,
      unit_of_measurement,
      state_class,
      command_topic,
      config_topic,
      availability_topic,
      state_topic,
      entity_category,
    };
    logger.debug(`Creating home assistant entity:
      
      ${JSON.stringify(mqttPayload, null, 2)}`);
    mqttClient.publish(
      d.config_topic,
      JSON.stringify(mqttPayload),
      {
        qos: 1,
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
  }
};

type ReturnStagger<T> =
  | {
      value: T;
      done: false;
    }
  | {
      value: null;
      done: true;
    };

async function* staggerEntities<T>(
  entities: Array<T>
): AsyncIterable<ReturnStagger<T>> {
  for (const entity of entities) {
    yield { value: entity, done: false };
    await new Promise<void>((r) => setTimeout(() => r(), 500));
  }
  yield {
    value: null,
    done: true,
  };
}
