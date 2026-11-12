import { packageFolders } from './packageFolders.ts';
import { runQuietly } from './runQuietly.ts';
import type { Step } from './StepTypes.ts';

const folders = packageFolders();

const steps: Step[] = [
  { label: 'prettier', command: 'prettier', args: ['--check', '.'] },
  { label: 'typecheck', command: 'tsc', args: ['-p', '.'] },
  { label: 'lint', command: 'oxlint', args: ['--type-aware', '--disable-nested-config'] },
  ...folders.map((folder) => ({
    label: `${folder} check`,
    command: 'npm',
    args: ['run', 'check', '--if-present'],
    cwd: folder,
  })),
  { label: 'check-doc-length', command: 'check-doc-length', args: [] },
  { label: 'check-doc-sources', command: 'check-doc-sources', args: [] },
  { label: 'check-doc-links', command: 'check-doc-links', args: [] },
  { label: 'knip', command: 'knip', args: [] },
  ...folders.map((folder) => ({
    label: `${folder} test`,
    command: 'npm',
    args: ['test', '--if-present'],
    cwd: folder,
  })),
  { label: 'scripts test', command: 'node', args: ['--test', 'scripts/**/*.test.ts'] },
];

for (const step of steps) {
  const status = await runQuietly(step);
  if (status !== 0) {
    process.exitCode = status;
    break;
  }
}
