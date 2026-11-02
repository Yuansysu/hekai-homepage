import { defineConfig } from 'vite';

export default defineConfig({
  // 相对路径，打包后的 dist 可以放到任意子目录下
  base: './',
  server: { port: 5173, open: false },
  preview: { port: 4173 },
  // three.js 本身就有 600KB 左右，不必提示
  build: { chunkSizeWarningLimit: 900 },
});
