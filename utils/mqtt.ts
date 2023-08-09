import { connect, IClientOptions, MqttClient } from 'mqtt';
import { logger } from './logger';
import dotenv from 'dotenv';
import config from 'config';
import { Config } from '../models/config';
import { DoneCallback } from 'mqtt/src/lib/shared';
import { IClientPublishOptions } from 'mqtt/src/lib/client';

dotenv.config();
process.env.MQTT_HOST =
  process.env.MQTT_HOST ?? config.get<Config['mqtt']>('mqtt').host;
process.env.MQTT_USER =
  process.env.MQTT_USER ?? config.get<Config['mqtt']>('mqtt').user;

const enabled = config.get<Config['mqtt']>('mqtt').enabled ?? true;

if (!process.env.MQTT_HOST) {
  logger.fatal('MQTT_HOST is not defined');
  process.exit();
}
const mqttOptions: IClientOptions = {
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASSWORD,
  log: (args) => logger.debug(args),
  will: {
    topic: 'homely/notice',
    payload: new Buffer('Homely is offline'),
    qos: 1,
    retain: false,
  },
};

let mqttClient: MqttClient;

if (enabled) {
  mqttClient = connect(process.env.MQTT_HOST, mqttOptions);
} else {
  // A mock instance of mqttClient for testing without sending any messages
  mqttClient = {
    publish: (
      topic: string,
      message: string | Buffer,
      opts?: IClientPublishOptions,
      callback?: DoneCallback
    ) => {
      let msg: object | string;
      try {
        msg = JSON.parse(message.toString());
      } catch {
        msg = message?.toString() ?? '';
      }
      logger.info({
        topic,
        message: msg,
        opts,
        callback,
      });
    },
  } as unknown as MqttClient;
}

export { mqttClient };

mqttClient.publish('homely/notice', 'Homely is online');
