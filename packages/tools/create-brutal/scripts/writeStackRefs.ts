import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { runCommand } from '../src/runCommand.ts';
import { stacks } from '../src/stacks/stacksConfig.ts';

const root = fileURLToPath(new URL('../../../..', import.meta.url));
const refs = Object.fromEntries(
  stacks.map((stack) => {
    const [, , sha] = runCommand('git', ['ls-tree', 'HEAD', stack.submodule], root, true).trim().split(/\s+/u);
    if (sha === undefined) throw new Error(`${stack.submodule} is not a submodule of HEAD`);
    return [stack.id, sha];
  }),
);
writeFileSync(new URL('../dist/stackRefs.json', import.meta.url), `${JSON.stringify(refs, null, 2)}\n`);
