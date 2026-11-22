import type { Step } from '#src/features/steps/StepsTypes.ts';

export const STEPS: Step[] = [
  { name: 'prettier', command: 'prettier', args: ['--check', '.'], dependency: 'prettier' },
  { name: 'typecheck', script: 'typecheck' },
  { name: 'lint', script: 'lint' },
  { name: 'styles', script: 'styles' },
  { name: 'deps', script: 'deps' },
  { name: 'tree', script: 'tree' },
  { name: 'duplicates', script: 'duplicates' },
  { name: 'docs', script: 'docs' },
  { name: 'messages', script: 'messages' },
  { name: 'alint', command: 'alint', args: ['check'], dependency: '@asamarts/alint' },
  { name: 'knip', command: 'knip', args: [], dependency: 'knip' },
  { name: 'knip --production', command: 'knip', args: ['--production'], dependency: 'knip' },
  {
    name: 'check-secrets',
    command: 'check-secrets',
    args: [],
    dependency: '@brutalway/check-secrets',
  },
  {
    name: 'check-exceptions',
    command: 'check-exceptions',
    args: [],
    dependency: '@brutalway/check-exceptions',
  },
];
