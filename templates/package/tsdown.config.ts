import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/todo.ts', 'src/todos.ts'],
  format: 'esm',
  platform: 'node',
  dts: true,
  fixedExtension: false,
  outDir: 'dist',
});
