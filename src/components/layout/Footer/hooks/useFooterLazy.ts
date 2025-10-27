import { useState, useEffect, useCallback, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

interface UseFooterLazyOptions {
  // 根元素边距（用于提前加载）
  rootMargin?: string;
  // 触发阈值
  threshold?: number | number[];
  // 延迟加载时间（毫秒）
  delay?: number;
  // 是否启用延迟加载
  enabled?: boolean;
  // 最小等待时间（毫秒，防止闪烁）
  minWaitTime?: number;
  // 失败重试次数
  retryCount?: number;
  // 重试间隔（毫秒）
  retryDelay?: number;
}

interface UseFooterLazyReturn {
  // 是否可见
  isVisible: boolean;
  // 是否正在加载
  isLoading: boolean;
  // 是否已加载完成
  isLoaded: boolean;
  // 加载错误
  error: Error | null;
  // 重新加载
  retry: () => void;
  // 手动触发加载
  load: () => void;
  // 重置状态
  reset: () => void;
  // Intersection Observer ref
  ref: (node?: Element | null) => void;
}

/**
 * 万象生活底栏延迟加载Hook
 * 基于Intersection Observer实现智能延迟加载
 */
export const useFooterLazy = (
  loader?: () => Promise<void>,
  options: UseFooterLazyOptions = {}
): UseFooterLazyReturn => {
  const {
    rootMargin = '200px 0px',
    threshold = 0.1,
    delay = 0,
    enabled = true,
    minWaitTime = 300,
    retryCount = 3,
    retryDelay = 1000,
  } = options;

  // 状态管理
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryAttempts, setRetryAttempts] = useState(0);

  // 引用管理
  const loadStartTime = useRef<number>(0);
  const minWaitTimer = useRef<NodeJS.Timeout | null>(null);
  const delayTimer = useRef<NodeJS.Timeout | null>(null);

  // Intersection Observer配置
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce: true, // 只触发一次
    skip: !enabled || isLoaded, // 跳过已加载或禁用的情况
  });

  // 执行加载逻辑
  const executeLoad = useCallback(async () => {
    if (!loader || isLoading || isLoaded) return;

    setIsLoading(true);
    setError(null);
    loadStartTime.current = Date.now();

    try {
      // 确保最小等待时间（防止闪烁）
      const loadPromise = loader();
      const minWaitPromise = new Promise<void>(resolve => {
        minWaitTimer.current = setTimeout(resolve, minWaitTime);
      });

      await Promise.all([loadPromise, minWaitPromise]);

      setIsLoaded(true);
      setRetryAttempts(0);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Footer loading failed');
      setError(error);

      // 自动重试逻辑
      if (retryAttempts < retryCount) {
        console.warn(`Footer loading failed, retrying (${retryAttempts + 1}/${retryCount}):`, error);
        setRetryAttempts(prev => prev + 1);

        delayTimer.current = setTimeout(() => {
          executeLoad();
        }, retryDelay * (retryAttempts + 1)); // 指数退避
      } else {
        console.error('Footer loading failed after all retries:', error);
      }
    } finally {
      setIsLoading(false);
      if (minWaitTimer.current) {
        clearTimeout(minWaitTimer.current);
      }
      if (delayTimer.current) {
        clearTimeout(delayTimer.current);
      }
    }
  }, [loader, isLoading, isLoaded, retryAttempts, retryCount, retryDelay, minWaitTime]);

  // 手动触发加载
  const load = useCallback(() => {
    if (delay > 0) {
      delayTimer.current = setTimeout(() => {
        executeLoad();
      }, delay);
    } else {
      executeLoad();
    }
  }, [delay, executeLoad]);

  // 重新加载
  const retry = useCallback(() => {
    setRetryAttempts(0);
    setError(null);
    setIsLoaded(false);
    load();
  }, [load]);

  // 重置状态
  const reset = useCallback(() => {
    setIsVisible(false);
    setIsLoading(false);
    setIsLoaded(false);
    setError(null);
    setRetryAttempts(0);

    if (minWaitTimer.current) {
      clearTimeout(minWaitTimer.current);
    }
    if (delayTimer.current) {
      clearTimeout(delayTimer.current);
    }
  }, []);

  // 监听可见性变化
  useEffect(() => {
    if (inView && !isVisible && !isLoaded && enabled) {
      setIsVisible(true);
      load();
    }
  }, [inView, isVisible, isLoaded, enabled, load]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (minWaitTimer.current) {
        clearTimeout(minWaitTimer.current);
      }
      if (delayTimer.current) {
        clearTimeout(delayTimer.current);
      }
    };
  }, []);

  // 性能监控
  useEffect(() => {
    if (isLoaded && loadStartTime.current > 0) {
      const loadTime = Date.now() - loadStartTime.current;
      console.log(`Footer loaded in ${loadTime}ms`);

      // 可以添加性能分析事件
      if (window.gtag) {
        window.gtag('event', 'footer_load_time', {
          value: loadTime,
          custom_parameter: 'footer_performance'
        });
      }
    }
  }, [isLoaded]);

  return {
    isVisible,
    isLoading,
    isLoaded,
    error,
    retry,
    load,
    reset,
    ref,
  };
};

/**
 * 简化版本的延迟加载Hook
 * 适用于不需要自定义加载器的场景
 */
export const useFooterLazySimple = (options: UseFooterLazyOptions = {}) => {
  return useFooterLazy(undefined, options);
};

export default useFooterLazy;