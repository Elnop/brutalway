import { extname } from 'node:path';
import { fileURLToPath } from 'node:url';

export function siblingModule(name: string, from: string) {
  return fileURLToPath(new URL(`./${name}${extname(from)}`, from));
}
