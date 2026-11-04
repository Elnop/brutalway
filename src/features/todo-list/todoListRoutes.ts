import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { ClearedSchema, TodoIdParamsSchema } from '#src/features/todo-list/TodoListSchemas.ts';
import type { TodoListService } from '#src/features/todo-list/TodoListTypes.ts';
import { ErrorSchema } from '#src/shared/ErrorSchemas.ts';
import { TodoDraftSchema, TodoFilterSchema, TodoPatchSchema, TodoSchema } from '#src/shared-features/todos/TodosSchemas.ts';

const NOT_FOUND = { message: 'No todo has this id' };

export function todoListRoutes(service: TodoListService): FastifyPluginAsyncZod {
  return async (app) => {
    app.get('/todos', { schema: { tags: ['todos'], querystring: z.object({ filter: TodoFilterSchema.default('all') }), response: { 200: z.array(TodoSchema) } } }, async (request) =>
      service.list(request.query.filter),
    );

    app.post('/todos', { schema: { tags: ['todos'], body: TodoDraftSchema, response: { 201: TodoSchema } } }, async (request, reply) => {
      reply.code(201);
      return service.create(request.body);
    });

    app.delete('/todos/completed', { schema: { tags: ['todos'], response: { 200: ClearedSchema } } }, async () => service.clearCompleted());

    app.patch('/todos/:id', { schema: { tags: ['todos'], params: TodoIdParamsSchema, body: TodoPatchSchema, response: { 200: TodoSchema, 404: ErrorSchema } } }, async (request, reply) => {
      const todo = service.update(request.params.id, request.body);
      if (todo !== null) return todo;
      reply.code(404);
      return NOT_FOUND;
    });

    app.delete('/todos/:id', { schema: { tags: ['todos'], params: TodoIdParamsSchema, response: { 200: TodoSchema, 404: ErrorSchema } } }, async (request, reply) => {
      const todo = service.remove(request.params.id);
      if (todo !== null) return todo;
      reply.code(404);
      return NOT_FOUND;
    });
  };
}
