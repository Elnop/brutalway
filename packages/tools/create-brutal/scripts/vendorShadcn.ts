import {
  cpSync,
  globSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runCommand } from '#src/features/scaffolding/lib/runCommand.ts';
import { OVERLAYS_ROOT } from '#src/features/scaffolding/ScaffoldConfig.ts';
import { SHADCN_PRIMITIVES, SHADCN_VERSION } from '#src/features/stacks/configs/shadcnConfig.ts';

const overlay = join(OVERLAYS_ROOT, 'vite', 'shadcn');
const target = join(overlay, 'third-party', 'shadcn');
const work = mkdtempSync(join(tmpdir(), 'brutal-shadcn-'));

writeFileSync(
  join(work, 'package.json'),
  `${JSON.stringify({ name: 'vendor-shadcn', private: true, type: 'module', dependencies: { react: '19.3.1', tailwindcss: '4.3.3' } }, null, 2)}\n`,
);
writeFileSync(
  join(work, 'tsconfig.json'),
  `${JSON.stringify({ compilerOptions: { paths: { '@third-party/*': ['./third-party/*'] } } }, null, 2)}\n`,
);
mkdirSync(join(work, 'src', 'app'), { recursive: true });
writeFileSync(join(work, 'src', 'app', 'globals.css'), "@import 'tailwindcss';\n");
cpSync(join(overlay, 'components.json'), join(work, 'components.json'));

runCommand(
  'npx',
  ['--yes', `shadcn@${SHADCN_VERSION}`, 'add', ...SHADCN_PRIMITIVES, '--yes'],
  work,
);

rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
for (const file of globSync('*.tsx', { cwd: join(work, 'third-party', 'shadcn') })) {
  cpSync(join(work, 'third-party', 'shadcn', file), join(target, file));
}
const installed: unknown = JSON.parse(readFileSync(join(work, 'package.json'), 'utf8'));
process.stdout.write(
  `Vendored ${SHADCN_PRIMITIVES.join(', ')} with shadcn ${SHADCN_VERSION}. package.json after the shadcn CLI:\n${JSON.stringify(installed, null, 2)}\n`,
);
rmSync(work, { recursive: true, force: true });
