import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Connect, Plugin, ProxyOptions } from 'vite';

type MockTodo = { id: number; title: string; completed: boolean };
type MockList = { todos: MockTodo[]; nextId: number };
type MockAnswer = { status: number; body: unknown };

const API_PREFIX = '/api';
const SESSION_COOKIE = 'dev-api-list';
const STARTER_TODOS: MockTodo[] = [
  { id: 1, title: 'Read the README', completed: true },
  { id: 2, title: 'Run npm run check', completed: false },
  { id: 3, title: 'Write your first feature', completed: false },
];
const NOT_FOUND: MockAnswer = { status: 404, body: { message: 'No todo has this id' } };
const BLANK_TITLE: MockAnswer = { status: 400, body: { message: 'The title is blank' } };

function sessionId(request: IncomingMessage): string | undefined {
  return new RegExp(String.raw`(?:^|;\s*)${SESSION_COOKIE}=([\w-]+)`, 'u').exec(request.headers.cookie ?? '')?.[1];
}

function listOf(lists: Map<string, MockList>, request: IncomingMessage, response: ServerResponse): MockList {
  const id = sessionId(request);
  const existing = id === undefined ? undefined : lists.get(id);
  if (existing !== undefined) return existing;
  const fresh = id ?? crypto.randomUUID();
  response.setHeader('Set-Cookie', `${SESSION_COOKIE}=${fresh}; Path=/; SameSite=Strict`);
  const list = { todos: STARTER_TODOS.map((todo) => ({ ...todo })), nextId: STARTER_TODOS.length + 1 };
  lists.set(fresh, list);
  return list;
}

async function readJson(request: IncomingMessage): Promise<Record<string, unknown>> {
  let text = '';
  for await (const chunk of request) text += String(chunk);
  const parsed: unknown = text === '' ? {} : JSON.parse(text);
  return typeof parsed === 'object' && parsed !== null ? Object.fromEntries(Object.entries(parsed)) : {};
}

function normalizedTitle(title: unknown): string | undefined {
  if (typeof title !== 'string') return undefined;
  const normalized = title.trim().replaceAll(/\s+/gu, ' ');
  return normalized === '' || normalized.length > 200 ? undefined : normalized;
}

function patchTodo(todo: MockTodo, body: Record<string, unknown>): MockAnswer {
  const title = body['title'] === undefined ? todo.title : normalizedTitle(body['title']);
  if (title === undefined) return BLANK_TITLE;
  todo.title = title;
  if (typeof body['completed'] === 'boolean') todo.completed = body['completed'];
  return { status: 200, body: todo };
}

function answerTodo(list: MockList, method: string, id: number, body: Record<string, unknown>): MockAnswer {
  const todo = list.todos.find((candidate) => candidate.id === id);
  if (todo === undefined) return NOT_FOUND;
  if (method === 'PATCH') return patchTodo(todo, body);
  list.todos = list.todos.filter((candidate) => candidate !== todo);
  return { status: 200, body: todo };
}

function answer(list: MockList, method: string, url: URL, body: Record<string, unknown>): MockAnswer {
  const route = `${method} ${url.pathname}`;
  if (route === 'GET /todos') {
    const filter = url.searchParams.get('filter') ?? 'all';
    return { status: 200, body: list.todos.filter((todo) => filter === 'all' || todo.completed === (filter === 'completed')) };
  }
  if (route === 'POST /todos') {
    const title = normalizedTitle(body['title']);
    if (title === undefined) return BLANK_TITLE;
    const todo = { id: list.nextId, title, completed: false };
    list.nextId += 1;
    list.todos.push(todo);
    return { status: 201, body: todo };
  }
  if (route === 'DELETE /todos/completed') {
    const remaining = list.todos.filter((todo) => !todo.completed);
    const deleted = list.todos.length - remaining.length;
    list.todos = remaining;
    return { status: 200, body: { deleted } };
  }
  if (route === 'GET /stats') {
    const completed = list.todos.filter((todo) => todo.completed).length;
    return { status: 200, body: { total: list.todos.length, completed, remaining: list.todos.length - completed } };
  }
  const todoRoute = /^(PATCH|DELETE) \/todos\/(\d+)$/u.exec(route);
  if (todoRoute !== null) return answerTodo(list, todoRoute[1] ?? '', Number(todoRoute[2]), body);
  return { status: 404, body: { message: `No route for ${route}` } };
}

function mockMiddleware(): Connect.NextHandleFunction {
  const lists = new Map<string, MockList>();
  return (request, response, next) => {
    const list = listOf(lists, request, response);
    const url = new URL(request.url ?? '/', 'http://dev-api');
    if (!url.pathname.startsWith(`${API_PREFIX}/`)) {
      next();
      return;
    }
    url.pathname = url.pathname.slice(API_PREFIX.length);
    readJson(request)
      .then((body) => {
        const { status, body: payload } = answer(list, request.method ?? 'GET', url, body);
        response.statusCode = status;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(payload));
      })
      .catch(next);
  };
}

export function devApi(): Plugin {
  const target = process.env['API_URL'];
  if (target !== undefined) {
    const proxy: Record<string, ProxyOptions> = { [API_PREFIX]: { target, changeOrigin: true, rewrite: (path) => path.slice(API_PREFIX.length) } };
    return { name: 'dev-api', config: () => ({ server: { proxy }, preview: { proxy } }) };
  }
  return {
    name: 'dev-api',
    configureServer: (server) => {
      server.middlewares.use(mockMiddleware());
    },
    configurePreviewServer: (server) => {
      server.middlewares.use(mockMiddleware());
    },
  };
}
