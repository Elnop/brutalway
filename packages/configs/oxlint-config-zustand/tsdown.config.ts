import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/ZustandConfig.ts', 'src/plugin.ts', 'src/storeSelectorPlugin.ts'],
  format: 'esm',
  platform: 'node',
  dts: true,
  fixedExtension: false,
  outDir: 'dist',
});
