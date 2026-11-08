import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/oklab.ts', 'src/createColorTokenReader.ts', 'src/ColorTypes.ts'],
  format: 'esm',
  platform: 'node',
  dts: true,
  fixedExtension: false,
  outDir: 'dist',
});
