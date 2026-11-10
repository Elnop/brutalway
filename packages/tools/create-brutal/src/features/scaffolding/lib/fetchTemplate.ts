import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { downloadTemplate } from 'giget';
import { runCommand } from '#src/shared/lib/runCommand.ts';
import { TEMPLATES_REPOSITORY } from '#src/features/scaffolding/ScaffoldConfig.ts';
import type { TemplateSource } from '#src/features/scaffolding/ScaffoldTypes.ts';
import type { Stack } from '#src/shared-features/stack/StackTypes.ts';

function copyWorkingTree(from: string, to: string): void {
  const files = runCommand(
    'git',
    ['ls-files', '--cached', '--others', '--exclude-standard', '-z'],
    from,
    true,
  )
    .split('\0')
    .filter(Boolean);
  for (const file of files) {
    const source = join(from, file);
    if (!existsSync(source)) continue;
    mkdirSync(dirname(join(to, file)), { recursive: true });
    cpSync(source, join(to, file));
  }
}

export async function fetchTemplate(
  stack: Stack,
  dir: string,
  source: TemplateSource,
): Promise<void> {
  if (source.kind === 'local') {
    copyWorkingTree(join(source.root, stack.directory), dir);
    return;
  }
  await downloadTemplate(`github:${TEMPLATES_REPOSITORY}/${stack.directory}#${source.ref}`, {
    dir,
    silent: true,
  });
}
