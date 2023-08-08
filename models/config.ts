import { Dialect } from 'sequelize';

export type Config = {
  database: {
    reset?: boolean;
    connection: {
      username: string;
      password: string;
      storage: string;
      host: string;
      dialect: Dialect;
    };
    logLevel?:
      | 'fatal'
      | 'error'
      | 'warn'
      | 'info'
      | 'debug'
      | 'trace'
      | 'silent';
  };
  mqtt: {
    enabled?: boolean;
    host: string;
    user: string;
  };
  homely: {
    host: string;
  };
  polling?: {
    schedule?: string;
  };
  logLevel?: string;
};
