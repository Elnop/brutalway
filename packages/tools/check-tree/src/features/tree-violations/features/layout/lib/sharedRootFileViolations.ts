import type { Violation } from '#src/shared/violations/ViolationTypes.ts';

export function sharedRootFileViolations(name: string, files: readonly string[]): Violation[] {
  if (files.length === 0) return [];
  return [
    {
      rule: 'shared-root-files',
      path: name,
      count: files.length,
      message: `${name} holds ${files.join(', ')}: shared/ holds one folder per shared feature, move each file into the shared feature of its concept`,
    },
  ];
}
