import type { Env } from '#src/shared/EnvTypes.ts';

export type BuildAppOptions = Pick<Env, 'databasePath' | 'logLevel'>;
