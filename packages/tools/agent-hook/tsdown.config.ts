import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/agentHook.ts'],
  format: 'esm',
  platform: 'node',
  fixedExtension: false,
  outDir: 'dist',
});
