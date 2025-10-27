import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // 测试环境配置
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],

    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        'dist/',
        'coverage/',
        'public/',
        'src/vite-env.d.ts'
      ],
      thresholds: {
        global: {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        }
      }
    },

    // 测试文件匹配
    include: [
      'src/**/*.{test,spec}.{js,ts,tsx}',
      'tests/**/*.{test,spec}.{js,ts,tsx}'
    ],

    // 排除文件
    exclude: [
      'node_modules/',
      'dist/',
      'coverage/',
      '**/*.d.ts'
    ],

    // 测试超时
    testTimeout: 10000,

    // 测试并发
    threads: true,
    maxThreads: 4,
    minThreads: 1,

    // 监视模式
    watch: false,

    // 静默输出
    silent: false,
    verbose: true,

    // 报告器
    reporter: ['verbose', 'json', 'html'],

    // 全局设置
    passWithNoTests: false,
    allowOnly: true,
    isolate: true,

    // Mock配置
    clearMocks: true,
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true
  },

  // 解析配置
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/components': resolve(__dirname, './src/components'),
      '@/pages': resolve(__dirname, './src/pages'),
      '@/hooks': resolve(__dirname, './src/hooks'),
      '@/utils': resolve(__dirname, './src/utils'),
      '@/types': resolve(__dirname, './src/types'),
      '@/store': resolve(__dirname, './src/store'),
      '@/services': resolve(__dirname, './src/services'),
      '@/assets': resolve(__dirname, './src/assets')
    }
  },

  // 环境变量
  define: {
    'process.env.NODE_ENV': '"test"'
  }
});