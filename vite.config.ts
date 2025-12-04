import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@emotion/babel-plugin', {}],
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    open: true,
    strictPort: true, // 强制使用3000端口，如果被占用则失败
    proxy: {
      '/oauth2': {
        target: 'http://localhost:8099',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
