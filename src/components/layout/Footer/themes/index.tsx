import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { darkTheme } from './dark';
import { lightTheme } from './light';
import type { FooterTheme, ThemeContextType, ThemeCustomizerOptions } from './types';

// 默认主题定制器配置
const defaultThemeOptions: ThemeCustomizerOptions = {
  enableLivePreview: true,
  enablePersistence: true,
  storageKey: 'universe-footer-theme',
  enableSystemThemeDetection: true,
  defaultTheme: 'auto',
};

// 创建主题上下文
const ThemeContext = createContext<ThemeContextType | null>(null);

/**
 * 万象生活底栏主题提供者组件
 */
export const FooterThemeProvider: React.FC<{
  children: React.ReactNode;
  options?: ThemeCustomizerOptions;
  initialTheme?: Partial<FooterTheme>;
}> = ({
  children,
  options = {},
  initialTheme = {}
}) => {
  const config = { ...defaultThemeOptions, ...options };

  // 状态管理
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'auto'>(
    config.defaultTheme || 'auto'
  );
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [customTheme, setCustomTheme] = useState<Partial<FooterTheme>>(initialTheme);

  // 获取系统主题
  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  // 获取当前实际应用的主题
  const getCurrentTheme = useCallback((): FooterTheme => {
    const baseTheme = themeMode === 'auto' ? getSystemTheme() : themeMode;
    const theme = baseTheme === 'dark' ? darkTheme : lightTheme;

    // 如果是高对比度模式，使用高对比度主题
    if (isHighContrast) {
      const highContrastTheme = baseTheme === 'dark'
        ? { ...theme,
            token: { ...theme.token,
              colorBgFooter: '#000000',
              colorTextFooter: '#ffffff',
              colorBorderFooter: '#ffffff'
            }
          }
        : { ...theme,
            token: { ...theme.token,
              colorBgFooter: '#ffffff',
              colorTextFooter: '#000000',
              colorBorderFooter: '#000000'
            }
          };
      return mergeThemes(highContrastTheme, customTheme);
    }

    return mergeThemes(theme, customTheme);
  }, [themeMode, getSystemTheme, isHighContrast, customTheme]);

  // 合并主题配置
  const mergeThemes = useCallback((base: FooterTheme, custom: Partial<FooterTheme>): FooterTheme => {
    return {
      ...base,
      token: {
        ...base.token,
        ...custom.token,
      },
      components: {
        ...base.components,
        ...custom.components,
      },
      responsive: {
        ...base.responsive,
        ...custom.responsive,
      },
      animation: {
        ...base.animation,
        ...custom.animation,
      },
    };
  }, []);

  // 从本地存储加载主题设置
  const loadThemeSettings = useCallback(() => {
    if (!config.enablePersistence || typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(config.storageKey!);
      if (stored) {
        const settings = JSON.parse(stored);
        setThemeMode(settings.themeMode || 'auto');
        setIsHighContrast(settings.isHighContrast || false);
        setIsCompact(settings.isCompact || false);
        setCustomTheme(settings.customTheme || {});
      }
    } catch (error) {
      console.warn('Failed to load theme settings:', error);
    }
  }, [config]);

  // 保存主题设置到本地存储
  const saveThemeSettings = useCallback(() => {
    if (!config.enablePersistence || typeof window === 'undefined') return;

    try {
      const settings = {
        themeMode,
        isHighContrast,
        isCompact,
        customTheme,
      };
      localStorage.setItem(config.storageKey!, JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save theme settings:', error);
    }
  }, [config, themeMode, isHighContrast, isCompact, customTheme]);

  // 切换主题模式
  const handleSetThemeMode = useCallback((mode: 'light' | 'dark' | 'auto') => {
    setThemeMode(mode);
  }, []);

  // 切换高对比度模式
  const handleSetHighContrast = useCallback((enabled: boolean) => {
    setIsHighContrast(enabled);
  }, []);

  // 切换紧凑模式
  const handleSetCompact = useCallback((enabled: boolean) => {
    setIsCompact(enabled);
  }, []);

  // 应用自定义主题
  const handleApplyCustomTheme = useCallback((theme: Partial<FooterTheme>) => {
    setCustomTheme(prev => mergeThemes(prev, theme));
  }, [mergeThemes]);

  // 重置主题
  const handleResetTheme = useCallback(() => {
    setThemeMode(config.defaultTheme || 'auto');
    setIsHighContrast(false);
    setIsCompact(false);
    setCustomTheme({});
  }, [config]);

  // 获取主题变量
  const getThemeVariable = useCallback((key: keyof FooterTheme['token']): string => {
    const currentTheme = getCurrentTheme();
    return currentTheme.token[key] as string;
  }, [getCurrentTheme]);

  // 获取计算后的主题
  const getComputedTheme = useCallback(() => {
    return getCurrentTheme();
  }, [getCurrentTheme]);

  // 初始化
  useEffect(() => {
    loadThemeSettings();
  }, [loadThemeSettings]);

  // 保存设置
  useEffect(() => {
    saveThemeSettings();
  }, [saveThemeSettings]);

  // 监听系统主题变化
  useEffect(() => {
    if (!config.enableSystemThemeDetection || typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // 自动模式下需要重新计算主题
      if (themeMode === 'auto') {
        // 触发重新渲染
        setCustomTheme(prev => ({ ...prev }));
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [config.enableSystemThemeDetection, themeMode]);

  // 生成CSS变量
  const generateCSSVariables = useCallback((theme: FooterTheme): Record<string, string> => {
    const variables: Record<string, string> = {};

    // 生成Token变量
    Object.entries(theme.token).forEach(([key, value]) => {
      const cssVar = `--footer-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      variables[cssVar] = value;
    });

    return variables;
  }, []);

  const currentTheme = getCurrentTheme();
  const cssVariables = generateCSSVariables(currentTheme);

  const contextValue: ThemeContextType = {
    currentTheme,
    themeMode,
    isHighContrast,
    isCompact,
    setThemeMode: handleSetThemeMode,
    setHighContrast: handleSetHighContrast,
    setCompact: handleSetCompact,
    applyCustomTheme: handleApplyCustomTheme,
    resetTheme: handleResetTheme,
    getThemeVariable,
    getComputedTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <ConfigProvider
        theme={{
          algorithm: themeMode === 'dark'
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
          token: {
            ...currentTheme.token,
            // 紧凑模式调整
            ...(isCompact && {
              fontSize: 12,
              padding: 8,
              paddingSM: 6,
              paddingMD: 8,
              paddingLG: 12,
              margin: 8,
              marginSM: 4,
              marginMD: 8,
              marginLG: 12,
            }),
          },
          components: currentTheme.components,
        }}
      >
        <div
          style={{
            ...cssVariables,
            // 紧凑模式样式
            ...(isCompact && {
              '--footer-font-size': '12px',
              '--footer-padding': '8px',
              '--footer-margin': '4px',
            }),
          } as React.CSSProperties}
        >
          {children}
        </div>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

/**
 * 使用主题的Hook
 */
export const useFooterTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useFooterTheme must be used within FooterThemeProvider');
  }
  return context;
};

// 导出主题配置
export type { FooterTheme, ThemeContextType, ThemeCustomizerOptions };

export default {
  FooterThemeProvider,
  useFooterTheme,
  darkTheme,
  lightTheme,
};