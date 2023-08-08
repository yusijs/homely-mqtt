import { sequelize } from './connection';
import config from 'config';
import { Config } from '../models/config';

const force = config.get<Config['database']>('database').reset ?? false;

/**
 * Initialise the database connection and sync the models.
 */
export const init = async () => {
  await sequelize.sync({ force });
};
