import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    'src/ReactConfig.ts',
    'src/plugin.ts',
    'src/hookNamingPlugin.ts',
    'src/fetchPlugin.ts',
    'src/componentRolesPlugin.ts',
    'src/hookFilesPlugin.ts',
  ],
  format: 'esm',
  platform: 'node',
  dts: true,
  fixedExtension: false,
  outDir: 'dist',
});
