import type { BuildAppOptions } from '#src/app/AppTypes.ts';
import { openDatabase } from '#src/features/database/openDatabase.ts';
import { createHttpServer } from '#src/features/http-server/createHttpServer.ts';
import { todoListRoutes } from '#src/features/todo-list/todoListRoutes.ts';
import { createTodoListService } from '#src/features/todo-list/todoListService.ts';
import { todoStatsRoutes } from '#src/features/todo-stats/todoStatsRoutes.ts';
import { createTodoStatsService } from '#src/features/todo-stats/todoStatsService.ts';

export async function buildApp({ databasePath, logLevel }: BuildAppOptions) {
  const app = await createHttpServer({ logLevel });
  const database = openDatabase(databasePath);
  app.addHook('onClose', async () => database.close());

  await app.register(todoListRoutes(createTodoListService(database)));
  await app.register(todoStatsRoutes(createTodoStatsService(database)));
  return app;
}
