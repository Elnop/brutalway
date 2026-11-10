import type { Heading, Root } from 'mdast';
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

export type Section = { node: Heading; start: number; depth: number; text: string };
export type Piece = { path: string; start: number; end: number; shift: number; children: { title: string; path: string }[] };
export type Target = { path: string; slug: string | undefined };
export type PlanRange = { from: number; to: number; depth: number; dir: string };
export type MovedDoc = { docPath: string; targets: Map<string, Target>; indexPath: string };
export type SplitSource = { source: string; tree: Root; sections: Section[]; pieces: Piece[] };
