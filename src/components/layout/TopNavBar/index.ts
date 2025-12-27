/**
 * TopNavBar 组件模块导出
 * 淘宝/天猫风格顶部导航栏
 */

// 主要组件
export { default as TopNavBar } from './TopNavBar';

// 类型定义
export type { User, NotificationItem, TopNavBarProps, TopNavBarTheme } from './types';

// 主题配置
export { brightTheme, lightTheme, getTheme, cssVariables } from './theme';

// 组件常量
export const COMPONENT_NAME = 'TopNavBar';
export const VERSION = '2.0.0';
export const LAST_UPDATE = '2025-12-02';
