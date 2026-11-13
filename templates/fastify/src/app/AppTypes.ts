import type { createHttpServer } from '#src/features/http-server/createHttpServer.ts';

export type BuildAppOptions = Parameters<typeof createHttpServer>[0] & { databasePath: string };
