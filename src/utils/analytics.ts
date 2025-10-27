/**
 * 万象生活分析工具
 * 提供用户行为追踪和数据分析功能
 */

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
  page?: string;
  referrer?: string;
  userAgent?: string;
  screenResolution?: string;
  language?: string;
}

interface AnalyticsConfig {
  enableTracking?: boolean;
  debugMode?: boolean;
  apiEndpoint?: string;
  apiKey?: string;
  userId?: string;
  sessionId?: string;
}

class Analytics {
  private config: AnalyticsConfig;
  private eventQueue: AnalyticsEvent[] = [];
  private isInitialized: boolean = false;

  constructor(config: AnalyticsConfig = {}) {
    this.config = {
      enableTracking: true,
      debugMode: process.env.NODE_ENV === 'development',
      ...config,
    };

    this.init();
  }

  private init() {
    if (!this.config.enableTracking) {
      return;
    }

    // 生成会话ID
    this.config.sessionId = this.config.sessionId || this.generateSessionId();

    // 初始化用户代理
    if (typeof window !== 'undefined') {
      this.trackPageView();
      this.setupAutoTracking();
    }

    this.isInitialized = true;

    if (this.config.debugMode) {
      console.log('Analytics initialized:', this.config);
    }
  }

  private generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  private setupAutoTracking() {
    // 页面卸载时发送剩余事件
    window.addEventListener('beforeunload', () => {
      this.flush();
    });

    // 页面可见性变化追踪
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.track('page_visible');
      } else {
        this.track('page_hidden');
      }
    });

    // 错误追踪
    window.addEventListener('error', (event) => {
      this.track('javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      });
    });

    // 未处理的Promise拒绝
    window.addEventListener('unhandledrejection', (event) => {
      this.track('unhandled_promise_rejection', {
        reason: event.reason,
        stack: event.reason?.stack,
      });
    });
  }

  public track(event: string, properties?: Record<string, any>) {
    if (!this.config.enableTracking) {
      return;
    }

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: Date.now(),
      userId: this.config.userId,
      sessionId: this.config.sessionId,
      page: typeof window !== 'undefined' ? window.location.pathname : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      screenResolution: typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : '',
      language: typeof navigator !== 'undefined' ? navigator.language : '',
    };

    this.eventQueue.push(analyticsEvent);

    if (this.config.debugMode) {
      console.log('Analytics Event:', analyticsEvent);
    }

    // 批量发送事件（避免频繁请求）
    if (this.eventQueue.length >= 10) {
      this.flush();
    }
  }

  public trackPageView(path?: string) {
    this.track('page_view', {
      path: path || (typeof window !== 'undefined' ? window.location.pathname : ''),
      title: typeof document !== 'undefined' ? document.title : '',
      url: typeof window !== 'undefined' ? window.location.href : '',
    });
  }

  public trackClick(element: string, properties?: Record<string, any>) {
    this.track('click', {
      element,
      ...properties,
    });
  }

  public trackHover(element: string, properties?: Record<string, any>) {
    this.track('hover', {
      element,
      ...properties,
    });
  }

  public trackFormSubmit(formName: string, properties?: Record<string, any>) {
    this.track('form_submit', {
      form_name: formName,
      ...properties,
    });
  }

  public trackDownload(fileUrl: string, fileName?: string) {
    this.track('download', {
      file_url: fileUrl,
      file_name: fileName,
    });
  }

  public trackSearch(query: string, resultsCount?: number) {
    this.track('search', {
      query,
      results_count: resultsCount,
    });
  }

  public trackError(error: Error | string, context?: string) {
    this.track('error', {
      error_message: typeof error === 'string' ? error : error.message,
      error_stack: typeof error === 'string' ? undefined : error.stack,
      context,
    });
  }

  public trackPerformance(metric: string, value: number, unit?: string) {
    this.track('performance', {
      metric,
      value,
      unit,
    });
  }

  public setUser(userId: string, properties?: Record<string, any>) {
    this.config.userId = userId;
    this.track('user_identified', {
      user_id: userId,
      ...properties,
    });
  }

  public resetUser() {
    this.config.userId = undefined;
    this.track('user_reset');
  }

  public flush() {
    if (this.eventQueue.length === 0) {
      return;
    }

    const eventsToSend = [...this.eventQueue];
    this.eventQueue = [];

    // 发送到分析服务（这里只是示例，实际需要根据具体的分析API实现）
    this.sendEvents(eventsToSend);
  }

  private sendEvents(events: AnalyticsEvent[]) {
    if (this.config.debugMode) {
      console.log('Sending analytics events:', events);
      return;
    }

    // 这里可以集成具体的分析服务
    // 例如：Google Analytics, Mixpanel, Amplitude, 自建分析平台等
    if (this.config.apiEndpoint && this.config.apiKey) {
      fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          events,
          meta: {
            timestamp: Date.now(),
            version: '1.0.0',
          },
        }),
      }).catch(error => {
        console.error('Failed to send analytics events:', error);
        // 失败的事件重新加入队列
        this.eventQueue.unshift(...events);
      });
    }
  }

  public getConfig(): AnalyticsConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<AnalyticsConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  public destroy() {
    this.flush();
    this.eventQueue = [];
    this.isInitialized = false;
  }
}

// 创建默认的分析实例
const analytics = new Analytics({
  enableTracking: process.env.NODE_ENV === 'production',
  debugMode: process.env.NODE_ENV === 'development',
});

// 导出分析实例和类
export { analytics, Analytics };

// 导出便捷函数
export const track = (event: string, properties?: Record<string, any>) => {
  analytics.track(event, properties);
};

export const trackPageView = (path?: string) => {
  analytics.trackPageView(path);
};

export const trackClick = (element: string, properties?: Record<string, any>) => {
  analytics.trackClick(element, properties);
};

export const trackHover = (element: string, properties?: Record<string, any>) => {
  analytics.trackHover(element, properties);
};

export const trackFormSubmit = (formName: string, properties?: Record<string, any>) => {
  analytics.trackFormSubmit(formName, properties);
};

export const trackDownload = (fileUrl: string, fileName?: string) => {
  analytics.trackDownload(fileUrl, fileName);
};

export const trackSearch = (query: string, resultsCount?: number) => {
  analytics.trackSearch(query, resultsCount);
};

export const trackError = (error: Error | string, context?: string) => {
  analytics.trackError(error, context);
};

export const trackPerformance = (metric: string, value: number, unit?: string) => {
  analytics.trackPerformance(metric, value, unit);
};

export const setUser = (userId: string, properties?: Record<string, any>) => {
  analytics.setUser(userId, properties);
};

export const resetUser = () => {
  analytics.resetUser();
};

export const flush = () => {
  analytics.flush();
};

// 类型定义
export type { AnalyticsEvent, AnalyticsConfig };

export default analytics;