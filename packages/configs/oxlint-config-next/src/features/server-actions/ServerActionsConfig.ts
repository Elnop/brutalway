import type { OxlintOverride } from 'oxlint';

const USE_SERVER = 'ExpressionStatement[directive="use server"]';

const SERVER_ACTIONS = [
  {
    selector: `:function > BlockStatement > ${USE_SERVER}`,
    message:
      "A server action lives in a file of its own that starts with 'use server': move this function there, named after what it does (addTodo in addTodo.ts).",
  },
  {
    selector: `Program:has(> ${USE_SERVER}) > ExportNamedDeclaration ~ ExportNamedDeclaration`,
    message:
      "A 'use server' file exports a single server action, named after what it does: move this one into a file of its own.",
  },
  {
    selector: `Program:has(> ${USE_SERVER}) > ExportNamedDeclaration > FunctionDeclaration[async=false]`,
    message: 'A server action is an async function: add async.',
  },
];

export const serverActionsOverrides: OxlintOverride[] = [
  {
    files: ['**/*.ts'],
    rules: { 'server-actions/no-restricted-syntax': ['error', ...SERVER_ACTIONS] },
  },
  {
    files: ['**/*.tsx'],
    rules: {
      'server-actions/no-restricted-syntax': [
        'error',
        ...SERVER_ACTIONS,
        {
          selector: `Program > ${USE_SERVER}`,
          message: "A 'use server' file holds no JSX: rename it to .ts.",
        },
      ],
    },
  },
];
