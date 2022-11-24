import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { viteMockServe } from 'vite-plugin-mock';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    viteMockServe({
      supportTs: false,
      logger: false,
      mockPath: './src/service/mock/'
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/dev-api': {
        target: 'http://localhost:3000',
        // 允许跨域
        changeOrigin: true,
        // 如果是https接口，需要配置这个参数
        secure: true,
        //路径重写
        rewrite: (path) => path.replace(/^\/dev-api/, ""),
      },
    },
  },
})
