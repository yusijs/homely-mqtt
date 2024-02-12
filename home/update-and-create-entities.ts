import { Device, Home } from '../models/home';
import { gateway } from '../entities/gateway';
import { createDevices } from '../entities/devices';
import { discover } from '../entities/discover';
import {
  publish,
  publishEntityChanges,
} from '../entities/publish-entity-changes';
import { getAndCreateEntities } from '../entities/entities';
import { createEntitiesMqtt } from '../entities/create-entities-mqtt';
import { HomelyAlarmStateToHomeAssistant } from '../models/alarm-state';

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

export { updateAndCreateEntities };
