import { useEffect, useCallback, useRef, useState } from 'react';

interface UseFooterA11yOptions {
  // 是否启用无障碍功能
  enabled?: boolean;
  // 是否启用键盘导航
  enableKeyboardNavigation?: boolean;
  // 是否启用屏幕阅读器支持
  enableScreenReaderSupport?: boolean;
  // 是否启用高对比度模式检测
  enableHighContrastDetection?: boolean;
  // 是否启用焦点管理
  enableFocusManagement?: boolean;
  // 焦点陷阱配置
  focusTrapConfig?: {
    enabled: boolean;
    restoreFocus: boolean;
  };
}

interface UseFooterA11yReturn {
  // 当前焦点元素
  focusedElement: HTMLElement | null;
  // 是否处于键盘导航模式
  isKeyboardMode: boolean;
  // 是否为高对比度模式
  isHighContrast: boolean;
  // 屏幕阅读器是否活跃
  isScreenReaderActive: boolean;
  // 设置焦点到元素
  setFocus: (element: HTMLElement | string, options?: FocusOptions) => boolean;
  // 检查元素是否可聚焦
  isFocusable: (element: HTMLElement) => boolean;
  // 获取所有可聚焦元素
  getFocusableElements: (container?: HTMLElement) => HTMLElement[];
  // 键盘导航处理
  handleKeyDown: (event: KeyboardEvent) => void;
  // 添加无障碍属性
  addA11yAttributes: (element: HTMLElement, attributes: Record<string, string>) => void;
  // 宣告文本到屏幕阅读器
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
  // 检查颜色对比度
  checkColorContrast: (foreground: string, background: string) => {
    ratio: number;
    wcagAA: boolean;
    wcagAAA: boolean;
  };
}

/**
 * 万象生活底栏无障碍支持Hook
 * 提供键盘导航、屏幕阅读器支持、焦点管理等功能
 */
export const useFooterA11y = (options: UseFooterA11yOptions = {}): UseFooterA11yReturn => {
  const {
    enabled = true,
    enableKeyboardNavigation = true,
    enableScreenReaderSupport = true,
    enableHighContrastDetection = true,
    enableFocusManagement = true,
    focusTrapConfig = {
      enabled: true,
      restoreFocus: true,
    },
  } = options;

  // 状态管理
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isScreenReaderActive, setIsScreenReaderActive] = useState(false);

  // 引用管理
  const footerRef = useRef<HTMLElement | null>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const announcementArea = useRef<HTMLDivElement | null>(null);

  // 初始化屏幕阅读器宣告区域
  useEffect(() => {
    if (!enableScreenReaderSupport || typeof document === 'undefined') return;

    // 创建隐藏的宣告区域
    const announcementDiv = document.createElement('div');
    announcementDiv.setAttribute('aria-live', 'polite');
    announcementDiv.setAttribute('aria-atomic', 'true');
    announcementDiv.style.position = 'absolute';
    announcementDiv.style.left = '-10000px';
    announcementDiv.style.width = '1px';
    announcementDiv.style.height = '1px';
    announcementDiv.style.overflow = 'hidden';
    announcementDiv.id = 'footer-a11y-announcements';

    document.body.appendChild(announcementDiv);
    announcementArea.current = announcementDiv;

    return () => {
      if (announcementArea.current && announcementArea.current.parentNode) {
        announcementArea.current.parentNode.removeChild(announcementArea.current);
      }
    };
  }, [enableScreenReaderSupport]);

  // 检测高对比度模式
  const detectHighContrast = useCallback(() => {
    if (!enableHighContrastDetection || typeof window === 'undefined') return;

    try {
      // 创建测试元素
      const testElement = document.createElement('div');
      testElement.style.color = 'rgb(255, 255, 255)';
      testElement.style.backgroundColor = 'rgb(0, 0, 0)';
      testElement.style.position = 'absolute';
      testElement.style.left = '-9999px';
      document.body.appendChild(testElement);

      // 获取计算样式
      const computedStyle = window.getComputedStyle(testElement);
      const color = computedStyle.color;
      const backgroundColor = computedStyle.backgroundColor;

      // 移除测试元素
      document.body.removeChild(testElement);

      // 检测是否为高对比度模式
      const isHighContrastMode =
        color === 'rgb(255, 255, 255)' && backgroundColor === 'rgb(0, 0, 0)';

      setIsHighContrast(isHighContrastMode);
    } catch (error) {
      console.warn('Failed to detect high contrast mode:', error);
    }
  }, [enableHighContrastDetection]);

  // 检测屏幕阅读器
  const detectScreenReader = useCallback(() => {
    if (!enableScreenReaderSupport || typeof window === 'undefined') return;

    try {
      // 检测常见的屏幕阅读器标识
      const hasScreenReader =
        window.speechSynthesis !== undefined ||
        navigator.userAgent.includes('NVDA') ||
        navigator.userAgent.includes('JAWS') ||
        navigator.userAgent.includes('VoiceOver') ||
        window.getComputedStyle(document.body).position === 'fixed';

      setIsScreenReaderActive(hasScreenReader);
    } catch (error) {
      console.warn('Failed to detect screen reader:', error);
    }
  }, [enableScreenReaderSupport]);

  // 检查元素是否可聚焦
  const isFocusable = useCallback((element: HTMLElement): boolean => {
    if (!element) return false;

    // 检查是否被禁用
    if (element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true') {
      return false;
    }

    // 检查是否被隐藏
    if (element.getAttribute('aria-hidden') === 'true') {
      return false;
    }

    // 检查可见性
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
      return false;
    }

    // 检查是否在视口内
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return false;
    }

    // 检查 tabindex
    const tabindex = element.getAttribute('tabindex');
    const hasTabIndex = tabindex !== null && parseInt(tabindex, 10) >= 0;

    // 可聚焦的标签
    const focusableTags = ['a', 'button', 'input', 'select', 'textarea', 'details'];
    const isFocusableTag = focusableTags.includes(element.tagName.toLowerCase());

    // 检查 contenteditable
    const isContentEditable = element.getAttribute('contenteditable') === 'true';

    return isFocusableTag || isContentEditable || hasTabIndex;
  }, []);

  // 获取所有可聚焦元素
  const getFocusableElements = useCallback((container?: HTMLElement): HTMLElement[] => {
    const root = container || document.body;
    const focusableElements = Array.from(root.querySelectorAll<HTMLElement>(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'
    ));

    return focusableElements.filter(element => isFocusable(element));
  }, [isFocusable]);

  // 设置焦点
  const setFocus = useCallback((element: HTMLElement | string, options?: FocusOptions): boolean => {
    if (!enableFocusManagement) return false;

    try {
      let targetElement: HTMLElement | null = null;

      if (typeof element === 'string') {
        targetElement = document.querySelector(element);
      } else {
        targetElement = element;
      }

      if (!targetElement || !isFocusable(targetElement)) {
        return false;
      }

      // 保存当前焦点元素
      if (focusTrapConfig.restoreFocus && document.activeElement instanceof HTMLElement) {
        lastFocusedElement.current = document.activeElement;
      }

      targetElement.focus(options);
      setFocusedElement(targetElement);

      return true;
    } catch (error) {
      console.warn('Failed to set focus:', error);
      return false;
    }
  }, [enableFocusManagement, isFocusable, focusTrapConfig.restoreFocus]);

  // 键盘导航处理
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enableKeyboardNavigation) return;

    // 标记键盘导航模式
    if (!isKeyboardMode) {
      setIsKeyboardMode(true);
    }

    const target = event.target as HTMLElement;

    switch (event.key) {
      case 'Tab':
        // Tab键导航逻辑
        if (footerRef.current && footerRef.current.contains(target)) {
          const focusableElements = getFocusableElements(footerRef.current);
          const currentIndex = focusableElements.indexOf(target);

          if (currentIndex !== -1) {
            let nextIndex: number;

            if (event.shiftKey) {
              // Shift + Tab: 向前导航
              nextIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
            } else {
              // Tab: 向后导航
              nextIndex = currentIndex === focusableElements.length - 1 ? 0 : currentIndex + 1;
            }

            event.preventDefault();
            setFocus(focusableElements[nextIndex]);
          }
        }
        break;

      case 'Enter':
      case ' ':
        // Enter和空格键激活元素
        if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.role === 'button') {
          // 让默认行为处理
          break;
        }
        event.preventDefault();
        target.click();
        break;

      case 'Escape':
        // Escape键恢复焦点
        if (focusTrapConfig.restoreFocus && lastFocusedElement.current) {
          event.preventDefault();
          setFocus(lastFocusedElement.current);
        }
        break;
    }
  }, [enableKeyboardNavigation, isKeyboardMode, getFocusableElements, setFocus, focusTrapConfig.restoreFocus]);

  // 添加无障碍属性
  const addA11yAttributes = useCallback((element: HTMLElement, attributes: Record<string, string>) => {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }, []);

  // 向屏幕阅读器宣告消息
  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!enableScreenReaderSupport || !announcementArea.current) return;

    // 清除之前的内容
    announcementArea.current.textContent = '';

    // 设置优先级
    announcementArea.current.setAttribute('aria-live', priority);

    // 添加新消息
    setTimeout(() => {
      if (announcementArea.current) {
        announcementArea.current.textContent = message;
      }
    }, 100);
  }, [enableScreenReaderSupport]);

  // 检查颜色对比度
  const checkColorContrast = useCallback((foreground: string, background: string) => {
    // 简单的颜色对比度计算（实际项目中可以使用专业库如 color-contrast）
    const getLuminance = (color: string): number => {
      // 移除 # 前缀
      const hex = color.replace('#', '');

      // 转换为RGB
      const r = parseInt(hex.substr(0, 2), 16) / 255;
      const g = parseInt(hex.substr(2, 2), 16) / 255;
      const b = parseInt(hex.substr(4, 2), 16) / 255;

      // 计算相对亮度
      const RsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
      const GsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
      const BsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

      return 0.2126 * RsRGB + 0.7152 * GsRGB + 0.0722 * BsRGB;
    };

    const L1 = getLuminance(foreground);
    const L2 = getLuminance(background);

    const lighter = Math.max(L1, L2);
    const darker = Math.min(L1, L2);

    const ratio = (lighter + 0.05) / (darker + 0.05);

    return {
      ratio: Math.round(ratio * 100) / 100,
      wcagAA: ratio >= 4.5,
      wcagAAA: ratio >= 7,
    };
  }, []);

  // 初始化和清理
  useEffect(() => {
    if (!enabled) return;

    // 检测环境
    detectHighContrast();
    detectScreenReader();

    // 添加事件监听器
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', () => setIsKeyboardMode(false), true);

    // 监听高对比度模式变化
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    const handleContrastChange = () => detectHighContrast();
    mediaQuery.addEventListener('change', handleContrastChange);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      mediaQuery.removeEventListener('change', handleContrastChange);
    };
  }, [enabled, handleKeyDown, detectHighContrast, detectScreenReader]);

  return {
    focusedElement,
    isKeyboardMode,
    isHighContrast,
    isScreenReaderActive,
    setFocus,
    isFocusable,
    getFocusableElements,
    handleKeyDown,
    addA11yAttributes,
    announceToScreenReader,
    checkColorContrast,
  };
};

export default useFooterA11y;