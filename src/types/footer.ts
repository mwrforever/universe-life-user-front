// 万象生活底栏系统类型定义

export interface FooterConfig {
  topBar: {
    logo: {
      icon: string;
      text: string;
      href: string;
    };
    navigation: NavigationItem[];
    userActions: UserActionItem[];
  };
  mainContent: {
    services: ServiceGridItem[];
    promotion?: PromotionBanner;
  };
  bottomBar: {
    links: FooterLink[];
    legal: LegalLinks;
    social: SocialLink[];
  };
}

export interface NavigationItem {
  id: string;
  title: string;
  href: string;
  external?: boolean;
  badge?: number;
  description?: string;
}

export interface UserActionItem {
  id: string;
  title: string;
  href: string;
  type: 'primary' | 'default';
  icon?: React.ReactNode;
}

export interface ServiceGridItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  badge?: number;
  href: string;
  color?: string;
  description?: string;
  isNew?: boolean;
}

export interface FooterLink {
  id: string;
  title: string;
  href: string;
  external?: boolean;
}

export interface LegalLinks {
  icp?: string;
  police?: string;
  copyright?: string;
}

export interface SocialLink {
  id: string;
  title: string;
  qrCode?: string;
  href?: string;
  icon?: string;
}

export interface PromotionBanner {
  id: string;
  title: string;
  description: string;
  image?: string;
  link?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface FooterProps {
  config?: Partial<FooterConfig>;
  className?: string;
  loading?: boolean;
  onConfigUpdate?: (config: FooterConfig) => void;
}

export interface TopBarProps {
  logo?: FooterConfig['topBar']['logo'];
  navigation?: NavigationItem[];
  userActions?: UserActionItem[];
  className?: string;
  onNavigationClick?: (item: NavigationItem) => void;
  onUserActionClick?: (item: UserActionItem) => void;
}

export interface MainContentProps {
  services?: ServiceGridItem[];
  promotion?: PromotionBanner;
  loading?: boolean;
  className?: string;
  onServiceClick?: (item: ServiceGridItem) => void;
  onPromotionClick?: (promotion: PromotionBanner) => void;
}

export interface BottomBarProps {
  links?: FooterLink[];
  legal?: LegalLinks;
  social?: SocialLink[];
  className?: string;
  onLinkClick?: (item: FooterLink) => void;
  onSocialClick?: (item: SocialLink) => void;
}

export interface ServiceCardProps {
  service: ServiceGridItem;
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  onClick?: (item: ServiceGridItem) => void;
}