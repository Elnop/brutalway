import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/brutalCheck.ts'],
  format: 'esm',
  platform: 'node',
  fixedExtension: false,
  outDir: 'dist',
});
