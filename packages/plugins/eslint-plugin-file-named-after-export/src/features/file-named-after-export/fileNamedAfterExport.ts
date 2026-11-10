import { defineRule } from '@oxlint/plugins';
import type { ESTree } from '@oxlint/plugins';
import { baseName } from '@brutalway/lint-utils/baseName';
import { exportsOf } from '@brutalway/lint-utils/exportsOf';

function stringsAt(options: unknown, key: string): string[] {
  if (typeof options !== 'object' || options === null || !(key in options)) return [];
  const value: unknown = Reflect.get(options, key);
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

function namedDefaultExports(program: ESTree.Program) {
  return program.body.flatMap((node) => {
    if (node.type !== 'ExportDefaultDeclaration') return [];
    const { declaration } = node;
    const named =
      (declaration.type === 'FunctionDeclaration' || declaration.type === 'ClassDeclaration') &&
      declaration.id;
    return named ? [{ name: named.name, node }] : [];
  });
}

export const fileNamedAfterExport = defineRule({
  meta: {
    type: 'suggestion',
    docs: { description: 'Name a file with a single export after that export.' },
    messages: {
      renameFile: 'A file with a single export is named after it: rename {{file}} to {{name}}.',
    },
    defaultOptions: [{ exemptSuffixes: ['Types', 'Config', 'Content'] }],
    schema: [
      {
        type: 'object',
        properties: { exemptSuffixes: { type: 'array', items: { type: 'string' } } },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    return {
      Program(program) {
        const exemptSuffixes = stringsAt(context.options[0], 'exemptSuffixes');
        const file = baseName(context.filename);
        const entries = [...exportsOf(program), ...namedDefaultExports(program)];
        const [only] = entries;
        if (
          entries.length !== 1 ||
          !only ||
          exemptSuffixes.some((suffix) => file.endsWith(suffix)) ||
          only.name === file
        ) {
          return;
        }
        context.report({
          node: only.node,
          messageId: 'renameFile',
          data: { file, name: only.name },
        });
      },
    };
  },
});
