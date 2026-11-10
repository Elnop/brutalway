import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { orNotFound } from '#src/features/todo-list/orNotFound.ts';
import { ClearedSchema, TodoIdParamsSchema } from '#src/features/todo-list/TodoListSchemas.ts';
import type { TodoListService } from '#src/features/todo-list/TodoListTypes.ts';
import { ErrorSchema } from '#src/shared/ErrorSchemas.ts';
import {
  TodoDraftSchema,
  TodoFilterSchema,
  TodoPatchSchema,
  TodoSchema,
} from '#src/shared-features/todos/TodosSchemas.ts';

type TodoApp = Parameters<FastifyPluginAsyncZod>[0];

function collectionRoutes(app: TodoApp, service: TodoListService): void {
  app.get(
    '/todos',
    {
      schema: {
        tags: ['todos'],
        querystring: z.object({ filter: TodoFilterSchema.default('all') }),
        response: { 200: z.array(TodoSchema) },
      },
    },
    async (request) => service.list(request.query.filter),
  );

  app.post(
    '/todos',
    { schema: { tags: ['todos'], body: TodoDraftSchema, response: { 201: TodoSchema } } },
    async (request, reply) => {
      reply.code(201);
      return service.create(request.body);
    },
  );
}

function clearCompletedRoute(app: TodoApp, service: TodoListService): void {
  app.delete(
    '/todos/completed',
    { schema: { tags: ['todos'], response: { 200: ClearedSchema } } },
    async () => service.clearCompleted(),
  );
}

function patchRoute(app: TodoApp, service: TodoListService): void {
  app.patch(
    '/todos/:id',
    {
      schema: {
        tags: ['todos'],
        params: TodoIdParamsSchema,
        body: TodoPatchSchema,
        response: { 200: TodoSchema, 404: ErrorSchema },
      },
    },
    async (request, reply) => orNotFound(service.update(request.params.id, request.body), reply),
  );
}

function deleteRoute(app: TodoApp, service: TodoListService): void {
  app.delete(
    '/todos/:id',
    {
      schema: {
        tags: ['todos'],
        params: TodoIdParamsSchema,
        response: { 200: TodoSchema, 404: ErrorSchema },
      },
    },
    async (request, reply) => orNotFound(service.remove(request.params.id), reply),
  );
}

export function todoListRoutes(service: TodoListService): FastifyPluginAsyncZod {
  return async (app) => {
    collectionRoutes(app, service);
    clearCompletedRoute(app, service);
    patchRoute(app, service);
    deleteRoute(app, service);
  };
}
