import { describe, expect, it } from 'vitest';
import { todoApi } from '@/features/todo-api/lib/todoApi.ts';

type Session = { cookie: string };

async function call(session: Session, method: string, url: string, body?: unknown) {
  const response = await todoApi(
    new Request(`http://localhost/api${url}`, {
      method,
      headers: { cookie: session.cookie },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    }),
    new URL(`http://localhost${url}`).pathname.split('/').slice(1),
  );
  session.cookie = (response.headers.get('set-cookie') ?? '').split(';')[0] ?? '';
  return { status: response.status, body: await response.json() };
}

describe('todoApi', () => {
  it('starts each browser with its own copy of the starter todos', async () => {
    const first = { cookie: '' };
    await call(first, 'POST', '/todos', { title: 'Ship it' });
    const second = { cookie: '' };
    expect((await call(second, 'GET', '/todos')).body).toHaveLength(3);
    expect((await call(first, 'GET', '/todos')).body).toHaveLength(4);
  });

  it('adds, filters, renames, checks and removes todos', async () => {
    const session = { cookie: '' };
    expect(await call(session, 'POST', '/todos', { title: '  Ship   it ' })).toStrictEqual({
      status: 201,
      body: { id: 4, title: 'Ship it', completed: false },
    });
    expect((await call(session, 'GET', '/todos?filter=completed')).body).toHaveLength(1);
    expect((await call(session, 'GET', '/todos?filter=active')).body).toHaveLength(3);
    expect(
      (await call(session, 'PATCH', '/todos/4', { title: 'Ship', completed: true })).body,
    ).toStrictEqual({ id: 4, title: 'Ship', completed: true });
    expect((await call(session, 'DELETE', '/todos/2')).status).toBe(200);
    expect((await call(session, 'GET', '/stats')).body).toStrictEqual({
      total: 3,
      completed: 2,
      remaining: 1,
    });
    expect((await call(session, 'DELETE', '/todos/completed')).body).toStrictEqual({ deleted: 2 });
  });

  it('changes only the fields a patch sends', async () => {
    const session = { cookie: '' };
    expect((await call(session, 'PATCH', '/todos/2', { completed: true })).body).toStrictEqual({
      id: 2,
      title: 'Run npm run check',
      completed: true,
    });
    expect(
      (await call(session, 'PATCH', '/todos/2', { title: 'Run it', completed: 'yes' })).body,
    ).toStrictEqual({ id: 2, title: 'Run it', completed: true });
  });

  it('answers a request without a cookie or with a body that is not an object', async () => {
    const response = await todoApi(
      new Request('http://localhost/api/todos', { method: 'POST', body: '"Ship it"' }),
      ['todos'],
    );
    expect(response.status).toBe(400);
  });

  it('refuses a blank title, an unknown todo and an unknown route', async () => {
    const session = { cookie: '' };
    expect((await call(session, 'POST', '/todos', { title: '   ' })).status).toBe(400);
    expect((await call(session, 'PATCH', '/todos/1', { title: '' })).status).toBe(400);
    expect((await call(session, 'POST', '/todos', [])).status).toBe(400);
    expect((await call(session, 'DELETE', '/todos/99')).status).toBe(404);
    expect((await call(session, 'GET', '/nothing')).status).toBe(404);
  });
});
