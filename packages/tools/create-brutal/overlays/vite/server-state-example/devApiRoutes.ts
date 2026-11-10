type MockTodo = { id: number; title: string; completed: boolean };
type MockList = { todos: MockTodo[]; nextId: number };
type MockAnswer = { status: number; body: unknown };
type Body = Record<string, unknown>;

const STARTER_TODOS: MockTodo[] = [
  { id: 1, title: 'Read the README', completed: true },
  { id: 2, title: 'Run npm run check', completed: false },
  { id: 3, title: 'Write your first feature', completed: false },
];
const NOT_FOUND: MockAnswer = { status: 404, body: { message: 'No todo has this id' } };
const BLANK_TITLE: MockAnswer = { status: 400, body: { message: 'The title is blank' } };

function normalizedTitle(title: unknown): string | undefined {
  if (typeof title !== 'string') return undefined;
  const normalized = title.trim().replaceAll(/\s+/gu, ' ');
  return normalized === '' || normalized.length > 200 ? undefined : normalized;
}

const LIST_ROUTES: Record<string, (list: MockList, url: URL, body: Body) => MockAnswer> = {
  'GET /todos': (list, url) => {
    const filter = url.searchParams.get('filter') ?? 'all';
    return {
      status: 200,
      body: list.todos.filter(
        (todo) => filter === 'all' || todo.completed === (filter === 'completed'),
      ),
    };
  },
  'POST /todos': (list, _url, body) => {
    const title = normalizedTitle(body['title']);
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

function patchTodo(todo: MockTodo, body: Body): MockAnswer {
  const title = body['title'] === undefined ? todo.title : normalizedTitle(body['title']);
  if (title === undefined) return BLANK_TITLE;
  todo.title = title;
  if (typeof body['completed'] === 'boolean') todo.completed = body['completed'];
  return { status: 200, body: todo };
}

function answerTodo(list: MockList, method: string, id: number, body: Body): MockAnswer {
  const todo = list.todos.find((candidate) => candidate.id === id);
  if (todo === undefined) return NOT_FOUND;
  if (method === 'PATCH') return patchTodo(todo, body);
  list.todos = list.todos.filter((candidate) => candidate !== todo);
  return { status: 200, body: todo };
}

export function starterList(): MockList {
  return { todos: STARTER_TODOS.map((todo) => ({ ...todo })), nextId: STARTER_TODOS.length + 1 };
}

export function answer(list: MockList, method: string, url: URL, body: Body): MockAnswer {
  const route = `${method} ${url.pathname}`;
  const listRoute = LIST_ROUTES[route];
  if (listRoute !== undefined) return listRoute(list, url, body);
  const todoRoute = /^(PATCH|DELETE) \/todos\/(\d+)$/u.exec(route);
  if (todoRoute !== null) return answerTodo(list, todoRoute[1] ?? '', Number(todoRoute[2]), body);
  return { status: 404, body: { message: `No route for ${route}` } };
}
