// 万象生活底栏主题系统类型定义

import type { GlobalToken } from 'antd/es/theme/interface';

export interface FooterThemeToken extends GlobalToken {
  // 底栏专用Token
  colorBgFooter: string;
  colorTextFooter: string;
  colorTextFooterSecondary: string;
  colorTextFooterTertiary: string;
  colorBorderFooter: string;
  colorPrimaryFooter: string;
  borderRadiusFooter: number;
  fontSizeFooter: number;
  paddingFooterSM: number;
  paddingFooterMD: number;
  paddingFooterLG: number;
  marginFooterXS: number;
  marginFooterSM: number;
  marginFooterMD: number;
  marginFooterLG: number;
}

export interface FooterTheme {
  token: FooterThemeToken;
  components?: {
    Footer?: {
      // Footer组件样式
      colorBgContainer?: string;
      colorText?: string;
      colorTextSecondary?: string;
      colorTextTertiary?: string;
      colorBorder?: string;
      borderRadius?: number;
      fontSize?: number;
      padding?: string | number;
      margin?: string | number;
    };
    ServiceCard?: {
      // 服务卡片样式
      colorBgContainer?: string;
      colorBorder?: string;
      borderRadius?: number;
      boxShadow?: string;
      transitionDuration?: string;
    };
    PromotionBanner?: {
      // 推广横幅样式
      colorBgContainer?: string;
      colorText?: string;
      borderRadius?: number;
      boxShadow?: string;
    };
    TopBar?: {
      // 顶部栏样式
      colorBgContainer?: string;
      colorBorder?: string;
      height?: number | string;
      padding?: string | number;
    };
    Navigation?: {
      // 导航样式
      colorText?: string;
      colorTextHover?: string;
      colorBgHover?: string;
      borderRadius?: number;
    };
    SocialSection?: {
      // 社交区域样式
      colorBgIcon?: string;
      colorBorderIcon?: string;
      borderRadiusIcon?: number;
      sizeIcon?: number;
    };
  };
  // 响应式断点配置
  responsive?: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  // 动画配置
  animation?: {
    durationSlow: string;
    durationBase: string;
    durationFast: string;
    easeBase: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
}

export interface ThemePreset {
  name: string;
  displayName: string;
  description: string;
  theme: FooterTheme;
  preview?: {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
  };
}

export interface ThemeCustomizerOptions {
  // 是否启用实时预览
  enableLivePreview?: boolean;
  // 是否保存到本地存储
  enablePersistence?: boolean;
  // 本地存储键名
  storageKey?: string;
  // 是否启用系统主题检测
  enableSystemThemeDetection?: boolean;
  // 默认主题
  defaultTheme?: 'light' | 'dark' | 'auto';
}

export interface ThemeContextType {
  // 当前主题
  currentTheme: FooterTheme;
  // 主题模式
  themeMode: 'light' | 'dark' | 'auto';
  // 是否为高对比度模式
  isHighContrast: boolean;
  // 是否为紧凑模式
  isCompact: boolean;
  // 切换主题
  setThemeMode: (mode: 'light' | 'dark' | 'auto') => void;
  // 切换高对比度
  setHighContrast: (enabled: boolean) => void;
  // 切换紧凑模式
  setCompact: (enabled: boolean) => void;
  // 应用自定义主题
  applyCustomTheme: (theme: Partial<FooterTheme>) => void;
  // 重置为默认主题
  resetTheme: () => void;
  // 获取主题变量
  getThemeVariable: (key: keyof FooterThemeToken) => string;
  // 获取计算后的主题
  getComputedTheme: () => FooterTheme;
}

// CSS变量名映射
export interface ThemeCSSVariables {
  [key: string]: string;
}

// 主题验证规则
export interface ThemeValidationRule {
  // 验证函数
  validate: (value: any) => boolean;
  // 错误消息
  message: string;
  // 是否必需
  required?: boolean;
}

// 主题验证配置
export interface ThemeValidationSchema {
  [key: string]: ThemeValidationRule;
}