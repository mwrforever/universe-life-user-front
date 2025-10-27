// 万象生活底栏数据埋点工具函数

export const footerAnalytics = {
  // 发送分析事件
  sendEvent: (category: string, action: string, label?: string, value?: number) => {
    console.log(`Analytics Event: ${category} - ${action}`, { label, value });
  },

  // 页面访问埋点
  trackPageView: (page: string) => {
    console.log(`Page View: ${page}`);
  },

  // 性能埋点
  trackPerformance: (metric: string, value: number) => {
    console.log(`Performance: ${metric} - ${value}ms`);
  },

  // 错误埋点
  trackError: (error: Error, context?: string) => {
    console.log(`Error: ${error.message}`, { context, stack: error.stack });
  }
};