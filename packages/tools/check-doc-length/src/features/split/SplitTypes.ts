import type { WrittenFile } from '#src/shared-features/docs/DocLengthTypes.ts';

export type SplitPlan = {
  removed: string;
  written: WrittenFile[];
};

export type TextEdit = {
  start: number;
  end: number;
  text: string;
};
