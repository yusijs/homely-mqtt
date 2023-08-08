import { Sequelize } from 'sequelize';
import config from 'config';
import { Config } from '../models/config';
import { logger } from '../utils/logger';
import pino from 'pino';
import LogFn = pino.LogFn;

const dbConfig = config.get<Config['database']>('database');

// ((sql: string, timing?: number) => void)
const dbLogger = (sql: string, timing?: number) => {
  let log: LogFn;
  if (dbConfig.logLevel) {
    log = logger[dbConfig.logLevel] ?? logger.debug;
  } else {
    log = logger.debug;
  }
  return log(`[DB][${timing}ms] ${sql}`);
};

export const sequelize = new Sequelize({
  ...dbConfig.connection,
  logging: dbLogger,
});
