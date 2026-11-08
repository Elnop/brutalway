import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/I18nextConfig.ts'],
  format: 'esm',
  platform: 'node',
  dts: true,
  fixedExtension: false,
  outDir: 'dist',
});
