// 全局类型声明
declare global {
  interface Window {
    gtag?: (command: string, action: string, options?: Record<string, unknown>) => void;
  }
}

export {};
