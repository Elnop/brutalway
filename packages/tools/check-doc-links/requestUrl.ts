import { REQUEST_TIMEOUT_MS } from './DocLinksConfig.ts';
import type { LinkResult, LinkVerdict } from './DocLinksTypes.ts';
import { npmPackageName } from './resolveLocally.ts';

const HEADERS = { 'user-agent': 'check-doc-links (+https://github.com/Elnop/brutalway)', accept: 'text/html,application/json;q=0.9,*/*;q=0.8' };

export function statusVerdict(status: number): LinkVerdict {
  if (status < 400) return 'alive';
  return status === 404 || status === 410 ? 'dead' : 'unsure';
}

function requestedUrl(url: string): string {
  const name = npmPackageName(url);
  return name === undefined ? url : `https://registry.npmjs.org/${name}`;
}

async function status(url: string, method: 'HEAD' | 'GET'): Promise<number> {
  const response = await fetch(url, { method, headers: HEADERS, redirect: 'follow', signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  await response.body?.cancel();
  return response.status;
}

function failureCode(error: unknown): unknown {
  return error instanceof Error && typeof error.cause === 'object' && error.cause !== null ? Reflect.get(error.cause, 'code') : undefined;
}

export async function requestUrl(url: string): Promise<LinkResult> {
  const target = requestedUrl(url);
  try {
    const head = await status(target, 'HEAD');
    const code = head < 400 ? head : await status(target, 'GET');
    return { verdict: statusVerdict(code), reason: `status ${code}` };
  } catch (error) {
    if (failureCode(error) === 'ENOTFOUND') return { verdict: 'dead', reason: 'the domain does not exist' };
    return { verdict: 'unsure', reason: error instanceof Error && error.name === 'TimeoutError' ? 'no answer' : 'no connection' };
  }
}
