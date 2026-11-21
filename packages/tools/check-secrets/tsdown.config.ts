import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/checkSecrets.ts'],
  format: 'esm',
  platform: 'node',
  fixedExtension: false,
  outDir: 'dist',
});
