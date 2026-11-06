import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      // Mengarahkan setiap request yang diawali '/api' dari port 5173 ke port 5000 backend
      '/api': {
        target: 'http://103.247.11.173:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
