import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { securityHeaders } from './securityHeaders.ts';

export default defineConfig({
  plugins: [react(), securityHeaders()],
  resolve: {
    alias: [{ find: /^@\//u, replacement: fileURLToPath(new URL('./src/', import.meta.url)) }],
  },
});
