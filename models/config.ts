import { Dialect } from 'sequelize';

export type Config = {
  database: {
    /**
     * If true, the database will be reset on startup, and all devices will be re-discovered.
     */
    reset?: boolean;
    connection: {
      username: string;
      password: string;
      /**
       * SQLite specific option, either path/to/db.file or :memory:
       */
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
