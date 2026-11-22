import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    'src/ReactNativeConfig.ts',
    'src/themeStylesPlugin.ts',
    'src/storagePlacementPlugin.ts',
    'src/designSystemPrimitives.ts',
    'src/designSystemPlugin.ts',
    'src/themeColorsPlugin.ts',
    'src/colorFiles.ts',
  ],
  format: 'esm',
  platform: 'node',
  dts: true,
  fixedExtension: false,
  outDir: 'dist',
});
