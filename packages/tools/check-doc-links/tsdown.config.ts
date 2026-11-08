import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/checkDocLinks.ts'],
  format: 'esm',
  platform: 'node',
  fixedExtension: false,
  outDir: 'dist',
});
