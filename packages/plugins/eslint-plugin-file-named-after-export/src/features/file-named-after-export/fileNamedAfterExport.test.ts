import { ruleTester } from '@brutalway/lint-utils/ruleTester';
import { fileNamedAfterExport } from '#src/features/file-named-after-export/fileNamedAfterExport.ts';

ruleTester.run('file-named-after-export', fileNamedAfterExport, {
  valid: [
    { filename: 'src/lib/hexToRgb.ts', code: 'export function hexToRgb() {}' },
    { filename: 'src/components/Formula.tsx', code: 'export function Formula() {}' },
    { filename: 'src/lib/random.ts', code: 'export function seed() {} export function pick() {}' },
    { filename: 'src/configs/LogoConfig.ts', code: 'export const LOGO_42 = "";' },
    { filename: 'src/types/ColorTypes.ts', code: 'export type Rgb = number[];' },
    { filename: 'src/content/HomeContent.ts', code: 'export const title = "";' },
    { filename: 'src/main.tsx', code: 'render();' },
    { filename: 'src/schemas/UserSchema.ts', code: 'export const user = {};', options: [{ exemptSuffixes: ['Schema'] }] },
  ],
  invalid: [
    { filename: 'src/configs/LogoConfig.ts', code: 'export const LOGO_42 = "";', options: [{ exemptSuffixes: ['Schema'] }], errors: [{ messageId: 'renameFile' }] },
    { filename: 'src/lib/color.ts', code: 'export function hexToRgb() {}', errors: [{ messageId: 'renameFile', data: { file: 'color', name: 'hexToRgb' } }] },
    {
      filename: 'src/lib/formatPrice.ts',
      code: 'const price = 1; export { price };',
      errors: [{ message: 'A file with a single export is named after it: rename formatPrice to price.' }],
    },
  ],
});
