import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    outDir: '../../backend/static/dist',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/chatbot': 'http://127.0.0.1:7860',
      '/conversation': 'http://127.0.0.1:7860',
      '/speak': 'http://127.0.0.1:7860',
    },
  },
});
