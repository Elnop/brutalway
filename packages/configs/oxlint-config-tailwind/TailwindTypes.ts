import type { ESTree } from '@oxlint/plugins';

export type Oklab = { l: number; a: number; b: number };

export type ColorToken = { name: string; color: Oklab | undefined };

export type ClassString = { node: ESTree.Node; text: string };

export type TailwindClass = { variants: string[]; utility: string };
