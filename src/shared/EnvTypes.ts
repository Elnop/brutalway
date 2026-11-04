export type Env = {
  host: string;
  port: number;
  databasePath: string;
  logLevel: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silent';
};
