/**
 * TopNavBar组件的类型定义
 * 高端订餐平台顶部导航栏
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'guest' | 'user' | 'vendor' | 'admin';
  isOnline: boolean;
}

export interface NavItem {
  key: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
  badge?: number;
  disabled?: boolean;
  onClick?: () => void;
}

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  time: Date;
  read: boolean;
  type: 'info' | 'warning' | 'error' | 'success';
}

export interface TopNavBarProps {
  /** 当前用户信息 */
  user?: User;
  /** 导航链接配置 */
  navigationItems?: NavItem[];
  /** 通知列表 */
  notifications?: NotificationItem[];
  /** 当前主题 */
  theme?: 'light' | 'dark';
  /** 当前语言 */
  language?: 'zh-CN' | 'en-US';
  /** 是否固定在顶部 */
  fixed?: boolean;
  /** 是否显示背景模糊效果 */
  blurBackground?: boolean;
  /** 是否显示首页链接（用于非首页页面） */
  showHomeLink?: boolean;
  /** 用户菜单项 */
  userMenuItems?: {
    key: string;
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  }[];
  /** 回调函数 */
  onThemeChange?: (theme: 'light' | 'dark') => void;
  onLanguageChange?: (language: 'zh-CN' | 'en-US') => void;
  onNotificationClick?: (notification: NotificationItem) => void;
  onNavigate?: (path: string) => void;
}

export interface TopNavBarTheme {
  /** 主色调 */
  primaryColor: string;
  /** 背景色 */
  backgroundColor: string;
  /** 文字颜色 */
  textColor: string;
  /** 边框颜色 */
  borderColor: string;
  /** 悬停效果 */
  hoverColor: string;
  /** 模糊效果强度 */
  blurIntensity: number;
}
