/**
 * 万象生活底栏性能监控Hook
 * 提供性能指标监控和优化建议
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export interface PerformanceMetrics {
  // 渲染性能
  renderTime: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;

  // 交互性能
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;

  // 内存使用
  memoryUsage: number;
  memoryLimit: number;

  // 网络性能
  resourceLoadTime: number;
  totalResources: number;
  compressedResources: number;
}

export interface PerformanceOptions {
  // 是否启用性能监控
  enableMonitoring?: boolean;
  // 监控间隔（毫秒）
  monitoringInterval?: number;
  // 性能警告阈值
  thresholds?: {
    renderTime?: number;
    firstContentfulPaint?: number;
    largestContentfulPaint?: number;
    cumulativeLayoutShift?: number;
    memoryUsage?: number;
  };
  // 是否自动优化
  enableAutoOptimization?: boolean;
}

/**
 * 底栏性能监控Hook
 */
export const useFooterPerformance = (options: PerformanceOptions = {}) => {
  const {
    enableMonitoring = true,
    monitoringInterval = 5000,
    thresholds = {
      renderTime: 16.67, // 60fps
      firstContentfulPaint: 2000,
      largestContentfulPaint: 2500,
      cumulativeLayoutShift: 0.1,
      memoryUsage: 50 * 1024 * 1024, // 50MB
    },
    enableAutoOptimization = true,
  } = options;

  // 状态管理
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    firstPaint: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    firstInputDelay: 0,
    cumulativeLayoutShift: 0,
    timeToInteractive: 0,
    memoryUsage: 0,
    memoryLimit: 0,
    resourceLoadTime: 0,
    totalResources: 0,
    compressedResources: 0,
  });

  const [performanceIssues, setPerformanceIssues] = useState<string[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // 引用管理
  const observerRef = useRef<PerformanceObserver | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const frameCountRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(Date.now());
  const monitoringIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 获取性能指标
  const getPerformanceMetrics = useCallback((): PerformanceMetrics => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    const resources = performance.getEntriesByType('resource');

    // 计算渲染时间
    const renderTime = Date.now() - startTimeRef.current;
    const firstPaint = paint.find(entry => entry.name === 'first-paint')?.startTime || 0;
    const firstContentfulPaint = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;

    // 计算资源加载时间
    let totalResourceLoadTime = 0;
    let totalResources = resources.length;
    let compressedResources = 0;

    resources.forEach(resource => {
      const timing = resource as PerformanceResourceTiming;
      const loadTime = timing.responseEnd - timing.requestStart;
      totalResourceLoadTime += loadTime;

      // 检查是否使用了压缩
      const encoding = (timing as any).encoding;
      if (encoding && encoding !== 'identity') {
        compressedResources++;
      }
    });

    // 获取内存信息（如果支持）
    let memoryUsage = 0;
    let memoryLimit = 0;
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      memoryUsage = memory.usedJSHeapSize;
      memoryLimit = memory.jsHeapSizeLimit;
    }

    return {
      renderTime,
      firstPaint,
      firstContentfulPaint,
      largestContentfulPaint: 0, // 需要通过PerformanceObserver获取
      firstInputDelay: 0, // 需要通过PerformanceObserver获取
      cumulativeLayoutShift: 0, // 需要通过PerformanceObserver获取
      timeToInteractive: navigation?.domInteractive - navigation?.fetchStart || 0,
      memoryUsage,
      memoryLimit,
      resourceLoadTime: totalResourceLoadTime,
      totalResources,
      compressedResources,
    };
  }, []);

  // 检测性能问题
  const detectPerformanceIssues = useCallback((currentMetrics: PerformanceMetrics): string[] => {
    const issues: string[] = [];

    if (currentMetrics.renderTime > thresholds.renderTime!) {
      issues.push(`渲染时间过长: ${currentMetrics.renderTime.toFixed(2)}ms (阈值: ${thresholds.renderTime}ms)`);
    }

    if (currentMetrics.firstContentfulPaint > thresholds.firstContentfulPaint!) {
      issues.push(`首次内容绘制时间过长: ${currentMetrics.firstContentfulPaint.toFixed(0)}ms`);
    }

    if (currentMetrics.cumulativeLayoutShift > thresholds.cumulativeLayoutShift!) {
      issues.push(`累积布局偏移过大: ${currentMetrics.cumulativeLayoutShift.toFixed(3)}`);
    }

    if (currentMetrics.memoryUsage > thresholds.memoryUsage!) {
      issues.push(`内存使用过高: ${(currentMetrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
    }

    const avgResourceLoadTime = currentMetrics.totalResources > 0
      ? currentMetrics.resourceLoadTime / currentMetrics.totalResources
      : 0;

    if (avgResourceLoadTime > 1000) {
      issues.push(`资源加载时间过长: 平均 ${avgResourceLoadTime.toFixed(0)}ms`);
    }

    const compressionRatio = currentMetrics.totalResources > 0
      ? (currentMetrics.compressedResources / currentMetrics.totalResources) * 100
      : 0;

    if (compressionRatio < 80) {
      issues.push(`资源压缩率较低: ${compressionRatio.toFixed(1)}%`);
    }

    return issues;
  }, [thresholds]);

  // 自动优化性能
  const optimizePerformance = useCallback(async () => {
    if (!enableAutoOptimization || isOptimizing) return;

    setIsOptimizing(true);

    try {
      // 1. 优化图片懒加载
      const images = document.querySelectorAll('img[data-src]');
      images.forEach(img => {
        const imgElement = img as HTMLImageElement;
        if (imgElement.dataset.src) {
          imgElement.src = imgElement.dataset.src;
          imgElement.removeAttribute('data-src');
        }
      });

      // 2. 预加载关键资源
      const criticalResources = [
        '/fonts/inter-var.woff2',
        '/images/logo.svg',
      ];

      criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.endsWith('.woff2') ? 'font' : 'image';
        link.type = resource.endsWith('.woff2') ? 'font/woff2' : 'image/svg+xml';
        document.head.appendChild(link);
      });

      // 3. 清理不必要的定时器
      if (monitoringIntervalRef.current) {
        clearInterval(monitoringIntervalRef.current);
        monitoringIntervalRef.current = null;
      }

      // 4. 强制垃圾回收（如果支持）
      if ('gc' in window) {
        (window as any).gc();
      }

      // 5. 优化CSS变量
      const root = document.documentElement;
      root.style.setProperty('--footer-transition-fast', '0.1s ease');
      root.style.setProperty('--footer-transition-base', '0.2s ease');

      console.log('Footer performance optimization completed');
    } catch (error) {
      console.error('Performance optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  }, [enableAutoOptimization, isOptimizing]);

  // 设置性能观察器
  const setupPerformanceObserver = useCallback(() => {
    if (!('PerformanceObserver' in window)) return;

    // 观察LCP
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        setMetrics(prev => ({
          ...prev,
          largestContentfulPaint: lastEntry.startTime,
        }));
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      observerRef.current = lcpObserver;
    } catch (error) {
      console.warn('LCP observer not supported:', error);
    }

    // 观察CLS
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        setMetrics(prev => ({
          ...prev,
          cumulativeLayoutShift: clsValue,
        }));
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('CLS observer not supported:', error);
    }

    // 观察FID
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const firstInput = list.getEntries()[0];
        if (firstInput) {
          const fid = (firstInput as any).processingStart - firstInput.startTime;
          setMetrics(prev => ({
            ...prev,
            firstInputDelay: fid,
          }));
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (error) {
      console.warn('FID observer not supported:', error);
    }
  }, []);

  // 计算FPS
  const calculateFPS = useCallback(() => {
    const now = Date.now();
    const delta = now - lastFrameTimeRef.current;

    if (delta >= 1000) {
      const fps = (frameCountRef.current * 1000) / delta;
      frameCountRef.current = 0;
      lastFrameTimeRef.current = now;

      setMetrics(prev => ({
        ...prev,
        renderTime: 1000 / fps, // 转换为每帧渲染时间
      }));
    }

    frameCountRef.current++;
    requestAnimationFrame(calculateFPS);
  }, []);

  // 启动性能监控
  const startMonitoring = useCallback(() => {
    if (!enableMonitoring) return;

    // 设置性能观察器
    setupPerformanceObserver();

    // 启动FPS监控
    calculateFPS();

    // 定期更新指标
    monitoringIntervalRef.current = setInterval(() => {
      const currentMetrics = getPerformanceMetrics();
      setMetrics(currentMetrics);

      const issues = detectPerformanceIssues(currentMetrics);
      setPerformanceIssues(issues);

      // 自动优化
      if (issues.length > 0 && enableAutoOptimization) {
        optimizePerformance();
      }
    }, monitoringInterval);
  }, [enableMonitoring, monitoringInterval, setupPerformanceObserver, calculateFPS, getPerformanceMetrics, detectPerformanceIssues, enableAutoOptimization, optimizePerformance]);

  // 停止性能监控
  const stopMonitoring = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (monitoringIntervalRef.current) {
      clearInterval(monitoringIntervalRef.current);
      monitoringIntervalRef.current = null;
    }
  }, []);

  // 获取性能报告
  const getPerformanceReport = useCallback(() => {
    const score = calculatePerformanceScore(metrics);
    return {
      metrics,
      issues: performanceIssues,
      score,
      recommendations: generateRecommendations(metrics, performanceIssues),
      isOptimizing,
    };
  }, [metrics, performanceIssues, isOptimizing]);

  // 计算性能评分
  const calculatePerformanceScore = useCallback((currentMetrics: PerformanceMetrics): number => {
    let score = 100;

    // FCP评分 (30%)
    if (currentMetrics.firstContentfulPaint > thresholds.firstContentfulPaint!) {
      score -= 30;
    } else if (currentMetrics.firstContentfulPaint > 1000) {
      score -= 15;
    }

    // LCP评分 (25%)
    if (currentMetrics.largestContentfulPaint > thresholds.largestContentfulPaint!) {
      score -= 25;
    } else if (currentMetrics.largestContentfulPaint > 2000) {
      score -= 12;
    }

    // CLS评分 (20%)
    if (currentMetrics.cumulativeLayoutShift > thresholds.cumulativeLayoutShift!) {
      score -= 20;
    } else if (currentMetrics.cumulativeLayoutShift > 0.05) {
      score -= 10;
    }

    // 内存使用评分 (15%)
    if (currentMetrics.memoryUsage > thresholds.memoryUsage!) {
      score -= 15;
    } else if (currentMetrics.memoryUsage > thresholds.memoryUsage! * 0.8) {
      score -= 7;
    }

    // 渲染性能评分 (10%)
    if (currentMetrics.renderTime > thresholds.renderTime!) {
      score -= 10;
    } else if (currentMetrics.renderTime > thresholds.renderTime! * 2) {
      score -= 5;
    }

    return Math.max(0, Math.min(100, score));
  }, [thresholds]);

  // 生成优化建议
  const generateRecommendations = useCallback((currentMetrics: PerformanceMetrics, issues: string[]): string[] => {
    const recommendations: string[] = [];

    if (currentMetrics.firstContentfulPaint > 2000) {
      recommendations.push('优化关键渲染路径，减少首屏加载资源');
    }

    if (currentMetrics.cumulativeLayoutShift > 0.1) {
      recommendations.push('为图片和广告设置明确的尺寸，避免布局偏移');
    }

    if (currentMetrics.memoryUsage > 50 * 1024 * 1024) {
      recommendations.push('检查内存泄漏，优化组件卸载逻辑');
    }

    if (issues.some(issue => issue.includes('资源加载'))) {
      recommendations.push('启用资源压缩和缓存策略');
    }

    if (currentMetrics.renderTime > 16.67) {
      recommendations.push('优化动画和过渡效果，使用CSS transform');
    }

    if (recommendations.length === 0) {
      recommendations.push('性能表现良好，继续保持');
    }

    return recommendations;
  }, []);

  // 组件挂载时启动监控
  useEffect(() => {
    startMonitoring();

    return () => {
      stopMonitoring();
    };
  }, [startMonitoring, stopMonitoring]);

  return {
    metrics,
    performanceIssues,
    isOptimizing,
    getPerformanceReport,
    optimizePerformance,
    startMonitoring,
    stopMonitoring,
  };
};

/**
 * 简化版性能Hook
 * 适用于只需要基本性能监控的场景
 */
export const useFooterPerformanceSimple = () => {
  const [renderTime, setRenderTime] = useState(0);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const updateTime = () => {
      setRenderTime(Date.now() - startTimeRef.current);
      requestAnimationFrame(updateTime);
    };

    const animationId = requestAnimationFrame(updateTime);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return {
    renderTime,
    isOptimal: renderTime < 16.67, // 60fps
    fps: 1000 / renderTime,
  };
};

export default useFooterPerformance;