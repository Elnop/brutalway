import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { downloadTemplate } from 'giget';
import { runCommand } from './runCommand.ts';
import type { Stack, TemplateSource } from './StackTypes.ts';

function copyWorkingTree(from: string, to: string): void {
  const files = runCommand('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], from, true).split('\0').filter(Boolean);
  for (const file of files) {
    const source = join(from, file);
    if (!existsSync(source)) continue;
    mkdirSync(dirname(join(to, file)), { recursive: true });
    cpSync(source, join(to, file));
  }
}

export async function fetchTemplate(stack: Stack, dir: string, source: TemplateSource): Promise<void> {
  if (source.kind === 'local') {
    copyWorkingTree(join(source.root, stack.submodule), dir);
    return;
  }
  await downloadTemplate(`github:${stack.repository}#${source.ref}`, { dir, silent: true });
}
