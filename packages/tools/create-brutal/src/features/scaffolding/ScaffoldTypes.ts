import type { Answers, Stack } from '#src/shared-features/stack/StackTypes.ts';

export type TemplateSource = { kind: 'local'; root: string } | { kind: 'github'; ref: string };

export type ScaffoldPlan = {
  dir: string;
  projectName: string;
  stack: Stack;
  answers: Answers;
  source: TemplateSource;
  git: boolean;
  install: boolean;
};

export type PackageJson = Record<string, unknown> & {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};
