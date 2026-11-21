import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/checkExceptions.ts'],
  format: 'esm',
  platform: 'node',
  fixedExtension: false,
  outDir: 'dist',
});
