import { execFileSync } from 'node:child_process';

const projectToken = process.env['PROJECT_TOKEN'] ?? '';

export function gh(args: string[], token?: string): string {
  return execFileSync('gh', args, {
    encoding: 'utf8',
    env: token === undefined ? process.env : { ...process.env, GH_TOKEN: token },
  }).trim();
}

export function graphql(query: string, variables: Record<string, string | number>): string {
  const fields = Object.entries(variables).flatMap(([name, value]) => [
    typeof value === 'number' ? '-F' : '-f',
    `${name}=${String(value)}`,
  ]);
  return gh(['api', 'graphql', '-f', `query=${query}`, ...fields], projectToken);
}
