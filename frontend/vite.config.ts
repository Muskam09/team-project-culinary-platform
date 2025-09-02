import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/team-project-culinary-platform/",
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lightningcss']
  },
  server: {
    port: 5173,
    open: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
