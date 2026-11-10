import { spawnSync } from 'node:child_process';
import { globSync } from 'node:fs';
import { dirname } from 'node:path';

const PACKAGE_MANIFESTS = 'packages/{configs,plugins,tools,utils}/*/package.json';
const command = `npm ${process.argv.slice(2).join(' ')}`;

for (const folder of globSync(PACKAGE_MANIFESTS).map(dirname).toSorted()) {
  process.stdout.write(`\n${folder}: ${command}\n`);
  const { status } = spawnSync('npm', process.argv.slice(2), { cwd: folder, stdio: 'inherit' });
  if (status !== 0) {
    process.stderr.write(`\n${folder}: ${command} failed\n`);
    process.exitCode = status ?? 1;
    break;
  }
}
