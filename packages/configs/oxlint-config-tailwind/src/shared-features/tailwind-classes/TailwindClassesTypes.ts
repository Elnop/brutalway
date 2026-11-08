import type { ESTree } from '@oxlint/plugins';

export type ClassString = { node: ESTree.Node; text: string };

export type TailwindClass = { variants: string[]; utility: string };
