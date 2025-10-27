import { useState, useEffect } from 'react';
import zhCN from './zh-CN.json';
import enUS from './en-US.json';
import type { FooterLocaleType, FooterLocalePath, FooterLocaleKeys } from './types';

// 语言包映射
const localeMap = {
  'zh-CN': zhCN,
  'en-US': enUS,
} as const;

// 默认语言
const DEFAULT_LOCALE: FooterLocaleType = 'zh-CN';

/**
 * 万象生活底栏多语言Hook
 * 提供国际化文本翻译功能
 */
export const useFooterLocale = (initialLocale?: FooterLocaleType) => {
  // 检测浏览器语言
  const getBrowserLocale = (): FooterLocaleType => {
    if (typeof window === 'undefined') return DEFAULT_LOCALE;

    const browserLang = navigator.language.toLowerCase();

    if (browserLang.startsWith('zh')) {
      return 'zh-CN';
    } else if (browserLang.startsWith('en')) {
      return 'en-US';
    }

    return DEFAULT_LOCALE;
  };

  const [locale, setLocale] = useState<FooterLocaleType>(
    initialLocale || getBrowserLocale()
  );

  // 从本地存储恢复语言设置
  useEffect(() => {
    try {
      const storedLocale = localStorage.getItem('universe-footer-locale') as FooterLocaleType;
      if (storedLocale && localeMap[storedLocale]) {
        setLocale(storedLocale);
      }
    } catch (error) {
      console.warn('Failed to read locale from localStorage:', error);
    }
  }, []);

  // 语言切换时保存到本地存储
  useEffect(() => {
    try {
      localStorage.setItem('universe-footer-locale', locale);
    } catch (error) {
      console.warn('Failed to save locale to localStorage:', error);
    }
  }, [locale]);

  /**
   * 获取翻译文本
   * @param path 翻译路径，如 'topBar.navigation.home'
   * @returns 翻译后的文本
   */
  const t = (path: FooterLocalePath): string => {
    const currentLocale = localeMap[locale] || localeMap[DEFAULT_LOCALE];
    const keys = path.split('.');
    let value: any = currentLocale.footer;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        console.warn(`Translation key not found: ${path}`);
        return path; // 返回路径作为兜底
      }
    }

    return typeof value === 'string' ? value : path;
  };

  /**
   * 批量获取翻译文本
   * @param paths 翻译路径数组
   * @returns 翻译文本对象
   */
  const batch = <T extends readonly FooterLocalePath[]>(
    paths: T
  ): Record<T[number], string> => {
    const result = {} as Record<T[number], string>;

    for (const path of paths) {
      result[path] = t(path);
    }

    return result;
  };

  /**
   * 切换语言
   * @param newLocale 新语言类型
   */
  const changeLocale = (newLocale: FooterLocaleType) => {
    if (localeMap[newLocale]) {
      setLocale(newLocale);
    } else {
      console.warn(`Unsupported locale: ${newLocale}`);
    }
  };

  /**
   * 获取当前语言信息
   */
  const getLocaleInfo = () => ({
    current: locale,
    available: Object.keys(localeMap) as FooterLocaleType[],
    isRTL: false, // 目前不支持RTL语言
    direction: 'ltr' as const,
  });

  return {
    // 当前语言
    locale,

    // 翻译函数
    t,
    batch,

    // 语言控制
    changeLocale,
    setLocale,

    // 语言信息
    getLocaleInfo,

    // 便捷属性
    isZhCN: locale === 'zh-CN',
    isEnUS: locale === 'en-US',
  };
};

/**
 * 创建翻译Hook的高阶函数
 * 允许组件预设初始语言
 */
export const createFooterLocale = (initialLocale?: FooterLocaleType) => {
  return () => useFooterLocale(initialLocale);
};

/**
 * 静态翻译函数（用于非React环境）
 */
export const getFooterTranslation = (
  path: FooterLocalePath,
  locale: FooterLocaleType = DEFAULT_LOCALE
): string => {
  const currentLocale = localeMap[locale] || localeMap[DEFAULT_LOCALE];
  const keys = path.split('.');
  let value: any = currentLocale.footer;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return path;
    }
  }

  return typeof value === 'string' ? value : path;
};

export default useFooterLocale;