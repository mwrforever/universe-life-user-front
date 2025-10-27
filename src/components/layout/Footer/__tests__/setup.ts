/**
 * 万象生活底栏测试配置
 * 包含测试环境设置、Mock配置、全局测试工具
 */

import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// 配置Testing Library
configure({
  testIdAttribute: 'data-testid',
  asyncUtilTimeout: 5000,
});

// Mock Intersection Observer
global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn((element) => {
    // 立即触发回调模拟元素可见
    setTimeout(() => {
      callback([{ isIntersecting: true, target: element } as IntersectionObserverEntry]);
    }, 0);
  }),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock Resize Observer
global.ResizeObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  writable: true,
  configurable: true,
  value: jest.fn().mockImplementation(() => ({
    getPropertyValue: jest.fn().mockReturnValue(''),
    width: '100px',
    height: '100px',
    color: 'rgba(0, 0, 0, 0.85)',
    backgroundColor: '#ffffff',
    transform: 'none',
    opacity: '1',
  })),
});

// Mock window.performance
Object.defineProperty(window, 'performance', {
  writable: true,
  configurable: true,
  value: {
    ...global.performance,
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByType: jest.fn().mockReturnValue([]),
    getEntriesByName: jest.fn().mockReturnValue([]),
    clearMarks: jest.fn(),
    clearMeasures: jest.fn(),
    memory: {
      usedJSHeapSize: 10 * 1024 * 1024, // 10MB
      totalJSHeapSize: 20 * 1024 * 1024, // 20MB
      jsHeapSizeLimit: 100 * 1024 * 1024, // 100MB
    },
  },
});

// Mock window.requestAnimationFrame
Object.defineProperty(window, 'requestAnimationFrame', {
  writable: true,
  configurable: true,
  value: jest.fn((callback) => {
    return setTimeout(callback, 16); // 60fps
  }),
});

// Mock window.cancelAnimationFrame
Object.defineProperty(window, 'cancelAnimationFrame', {
  writable: true,
  configurable: true,
  value: jest.fn((id) => {
    clearTimeout(id);
  }),
});

// Mock navigator.vibrate
Object.defineProperty(navigator, 'vibrate', {
  writable: true,
  configurable: true,
  value: jest.fn().mockReturnValue(true),
});

// Mock window.open
Object.defineProperty(window, 'open', {
  writable: true,
  configurable: true,
  value: jest.fn().mockImplementation(() => ({
    closed: false,
    focus: jest.fn(),
    close: jest.fn(),
  })),
});

// Mock window.location
Object.defineProperty(window, 'location', {
  writable: true,
  configurable: true,
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    protocol: 'http:',
    host: 'localhost:3000',
    hostname: 'localhost',
    port: '3000',
    pathname: '/',
    search: '',
    hash: '',
    assign: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
  },
});

// Mock CSS Variables support
Object.defineProperty(document.documentElement, 'style', {
  writable: true,
  configurable: true,
  value: {
    setProperty: jest.fn(),
    getPropertyValue: jest.fn().mockReturnValue(''),
    removeProperty: jest.fn(),
  },
});

// Mock URL constructor
global.URL = class MockURL {
  constructor(public url: string, public base?: string) {
    // 简单的URL解析
    const parts = url.split('/');
    this.pathname = '/' + parts.slice(3).join('/');
    this.search = '';
    this.hash = '';
    this.origin = base || 'http://localhost:3000';
  }

  pathname: string;
  search: string;
  hash: string;
  origin: string;

  searchParams = {
    has: jest.fn().mockReturnValue(false),
    get: jest.fn().mockReturnValue(null),
    set: jest.fn(),
    delete: jest.fn(),
    toString: jest.fn().mockReturnValue(''),
  };

  toString() {
    return this.url;
  }
};

// Mock Canvas for WebP support detection
Object.defineProperty(document, 'createElement', {
  writable: true,
  configurable: true,
  value: jest.fn().mockImplementation((tagName) => {
    if (tagName === 'canvas') {
      return {
        width: 1,
        height: 1,
        getContext: jest.fn().mockReturnValue({
          toDataURL: jest.fn().mockReturnValue('data:image/webp;base64,test'),
        }),
        toDataURL: jest.fn().mockReturnValue('data:image/webp;base64,test'),
      };
    }

    // 返回默认元素
    return {
      tagName: tagName.toUpperCase(),
      style: {},
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      appendChild: jest.fn(),
      removeChild: jest.fn(),
      setAttribute: jest.fn(),
      getAttribute: jest.fn(),
    };
  }),
});

// Mock console methods to avoid noise
const originalConsole = { ...console };

beforeEach(() => {
  // 保存原始console方法
  Object.keys(console).forEach(key => {
    (console as any)[key] = jest.fn();
  });
});

afterEach(() => {
  // 恢复原始console方法
  Object.assign(console, originalConsole);
});

// 全局测试工具
export const createMockEvent = (type: string, properties: any = {}) => {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.assign(event, properties);
  return event;
};

export const createMockIntersectionObserverEntry = (
  target: Element,
  isIntersecting = true
): IntersectionObserverEntry => ({
  target,
  isIntersecting,
  intersectionRatio: isIntersecting ? 1 : 0,
  boundingClientRect: {
    bottom: 100,
    height: 100,
    left: 0,
    right: 100,
    top: 0,
    width: 100,
    x: 0,
    y: 0,
    toJSON: jest.fn(),
  },
  intersectionRect: {
    bottom: 100,
    height: 100,
    left: 0,
    right: 100,
    top: 0,
    width: 100,
    x: 0,
    y: 0,
    toJSON: jest.fn(),
  },
  rootBounds: null,
  time: Date.now(),
  toJSON: jest.fn(),
});

export const createMockPerformanceEntry = (
  name: string,
  entryType: string,
  startTime = 0
): PerformanceEntry => ({
  name,
  entryType,
  startTime,
  duration: 0,
  toJSON: jest.fn(),
});

export const createMockPerformanceNavigationTiming = (): PerformanceNavigationTiming => ({
  name: 'document',
  entryType: 'navigation',
  startTime: 0,
  duration: 0,
  initiatorType: 'navigation',
  nextHopProtocol: 'http/1.1',
  workerStart: 0,
  redirectStart: 0,
  redirectEnd: 0,
  fetchStart: 0,
  domainLookupStart: 0,
  domainLookupEnd: 0,
  connectStart: 0,
  connectEnd: 0,
  secureConnectionStart: 0,
  requestStart: 0,
  responseStart: 0,
  responseEnd: 0,
  transferSize: 0,
  encodedBodySize: 0,
  decodedBodySize: 0,
  serverTiming: [],
  unloadEventStart: 0,
  unloadEventEnd: 0,
  domInteractive: 100,
  domContentLoadedEventStart: 100,
  domContentLoadedEventEnd: 100,
  domComplete: 100,
  loadEventStart: 100,
  loadEventEnd: 100,
  type: 'navigate',
  redirectCount: 0,
  activationStart: 0,
  toJSON: jest.fn(),
} as any);

// 测试数据工厂
export const createMockFooterData = () => ({
  brand: {
    name: '万象生活',
    slogan: '您的品质生活服务平台',
    logo: '/images/logo.svg',
  },
  navigation: {
    products: [
      { id: 'home', title: '首页', href: '/', external: false },
      { id: 'services', title: '生活服务', href: '/services', external: false },
      { id: 'orders', title: '我的订单', href: '/orders', external: false },
      { id: 'profile', title: '个人中心', href: '/profile', external: false },
    ],
    support: [
      { id: 'help', title: '帮助中心', href: '/help', external: false },
      { id: 'contact', title: '联系我们', href: '/contact', external: false },
      { id: 'feedback', title: '意见反馈', href: '/feedback', external: false },
      { id: 'faq', title: '常见问题', href: '/faq', external: false },
    ],
  },
  social: [
    { id: 'github', title: 'GitHub', href: 'https://github.com/universe-life', icon: 'GithubOutlined' },
    { id: 'wechat', title: '微信公众号', href: '#', icon: 'WechatOutlined' },
    { id: 'weibo', title: '微博', href: 'https://weibo.com/universe-life', icon: 'WeiboOutlined' },
    { id: 'qq', title: 'QQ群', href: '#', icon: 'QqOutlined' },
  ],
  contact: {
    phone: '400-123-4567',
    email: 'service@universe-life.com',
    address: '北京市朝阳区',
  },
  legal: {
    copyright: '© 2024 万象生活科技有限公司. 保留所有权利.',
    icp: '京ICP备12345678号',
    police: '京公网安备11010502012345号',
  },
});

// 测试环境变量
export const setTestEnvironment = (env: 'development' | 'production' | 'test') => {
  process.env.NODE_ENV = env;
};

// 性能测试工具
export const measureRenderTime = (renderFn: () => void): number => {
  const start = performance.now();
  renderFn();
  const end = performance.now();
  return end - start;
};

export const measureMemoryUsage = (): number => {
  return (performance as any).memory?.usedJSHeapSize || 0;
};

// Mock fetch API
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
);

// Mock Image constructor
global.Image = class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  src: string = '';

  constructor() {
    // 模拟图片加载成功
    setTimeout(() => {
      if (this.onload) {
        this.onload();
      }
    }, 0);
  }

  set src(value: string) {
    this.src = value;
  }
} as any;

// Error边界测试工具
export const createErrorBoundaryTest = (Component: React.ComponentType<any>) => {
  const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) {
      throw new Error('Test error');
    }
    return React.createElement(Component);
  };

  return ThrowError;
};

// 可访问性测试工具
export const checkAccessibility = async (container: HTMLElement) => {
  const { axe } = await import('jest-axe');
  return await axe(container);
};

// 国际化测试工具
export const createMockI18n = (locale = 'zh-CN') => {
  return {
    t: (key: string) => key,
    locale,
    changeLanguage: jest.fn(),
  };
};

// 主题测试工具
export const createMockTheme = (theme: 'light' | 'dark' = 'light') => {
  const themeVariables = {
    light: {
      '--footer-bg': '#ffffff',
      '--footer-text-primary': 'rgba(0, 0, 0, 0.85)',
      '--footer-primary': '#1890ff',
    },
    dark: {
      '--footer-bg': '#141414',
      '--footer-text-primary': 'rgba(255, 255, 255, 0.85)',
      '--footer-primary': '#1890ff',
    },
  };

  return themeVariables[theme];
};

export default {
  createMockEvent,
  createMockIntersectionObserverEntry,
  createMockPerformanceEntry,
  createMockPerformanceNavigationTiming,
  createMockFooterData,
  setTestEnvironment,
  measureRenderTime,
  measureMemoryUsage,
  createErrorBoundaryTest,
  checkAccessibility,
  createMockI18n,
  createMockTheme,
};