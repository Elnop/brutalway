import type { Answers, StackChange } from '#src/shared-features/stack/StackTypes.ts';

const SCHEMAS = 'src/shared-features/todos/TodosSchemas.ts';
const TODOS = 'src/shared-features/todos';
const TODO_LIST_SHARED = 'src/features/todo-list/shared';
const TODOS_LIB = `${TODOS}/lib`;
const SELECTORS_IMPORTERS = [
  'src/features/todo-list/useTodoList.ts',
  'src/features/todo-stats/components/TodoStatsContainer.tsx',
  `${TODOS_LIB}/todosSelectors.test.ts`,
];
const FORMS_WITHOUT_SERVER_STATE: Answers = { forms: true, example: true, 'server-state': false };

type Variant = { when: Answers; folder: string; importers: string[] };

const VARIANTS: Variant[] = [
  {
    when: FORMS_WITHOUT_SERVER_STATE,
    folder: TODOS_LIB,
    importers: [SCHEMAS, `${TODOS}/todosStore.ts`],
  },
  {
    when: { forms: true, example: true, 'server-state': true },
    folder: TODOS,
    importers: [SCHEMAS],
  },
  {
    when: { forms: false, example: true, 'server-state': true },
    folder: TODO_LIST_SHARED,
    importers: [`${TODO_LIST_SHARED}/useTitleForm.ts`],
  },
];

function moveNormalizeTitle({ when, folder, importers }: Variant, docs: string[]): StackChange {
  const sourceEdits = [...importers, `${folder}/normalizeTitle.test.ts`].map((file) => ({
    file,
    replace: "'@/shared/normalizeTitle.ts'",
    with: `'${folder.replace(/^src\//u, '@/')}/normalizeTitle.ts'`,
  }));
  const docEdits = docs.map((file) => ({
    file,
    replace: '`src/shared/normalizeTitle',
    with: `\`${folder}/normalizeTitle`,
    all: true,
  }));
  return {
    when,
    move: Object.fromEntries(
      ['normalizeTitle.ts', 'normalizeTitle.test.ts'].map((file) => [
        `src/shared/${file}`,
        `${folder}/${file}`,
      ]),
    ),
    edits: [...sourceEdits, ...docEdits],
    keep: ['src/shared'],
  };
}

function selectorsBesideNormalizeTitle(when: Answers): StackChange {
  return {
    when,
    move: Object.fromEntries(
      ['todosSelectors.ts', 'todosSelectors.test.ts'].map((file) => [
        `${TODOS}/${file}`,
        `${TODOS_LIB}/${file}`,
      ]),
    ),
    edits: [
      ...SELECTORS_IMPORTERS.map((file) => ({
        file,
        replace: "'@/shared-features/todos/todosSelectors.ts'",
        with: "'@/shared-features/todos/lib/todosSelectors.ts'",
      })),
      {
        file: 'docs/concepts/architecture.md',
        replace: '`src/shared-features/todos/todosSelectors.ts`',
        with: '`src/shared-features/todos/lib/todosSelectors.ts`',
      },
    ],
  };
}

export function normalizeTitleChanges(docs: string[], serverState = true): StackChange[] {
  const formsWhen = serverState ? FORMS_WITHOUT_SERVER_STATE : { forms: true, example: true };
  const variants = serverState ? VARIANTS : [{ ...VARIANTS[0], when: formsWhen }];
  return [
    ...variants.map((variant) => moveNormalizeTitle(variant, docs)),
    selectorsBesideNormalizeTitle(formsWhen),
  ];
}
