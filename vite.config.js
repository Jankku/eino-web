import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    plugins: [react()],
    build: {
      outDir: 'build',
    },
    server: {
      open: true,
      port: 3000,
      strictPort: true,
    },
  };
});
