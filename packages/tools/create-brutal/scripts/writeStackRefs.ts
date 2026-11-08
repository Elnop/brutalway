import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { runCommand } from '#src/shared/lib/runCommand.ts';
import { stacks } from '#src/features/stacks/configs/stacksConfig.ts';

const root = fileURLToPath(new URL('../../../..', import.meta.url));
const refs = Object.fromEntries(
  stacks.map((stack) => {
    const sha = runCommand('git', ['log', '-1', '--format=%H', 'HEAD', '--', stack.directory], root, true).trim();
    if (sha === '') throw new Error(`${stack.directory} has no commit in HEAD`);
    return [stack.id, sha];
  }),
);
writeFileSync(new URL('../dist/stackRefs.json', import.meta.url), `${JSON.stringify(refs, null, 2)}\n`);
