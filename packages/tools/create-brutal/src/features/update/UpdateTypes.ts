import type { Answers, BrutalwayState } from '#src/shared/stack/StackTypes.ts';

export type Renderer = (state: BrutalwayState, dir: string) => Promise<void>;

export type UpdatePlan = {
  projectDir: string;
  from: BrutalwayState;
  to: BrutalwayState;
  render: Renderer;
  attach: boolean;
};

export type FileComparison = { total: number; present: number; identical: number };

export type UpdateResult = {
  changed: boolean;
  conflicts: string[];
  packageConflicts: string[];
  attached: FileComparison | undefined;
};

export type JsonMerge = { value: unknown; conflicts: string[] };

export type UpdateArgs = {
  to: string | undefined;
  from: string | undefined;
  stack: string | undefined;
  set: Answers;
  local: boolean;
};

export type StartState = { state: BrutalwayState; attach: boolean };

export type UpdateTools = {
  version: string;
  renderCurrent: (state: BrutalwayState, dir: string, local: boolean) => Promise<void>;
  resolveOptions: (stack: string, given: Answers) => Promise<Answers>;
};
