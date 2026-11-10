import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { StatsSchema } from '#src/features/todo-stats/TodoStatsSchemas.ts';
import type { TodoStatsService } from '#src/features/todo-stats/TodoStatsTypes.ts';

export function todoStatsRoutes(service: TodoStatsService): FastifyPluginAsyncZod {
  return async (app) => {
    app.get('/stats', { schema: { tags: ['stats'], response: { 200: StatsSchema } } }, async () =>
      service.stats(),
    );
  };
}
