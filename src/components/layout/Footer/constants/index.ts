// 万象生活底栏组件库常量配置

export const FOOTER_CONSTANTS = {
  // 延迟加载配置
  LAZY_LOAD: {
    ROOT_MARGIN: '100px 0px',
    THRESHOLD: 0.1,
    DELAY: 0,
    MIN_WAIT_TIME: 200,
    RETRY_COUNT: 3,
    RETRY_DELAY: 1000,
  },

  // 性能配置
  PERFORMANCE: {
    ANALYTICS_SAMPLE_RATE: 0.1,
    BATCH_MAX_SIZE: 10,
    BATCH_FLUSH_INTERVAL: 3000,
    COMPONENT_LOAD_TIMEOUT: 5000,
  },

  // 响应式断点
  RESPONSIVE: {
    XS: 480,
    SM: 576,
    MD: 768,
    LG: 992,
    XL: 1200,
    XXL: 1600,
  },

  // 尺寸配置
  SIZES: {
    SERVICE_CARD: {
      SMALL: { WIDTH: 120, HEIGHT: 140 },
      MEDIUM: { WIDTH: 160, HEIGHT: 180 },
      LARGE: { WIDTH: 200, HEIGHT: 220 },
    },
    SOCIAL_ICON: {
      SMALL: 36,
      MEDIUM: 44,
      LARGE: 52,
    },
    LOGO: {
      SMALL: 20,
      MEDIUM: 24,
      LARGE: 32,
    },
  },

  // 颜色配置
  COLORS: {
    PRIMARY: '#1890ff',
    SUCCESS: '#52c41a',
    WARNING: '#faad14',
    ERROR: '#ff4d4f',
    INFO: '#1890ff',
  },

  // 动画配置
  ANIMATION: {
    DURATION: {
      FAST: '0.1s',
      BASE: '0.2s',
      SLOW: '0.3s',
    },
    EASE: {
      BASE: 'cubic-bezier(0.4, 0, 0.2, 1)',
      IN: 'cubic-bezier(0.4, 0, 1, 1)',
      OUT: 'cubic-bezier(0, 0, 0.2, 1)',
      IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  // 缓存配置
  CACHE: {
    CONFIG_KEY: 'universe-footer-config',
    THEME_KEY: 'universe-footer-theme',
    LOCALE_KEY: 'universe-footer-locale',
    EXPIRY_TIME: 24 * 60 * 60 * 1000, // 24小时
  },

  // 无障碍配置
  ACCESSIBILITY: {
    FOCUS_VISIBLE_OFFSET: '2px',
    SKIP_LINK_DURATION: 3000,
    ANNOUNCEMENT_DELAY: 100,
  },

  // 错误消息
  ERROR_MESSAGES: {
    CONFIG_LOAD_FAILED: '底栏配置加载失败',
    LAZY_LOAD_FAILED: '底栏延迟加载失败',
    ANALYTICS_FAILED: '数据埋点发送失败',
    RENDER_FAILED: '底栏渲染失败',
  },

  // 成功消息
  SUCCESS_MESSAGES: {
    CONFIG_UPDATED: '配置已更新',
    THEME_CHANGED: '主题已切换',
    LOCALE_CHANGED: '语言已切换',
  },
} as const;

// 导出类型定义
export type FooterConstants = typeof FOOTER_CONSTANTS;
export type LazyLoadConfig = typeof FOOTER_CONSTANTS.LAZY_LOAD;
export type PerformanceConfig = typeof FOOTER_CONSTANTS.PERFORMANCE;
export type ResponsiveConfig = typeof FOOTER_CONSTANTS.RESPONSIVE;
export type SizeConfig = typeof FOOTER_CONSTANTS.SIZES;
export type ColorConfig = typeof FOOTER_CONSTANTS.COLORS;
export type AnimationConfig = typeof FOOTER_CONSTANTS.ANIMATION;
export type CacheConfig = typeof FOOTER_CONSTANTS.CACHE;
export type AccessibilityConfig = typeof FOOTER_CONSTANTS.ACCESSIBILITY;

export default FOOTER_CONSTANTS;