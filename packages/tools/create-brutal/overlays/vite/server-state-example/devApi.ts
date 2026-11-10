import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Connect, Plugin, ProxyOptions } from 'vite';

import { answer, starterList } from './devApiRoutes.ts';

type MockList = ReturnType<typeof starterList>;

const API_PREFIX = '/api';
const SESSION_COOKIE = 'dev-api-list';

function sessionId(request: IncomingMessage): string | undefined {
  return new RegExp(String.raw`(?:^|;\s*)${SESSION_COOKIE}=([\w-]+)`, 'u').exec(
    request.headers.cookie ?? '',
  )?.[1];
}

function listOf(
  lists: Map<string, MockList>,
  request: IncomingMessage,
  response: ServerResponse,
): MockList {
  const id = sessionId(request);
  const existing = id === undefined ? undefined : lists.get(id);
  if (existing !== undefined) return existing;
  const fresh = id ?? crypto.randomUUID();
  response.setHeader('Set-Cookie', `${SESSION_COOKIE}=${fresh}; Path=/; SameSite=Strict`);
  const list = starterList();
  lists.set(fresh, list);
  return list;
}

async function readJson(request: IncomingMessage): Promise<Record<string, unknown>> {
  let text = '';
  for await (const chunk of request) text += String(chunk);
  const parsed: unknown = text === '' ? {} : JSON.parse(text);
  return typeof parsed === 'object' && parsed !== null
    ? Object.fromEntries(Object.entries(parsed))
    : {};
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
    const proxy: Record<string, ProxyOptions> = {
      [API_PREFIX]: {
        target,
        changeOrigin: true,
        rewrite: (path) => path.slice(API_PREFIX.length),
      },
    };
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
