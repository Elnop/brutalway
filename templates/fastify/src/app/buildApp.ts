import { readFileSync } from 'node:fs';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';
import type { BuildAppOptions } from '#src/app/AppTypes.ts';
import { todoListRoutes } from '#src/features/todo-list/todoListRoutes.ts';
import { createTodoListService } from '#src/features/todo-list/todoListService.ts';
import { todoStatsRoutes } from '#src/features/todo-stats/todoStatsRoutes.ts';
import { createTodoStatsService } from '#src/features/todo-stats/todoStatsService.ts';
import { createServer } from '#src/shared/lib/createServer.ts';
import { openDatabase } from '#src/shared/lib/openDatabase.ts';
import { createTodosQueries } from '#src/shared-features/todos/todosQueries.ts';

const SWAGGER_THEME = readFileSync(new URL('../shared/swaggerTheme.css', import.meta.url), 'utf8');

export async function buildApp({ databasePath, logLevel }: BuildAppOptions) {
  const app = createServer({ logLevel });

  await app.register(swagger, {
    openapi: { info: { title: 'Todos API', version: '1.0.0' } },
    transform: jsonSchemaTransform,
  });
  await app.register(swaggerUi, {
    routePrefix: '/docs',
    theme: { title: 'Todos API', css: [{ filename: 'theme.css', content: SWAGGER_THEME }] },
  });

  const database = openDatabase(databasePath);
  app.addHook('onClose', async () => database.close());
  const todos = createTodosQueries(database);

  await app.register(todoListRoutes(createTodoListService({ todos })));
  await app.register(todoStatsRoutes(createTodoStatsService({ todos })));
  return app;
}
