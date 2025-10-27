/**
 * 万象生活底栏主题工具
 * 提供 CSS Variables 操作工具和主题切换功能
 */

/**
 * 获取 CSS 变量值
 */
export const getCSSVariable = (variableName: string): string => {
  if (typeof document === 'undefined') return '';

  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
};

/**
 * 设置 CSS 变量值
 */
export const setCSSVariable = (variableName: string, value: string): void => {
  if (typeof document === 'undefined') return;

  document.documentElement.style.setProperty(variableName, value);
};

/**
 * 批量设置 CSS 变量
 */
export const setCSSVariables = (variables: Record<string, string>): void => {
  if (typeof document === 'undefined') return;

  Object.entries(variables).forEach(([name, value]) => {
    document.documentElement.style.setProperty(name, value);
  });
};

/**
 * 主题类型定义
 */
export interface FooterTheme {
  name: string;
  colors: {
    primary: string;
    background: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    link: string;
    linkHover: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  borderRadius: {
    sm: string;
    base: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    base: string;
    lg: string;
    xl: string;
  };
  transitions: {
    fast: string;
    base: string;
    slow: string;
  };
}

/**
 * 预定义主题
 */
export const FOOTER_THEMES: Record<string, FooterTheme> = {
  // 默认亮色主题
  light: {
    name: 'light',
    colors: {
      primary: '#1890ff',
      background: '#ffffff',
      textPrimary: 'rgba(0, 0, 0, 0.85)',
      textSecondary: 'rgba(0, 0, 0, 0.65)',
      textTertiary: 'rgba(0, 0, 0, 0.45)',
      border: '#e6e6e6',
      link: '#1890ff',
      linkHover: '#40a9ff',
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      xxl: '48px',
    },
    borderRadius: {
      sm: '4px',
      base: '6px',
      md: '8px',
      lg: '12px',
      xl: '16px',
    },
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px rgba(0, 0, 0, 0.02)',
      base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    transitions: {
      fast: '0.1s cubic-bezier(0.4, 0, 0.2, 1)',
      base: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      slow: '0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  // 暗色主题
  dark: {
    name: 'dark',
    colors: {
      primary: '#1890ff',
      background: '#141414',
      textPrimary: 'rgba(255, 255, 255, 0.85)',
      textSecondary: 'rgba(255, 255, 255, 0.65)',
      textTertiary: 'rgba(255, 255, 255, 0.45)',
      border: '#434343',
      link: '#40a9ff',
      linkHover: '#69c0ff',
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      xxl: '48px',
    },
    borderRadius: {
      sm: '4px',
      base: '6px',
      md: '8px',
      lg: '12px',
      xl: '16px',
    },
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.1), 0 1px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.08)',
      base: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
    },
    transitions: {
      fast: '0.1s cubic-bezier(0.4, 0, 0.2, 1)',
      base: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      slow: '0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  // 品牌主题
  brand: {
    name: 'brand',
    colors: {
      primary: '#FF6B35',
      background: '#ffffff',
      textPrimary: 'rgba(0, 0, 0, 0.85)',
      textSecondary: 'rgba(0, 0, 0, 0.65)',
      textTertiary: 'rgba(0, 0, 0, 0.45)',
      border: '#e6e6e6',
      link: '#FF6B35',
      linkHover: '#FF8C42',
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      xxl: '48px',
    },
    borderRadius: {
      sm: '4px',
      base: '6px',
      md: '8px',
      lg: '12px',
      xl: '16px',
    },
    shadows: {
      sm: '0 1px 2px rgba(255, 107, 53, 0.05), 0 1px 6px -1px rgba(255, 107, 53, 0.03)',
      base: '0 4px 6px -1px rgba(255, 107, 53, 0.15), 0 2px 4px -1px rgba(255, 107, 53, 0.1)',
      lg: '0 10px 15px -3px rgba(255, 107, 53, 0.15), 0 4px 6px -2px rgba(255, 107, 53, 0.1)',
      xl: '0 20px 25px -5px rgba(255, 107, 53, 0.15), 0 10px 10px -5px rgba(255, 107, 53, 0.1)',
    },
    transitions: {
      fast: '0.1s cubic-bezier(0.4, 0, 0.2, 1)',
      base: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      slow: '0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  // 简约主题
  minimal: {
    name: 'minimal',
    colors: {
      primary: '#000000',
      background: '#ffffff',
      textPrimary: '#000000',
      textSecondary: '#666666',
      textTertiary: '#999999',
      border: '#f0f0f0',
      link: '#000000',
      linkHover: '#333333',
    },
    spacing: {
      xs: '2px',
      sm: '4px',
      md: '8px',
      lg: '16px',
      xl: '24px',
      xxl: '32px',
    },
    borderRadius: {
      sm: '0px',
      base: '0px',
      md: '0px',
      lg: '0px',
      xl: '0px',
    },
    shadows: {
      sm: 'none',
      base: 'none',
      lg: 'none',
      xl: 'none',
    },
    transitions: {
      fast: '0.1s ease',
      base: '0.2s ease',
      slow: '0.3s ease',
    },
  },
};

/**
 * 应用主题
 */
export const applyFooterTheme = (theme: FooterTheme): void => {
  const variables: Record<string, string> = {
    // 颜色变量
    '--footer-primary': theme.colors.primary,
    '--footer-bg': theme.colors.background,
    '--footer-text-primary': theme.colors.textPrimary,
    '--footer-text-secondary': theme.colors.textSecondary,
    '--footer-text-tertiary': theme.colors.textTertiary,
    '--footer-border': theme.colors.border,
    '--footer-link': theme.colors.link,
    '--footer-link-hover': theme.colors.linkHover,

    // 间距变量
    '--footer-space-xs': theme.spacing.xs,
    '--footer-space-sm': theme.spacing.sm,
    '--footer-space-md': theme.spacing.md,
    '--footer-space-lg': theme.spacing.lg,
    '--footer-space-xl': theme.spacing.xl,
    '--footer-space-xxl': theme.spacing.xxl,

    // 圆角变量
    '--footer-radius-sm': theme.borderRadius.sm,
    '--footer-radius-base': theme.borderRadius.base,
    '--footer-radius-md': theme.borderRadius.md,
    '--footer-radius-lg': theme.borderRadius.lg,
    '--footer-radius-xl': theme.borderRadius.xl,

    // 阴影变量
    '--footer-shadow-sm': theme.shadows.sm,
    '--footer-shadow-base': theme.shadows.base,
    '--footer-shadow-lg': theme.shadows.lg,
    '--footer-shadow-xl': theme.shadows.xl,

    // 过渡变量
    '--footer-transition-fast': theme.transitions.fast,
    '--footer-transition-base': theme.transitions.base,
    '--footer-transition-slow': theme.transitions.slow,
  };

  setCSSVariables(variables);
};

/**
 * 获取当前主题名称
 */
export const getCurrentTheme = (): string => {
  if (typeof document === 'undefined') return 'light';

  const computedStyle = getComputedStyle(document.documentElement);
  const bgColor = computedStyle.getPropertyValue('--footer-bg').trim();

  // 根据背景色判断主题
  if (bgColor === '#141414' || bgColor === 'rgb(20, 20, 20)') {
    return 'dark';
  } else if (bgColor === '#ffffff' || bgColor === 'rgb(255, 255, 255)') {
    const primaryColor = computedStyle.getPropertyValue('--footer-primary').trim();
    if (primaryColor === '#FF6B35' || primaryColor === 'rgb(255, 107, 53)') {
      return 'brand';
    }
    return 'light';
  }

  return 'light';
};

/**
 * 切换主题
 */
export const toggleFooterTheme = (themeName?: keyof typeof FOOTER_THEMES): void => {
  const theme = themeName ? FOOTER_THEMES[themeName] : FOOTER_THEMES.light;
  applyFooterTheme(theme);
};

/**
 * 重置为默认主题
 */
export const resetFooterTheme = (): void => {
  // 清除所有自定义 CSS 变量，回退到 CSS 文件中定义的默认值
  const variableNames = Object.keys(FOOTER_THEMES.light.colors)
    .map(key => `--footer-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`);

  variableNames.forEach(name => {
    document.documentElement.style.removeProperty(name);
  });
};

/**
 * 检测系统主题偏好
 */
export const detectSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/**
 * 监听系统主题变化
 */
export const watchSystemTheme = (callback: (theme: 'light' | 'dark') => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handleChange = (e: MediaQueryListEvent) => {
    callback(e.matches ? 'dark' : 'light');
  };

  mediaQuery.addEventListener('change', handleChange);

  // 返回清理函数
  return () => {
    mediaQuery.removeEventListener('change', handleChange);
  };
};

/**
 * 主题工具类
 */
export class FooterThemeManager {
  private currentTheme: string = 'light';
  private systemThemeWatcher?: (() => void);

  constructor(initialTheme?: keyof typeof FOOTER_THEMES) {
    if (initialTheme) {
      this.setTheme(initialTheme);
    } else {
      // 自动检测系统主题
      this.currentTheme = detectSystemTheme();
      this.applyCurrentTheme();

      // 监听系统主题变化
      this.systemThemeWatcher = watchSystemTheme((theme) => {
        if (this.currentTheme === 'auto') {
          this.applyCurrentTheme();
        }
      });
    }
  }

  /**
   * 设置主题
   */
  setTheme(themeName: keyof typeof FOOTER_THEMES | 'auto'): void {
    this.currentTheme = themeName;
    this.applyCurrentTheme();
  }

  /**
   * 获取当前主题
   */
  getTheme(): string {
    return this.currentTheme;
  }

  /**
   * 应用当前主题
   */
  private applyCurrentTheme(): void {
    if (this.currentTheme === 'auto') {
      const systemTheme = detectSystemTheme();
      applyFooterTheme(FOOTER_THEMES[systemTheme]);
    } else {
      applyFooterTheme(FOOTER_THEMES[this.currentTheme as keyof typeof FOOTER_THEMES]);
    }
  }

  /**
   * 切换主题
   */
  toggleTheme(): void {
    const themes = Object.keys(FOOTER_THEMES) as (keyof typeof FOOTER_THEMES)[];
    const currentIndex = themes.indexOf(this.currentTheme as keyof typeof FOOTER_THEMES);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.setTheme(themes[nextIndex]);
  }

  /**
   * 重置主题
   */
  reset(): void {
    this.currentTheme = 'light';
    resetFooterTheme();
  }

  /**
   * 销毁主题管理器
   */
  destroy(): void {
    if (this.systemThemeWatcher) {
      this.systemThemeWatcher();
    }
  }
}

export default {
  getCSSVariable,
  setCSSVariable,
  setCSSVariables,
  FOOTER_THEMES,
  applyFooterTheme,
  getCurrentTheme,
  toggleFooterTheme,
  resetFooterTheme,
  detectSystemTheme,
  watchSystemTheme,
  FooterThemeManager,
};