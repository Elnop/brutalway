import type { Axiom } from '@/features/landing/shared/AxiomsTypes.ts';

export const AXIOMS: Axiom[] = [
  {
    letter: 'B',
    name: 'Bounded',
    motto: 'Siblings never know each other.',
    detail:
      'A layer imports only the layers below it. Two features never import each other: what they share moves one level down.',
    tone: 'yellow',
  },
  {
    letter: 'R',
    name: 'Reproducible',
    motto: 'A convention that no program checks does not exist.',
    detail:
      'Every rule runs in a tool, never in a review or a prompt. The same code gets the same verdict, locally, in the git hook and in CI.',
    tone: 'pink',
  },
  {
    letter: 'U',
    name: 'Unified',
    motto: 'One way to write each thing.',
    detail:
      'Function declarations, type over interface, imports through an alias. The front end and the API share the same layers and names.',
    tone: 'blue',
  },
  {
    letter: 'T',
    name: 'Teaching',
    motto: 'The error says what to change.',
    detail:
      'A failing check names the file, the rule and the fix. The Claude Code hook sends it back to the agent after each edit.',
    tone: 'paper',
  },
  {
    letter: 'A',
    name: 'Atomic',
    motto: 'One unit, one thing.',
    detail:
      'One file, one export, named after it. One rule, one message. Every CLI option can be added or left out on its own.',
    tone: 'pink',
  },
  {
    letter: 'L',
    name: 'Legible',
    motto: 'The name gives the path, the path gives the content.',
    detail:
      'todosStore.ts exports todosStore and todosActions. You know where to write a file without reading the codebase.',
    tone: 'yellow',
  },
];
