import type { z } from 'zod';
import {
  ClearedSchema,
  TodoListSchema,
  TodoSchema,
  TodoStatsSchema,
} from '@/shared-features/todos/TodosSchemas.ts';
import type { Todo, TodoFilter, TodoUpdate } from '@/shared-features/todos/TodosTypes.ts';

const API_ROOT = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';
const JSON_HEADERS = { 'Content-Type': 'application/json' };

async function request<T>(
  schema: z.ZodType<T>,
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const response = await fetch(
    `${API_ROOT}${path}`,
    body === undefined ? { method } : { method, headers: JSON_HEADERS, body: JSON.stringify(body) },
  );
  if (!response.ok) throw new Error(`${method} ${API_ROOT}${path} answered ${response.status}`);
  return schema.parse(await response.json());
}

export const todosClient = {
  list: async (filter: TodoFilter) => request(TodoListSchema, 'GET', `/todos?filter=${filter}`),
  create: async (title: string) => request(TodoSchema, 'POST', '/todos', { title }),
  update: async ({ id, patch }: TodoUpdate) => request(TodoSchema, 'PATCH', `/todos/${id}`, patch),
  remove: async (id: Todo['id']) => request(TodoSchema, 'DELETE', `/todos/${id}`),
  clearCompleted: async () => request(ClearedSchema, 'DELETE', '/todos/completed'),
  stats: async () => request(TodoStatsSchema, 'GET', '/stats'),
};
