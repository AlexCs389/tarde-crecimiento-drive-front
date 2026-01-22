import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@config': path.resolve(__dirname, './src/config'),
      '@core': path.resolve(__dirname, './src/core'),
      '@modules': path.resolve(__dirname, './src/modules'),
      '@router': path.resolve(__dirname, './src/router'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@store': path.resolve(__dirname, './src/store'),
    },
  },
});
