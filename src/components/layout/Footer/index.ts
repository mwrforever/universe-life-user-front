// 万象生活企业级底栏组件库统一导出入口
// 使用方法：import { LazyFooter } from '@/components/layout/Footer';

// 主组件（延迟加载）
export { LazyFooter } from './Footer';
export { Footer } from './Footer';

// 原子化组件
export { TopBar } from './components/TopBar';
export { Logo } from './components/TopBar/Logo';
export { Navigation } from './components/TopBar/Navigation';
export { UserActions } from './components/TopBar/UserActions';

export { MainContent } from './components/MainContent';
export { ServiceGrid } from './components/MainContent/ServiceGrid';
export { ServiceCard } from './components/MainContent/ServiceGrid/ServiceCard';
export { PromotionBanner } from './components/MainContent/PromotionBanner';

export { BottomBar } from './components/BottomBar';
export { LinkSection } from './components/BottomBar/LinkSection';
export { LegalSection } from './components/BottomBar/LegalSection';
export { SocialSection } from './components/BottomBar/SocialSection';

// Hook系统
export { useFooterConfig } from './hooks/useFooterConfig';
export { useFooterLazy } from './hooks/useFooterLazy';
export { useFooterAnalytics } from './hooks/useFooterAnalytics';
export { useFooterA11y } from './hooks/useFooterA11y';

// 主题系统
export { darkTheme } from './themes/dark';
export { lightTheme } from './themes/light';
export type { FooterTheme } from './themes/types';

// 多语言系统
export { useFooterLocale } from './locales/useFooterLocale';
export type { FooterLocaleKeys } from './locales/types';

// 工具函数
export { footerAnalytics } from './utils/analytics';
export { footerAccessibility } from './utils/accessibility';
export { footerPerformance } from './utils/performance';

// 类型定义
export type {
  FooterConfig,
  FooterProps,
  NavigationItem,
  UserActionItem,
  ServiceGridItem,
  FooterLink,
  LegalLinks,
  SocialLink,
  PromotionBanner,
  TopBarProps,
  MainContentProps,
  BottomBarProps,
  ServiceCardProps
} from './types';

// 默认配置
export { footerConfig, useDefaultFooterConfig } from './config/footerConfig';

// 常量配置
export { FOOTER_CONSTANTS } from './constants';