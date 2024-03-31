import dotenv from 'dotenv';
import config from 'config';
import { logger } from './utils/logger';
import { home, listenToSocket, locations } from './homely/api';
import { init } from './db/init';
import { discover } from './entities/discover';
import { Device, Home } from './models/home';
import { gateway } from './entities/gateway';
import { createDevices } from './entities/devices';
import { getAndCreateEntities } from './entities/entities';
import { createEntitiesMqtt } from './entities/create-entities-mqtt';
import {
  publish,
  publishEntityChanges,
} from './entities/publish-entity-changes';
import { scheduleJob } from 'node-schedule';
import { HomelyFeature } from './db';
import { HomelyAlarmStateToHomeAssistant } from './models/alarm-state';

dotenv.config();

logger.info('Starting service');

if (!process.env.MQTT_HOST) {
  logger.fatal('MQTT_HOST is not defined');
  process.exit();
}
if (!process.env.HOMELY_USER) {
  logger.fatal('HOMELY_USER is not defined');
  process.exit();
}
if (!process.env.HOMELY_PASSWORD) {
  logger.fatal('HOMELY_PASSWORD is not defined');
  process.exit();
}

const pollHomely = (locationId: string) => {
  const schedule = config.get<string | undefined>('polling.schedule');
  scheduleJob(schedule ?? '*/30 * * * *', async () => {
    const homeData = await home(locationId);
    await updateAndCreateEntities(homeData);
  });
};

async function updateAndCreateEntities(homeData: Home) {
  const { device: alarmDevice, feature: gatewayFeature } = gateway(homeData);
  const devices: Array<Device> = [
    alarmDevice,
    ...homeData.devices.map((d) => ({
      ...d,
      homeId: homeData.locationId,
    })),
  ];
  await createDevices(devices);
  const discoveredDevices = discover(homeData);
  discoveredDevices.forEach((dev) =>
    publish(dev.availability_topic, dev.online ? 'online' : 'offline')
  );
  publish(gatewayFeature.availability_topic, 'online');
  await getAndCreateEntities(discoveredDevices, gatewayFeature);
  await createEntitiesMqtt();
  await publishEntityChanges(discoveredDevices, devices);
  const alarmState = HomelyAlarmStateToHomeAssistant[homeData.alarmState];

  publish(gatewayFeature.state_topic, alarmState);
}

process.on('exit', () => {
  HomelyFeature.findAll({})
    .then((features) => {
      features.forEach((f) => {
        if (f.state_topic) {
          publish(f.availability_topic, 'offline');
        }
      });
    })
    .catch(() => {
      /*already exiting, skip.*/
    });
});

(async function () {
  await init();
  try {
    const homes = await locations();
    logger.info(`Loaded ${homes.length} homes`);
    logger.debug(homes);

    try {
      for (const location of homes) {
        const homeData = await home(location.locationId);
        if (process.env.GET_LOCATION) {
          logger.debug({
            message: `Getting location info for ${location.name}. The process will exit afterwards`,
            data: homeData,
          });
          process.exit(1);
        }
        logger.debug(`Home data retrieved from homely:
        
        ${JSON.stringify(homeData, null, 2)}`);
        await updateAndCreateEntities(homeData);
        pollHomely(location.locationId);
        await listenToSocket(location.locationId);
      }
    } catch (ex) {
      logger.fatal({
        message: `Application encountered a fatal error and will exit.`,
        error: ex,
      });
      process.exit();
    }
  } catch (ex) {
    logger.fatal({
      message: `Application encountered a fatal error and will exit.`,
      error: ex,
    });
    process.exit();
  }
})();
