import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import checker from 'vite-plugin-checker';
import compress from 'vite-plugin-compression';
import * as child from 'child_process';

const commitHash = child.execSync('git rev-parse --short HEAD').toString();

export default defineConfig(() => ({
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    checker({ typescript: { tsconfigPath: 'tsconfig.app.json' }, overlay: false }),
    compress({ algorithm: 'brotliCompress', verbose: false }),
  ],
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
