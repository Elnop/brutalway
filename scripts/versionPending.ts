import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const folder = process.argv[2] ?? '';
const pending = readdirSync(join(folder, '.changeset')).filter(
  (file) => file.endsWith('.md') && file !== 'README.md',
);

if (pending.length === 0) {
  process.stdout.write(`${folder}: no pending changeset, nothing to version\n`);
} else {
  const { status } = spawnSync('npm', ['run', 'version', '--prefix', folder], { stdio: 'inherit' });
  process.exitCode = status ?? 1;
}
