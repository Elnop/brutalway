import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import type { openDatabase } from '#src/features/database/openDatabase.ts';
import type { createHttpServer } from '#src/features/http-server/createHttpServer.ts';

export type BuildAppOptions = Parameters<typeof createHttpServer>[0] & { databasePath: string };

export type FeatureRoutes = (database: ReturnType<typeof openDatabase>) => FastifyPluginAsyncZod;
