/**
 * 万象生活可访问性工具
 * 提供WCAG 2.1 AA标准合规的辅助功能
 */

export interface AccessibilityConfig {
  enableAriaLabels?: boolean;
  enableKeyboardNavigation?: boolean;
  enableScreenReader?: boolean;
  enableHighContrast?: boolean;
  enableReducedMotion?: boolean;
}

export interface AriaLabel {
  element: string;
  label: string;
  description?: string;
}

export interface KeyboardNavigationItem {
  element: HTMLElement;
  order: number;
  group?: string;
  disabled?: boolean;
}

/**
 * 可访问性工具类
 */
export class AccessibilityManager {
  private config: AccessibilityConfig;
  private focusableElements: HTMLElement[] = [];
  private currentFocusIndex: number = -1;

  constructor(config: AccessibilityConfig = {}) {
    this.config = {
      enableAriaLabels: true,
      enableKeyboardNavigation: true,
      enableScreenReader: true,
      enableHighContrast: true,
      enableReducedMotion: true,
      ...config,
    };
  }

  /**
   * 生成ARIA标签
   */
  generateAriaLabel(element: string, label: string, description?: string): string {
    if (!this.config.enableAriaLabels) {
      return '';
    }

    const attributes = [];

    // 主标签
    attributes.push(`aria-label="${label}"`);

    // 描述
    if (description) {
      attributes.push(`aria-describedby="${element}-desc"`);
    }

    return attributes.join(' ');
  }

  /**
   * 设置元素的ARIA属性
   */
  setAriaAttributes(element: HTMLElement, attributes: Record<string, string>) {
    if (!this.config.enableAriaLabels) return;

    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  /**
   * 检查元素的可访问性
   */
  checkAccessibility(element: HTMLElement): string[] {
    const issues: string[] = [];

    // 检查ARIA标签
    if (this.config.enableAriaLabels) {
      const hasLabel =
        element.hasAttribute('aria-label') ||
        element.hasAttribute('aria-labelledby') ||
        (element.getAttribute('role') === 'button' && element.textContent);

      if (!hasLabel && (element.tagName === 'BUTTON' || element.tagName === 'A')) {
        issues.push(`元素 ${element.tagName} 缺少ARIA标签或文本内容`);
      }
    }

    // 检查键盘可访问性
    if (this.config.enableKeyboardNavigation) {
      const isFocusable = this.isElementFocusable(element);
      const hasTabIndex = element.hasAttribute('tabindex');

      if (!isFocusable && hasTabIndex) {
        issues.push(`元素设置了tabindex但不可键盘访问`);
      }
    }

    // 检查颜色对比度
    if (this.config.enableHighContrast) {
      const contrast = this.checkColorContrast(element);
      if (contrast < 4.5) {
        issues.push(`颜色对比度过低: ${contrast.toFixed(2)}:1 (需要≥4.5:1)`);
      }
    }

    return issues;
  }

  /**
   * 检查元素是否可聚焦
   */
  private isElementFocusable(element: HTMLElement): boolean {
    const focusableTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'DETAILS', 'SUMMARY'];

    if (focusableTags.includes(element.tagName)) {
      return !element.hasAttribute('disabled') && !element.hasAttribute('aria-disabled');
    }

    const focusableRoles = [
      'button',
      'link',
      'textbox',
      'checkbox',
      'radio',
      'combobox',
      'listbox',
      'option',
      'menuitem',
    ];
    const role = element.getAttribute('role');

    if (focusableRoles.includes(role || '')) {
      return !element.hasAttribute('aria-disabled') && !element.hasAttribute('disabled');
    }

    return element.hasAttribute('tabindex') && element.getAttribute('tabindex') !== '-1';
  }

  /**
   * 检查颜色对比度
   */
  private checkColorContrast(element: HTMLElement): number {
    const styles = window.getComputedStyle(element);
    const color = styles.color;
    const backgroundColor = styles.backgroundColor;

    // 简单的对比度计算（实际项目中应使用专业的对比度库）
    const getLuminance = (color: string): number => {
      const rgb = color.match(/\d+/g);
      if (!rgb) return 0;

      const [r, g, b] = rgb.map(Number);
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    };

    const textColor = getLuminance(color);
    const bgColor = getLuminance(backgroundColor);

    const lighter = Math.max(textColor, bgColor);
    const darker = Math.min(textColor, bgColor);

    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * 设置键盘导航
   */
  setupKeyboardNavigation(items: KeyboardNavigationItem[]): void {
    if (!this.config.enableKeyboardNavigation) return;

    // 按order排序
    items.sort((a, b) => a.order - b.order);

    // 获取所有可聚焦元素
    this.focusableElements = items
      .filter(item => !item.disabled && this.isElementFocusable(item.element))
      .map(item => item.element);

    // 添加键盘事件监听
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('focus', this.handleFocus.bind(this));
  }

  /**
   * 处理键盘事件
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.config.enableKeyboardNavigation) return;

    if (event.key === 'Tab') {
      event.preventDefault();
      this.navigateFocus(event.shiftKey ? -1 : 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      const focusedElement = document.activeElement as HTMLElement;
      if (focusedElement && focusedElement.click) {
        focusedElement.click();
      }
    }
  };

  /**
   * 处理焦点事件
   */
  private handleFocus = (): void => {
    const focusedElement = document.activeElement as HTMLElement;
    const index = this.focusableElements.indexOf(focusedElement);

    if (index !== -1) {
      this.currentFocusIndex = index;
    }
  };

  /**
   * 导航焦点
   */
  private navigateFocus(direction: number): void {
    const currentIndex = this.currentFocusIndex;
    const newIndex = currentIndex + direction;

    // 循环导航
    let nextIndex = newIndex;
    if (newIndex < 0) {
      nextIndex = this.focusableElements.length - 1;
    } else if (newIndex >= this.focusableElements.length) {
      nextIndex = 0;
    }

    const nextElement = this.focusableElements[nextIndex];
    if (nextElement) {
      nextElement.focus();
      this.currentFocusIndex = nextIndex;
    }
  }

  /**
   * 检测用户的可访问性偏好
   */
  detectAccessibilityPreferences(): {
    prefersReducedMotion: boolean;
    prefersHighContrast: boolean;
    prefersDarkMode: boolean;
    prefersHoverable: boolean;
    prefersColorScheme: boolean;
  } {
    const preferences = {
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
      prefersDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      prefersHoverable: window.matchMedia('(hover: hover)').matches,
      prefersColorScheme: window.matchMedia('(color-scheme: dark)').matches,
    };

    return preferences;
  }

  /**
   * 应用可访问性设置
   */
  applyAccessibilityPreferences(): void {
    const preferences = this.detectAccessibilityPreferences();

    // 减少动画
    if (this.config.enableReducedMotion && preferences.prefersReducedMotion) {
      document.documentElement.style.setProperty('--footer-transition-fast', '0s');
      document.documentElement.style.setProperty('--footer-transition-base', '0s');
    }

    // 高对比度
    if (this.config.enableHighContrast && preferences.prefersHighContrast) {
      document.documentElement.style.setProperty('--footer-text-primary', '#000000');
      document.documentElement.style.setProperty('--footer-bg', '#ffffff');
      document.documentElement.style.setProperty('--footer-border', '#000000');
    }

    // 暗色模式
    if (preferences.prefersDarkMode) {
      document.documentElement.style.setProperty('--footer-bg', '#141414');
      document.documentElement.style.setProperty(
        '--footer-text-primary',
        'rgba(255, 255, 255, 0.85)'
      );
    }

    console.log('Applied accessibility preferences:', preferences);
  }

  /**
   * 创建屏幕阅读器公告
   */
  announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.config.enableScreenReader) return;

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-9999px';
    announcement.style.opacity = '0';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // 立即移除元素，但屏幕阅读器会读出内容
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 100);
  }

  /**
   * 生成跳过链接
   */
  generateSkipLinks(): string {
    const skipLinks = [
      {
        href: '#main-content',
        text: '跳转到主内容',
        className: 'skip-link',
      },
      {
        href: '#footer-navigation',
        text: '跳转到导航',
        className: 'skip-link',
      },
      {
        href: '#footer-legal',
        text: '跳转到法律信息',
        className: 'skip-link',
      },
    ];

    return skipLinks
      .map(link => `<a href="${link.href}" class="${link.className}">${link.text}</a>`)
      .join('');
  }

  /**
   * 验证表单的可访问性
   */
  validateFormAccessibility(formElement: HTMLFormElement): string[] {
    const issues: string[] = [];

    // 检查表单字段是否有标签
    const inputs = formElement.querySelectorAll('input, select, textarea');
    inputs.forEach((input, index) => {
      const htmlInput = input as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      const hasLabel = htmlInput.id && formElement.querySelector(`label[for="${htmlInput.id}"]`);
      if (!hasLabel) {
        issues.push(`表单字段 ${index + 1} 缺少标签`);
      }

      // 检查必填字段
      if (htmlInput.hasAttribute('required') && !htmlInput.value) {
        issues.push(`必填字段 ${index + 1} 为空`);
      }

      // 检查输入类型
      const inputType = (htmlInput as HTMLInputElement).type;
      if (inputType === 'email' && htmlInput.value && !this.isValidEmail(htmlInput.value)) {
        issues.push(`无效的邮箱格式: ${htmlInput.value}`);
      }
    });

    // 检查提交按钮
    const submitButton = formElement.querySelector('button[type="submit"]');
    if (!submitButton) {
      issues.push('表单缺少提交按钮');
    }

    return issues;
  }

  /**
   * 验证邮箱格式
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 添加焦点指示器
   */
  addFocusIndicators(): void {
    const style = document.createElement('style');
    style.textContent = `
      :focus-visible {
        outline: 2px solid #1890ff !important;
        outline-offset: 2px;
      }

      *:focus:not(:focus-visible) {
        outline: none !important;
      }

      .skip-link:focus {
        position: absolute;
        top: 10px;
        left: 10px;
        background: var(--footer-primary, #1890ff);
        color: white;
        padding: 8px 16px;
        border-radius: 4px;
        text-decoration: none;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .skip-link:focus {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * 初始化可访问性功能
   */
  init(): void {
    this.applyAccessibilityPreferences();
    this.addFocusIndicators();

    // 监听系统偏好变化
    const mediaQueries = [
      '(prefers-reduced-motion: reduce)',
      '(prefers-contrast: high)',
      '(prefers-color-scheme: dark)',
    ];

    mediaQueries.forEach(query => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener('change', () => {
        this.applyAccessibilityPreferences();
      });
    });
  }

  /**
   * 获取当前配置
   */
  getConfig(): AccessibilityConfig {
    return { ...this.config };
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<AccessibilityConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.applyAccessibilityPreferences();
  }

  /**
   * 销毁实例
   */
  destroy(): void {
    this.focusableElements = [];
    this.currentFocusIndex = -1;
  }
}

// 默认可访问性管理器实例
const accessibilityManager = new AccessibilityManager();

// 导出便捷函数
export const generateAriaLabel = (element: string, label: string, description?: string): string => {
  return accessibilityManager.generateAriaLabel(element, label, description);
};

export const setAriaAttributes = (
  element: HTMLElement,
  attributes: Record<string, string>
): void => {
  accessibilityManager.setAriaAttributes(element, attributes);
};

export const checkAccessibility = (element: HTMLElement): string[] => {
  return accessibilityManager.checkAccessibility(element);
};

export const setupKeyboardNavigation = (items: KeyboardNavigationItem[]): void => {
  accessibilityManager.setupKeyboardNavigation(items);
};

export const detectAccessibilityPreferences = () => {
  return accessibilityManager.detectAccessibilityPreferences();
};

export const applyAccessibilityPreferences = (): void => {
  accessibilityManager.applyAccessibilityPreferences();
};

export const announceToScreenReader = (
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void => {
  accessibilityManager.announceToScreenReader(message, priority);
};

export const generateSkipLinks = (): string => {
  return accessibilityManager.generateSkipLinks();
};

export const validateFormAccessibility = (formElement: HTMLFormElement): string[] => {
  return accessibilityManager.validateFormAccessibility(formElement);
};

export const initAccessibility = (): void => {
  accessibilityManager.init();
};

export const getAccessibilityConfig = (): AccessibilityConfig => {
  return accessibilityManager.getConfig();
};

export const updateAccessibilityConfig = (newConfig: Partial<AccessibilityConfig>): void => {
  accessibilityManager.updateConfig(newConfig);
};

export default AccessibilityManager;
