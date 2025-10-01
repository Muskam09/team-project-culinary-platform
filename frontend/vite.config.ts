import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/team-project-culinary-platform/",
  plugins: [react(), svgr()],
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
