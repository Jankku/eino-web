import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import * as child from 'child_process';

const commitHash = child.execSync('git rev-parse --short HEAD').toString();

export default defineConfig(() => ({
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
  },
  plugins: [react(), checker({ typescript: { tsconfigPath: './tsconfig.app.json' } })],
  server: {
    open: true,
    port: 3000,
    strictPort: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFilesAfterEnv: ['./vitest.setup.ts'],
    include: ['./src/**/*.test.*'],
  },
}));
