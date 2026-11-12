import { spawnSync } from 'node:child_process';
import { packageFolders } from './packageFolders.ts';

const command = `npm ${process.argv.slice(2).join(' ')}`;

for (const folder of packageFolders()) {
  process.stdout.write(`\n${folder}: ${command}\n`);
  const { status } = spawnSync('npm', process.argv.slice(2), { cwd: folder, stdio: 'inherit' });
  if (status !== 0) {
    process.stderr.write(`\n${folder}: ${command} failed\n`);
    process.exitCode = status ?? 1;
    break;
  }
}
