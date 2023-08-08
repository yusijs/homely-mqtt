import pino from 'pino';
import config from 'config';
import { Config } from '../models/config';

const logLevel = config.get<Config['logLevel']>('logLevel');

export const logger = pino({
  level: logLevel ?? 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});
