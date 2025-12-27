/**
 * TopNavBar专用主题配置
 * Modern Bright 淘宝/天猫风格自定义Ant Design主题
 */

import { theme } from 'antd';
import type { ThemeConfig } from 'antd';

// Modern Bright 主题配置 - 淘宝风格
export const brightTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    // 主色调 - 淘宝橙色
    colorPrimary: '#ff6000',
    colorSuccess: '#52c41a',
    colorWarning: '#fa8c16',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',

    // 背景色 - 纯净白色
    colorBgBase: '#ffffff',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f8fafc',

    // 文字颜色
    colorTextBase: '#333333',
    colorTextSecondary: '#666666',
    colorTextTertiary: '#999999',
    colorTextQuaternary: '#cccccc',

    // 边框颜色 - 浅色系
    colorBorder: '#f0f0f0',
    colorBorderSecondary: '#f8f8f8',

    // 圆角
    borderRadius: 4,
    borderRadiusLG: 8,
    borderRadiusSM: 2,

    // 阴影 - 轻柔阴影
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
    boxShadowSecondary: '0 4px 12px rgba(0, 0, 0, 0.05)',

    // 字体 - Inter + 系统字体栈
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 12,
    fontSizeLG: 14,
    fontSizeSM: 10,

    // 间距
    padding: 16,
    paddingXS: 4,
    paddingSM: 8,
    paddingLG: 24,

    // 控制台高度
    controlHeight: 32,
    controlHeightSM: 24,
    controlHeightLG: 40,

    // 动画
    motionDurationFast: '0.1s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
  },
  components: {
    Button: {
      borderRadius: 4,
      controlHeight: 32,
      fontWeight: 400,
      colorPrimary: '#ff6000',
      colorPrimaryHover: '#ff7a1f',
      colorPrimaryActive: '#e55a00',
    },

    Dropdown: {
      borderRadius: 8,
      boxShadow: '0 6px 16px -8px rgba(0,0,0,0.08)',
      colorBgElevated: '#ffffff',
      colorText: '#666666',
      colorTextQuaternary: '#999999',

      itemBg: 'transparent',
      itemHoverBg: '#fff5f0',
      itemSelectedBg: '#fff0e6',
      itemSelectedColor: '#ff6000',
      itemActiveBg: '#ffe7d6',
    },

    Avatar: {
      borderRadius: 4,
      containerSize: 20,
      fontSize: 10,
      colorBgContainer: '#f5f5f5',
      colorText: '#666666',
    },

    Badge: {
      borderRadius: 2,
      fontSizeSM: 10,
      colorError: '#ff6000',
      colorTextLightSolid: '#ffffff',
    },

    Tooltip: {
      borderRadius: 4,
      colorBgSpotlight: '#333333',
      colorTextLightSolid: '#ffffff',
      fontSize: 12,
      paddingXS: 6,
      paddingSM: 8,
    },

    Typography: {
      colorText: '#333333',
      colorTextSecondary: '#666666',
      colorTextTertiary: '#999999',
      colorTextQuaternary: '#cccccc',
      fontWeightStrong: 500,
    },

    Menu: {
      borderRadius: 8,
      itemBg: 'transparent',
      itemSelectedBg: '#fff5f0',
      itemSelectedColor: '#ff6000',
      itemHoverBg: '#fafafa',
    },

    Divider: {
      colorSplit: '#f0f0f0',
    },
  },
};

// 浅色主题配置
export const lightTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    // 主色调
    colorPrimary: '#0f172a', // 深蓝灰作为主色调
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#3b82f6',

    // 背景色
    colorBgBase: '#ffffff',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f8fafc',

    // 文字颜色
    colorTextBase: '#0f172a',
    colorTextSecondary: '#475569',
    colorTextTertiary: '#64748b',
    colorTextQuaternary: '#94a3b8',

    // 边框颜色
    colorBorder: '#e2e8f0',
    colorBorderSecondary: '#f1f5f9',

    // 圆角
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,

    // 阴影
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    boxShadowSecondary: '0 4px 6px rgba(0, 0, 0, 0.05)',

    // 字体
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 36,
      fontWeight: 500,
    },

    Dropdown: {
      borderRadius: 12,
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      colorBgElevated: '#ffffff',
      colorText: '#0f172a',
      colorTextQuaternary: '#64748b',

      itemBg: 'transparent',
      itemHoverBg: '#f8fafc',
      itemSelectedBg: '#f1f5f9',
      itemSelectedColor: '#0f172a',
      itemDangerBg: 'rgba(239, 68, 68, 0.05)',
      itemDangerColor: '#ef4444',
      itemDangerSelectedColor: '#dc2626',
    },

    Avatar: {
      borderRadius: 8,
      containerSize: 32,
      fontSize: 14,
      colorBgContainer: '#f1f5f9',
      colorText: '#0f172a',
    },

    Badge: {
      borderRadius: 6,
      fontSizeSM: 10,
      colorError: '#ef4444',
      colorTextLightSolid: '#ffffff',
    },

    Tooltip: {
      borderRadius: 8,
      colorBgSpotlight: '#1e293b',
      colorTextLightSolid: '#ffffff',
      fontSize: 12,
      paddingXS: 8,
      paddingSM: 12,
    },
  },
};

// 主题切换工具函数
export const getTheme = (themeMode: 'bright' | 'light'): ThemeConfig => {
  return themeMode === 'bright' ? brightTheme : lightTheme;
};

// CSS变量定义（用于动态主题切换）
export const cssVariables = {
  dark: {
    '--topnav-bg': '#0f172a',
    '--topnav-bg-blur': 'rgba(15, 23, 42, 0.85)',
    '--topnav-text': 'rgba(255, 255, 255, 0.95)',
    '--topnav-text-secondary': 'rgba(255, 255, 255, 0.7)',
    '--topnav-border': 'rgba(255, 255, 255, 0.1)',
    '--topnav-primary': '#fbbf24',
    '--topnav-primary-hover': 'rgba(251, 191, 36, 0.1)',
  },
  light: {
    '--topnav-bg': '#ffffff',
    '--topnav-bg-blur': 'rgba(255, 255, 255, 0.9)',
    '--topnav-text': '#0f172a',
    '--topnav-text-secondary': '#475569',
    '--topnav-border': 'rgba(0, 0, 0, 0.06)',
    '--topnav-primary': '#0f172a',
    '--topnav-primary-hover': 'rgba(15, 23, 42, 0.05)',
  },
} as const;
