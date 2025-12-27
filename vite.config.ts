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
    allowedHosts: [
        'localhost'
    ],
    port: 3000,
    host: true,
    open: true,
    strictPort: true, // 强制使用3000端口，如果被占用则失败
    proxy: {
      // OAuth2 标准端点代理 - 本地授权服务器
      '/oauth2': {
        target: 'http://localhost:8099',
        changeOrigin: true,
        secure: false,
      },
      // Connect 登出端点代理 (/connect/logout) - 本地授权服务器
      '/connect': {
        target: 'http://localhost:8099',
        changeOrigin: true,
        secure: false,
      },
      // OpenID Connect 发现端点代理 - 本地授权服务器
      '/.well-known': {
        target: 'http://localhost:8099',
        changeOrigin: true,
        secure: false,
      },
      // 通用登出端点代理（如果需要） - 本地授权服务器
      '/logout': {
        target: 'http://localhost:8099',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
