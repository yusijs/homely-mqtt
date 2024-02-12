import pino from 'pino';
import config from 'config';
import { Config } from '../models/config';

const env = process.env.NODE_ENV;
const isTest = env === 'test';

const logLevel = config.get<Config['logLevel']>('logLevel');

export const logger = pino({
  level: logLevel ?? 'info',
  enabled: !isTest,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});
