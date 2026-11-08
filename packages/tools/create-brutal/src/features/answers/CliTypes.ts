import type { Answers } from '#src/shared-features/stack/StackTypes.ts';

export type CliArgs = {
  dir: string | undefined;
  stack: string | undefined;
  yes: boolean;
  local: boolean;
  help: boolean;
  git: boolean | undefined;
  install: boolean | undefined;
  options: Answers;
};

export type Preset = { stack?: string; git?: boolean; install?: boolean; options: Answers };
