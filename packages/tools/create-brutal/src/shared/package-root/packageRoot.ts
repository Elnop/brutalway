import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

export function packageRoot(from: string): string {
  if (existsSync(join(from, 'package.json'))) return from;
  const parent = dirname(from);
  if (parent === from) throw new Error(`No package.json above ${from}`);
  return packageRoot(parent);
}
