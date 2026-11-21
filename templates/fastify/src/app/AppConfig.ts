import type { FeatureRoutes } from '#src/app/AppTypes.ts';
import { todoListRoutes } from '#src/features/todo-list/todoListRoutes.ts';
import { createTodoListService } from '#src/features/todo-list/todoListService.ts';
import { todoStatsRoutes } from '#src/features/todo-stats/todoStatsRoutes.ts';
import { createTodoStatsService } from '#src/features/todo-stats/todoStatsService.ts';

export const FEATURES: FeatureRoutes[] = [
  (database) => todoListRoutes(createTodoListService(database)),
  (database) => todoStatsRoutes(createTodoStatsService(database)),
];
