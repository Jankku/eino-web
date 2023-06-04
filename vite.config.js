import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => ({
  plugins: [react()],
  build: {
    outDir: 'build',
  },
  server: {
    open: true,
    port: 3000,
    strictPort: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFilesAfterEnv: ['./vitest.setup.js'],
    include: ['./src/**/*.test.*'],
  },
}));
