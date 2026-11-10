import { posix } from 'node:path';

const URL_SCHEME = /^[a-z][\d+.a-z-]*:/iu;

function decodedPath(path: string): string {
  try {
    return decodeURI(path);
  } catch {
    return path;
  }
}

export function linkTarget(doc: string, url: string): string | undefined {
  if (url === '' || url.startsWith('#') || url.startsWith('/') || URL_SCHEME.test(url)) {
    return undefined;
  }
  const [path = ''] = url.split(/[#?]/u);
  return posix.join(posix.dirname(doc), decodedPath(path));
}
