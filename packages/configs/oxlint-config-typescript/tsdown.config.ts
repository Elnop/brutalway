import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    'src/TypescriptConfig.ts',
    'src/LineWidthConfig.ts',
    'src/lineWidthPlugin.ts',
    'src/plugin.ts',
    'src/typeDefinitionsPlugin.ts',
    'src/cognitiveComplexityPlugin.ts',
    'src/functionSizePlugin.ts',
  ],
  format: 'esm',
  platform: 'node',
  dts: true,
  fixedExtension: false,
  outDir: 'dist',
});
