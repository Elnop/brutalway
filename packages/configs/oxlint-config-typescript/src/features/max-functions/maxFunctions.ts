import { defineRule } from '@oxlint/plugins';
import type { ESTree } from '@oxlint/plugins';

const DEFAULT_MAX = 5;

function declaredFunctions(statement: ESTree.Node): ESTree.Node[] {
  const declaration =
    statement.type === 'ExportNamedDeclaration' || statement.type === 'ExportDefaultDeclaration'
      ? statement.declaration
      : statement;
  if (declaration === null || declaration === undefined) return [];
  if (declaration.type === 'FunctionDeclaration') return [declaration];
  if (declaration.type !== 'VariableDeclaration') return [];
  return declaration.declarations.filter(
    (declarator) =>
      declarator.init?.type === 'ArrowFunctionExpression' ||
      declarator.init?.type === 'FunctionExpression',
  );
}

export const maxFunctions = defineRule({
  meta: {
    type: 'suggestion',
    docs: { description: 'A file declares 5 top-level functions at most.' },
    messages: {
      tooMany:
        'This file declares {{count}} top-level functions, {{max}} at most: move the helpers into files of their own, under lib/.',
    },
    schema: [
      {
        type: 'object',
        properties: { max: { type: 'integer', minimum: 0 } },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const option: unknown = context.options[0];
    const max =
      typeof option === 'object' &&
      option !== null &&
      typeof Reflect.get(option, 'max') === 'number'
        ? Number(Reflect.get(option, 'max'))
        : DEFAULT_MAX;

    return {
      Program(program) {
        const functions = program.body.flatMap((statement) => declaredFunctions(statement));
        const extra = functions[max];
        if (extra !== undefined) {
          context.report({
            node: extra,
            messageId: 'tooMany',
            data: { count: String(functions.length), max: String(max) },
          });
        }
      },
    };
  },
});
