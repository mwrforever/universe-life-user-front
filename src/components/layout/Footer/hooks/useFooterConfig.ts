import { useState, useEffect, useCallback, useMemo } from 'react';
import { footerConfig as defaultConfig } from '../config/footerConfig';
import type { FooterConfig } from '../types/component';

interface UseFooterConfigOptions {
  // 是否启用本地存储缓存
  enableCache?: boolean;
  // 缓存键名
  cacheKey?: string;
  // 配置更新回调
  onUpdate?: (config: FooterConfig) => void;
  // 是否启用配置验证
  enableValidation?: boolean;
}

interface UseFooterConfigReturn {
  // 当前配置
  config: FooterConfig;
  // 更新配置
  updateConfig: (updater: Partial<FooterConfig> | ((prev: FooterConfig) => FooterConfig)) => void;
  // 重置为默认配置
  resetConfig: () => void;
  // 合并配置
  mergeConfig: (config: Partial<FooterConfig>) => void;
  // 获取配置的深拷贝
  getConfigCopy: () => FooterConfig;
  // 配置是否已修改
  isModified: boolean;
  // 保存配置到本地存储
  saveConfig: () => void;
  // 从本地存储加载配置
  loadConfig: () => boolean;
  // 清除本地存储的配置
  clearCache: () => void;
}

/**
 * 万象生活底栏配置管理Hook
 * 提供配置的读取、更新、缓存、验证等功能
 */
export const useFooterConfig = (options: UseFooterConfigOptions = {}): UseFooterConfigReturn => {
  const {
    enableCache = false,
    cacheKey = 'universe-footer-config',
    onUpdate,
    enableValidation = true,
  } = options;

  // 内部配置状态
  const [config, setConfig] = useState<FooterConfig>(defaultConfig);
  const [isModified, setIsModified] = useState(false);

  // 验证配置的合法性
  const validateConfig = useCallback((configToValidate: Partial<FooterConfig>): boolean => {
    if (!enableValidation) return true;

    try {
      // 基础结构验证
      if (!configToValidate.topBar || !configToValidate.mainContent || !configToValidate.bottomBar) {
        console.warn('Footer config validation failed: missing required sections');
        return false;
      }

      // TopBar 验证
      if (!configToValidate.topBar.logo || !configToValidate.topBar.navigation || !configToValidate.topBar.userActions) {
        console.warn('Footer config validation failed: missing topBar sections');
        return false;
      }

      // 导航项验证
      if (!Array.isArray(configToValidate.topBar.navigation) || configToValidate.topBar.navigation.length === 0) {
        console.warn('Footer config validation failed: navigation must be a non-empty array');
        return false;
      }

      // 服务项验证
      if (configToValidate.mainContent.services && (!Array.isArray(configToValidate.mainContent.services))) {
        console.warn('Footer config validation failed: services must be an array');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Footer config validation error:', error);
      return false;
    }
  }, [enableValidation]);

  // 深度合并配置
  const deepMergeConfig = useCallback((base: FooterConfig, override: Partial<FooterConfig>): FooterConfig => {
    const merge = (target: any, source: any): any => {
      if (!source || typeof source !== 'object') return target;
      if (!target || typeof target !== 'object') return source;

      const result = { ...target };

      Object.keys(source).forEach(key => {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          result[key] = merge(target[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      });

      return result;
    };

    return merge(base, override);
  }, []);

  // 从本地存储加载配置
  const loadConfig = useCallback((): boolean => {
    if (!enableCache || typeof window === 'undefined') return false;

    try {
      const cachedConfig = localStorage.getItem(cacheKey);
      if (!cachedConfig) return false;

      const parsedConfig = JSON.parse(cachedConfig) as Partial<FooterConfig>;

      if (validateConfig(parsedConfig)) {
        const mergedConfig = deepMergeConfig(defaultConfig, parsedConfig);
        setConfig(mergedConfig);
        return true;
      } else {
        console.warn('Cached footer config validation failed, using default config');
        localStorage.removeItem(cacheKey);
        return false;
      }
    } catch (error) {
      console.error('Failed to load footer config from cache:', error);
      return false;
    }
  }, [enableCache, cacheKey, validateConfig, deepMergeConfig]);

  // 保存配置到本地存储
  const saveConfig = useCallback(() => {
    if (!enableCache || typeof window === 'undefined') return;

    try {
      localStorage.setItem(cacheKey, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save footer config to cache:', error);
    }
  }, [enableCache, cacheKey, config]);

  // 清除本地存储
  const clearCache = useCallback(() => {
    if (enableCache && typeof window !== 'undefined') {
      localStorage.removeItem(cacheKey);
    }
  }, [enableCache, cacheKey]);

  // 更新配置
  const updateConfig = useCallback((updater: Partial<FooterConfig> | ((prev: FooterConfig) => FooterConfig)) => {
    setConfig(prevConfig => {
      let newConfig: FooterConfig;

      if (typeof updater === 'function') {
        newConfig = updater(prevConfig);
      } else {
        newConfig = deepMergeConfig(prevConfig, updater);
      }

      // 验证新配置
      if (!validateConfig(newConfig)) {
        console.warn('Footer config update failed validation, keeping current config');
        return prevConfig;
      }

      // 检查是否有修改
      const hasChanged = JSON.stringify(prevConfig) !== JSON.stringify(newConfig);
      setIsModified(hasChanged);

      // 触发更新回调
      if (onUpdate && hasChanged) {
        onUpdate(newConfig);
      }

      return newConfig;
    });
  }, [deepMergeConfig, validateConfig, onUpdate]);

  // 合并配置
  const mergeConfig = useCallback((configToMerge: Partial<FooterConfig>) => {
    updateConfig(configToMerge);
  }, [updateConfig]);

  // 重置配置
  const resetConfig = useCallback(() => {
    setConfig(defaultConfig);
    setIsModified(false);
    clearCache();
  }, [clearCache]);

  // 获取配置深拷贝
  const getConfigCopy = useCallback((): FooterConfig => {
    return JSON.parse(JSON.stringify(config));
  }, [config]);

  // 初始化时从缓存加载
  useEffect(() => {
    if (enableCache) {
      loadConfig();
    }
  }, [enableCache, loadConfig]);

  // 自动保存（当配置修改时）
  useEffect(() => {
    if (enableCache && isModified) {
      const timer = setTimeout(() => {
        saveConfig();
      }, 1000); // 防抖1秒

      return () => clearTimeout(timer);
    }
  }, [enableCache, isModified, saveConfig]);

  // 监听storage事件（跨标签页同步）
  useEffect(() => {
    if (!enableCache) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === cacheKey && e.newValue) {
        try {
          const newConfig = JSON.parse(e.newValue) as Partial<FooterConfig>;
          if (validateConfig(newConfig)) {
            const mergedConfig = deepMergeConfig(defaultConfig, newConfig);
            setConfig(mergedConfig);
          }
        } catch (error) {
          console.error('Failed to sync footer config from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [enableCache, cacheKey, validateConfig, deepMergeConfig]);

  return {
    config,
    updateConfig,
    resetConfig,
    mergeConfig,
    getConfigCopy,
    isModified,
    saveConfig,
    loadConfig,
    clearCache,
  };
};

export default useFooterConfig;