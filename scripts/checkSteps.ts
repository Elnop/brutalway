import type { Step } from './StepTypes.ts';

const CODE_STEPS: Step[] = [
  { label: 'prettier', command: 'prettier', args: ['--check', '.'] },
  { label: 'typecheck', command: 'tsc', args: ['-p', '.'] },
  { label: 'lint', command: 'oxlint', args: ['--type-aware', '--disable-nested-config'] },
];

const REPOSITORY_STEPS: Step[] = [
  { label: 'check-doc-length', command: 'check-doc-length', args: [] },
  {
    label: 'check-doc-sources',
    command: 'check-doc-sources',
    args: [],
    reportsWhenPassing: true,
  },
  { label: 'check-doc-links', command: 'check-doc-links', args: [] },
  { label: 'knip', command: 'knip', args: [] },
  { label: 'knip production', command: 'knip', args: ['--production'] },
];

function inEachFolder(folders: readonly string[], label: string, args: string[]): Step[] {
  return folders.map((folder) => ({
    label: `${folder} ${label}`,
    command: 'npm',
    args,
    cwd: folder,
  }));
}

export function buildSteps(folders: readonly string[]): Step[] {
  return inEachFolder(folders, 'build', ['run', 'build', '--if-present']);
}

export function checkSteps(folders: readonly string[]): Step[] {
  return [
    ...CODE_STEPS,
    ...inEachFolder(folders, 'check', ['run', 'check', '--if-present']),
    ...REPOSITORY_STEPS,
    ...inEachFolder(folders, 'test', ['test', '--if-present']),
    { label: 'scripts test', command: 'node', args: ['--test', 'scripts/**/*.test.ts'] },
  ];
}
