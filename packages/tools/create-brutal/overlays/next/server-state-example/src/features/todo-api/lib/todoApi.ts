import { LIST_COOKIE } from '@/features/todo-api/TodoApiConfig.ts';
import type { ApiBody, ApiCall, TodoList } from '@/features/todo-api/TodoApiTypes.ts';
import { answerCall, starterList } from '@/features/todo-api/lib/answerCall.ts';

const lists = new Map<string, TodoList>();

function listOf(request: Request): { id: string; list: TodoList } {
  const known = new RegExp(String.raw`(?:^|;\s*)${LIST_COOKIE}=([\w-]+)`, 'u').exec(
    request.headers.get('cookie') ?? '',
  )?.[1];
  const id = known !== undefined && lists.has(known) ? known : crypto.randomUUID();
  const list = lists.get(id) ?? starterList();
  lists.set(id, list);
  return { id, list };
}

async function readBody(request: Request): Promise<ApiBody> {
  const text = await request.text();
  const parsed: unknown = text === '' ? {} : JSON.parse(text);
  return typeof parsed === 'object' && parsed !== null
    ? Object.fromEntries(Object.entries(parsed))
    : {};
}

async function callOf(request: Request, path: string[]): Promise<ApiCall> {
  return {
    method: request.method,
    path: `/${path.join('/')}`,
    search: new URL(request.url).searchParams,
    body: await readBody(request),
  };
}

export async function todoApi(request: Request, path: string[]): Promise<Response> {
  const { id, list } = listOf(request);
  const { status, body } = answerCall(list, await callOf(request, path));
  return Response.json(body, {
    status,
    headers: { 'Set-Cookie': `${LIST_COOKIE}=${id}; Path=/; SameSite=Strict; HttpOnly` },
  });
}
