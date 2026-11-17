import { BLANK_TITLE } from '@/features/todo-api/TodoApiConfig.ts';
import type { ApiAnswer, ApiCall, TodoList } from '@/features/todo-api/TodoApiTypes.ts';
import { storedTitle } from '@/features/todo-api/lib/storedTitle.ts';

const LIST_ROUTES: Record<string, (list: TodoList, call: ApiCall) => ApiAnswer> = {
  'GET /todos': (list, { search }) => {
    const filter = search.get('filter') ?? 'all';
    return {
      status: 200,
      body: list.todos.filter(
        (todo) => filter === 'all' || todo.completed === (filter === 'completed'),
      ),
    };
  },
  'POST /todos': (list, { body }) => {
    const title = storedTitle(body['title']);
    if (title === undefined) return BLANK_TITLE;
    const todo = { id: list.nextId, title, completed: false };
    list.nextId += 1;
    list.todos.push(todo);
    return { status: 201, body: todo };
  },
  'DELETE /todos/completed': (list) => {
    const remaining = list.todos.filter((todo) => !todo.completed);
    const deleted = list.todos.length - remaining.length;
    list.todos = remaining;
    return { status: 200, body: { deleted } };
  },
  'GET /stats': (list) => {
    const completed = list.todos.filter((todo) => todo.completed).length;
    return {
      status: 200,
      body: { total: list.todos.length, completed, remaining: list.todos.length - completed },
    };
  },
};

export function answerListRoute(list: TodoList, call: ApiCall): ApiAnswer | undefined {
  return LIST_ROUTES[`${call.method} ${call.path}`]?.(list, call);
}
