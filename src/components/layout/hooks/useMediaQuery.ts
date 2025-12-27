/**
 * useMediaQuery Hook
 * 用于响应式设计，监听媒体查询变化
 */

import { useState, useEffect } from 'react';

/**
 * 监听媒体查询变化
 * @param query 媒体查询字符串，如 '(max-width: 768px)'
 * @returns 是否匹配当前媒体查询
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // 检查是否支持window对象
    if (typeof window === 'undefined') {
      return;
    }

    // 创建媒体查询监听器
    const media = window.matchMedia(query);

    // 设置初始值
    setMatches(media.matches);

    // 定义监听器回调
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 添加监听器
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      // 兼容旧版本浏览器
      media.addListener(listener);
    }

    // 清理函数
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        // 兼容旧版本浏览器
        media.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}

/**
 * 预定义的媒体查询hooks
 */
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const useIsLargeDesktop = () => useMediaQuery('(min-width: 1200px)');

/**
 * 通用断点Hook
 * @param breakpoint 断点配置
 * @returns 当前设备类型
 */
export const useBreakpoint = (breakpoint: {
  mobile?: number;
  tablet?: number;
  desktop?: number;
}) => {
  const isMobile = useMediaQuery(`(max-width: ${(breakpoint.mobile || 767) - 1}px)`);
  const isTablet = useMediaQuery(
    `(min-width: ${breakpoint.mobile || 768}px) and (max-width: ${(breakpoint.tablet || 1023) - 1}px)`
  );
  const isDesktop = useMediaQuery(`(min-width: ${breakpoint.tablet || 1024}px)`);
  const isLargeDesktop = useMediaQuery(`(min-width: ${breakpoint.desktop || 1200}px)`);

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    current: isMobile
      ? 'mobile'
      : isTablet
        ? 'tablet'
        : isLargeDesktop
          ? 'largeDesktop'
          : 'desktop',
  };
};

/**
 * 获取当前屏幕尺寸
 * @returns 屏幕尺寸信息
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // 检查是否支持window对象
    if (typeof window === 'undefined') {
      return;
    }

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // 设置初始值
    handleResize();

    // 添加事件监听器
    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
};

/**
 * 判断是否为移动设备（基于用户代理）
 * @returns 是否为移动设备
 */
export const useIsMobileDevice = (): boolean => {
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    // 检查是否支持window对象
    if (typeof window === 'undefined') {
      return;
    }

    const checkMobileDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as Window & { opera?: string }).opera || '';
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      setIsMobileDevice(mobileRegex.test(userAgent));
    };

    checkMobileDevice();
  }, []);

  return isMobileDevice;
};

/**
 * 监听设备方向变化
 * @returns 当前设备方向
 */
export const useOrientation = (): 'portrait' | 'landscape' => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    // 检查是否支持window对象
    if (typeof window === 'undefined') {
      return;
    }

    const handleOrientationChange = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      setOrientation(isPortrait ? 'portrait' : 'landscape');
    };

    // 设置初始值
    handleOrientationChange();

    // 添加事件监听器
    window.addEventListener('resize', handleOrientationChange);

    // 如果支持Screen Orientation API
    if (screen.orientation) {
      screen.orientation.addEventListener('change', handleOrientationChange);
    }

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      if (screen.orientation) {
        screen.orientation.removeEventListener('change', handleOrientationChange);
      }
    };
  }, []);

  return orientation;
};

export default useMediaQuery;
