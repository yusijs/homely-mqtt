import assert from 'assert/strict';
import test from 'node:test';
import { testLocation } from './test-data/location';
import { init } from './db/init';
import { createDevices } from './entities/devices';
import { Device } from './models/home';
import { HomelyDevice, HomelyFeature } from './db';
import { discover } from './entities/discover';
import { gateway } from './entities/gateway';
import { getAndCreateEntities } from './entities/entities';
import { mqttClient } from './utils/mqtt';
import { createEntitiesMqtt } from './entities/create-entities-mqtt';

test.describe('Verify location', () => {
  test.beforeEach(async () => {
    process.env.NODE_ENV = 'test';
    await init();
  });
  test(`Should create ${testLocation.devices.length} devices`, async () => {
    await createDevices(testLocation.devices as Array<Device>);
    const items = await HomelyDevice.findAll();
    assert.strictEqual(testLocation.devices.length, items.length);
  });
  test(`Should discover multiple entities`, async () => {
    await createDevices(testLocation.devices as Array<Device>);
    const discoveredHomeAssistantEntities = discover(testLocation);
    const allUniqueIds = Array.from(
      new Set(discoveredHomeAssistantEntities.map((e) => e.id))
    );
    const allUniqueConfigTopics = Array.from(
      new Set(discoveredHomeAssistantEntities.map((e) => e.config_topic))
    );
    const allUniqueStateTopics = Array.from(
      new Set(discoveredHomeAssistantEntities.map((e) => e.config_topic))
    );
    assert.strictEqual(
      allUniqueIds.length,
      discoveredHomeAssistantEntities.length
    );
    assert.strictEqual(
      allUniqueConfigTopics.length,
      discoveredHomeAssistantEntities.length
    );
    assert.strictEqual(
      allUniqueStateTopics.length,
      discoveredHomeAssistantEntities.length
    );
  });
  test('Should create gateway', async () => {
    const { device: alarmDevice, feature: gatewayFeature } =
      gateway(testLocation);
    assert.strictEqual(alarmDevice.id, testLocation.locationId);
    assert.strictEqual(gatewayFeature.device_id, alarmDevice.id);
  });
  test('Should emit events to mqtt', async () => {
    const { device: gatewayDevice, feature: gatewayFeature } =
      gateway(testLocation);
    await createDevices([
      ...testLocation.devices,
      gatewayDevice,
    ] as Array<Device>);
    const discoveredHomeAssistantEntities = discover(testLocation);
    const events = [];
    const cb = (value) => {
      events.push(value);
    };
    mqttClient.on('message', cb);
    await getAndCreateEntities(discoveredHomeAssistantEntities, gatewayFeature);
    await createEntitiesMqtt();
    const features = await HomelyFeature.findAll({
      include: {
        all: true,
      },
    });
    assert.strictEqual(
      features.length,
      discoveredHomeAssistantEntities.length + 1
    ); // + 1 for gateway
    await new Promise<void>((r) => {
      setTimeout(() => {
        r();
      }, 500);
    });
    assert.strictEqual(
      discoveredHomeAssistantEntities.length + 1,
      events.length
    );
  });
});
