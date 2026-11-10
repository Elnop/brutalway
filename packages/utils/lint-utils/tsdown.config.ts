import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    'src/baseName.ts',
    'src/exportsOf.ts',
    'src/ExportTypes.ts',
    'src/ruleTester.ts',
    'src/lintFixture.ts',
    'src/OxlintReportTypes.ts',
  ],
  format: 'esm',
  platform: 'node',
  dts: true,
  fixedExtension: false,
  outDir: 'dist',
});
