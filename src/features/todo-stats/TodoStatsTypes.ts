import type { createTodoStatsService } from '#src/features/todo-stats/todoStatsService.ts';

export type TodoStatsService = ReturnType<typeof createTodoStatsService>;
