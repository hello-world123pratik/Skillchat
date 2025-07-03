import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://skillchat-backend.onrender.com', // Express backend port
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
