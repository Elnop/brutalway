import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/checkDocSources.ts'],
  format: 'esm',
  platform: 'node',
  fixedExtension: false,
  outDir: 'dist',
});
