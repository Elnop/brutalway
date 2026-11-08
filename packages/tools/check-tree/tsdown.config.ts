import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/checkTree.ts', 'src/treeViolations.ts'],
  format: 'esm',
  platform: 'node',
  dts: true,
  fixedExtension: false,
  outDir: 'dist',
});
