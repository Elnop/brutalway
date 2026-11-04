import { z } from 'zod';
import type { Env } from '#src/shared/EnvTypes.ts';

const ENV_SCHEMA = z.object({
  HOST: z.string().default('127.0.0.1'),
  PORT: z.coerce.number().int().min(0).max(65_535).default(3000),
  DATABASE_PATH: z.string().min(1).default('todos.db'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
});

export function readEnv(source: Record<string, string | undefined> = process.env): Env {
  const env = ENV_SCHEMA.parse(source);
  return { host: env.HOST, port: env.PORT, databasePath: env.DATABASE_PATH, logLevel: env.LOG_LEVEL };
}
