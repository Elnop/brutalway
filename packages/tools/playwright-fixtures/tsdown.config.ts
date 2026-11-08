import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/playwrightFixtures.ts'],
  format: 'esm',
  platform: 'node',
  dts: true,
  fixedExtension: false,
  outDir: 'dist',
});
