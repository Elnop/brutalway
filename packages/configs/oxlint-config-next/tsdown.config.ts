import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/NextConfig.ts', 'src/clientBoundaryPlugin.ts', 'src/serverActionsPlugin.ts'],
  format: 'esm',
  platform: 'node',
  dts: true,
  fixedExtension: false,
  outDir: 'dist',
});
