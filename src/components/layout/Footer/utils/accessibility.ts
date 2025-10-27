// 万象生活底栏无障碍工具函数

export const footerAccessibility = {
  // 添加无障碍属性
  addA11yAttributes: (element: HTMLElement, attributes: Record<string, string>) => {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  },

  // 设置焦点
  setFocus: (element: HTMLElement, options?: FocusOptions) => {
    element.focus(options);
  },

  // 检查是否可聚焦
  isFocusable: (element: HTMLElement): boolean => {
    return element.tabIndex >= 0 && !element.hasAttribute('disabled');
  },

  // 宣告文本到屏幕阅读器
  announceToScreenReader: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
};