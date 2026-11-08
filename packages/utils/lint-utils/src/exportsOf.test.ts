import { defineRule } from '@oxlint/plugins';
import { exportsOf } from '#src/exportsOf.ts';
import { ruleTester } from '#src/ruleTester.ts';

const listExports = defineRule({
  meta: { type: 'suggestion', messages: { exported: '{{name}} on {{type}}' }, schema: [] },
  create(context) {
    return {
      Program(program) {
        for (const { name, node } of exportsOf(program)) context.report({ node, messageId: 'exported', data: { name, type: node.declaration?.type ?? 'specifiers' } });
      },
    };
  },
});

ruleTester.run('exportsOf', listExports, {
  valid: [{ code: 'const hidden = 1; export default hidden; export * from "./other.js";' }],
  invalid: [
    {
      code: 'export function hexToRgb() {} export class Palette {} export const [first] = [], second = 2, { third } = {};',
      errors: [{ message: 'hexToRgb on FunctionDeclaration' }, { message: 'Palette on ClassDeclaration' }, { message: 'second on VariableDeclaration' }],
    },
    {
      filename: 'shapes.ts',
      code: 'const a = 1; const b = 2; export { a, b as renamed, a as "quoted name" }; export type Shape = { a: number }; export interface Point { x: number }',
      errors: [
        { message: 'a on specifiers' },
        { message: 'renamed on specifiers' },
        { message: 'quoted name on specifiers' },
        { message: 'Shape on TSTypeAliasDeclaration' },
        { message: 'Point on TSInterfaceDeclaration' },
      ],
    },
  ],
});
