/**
 * 测试环境设置文件
 */

import '@testing-library/jest-dom';
import { oauth2MockServer } from './mocks/oauth2-server';
import { vi } from 'vitest';

// 全局测试设置
beforeAll(() => {
  oauth2MockServer.listen({
    onUnhandledRequest: 'warn'
  });
});

afterEach(() => {
  oauth2MockServer.resetHandlers();
  // 清理所有模拟
  vi.clearAllMocks();
});

afterAll(() => {
  oauth2MockServer.close();
});

// Mock window.alert
global.alert = vi.fn();

// Mock window.confirm
global.confirm = vi.fn(() => true);

// Mock window.prompt
global.prompt = vi.fn(() => 'test-input');

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    ...global.crypto,
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
    getRandomValues: (array: Uint8Array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    },
    subtle: {
      ...global.crypto.subtle,
      digest: vi.fn().mockResolvedValue(
        new ArrayBuffer(32) // Mock SHA-256 digest result
      )
    }
  },
  writable: true
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
};

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true
});

// Mock location
const mockLocation = {
  href: 'http://localhost:3000',
  origin: 'http://localhost:3000',
  protocol: 'http:',
  host: 'localhost:3000',
  hostname: 'localhost',
  port: '3000',
  pathname: '/',
  search: '',
  hash: '',
  assign: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn()
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

// Mock navigator
Object.defineProperty(window, 'navigator', {
  value: {
    ...window.navigator,
    userAgent: 'test-user-agent',
    language: 'zh-CN',
    languages: ['zh-CN', 'en', 'en-US'],
    platform: 'test-platform'
  },
  writable: true
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock fetch with proper headers
global.fetch = vi.fn();

// Mock URLSearchParams
global.URLSearchParams = class URLSearchParams {
  private params: Record<string, string> = {};

  constructor(init?: string | Record<string, string> | URLSearchParams) {
    if (typeof init === 'string') {
      // Parse query string
      init.split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        if (key) {
          this.params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }
      });
    } else if (init && typeof init === 'object') {
      if (init instanceof URLSearchParams) {
        // Copy from another URLSearchParams
        init.forEach((value, key) => {
          this.params[key] = value;
        });
      } else {
        // Copy from record
        Object.assign(this.params, init);
      }
    }
  }

  append(name: string, value: string): void {
    this.params[name] = value;
  }

  delete(name: string): void {
    delete this.params[name];
  }

  get(name: string): string | null {
    return this.params[name] || null;
  }

  getAll(name: string): string[] {
    const value = this.params[name];
    return value ? [value] : [];
  }

  has(name: string): boolean {
    return name in this.params;
  }

  set(name: string, value: string): void {
    this.params[name] = value;
  }

  sort(): void {
    // Sort keys alphabetically
    const sortedKeys = Object.keys(this.params).sort();
    const sortedParams: Record<string, string> = {};
    sortedKeys.forEach(key => {
      sortedParams[key] = this.params[key];
    });
    this.params = sortedParams;
  }

  toString(): string {
    return Object.entries(this.params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }

  forEach(callbackfn: (value: string, key: string, parent: URLSearchParams) => void): void {
    Object.entries(this.params).forEach(([key, value]) => {
      callbackfn(value, key, this);
    });
  }

  entries(): IterableIterator<[string, string]> {
    return Object.entries(this.params)[Symbol.iterator]();
  }

  keys(): IterableIterator<string> {
    return Object.keys(this.params)[Symbol.iterator]();
  }

  values(): IterableIterator<string> {
    return Object.values(this.params)[Symbol.iterator]();
  }

  [Symbol.iterator](): IterableIterator<[string, string]> {
    return this.entries();
  }
};

// 环境变量模拟
Object.defineProperty(import.meta, 'env', {
  value: {
    MODE: 'test',
    DEV: false,
    PROD: false,
    SSR: false,
    VITE_OAUTH_BASE_URL: 'http://localhost:8099',
    VITE_CLIENT_ID: 'test-client-id',
    VITE_REDIRECT_URI: 'http://localhost:3000/auth/callback',
    VITE_SCOPES: 'openid profile email offline_access read write user_info',
    VITE_ENV: 'development'
  },
  writable: true
});

// 清理函数
export function cleanupMocks() {
  vi.clearAllMocks();
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
  sessionStorageMock.getItem.mockClear();
  sessionStorageMock.setItem.mockClear();
  sessionStorageMock.removeItem.mockClear();
  sessionStorageMock.clear.mockClear();
  mockLocation.assign.mockClear();
  mockLocation.replace.mockClear();
  mockLocation.reload.mockClear();
}