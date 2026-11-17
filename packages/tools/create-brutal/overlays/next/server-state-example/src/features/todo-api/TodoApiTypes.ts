export type StoredTodo = { id: number; title: string; completed: boolean };

export type TodoList = { todos: StoredTodo[]; nextId: number };

export type ApiAnswer = { status: number; body: unknown };

export type ApiBody = Record<string, unknown>;

export type ApiCall = { method: string; path: string; search: URLSearchParams; body: ApiBody };
