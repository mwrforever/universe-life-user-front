/**
 * 万象生活底栏样式系统入口
 * 统一导出所有样式相关工具和类型
 */

// 导入 CSS 变量
import './variables.css';

// 导入主题工具函数以供内部使用
import {
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
} from './theme';

// 重新导出主题工具
export {
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

export type { FooterTheme } from './theme';

// 导出常用样式常量
export const FOOTER_BREAKPOINTS = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
} as const;

export const FOOTER_LAYOUT = {
  maxWidth: 1200,
  contentPadding: {
    horizontal: 24,
    vertical: 48,
  },
  sectionGap: 32,
  itemGap: 16,
} as const;

export const FOOTER_SOCIAL = {
  size: 36,
  sizeSmall: 32,
  iconSize: 18,
  qrSize: 120,
  qrSizeSmall: 100,
} as const;

// 媒体查询工具
export const createMediaQuery = (breakpoint: keyof typeof FOOTER_BREAKPOINTS) =>
  `@media (max-width: ${FOOTER_BREAKPOINTS[breakpoint]}px)`;

export const createMinMediaQuery = (breakpoint: keyof typeof FOOTER_BREAKPOINTS) =>
  `@media (min-width: ${FOOTER_BREAKPOINTS[breakpoint]}px)`;

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
  FOOTER_BREAKPOINTS,
  FOOTER_LAYOUT,
  FOOTER_SOCIAL,
  createMediaQuery,
  createMinMediaQuery,
};