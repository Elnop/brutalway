import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: /^@\//u, replacement: fileURLToPath(new URL('./src/', import.meta.url)) }],
  },
});
