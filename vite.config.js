import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as child from 'child_process';

const commitHash = child.execSync('git rev-parse --short HEAD').toString();

export default defineConfig(() => ({
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
  },
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
