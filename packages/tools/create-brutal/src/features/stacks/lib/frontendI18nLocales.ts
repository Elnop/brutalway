import type { StackChange } from '#src/shared/stack/StackTypes.ts';

const FRENCH_IMPORTS = [
  "import frApp from '@/app/locales/fr/app.json';",
  "import frTodoList from '@/features/todo-list/locales/fr/todoList.json';",
  "import frTodoStats from '@/features/todo-stats/locales/fr/todoStats.json';",
];

function exampleLocales(createI18n: string): StackChange {
  return {
    when: { i18n: 'en-fr', example: true },
    overlay: 'i18n-example',
    edits: [
      {
        file: createI18n,
        after: "import todoStats from '@/features/todo-stats/locales/en/todoStats.json';\n",
        insert: `${FRENCH_IMPORTS.join('\n')}\n`,
      },
      {
        file: createI18n,
        replace: 'fr: FRENCH,',
        with: 'fr: { app: frApp, todoList: frTodoList, todoStats: frTodoStats },',
      },
    ],
  };
}

function skeletonLocales(createI18n: string): StackChange {
  return {
    when: { i18n: 'en-fr', example: false },
    overlay: 'i18n-skeleton',
    edits: [
      {
        file: createI18n,
        after: "import app from '@/app/locales/en/app.json';\n",
        insert: "import frApp from '@/app/locales/fr/app.json';\n",
      },
      { file: createI18n, replace: 'fr: FRENCH,', with: 'fr: { app: frApp },' },
    ],
  };
}

export function frontendI18nLocales(createI18n: string): StackChange[] {
  return [exampleLocales(createI18n), skeletonLocales(createI18n)];
}
