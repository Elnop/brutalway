import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/NodeConfig.ts'],
  format: 'esm',
  platform: 'node',
  dts: true,
  fixedExtension: false,
  outDir: 'dist',
});
