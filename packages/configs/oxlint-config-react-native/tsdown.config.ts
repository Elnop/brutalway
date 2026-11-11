import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/ReactNativeConfig.ts', 'src/themeStylesPlugin.ts'],
  format: 'esm',
  platform: 'node',
  dts: true,
  fixedExtension: false,
  outDir: 'dist',
});
