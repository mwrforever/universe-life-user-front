/**
 * Footer 样式配置
 * 淘宝风格设计系统
 */

export const footerColors = {
  primary: '#ff6000',
  primaryHover: '#ff7a1f',
  textPrimary: '#333333',
  textSecondary: '#888888',
  textTertiary: '#999999',
  backgroundLight: '#f5f5f5',
  backgroundWhite: '#ffffff',
  backgroundGray: '#fafafa',
  border: '#e8e8e8',
  borderLight: '#f0f0f0',
};

export const footerBreakpoints = {
  xs: '480px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1600px',
};

export const footerAnimations = {
  smooth: 'all 0.3s ease',
  bouncy: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  fast: 'all 0.2s ease',
};

export const footerTypography = {
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '0.5px',
  },
  serviceTitle: {
    fontSize: '18px',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  serviceDesc: {
    fontSize: '14px',
    lineHeight: 1.4,
  },
  linkText: {
    fontSize: '14px',
    lineHeight: 2.2,
  },
  copyrightText: {
    fontSize: '13px',
    lineHeight: 1.6,
  },
};

export const footerSpacing = {
  sectionPadding: {
    large: '50px 0',
    medium: '40px 0',
    small: '25px 0',
  },
  itemSpacing: {
    large: '48px',
    medium: '32px',
    small: '24px',
  },
  contentMaxWidth: '1200px',
  containerPadding: '0 24px',
};

export const footerShadows = {
  serviceCard: '0 4px 12px rgba(0, 0, 0, 0.08)',
  serviceCardHover: '0 8px 24px rgba(255, 96, 0, 0.15)',
  subtle: '0 2px 8px rgba(0, 0, 0, 0.06)',
};

export const footerTransitions = {
  iconHover: {
    transform: 'scale(1.05)',
    color: footerColors.primary,
  },
  cardHover: {
    transform: 'translateY(-2px)',
    boxShadow: footerShadows.serviceCardHover,
  },
  linkHover: {
    color: footerColors.primary,
    textDecoration: 'none',
  },
};