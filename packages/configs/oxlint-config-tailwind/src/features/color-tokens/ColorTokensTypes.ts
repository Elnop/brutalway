import type { ESTree } from '@oxlint/plugins';
import type { Oklab } from '@brutalway/lint-utils/ColorTypes';

export type Offense = { text: string; color: Oklab | undefined; format: (token: string) => string };

export type Report = (node: ESTree.Node, offense: Offense) => void;
