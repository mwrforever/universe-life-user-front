import { useCallback, useRef, useEffect } from 'react';
import type { FooterAnalyticsEvent } from '../types/component';

interface UseFooterAnalyticsOptions {
  // 是否启用分析
  enabled?: boolean;
  // 调试模式
  debug?: boolean;
  // 自定义分析服务
  analyticsService?: 'google' | 'baidu' | 'custom' | 'console';
  // 数据采样率（0-1）
  sampleRate?: number;
  // 批量发送配置
  batchConfig?: {
    enabled: boolean;
    maxBatchSize: number;
    flushInterval: number; // 毫秒
  };
}

interface UseFooterAnalyticsReturn {
  // 发送分析事件
  trackEvent: (event: FooterAnalyticsEvent) => void;
  // 页面访问埋点
  trackPageView: (page: string, title?: string) => void;
  // 组件加载埋点
  trackComponentLoad: (component: string, loadTime: number) => void;
  // 用户交互埋点
  trackInteraction: (action: string, target: string, value?: number) => void;
  // 性能埋点
  trackPerformance: (metric: string, value: number) => void;
  // 错误埋点
  trackError: (error: Error, context?: string) => void;
  // 手动刷新
  flush: () => void;
  // 获取当前配置
  getConfig: () => UseFooterAnalyticsOptions;
}

/**
 * 万象生活底栏数据埋点Hook
 * 支持多种分析服务、批量发送、性能监控
 */
export const useFooterAnalytics = (options: UseFooterAnalyticsOptions = {}): UseFooterAnalyticsReturn => {
  const {
    enabled = true,
    debug = false,
    analyticsService = 'console',
    sampleRate = 1.0,
    batchConfig = {
      enabled: true,
      maxBatchSize: 10,
      flushInterval: 5000,
    },
  } = options;

  // 事件缓存（用于批量发送）
  const eventQueue = useRef<FooterAnalyticsEvent[]>([]);
  const flushTimer = useRef<NodeJS.Timeout | null>(null);

  // 生成唯一ID
  const generateEventId = useCallback(() => {
    return `footer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // 采样检查
  const shouldSample = useCallback(() => {
    return Math.random() <= sampleRate;
  }, [sampleRate]);

  // 发送事件到分析服务
  const sendEvent = useCallback((event: FooterAnalyticsEvent) => {
    if (!enabled || !shouldSample()) return;

    const enrichedEvent = {
      ...event,
      event_id: generateEventId(),
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      page_title: document.title,
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
    };

    // 调试模式
    if (debug) {
      console.log('🔍 Footer Analytics Event:', enrichedEvent);
    }

    // 根据配置的服务发送事件
    switch (analyticsService) {
      case 'google':
        sendToGoogleAnalytics(enrichedEvent);
        break;
      case 'baidu':
        sendToBaiduAnalytics(enrichedEvent);
        break;
      case 'custom':
        sendToCustomService(enrichedEvent);
        break;
      case 'console':
      default:
        console.log('📊 Footer Analytics:', enrichedEvent);
        break;
    }
  }, [enabled, shouldSample, debug, analyticsService, generateEventId]);

  // Google Analytics 集成
  const sendToGoogleAnalytics = useCallback((event: FooterAnalyticsEvent) => {
    if (window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        non_interaction: event.nonInteraction,
        custom_parameter: 'footer_analytics'
      });
    }
  }, []);

  // 百度统计集成
  const sendToBaiduAnalytics = useCallback((event: FooterAnalyticsEvent) => {
    if (window._hmt) {
      window._hmt.push([
        '_trackEvent',
        event.category,
        event.action,
        event.label,
        event.value
      ]);
    }
  }, []);

  // 自定义服务集成
  const sendToCustomService = useCallback((event: FooterAnalyticsEvent) => {
    // 这里可以实现自定义的分析服务逻辑
    // 例如发送到自有后端API
    try {
      fetch('/api/analytics/footer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }).catch(error => {
        console.warn('Failed to send analytics to custom service:', error);
      });
    } catch (error) {
      console.warn('Custom analytics service error:', error);
    }
  }, []);

  // 批量发送事件
  const flushEvents = useCallback(() => {
    if (eventQueue.current.length === 0) return;

    const eventsToSend = [...eventQueue.current];
    eventQueue.current = [];

    if (debug) {
      console.log(`📤 Flushing ${eventsToSend.length} footer analytics events`);
    }

    eventsToSend.forEach(event => sendEvent(event));
  }, [sendEvent, debug]);

  // 添加事件到队列
  const queueEvent = useCallback((event: FooterAnalyticsEvent) => {
    if (!batchConfig.enabled) {
      sendEvent(event);
      return;
    }

    eventQueue.current.push(event);

    // 检查是否需要立即发送
    if (eventQueue.current.length >= batchConfig.maxBatchSize) {
      flushEvents();
    } else if (!flushTimer.current) {
      // 设置定时发送
      flushTimer.current = setTimeout(() => {
        flushEvents();
        flushTimer.current = null;
      }, batchConfig.flushInterval);
    }
  }, [batchConfig, sendEvent, flushEvents]);

  // 发送分析事件
  const trackEvent = useCallback((event: FooterAnalyticsEvent) => {
    queueEvent(event);
  }, [queueEvent]);

  // 页面访问埋点
  const trackPageView = useCallback((page: string, title?: string) => {
    trackEvent({
      category: 'footer_page_view',
      action: 'view',
      label: page,
      nonInteraction: true,
    });

    // 同时发送到Google Analytics（如果可用）
    if (window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: title || document.title,
        page_location: page,
      });
    }
  }, [trackEvent]);

  // 组件加载埋点
  const trackComponentLoad = useCallback((component: string, loadTime: number) => {
    trackEvent({
      category: 'footer_performance',
      action: 'component_load',
      label: component,
      value: Math.round(loadTime),
      nonInteraction: true,
    });
  }, [trackEvent]);

  // 用户交互埋点
  const trackInteraction = useCallback((action: string, target: string, value?: number) => {
    trackEvent({
      category: 'footer_interaction',
      action,
      label: target,
      value,
      nonInteraction: false,
    });
  }, [trackEvent]);

  // 性能埋点
  const trackPerformance = useCallback((metric: string, value: number) => {
    trackEvent({
      category: 'footer_performance',
      action: metric,
      label: 'performance_metric',
      value: Math.round(value),
      nonInteraction: true,
    });
  }, [trackEvent]);

  // 错误埋点
  const trackError = useCallback((error: Error, context?: string) => {
    trackEvent({
      category: 'footer_error',
      action: error.name,
      label: context || error.message,
      value: 1,
      nonInteraction: true,
    });
  }, [trackEvent]);

  // 页面卸载时刷新事件
  useEffect(() => {
    const handleBeforeUnload = () => {
      flushEvents();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      flushEvents(); // 组件卸载时也要刷新
    };
  }, [flushEvents]);

  // 页面可见性变化时刷新事件
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        flushEvents();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [flushEvents]);

  return {
    trackEvent,
    trackPageView,
    trackComponentLoad,
    trackInteraction,
    trackPerformance,
    trackError,
    flush: flushEvents,
    getConfig: () => ({
      enabled,
      debug,
      analyticsService,
      sampleRate,
      batchConfig,
    }),
  };
};

/**
 * 预配置的埋点Hook实例
 */
export const useFooterAnalyticsDefault = () => {
  return useFooterAnalytics({
    enabled: process.env.NODE_ENV === 'production',
    debug: process.env.NODE_ENV === 'development',
    analyticsService: 'console',
    sampleRate: 0.1, // 10% 采样率
    batchConfig: {
      enabled: true,
      maxBatchSize: 5,
      flushInterval: 3000,
    },
  });
};

export default useFooterAnalytics;