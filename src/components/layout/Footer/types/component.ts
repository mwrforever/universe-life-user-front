import React from 'react';

// =============================================================================
// 核心配置类型
// =============================================================================

export interface FooterConfig {
  /** 顶部栏配置 */
  topBar: {
    /** 品牌Logo配置 */
    logo: {
      /** Logo图标（支持emoji、svg、图片URL） */
      icon: string;
      /** 品牌名称 */
      text: string;
      /** 链接地址 */
      href: string;
      /** 是否在新窗口打开 */
      external?: boolean;
      /** 无障碍描述 */
      alt?: string;
    };
    /** 主导航配置 */
    navigation: NavigationItem[];
    /** 用户操作按钮配置 */
    userActions: UserActionItem[];
  };
  /** 主内容区配置 */
  mainContent: {
    /** 服务网格配置 */
    services: ServiceGridItem[];
    /** 推广横幅配置（可选） */
    promotion?: PromotionBanner;
  };
  /** 底部栏配置 */
  bottomBar: {
    /** 友情链接配置 */
    links: FooterLink[];
    /** 法律合规信息配置 */
    legal: LegalLinks;
    /** 社交媒体配置 */
    social: SocialLink[];
  };
}

export interface FooterProps {
  /** 自定义配置（可选，覆盖默认配置） */
  config?: Partial<FooterConfig>;
  /** 自定义CSS类名 */
  className?: string;
  /** 加载状态 */
  loading?: boolean;
  /** 主题模式 */
  theme?: 'dark' | 'light' | 'auto';
  /** 语言设置 */
  locale?: 'zh-CN' | 'en-US';
  /** 配置更新回调 */
  onConfigUpdate?: (config: FooterConfig) => void;
  /** 服务点击事件回调 */
  onServiceClick?: (item: ServiceGridItem) => void;
  /** 导航点击事件回调 */
  onNavigationClick?: (item: NavigationItem) => void;
  /** 用户操作点击事件回调 */
  onUserActionClick?: (item: UserActionItem) => void;
  /** 社交链接点击事件回调 */
  onSocialClick?: (item: SocialLink) => void;
}

// =============================================================================
// TopBar 组件类型
// =============================================================================

export interface NavigationItem {
  /** 唯一标识 */
  id: string;
  /** 显示标题 */
  title: string;
  /** 链接地址 */
  href: string;
  /** 是否为外部链接 */
  external?: boolean;
  /** 徽章数字（可选） */
  badge?: number;
  /** 描述信息（用于无障碍） */
  description?: string;
  /** 是否为新功能 */
  isNew?: boolean;
  /** 图标（可选） */
  icon?: React.ReactNode;
  /** 自定义数据属性 */
  analytics?: {
    eventCategory: string;
    eventAction: string;
    eventLabel?: string;
  };
}

export interface UserActionItem {
  /** 唯一标识 */
  id: string;
  /** 显示标题 */
  title: string;
  /** 链接地址 */
  href: string;
  /** 按钮类型 */
  type: 'primary' | 'default' | 'text' | 'link';
  /** 图标（可选） */
  icon?: React.ReactNode;
  /** 按钮大小 */
  size?: 'small' | 'middle' | 'large';
  /** 是否禁用 */
  disabled?: boolean;
  /** 加载状态 */
  loading?: boolean;
  /** 自定义数据属性 */
  analytics?: {
    eventCategory: string;
    eventAction: string;
    eventLabel?: string;
  };
}

export interface TopBarProps {
  /** Logo配置（可选，使用全局配置） */
  logo?: FooterConfig['topBar']['logo'];
  /** 导航配置（可选，使用全局配置） */
  navigation?: NavigationItem[];
  /** 用户操作配置（可选，使用全局配置） */
  userActions?: UserActionItem[];
  /** 自定义CSS类名 */
  className?: string;
  /** 是否固定在顶部 */
  fixed?: boolean;
  /** 导航点击事件回调 */
  onNavigationClick?: (item: NavigationItem) => void;
  /** 用户操作点击事件回调 */
  onUserActionClick?: (item: UserActionItem) => void;
}

export interface LogoProps {
  /** Logo配置 */
  logo: FooterConfig['topBar']['logo'];
  /** 点击事件回调 */
  onClick?: (e: React.MouseEvent) => void;
  /** 自定义CSS类名 */
  className?: string;
  /** Logo尺寸 */
  size?: 'small' | 'medium' | 'large';
}

// =============================================================================
// MainContent 组件类型
// =============================================================================

export interface ServiceGridItem {
  /** 唯一标识 */
  id: string;
  /** 显示标题 */
  title: string;
  /** 图标（支持emoji、ReactNode、图片URL） */
  icon: React.ReactNode;
  /** 徽章数字（可选） */
  badge?: number;
  /** 主题颜色 */
  color?: string;
  /** 描述信息 */
  description?: string;
  /** 链接地址 */
  href: string;
  /** 是否为新服务 */
  isNew?: boolean;
  /** 是否为热门服务 */
  isHot?: boolean;
  /** 服务状态 */
  status?: 'active' | 'inactive' | 'coming-soon';
  /** 卡片尺寸 */
  size?: 'small' | 'medium' | 'large';
  /** 自定义数据属性 */
  analytics?: {
    eventCategory: string;
    eventAction: string;
    eventLabel?: string;
  };
}

export interface ServiceCardProps {
  /** 服务配置 */
  service: ServiceGridItem;
  /** 卡片尺寸 */
  size?: 'small' | 'medium' | 'large';
  /** 加载状态 */
  loading?: boolean;
  /** 是否显示边框 */
  bordered?: boolean;
  /** 是否显示阴影 */
  shadow?: boolean;
  /** 点击事件回调 */
  onClick?: (item: ServiceGridItem) => void;
  /** 自定义CSS类名 */
  className?: string;
  /** 悬停效果 */
  hoverable?: boolean;
}

export interface PromotionBanner {
  /** 唯一标识 */
  id: string;
  /** 标题 */
  title: string;
  /** 描述信息 */
  description: string;
  /** 背景图片URL（可选） */
  image?: string;
  /** 链接地址（可选） */
  link?: string;
  /** 背景颜色 */
  backgroundColor?: string;
  /** 文字颜色 */
  textColor?: string;
  /** 按钮配置（可选） */
  button?: {
    text: string;
    href: string;
    type?: 'primary' | 'default';
  };
  /** 是否显示关闭按钮 */
  closable?: boolean;
  /** 关闭事件回调 */
  onClose?: () => void;
  /** 点击事件回调 */
  onClick?: () => void;
  /** 自定义数据属性 */
  analytics?: {
    eventCategory: string;
    eventAction: string;
    eventLabel?: string;
  };
}

export interface MainContentProps {
  /** 服务网格配置（可选，使用全局配置） */
  services?: ServiceGridItem[];
  /** 推广横幅配置（可选，使用全局配置） */
  promotion?: PromotionBanner;
  /** 加载状态 */
  loading?: boolean;
  /** 自定义CSS类名 */
  className?: string;
  /** 网格列数配置 */
  gridCols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    xxl?: number;
  };
  /** 服务点击事件回调 */
  onServiceClick?: (item: ServiceGridItem) => void;
  /** 推广横幅点击事件回调 */
  onPromotionClick?: (promotion: PromotionBanner) => void;
}

// =============================================================================
// BottomBar 组件类型
// =============================================================================

export interface FooterLink {
  /** 唯一标识 */
  id: string;
  /** 显示标题 */
  title: string;
  /** 链接地址 */
  href: string;
  /** 是否为外部链接 */
  external?: boolean;
  /** 描述信息（用于无障碍） */
  description?: string;
  /** 是否在新窗口打开 */
  target?: '_self' | '_blank';
  /** 链接关系 */
  rel?: string;
  /** 自定义数据属性 */
  analytics?: {
    eventCategory: string;
    eventAction: string;
    eventLabel?: string;
  };
}

export interface LegalLinks {
  /** ICP备案号 */
  icp?: string;
  /** 公安网备案号 */
  police?: string;
  /** 版权信息 */
  copyright?: string;
  /** 营业执照链接 */
  license?: string;
  /** 隐私政策链接 */
  privacy?: string;
  /** 服务条款链接 */
  terms?: string;
}

export interface SocialLink {
  /** 唯一标识 */
  id: string;
  /** 显示标题 */
  title: string;
  /** 二维码图片URL（微信等需要） */
  qrCode?: string;
  /** 链接地址（GitHub等外链） */
  href?: string;
  /** 图标标识 */
  icon?: string;
  /** 是否为外部链接 */
  external?: boolean;
  /** 描述信息（用于无障碍） */
  description?: string;
  /** 弹窗配置（微信扫码等） */
  modal?: {
    title: string;
    description?: string;
    width?: number;
  };
  /** 自定义数据属性 */
  analytics?: {
    eventCategory: string;
    eventAction: string;
    eventLabel?: string;
  };
}

export interface BottomBarProps {
  /** 友情链接配置（可选，使用全局配置） */
  links?: FooterLink[];
  /** 法律合规信息配置（可选，使用全局配置） */
  legal?: LegalLinks;
  /** 社交媒体配置（可选，使用全局配置） */
  social?: SocialLink[];
  /** 自定义CSS类名 */
  className?: string;
  /** 链接点击事件回调 */
  onLinkClick?: (item: FooterLink) => void;
  /** 社交链接点击事件回调 */
  onSocialClick?: (item: SocialLink) => void;
}

// =============================================================================
// 工具类型
// =============================================================================

export interface FooterTheme {
  token: {
    colorBgContainer: string;
    colorText: string;
    colorTextSecondary: string;
    colorTextTertiary: string;
    colorBorder: string;
    colorPrimary: string;
    borderRadius: number;
    fontSize: number;
    paddingSM: number;
    paddingMD: number;
    paddingLG: number;
    marginXS: number;
    marginSM: number;
    marginMD: number;
    marginLG: number;
  };
  components?: {
    Footer?: Record<string, any>;
    ServiceCard?: Record<string, any>;
    PromotionBanner?: Record<string, any>;
  };
}

export interface FooterLocale {
  topBar: {
    navigation: Record<string, string>;
    userActions: Record<string, string>;
  };
  mainContent: {
    services: Record<string, string>;
    promotion: {
      title: string;
      description: string;
      button: string;
    };
  };
  bottomBar: {
    links: Record<string, string>;
    legal: {
      copyright: string;
      icp: string;
      police: string;
    };
    social: Record<string, string>;
  };
  common: {
    loading: string;
    error: string;
    retry: string;
    close: string;
    more: string;
  };
}

export interface FooterAnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
}

export interface FooterAccessibilityProps {
  /** 无障碍标签 */
  'aria-label'?: string;
  /** 无障碍描述 */
  'aria-describedby'?: string;
  /** 键盘导航支持 */
  tabIndex?: number;
  /** 角色定义 */
  role?: string;
  /** 是否隐藏 */
  'aria-hidden'?: boolean;
  /** 当前状态 */
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
}