import { basename } from 'node:path';
import { defineRule } from '@oxlint/plugins';
import { baseName } from '@brutalway/lint-utils/baseName';
import { exportsOf } from '@brutalway/lint-utils/exportsOf';

export const storeLayout = defineRule({
  meta: {
    type: 'suggestion',
    docs: { description: 'A xStore.ts file exports only xStore and xActions.' },
    messages: {
      foreignExport: '{{file}} only exports {{store}} and {{actions}}: move {{name}} out of it.',
      missingStore: '{{file}} must export {{store}}.',
    },
    schema: [],
  },
  create(context) {
    return {
      Program(program) {
        const file = basename(context.filename);
        const store = baseName(context.filename);
        if (!store.endsWith('Store')) return;
        const actions = store.replace(/Store$/u, 'Actions');
        const entries = exportsOf(program);
        for (const entry of entries) {
          if (entry.name === store || entry.name === actions) continue;
          context.report({ node: entry.node, messageId: 'foreignExport', data: { file, store, actions, name: entry.name } });
        }
        if (!entries.some((entry) => entry.name === store)) context.report({ node: program, messageId: 'missingStore', data: { file, store } });
      },
    };
  },
});
