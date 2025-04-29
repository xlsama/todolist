import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  server: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [
    VueRouter(),
    vue(),
    vueDevTools(),
    tailwindcss(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core',
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
