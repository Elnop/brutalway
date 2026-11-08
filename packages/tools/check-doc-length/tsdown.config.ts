import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/checkDocLength.ts'],
  format: 'esm',
  platform: 'node',
  fixedExtension: false,
  outDir: 'dist',
});
