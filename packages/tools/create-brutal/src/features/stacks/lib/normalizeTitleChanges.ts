import type { StackChange } from '#src/shared/stack/StackTypes.ts';

const TODOS = 'src/shared/todos';
const TODOS_LIB = `${TODOS}/lib`;
const TITLE_FORM = 'src/features/todo-list/shared/title-form';

type Variant = Pick<StackChange, 'when'> & { folder: string; importers: string[] };

const VARIANTS: Variant[] = [
  {
    when: { forms: true, example: true, 'server-state': true },
    folder: TODOS,
    importers: [`${TODOS}/TodosSchemas.ts`],
  },
  {
    when: { forms: false, example: true, 'server-state': true },
    folder: TITLE_FORM,
    importers: [`${TITLE_FORM}/useTitleForm.ts`],
  },
];

function moveNormalizeTitle({ when, folder, importers }: Variant, docs: string[]): StackChange {
  const sourceEdits = [...importers, `${folder}/normalizeTitle.test.ts`].map((file) => ({
    file,
    replace: "'@/shared/todos/lib/normalizeTitle.ts'",
    with: `'${folder.replace(/^src\//u, '@/')}/normalizeTitle.ts'`,
  }));
  const docEdits = docs.map((file) => ({
    file,
    replace: `\`${TODOS_LIB}/normalizeTitle`,
    with: `\`${folder}/normalizeTitle`,
    all: true,
  }));
  return {
    when,
    move: Object.fromEntries(
      ['normalizeTitle.ts', 'normalizeTitle.test.ts'].map((file) => [
        `${TODOS_LIB}/${file}`,
        `${folder}/${file}`,
      ]),
    ),
    edits: [...sourceEdits, ...docEdits],
  };
}

export function normalizeTitleChanges(docs: string[]): StackChange[] {
  return VARIANTS.map((variant) => moveNormalizeTitle(variant, docs));
}
