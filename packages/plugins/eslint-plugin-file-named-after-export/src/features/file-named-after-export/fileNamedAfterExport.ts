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

const DEFAULT_PLATFORMS = ['web', 'ios', 'android', 'native'];

function withoutPlatform(file: string, options: unknown): string {
  const listed = stringsAt(options, 'platforms');
  const platforms =
    typeof options === 'object' && options !== null && 'platforms' in options
      ? listed
      : DEFAULT_PLATFORMS;
  const platform = platforms.find((name) => file.endsWith(`.${name}`));
  return platform === undefined ? file : file.slice(0, -platform.length - 1);
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
    defaultOptions: [
      { exemptSuffixes: ['Types', 'Config', 'Content'], platforms: DEFAULT_PLATFORMS },
    ],
    schema: [
      {
        type: 'object',
        properties: {
          exemptSuffixes: { type: 'array', items: { type: 'string' } },
          platforms: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    return {
      Program(program) {
        const exemptSuffixes = stringsAt(context.options[0], 'exemptSuffixes');
        const file = withoutPlatform(baseName(context.filename), context.options[0]);
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
