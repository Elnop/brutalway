import { BLANK_TITLE, NOT_FOUND, STARTER_TODOS } from '@/features/todo-api/TodoApiConfig.ts';
import type {
  ApiAnswer,
  ApiBody,
  ApiCall,
  StoredTodo,
  TodoList,
} from '@/features/todo-api/TodoApiTypes.ts';
import { answerListRoute } from '@/features/todo-api/lib/answerListRoute.ts';
import { storedTitle } from '@/features/todo-api/lib/storedTitle.ts';

function patchTodo(todo: StoredTodo, body: ApiBody): ApiAnswer {
  const title = body['title'] === undefined ? todo.title : storedTitle(body['title']);
  if (title === undefined) return BLANK_TITLE;
  todo.title = title;
  if (typeof body['completed'] === 'boolean') todo.completed = body['completed'];
  return { status: 200, body: todo };
}

function answerTodo(list: TodoList, method: string, id: number, body: ApiBody): ApiAnswer {
  const todo = list.todos.find((candidate) => candidate.id === id);
  if (todo === undefined) return NOT_FOUND;
  if (method === 'PATCH') return patchTodo(todo, body);
  list.todos = list.todos.filter((candidate) => candidate !== todo);
  return { status: 200, body: todo };
}

export function starterList(): TodoList {
  return { todos: STARTER_TODOS.map((todo) => ({ ...todo })), nextId: STARTER_TODOS.length + 1 };
}

export function answerCall(list: TodoList, call: ApiCall): ApiAnswer {
  const listAnswer = answerListRoute(list, call);
  if (listAnswer !== undefined) return listAnswer;
  const route = `${call.method} ${call.path}`;
  const todoRoute = /^(PATCH|DELETE) \/todos\/(\d+)$/u.exec(route);
  if (todoRoute !== null) return answerTodo(list, call.method, Number(todoRoute[2]), call.body);
  return { status: 404, body: { message: `No route for ${route}` } };
}
