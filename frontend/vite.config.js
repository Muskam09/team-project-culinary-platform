import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',        // корінь проєкту (папка з index.html)
  base: './',       // щоб працювало правильно навіть з підпапки
  server: {
    port: 3000,     // dev-сервер на http://localhost:3000
    open: true,     // автоматично відкривати браузер
  },
  build: {
    outDir: 'dist', // куди буде збиратися проєкт
    sourcemap: true // для зручного дебагу
  }
});