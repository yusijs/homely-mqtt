import dotenv from 'dotenv';
import config from 'config';
import { logger } from './utils/logger';
import { home, listenToSocket, locations } from './homely/api';
import { init } from './db/init';
import { discover } from './entities/discover';
import { Device, Home, HomelyLocation } from './models/home';
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

const exitOnFailure = config.get<boolean>('exitOnFailure') ?? true;

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
    try {
      const homeData = await home(locationId);
      await updateAndCreateEntities(homeData);
    } catch (ex) {
      logger.error(
        `Failed to poll homely for location ${locationId}, exception listed below:`
      );
      logger.error(ex);
      if (exitOnFailure) {
        process.exit();
      }
    }
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
    .catch((ex) => {
      /*already exiting, skip.*/
    });
});

async function run() {
  let homes: Array<HomelyLocation> | null;
  try {
    homes = await locations();
  } catch (ex) {
    homes = null;
    logger.error(`Failed to load homes`);
    logger.error(ex);
    if (exitOnFailure) {
      process.exit();
    }
  }
  if (!homes) {
    logger.error(`Failed to load homes, rerunning discovery in 30 seconds`);
    setTimeout(run, 30_000);
    return;
  }
  logger.info(`Loaded ${homes.length} homes`);
  logger.debug(homes);
  for (const location of homes) {
    let homeData: Home | null;
    try {
      homeData = await home(location.locationId);
    } catch (ex) {
      homeData = null;
      logger.error(`Failed to load home ${location.locationId}`);
      logger.error(ex);
      if (exitOnFailure) {
        process.exit();
      }
    }
    if (homeData) {
      await updateAndCreateEntities(homeData);
    }
    pollHomely(location.locationId);
    await listenToSocket(location.locationId);
  }
}

(async function () {
  await init();
  await run();
})();
