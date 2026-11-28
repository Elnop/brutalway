import { extname } from 'node:path';
import { fileURLToPath } from 'node:url';

export function siblingModule(name: string) {
  return fileURLToPath(new URL(`./${name}${extname(import.meta.url)}`, import.meta.url));
}
