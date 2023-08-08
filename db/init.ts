import { sequelize } from './connection';
import config from 'config';
import { Config } from '../models/config';
let initialized = false;

const force = config.get<Config['database']>('database').reset ?? false;

export const init = async () => {
  await sequelize.sync({ force });
  initialized = true;
};
