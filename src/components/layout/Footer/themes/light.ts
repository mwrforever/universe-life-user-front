import type { FooterTheme } from './types';

/**
 * 万象生活底栏亮色主题配置
 * 基于Ant Design Token系统，提供清新明亮的体验
 */
export const lightTheme: FooterTheme = {
  token: {
    // 基础颜色
    colorBgFooter: '#ffffff',
    colorTextFooter: '#000000',
    colorTextFooterSecondary: 'rgba(0, 0, 0, 0.65)',
    colorTextFooterTertiary: 'rgba(0, 0, 0, 0.45)',
    colorBorderFooter: 'rgba(0, 0, 0, 0.1)',
    colorPrimaryFooter: '#1890ff',

    // Ant Design Token 继承和重写
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',

    // 布局尺寸
    borderRadiusFooter: 8,
    fontSizeFooter: 14,
    paddingFooterSM: 12,
    paddingFooterMD: 16,
    paddingFooterLG: 24,
    marginFooterXS: 4,
    marginFooterSM: 8,
    marginFooterMD: 16,
    marginFooterLG: 24,

    // 通用Token
    colorBgContainer: '#ffffff',
    colorText: '#000000',
    colorTextSecondary: 'rgba(0, 0, 0, 0.65)',
    colorTextTertiary: 'rgba(0, 0, 0, 0.45)',
    colorBorder: 'rgba(0, 0, 0, 0.1)',
    colorBgBase: '#ffffff',
    colorBgElevated: '#ffffff',
    colorFillContent: 'rgba(0, 0, 0, 0.02)',
    colorFillSecondary: 'rgba(0, 0, 0, 0.06)',
    colorFillTertiary: 'rgba(0, 0, 0, 0.1)',

    // 尺寸
    borderRadius: 8,
    fontSize: 14,
    fontSizeSM: 12,
    fontSizeLG: 16,
    padding: 16,
    paddingSM: 12,
    paddingMD: 16,
    paddingLG: 24,
    paddingXL: 32,
    margin: 16,
    marginSM: 8,
    marginMD: 16,
    marginLG: 24,
    marginXL: 32,

    // 阴影
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    boxShadowCard: '0 4px 12px rgba(0, 0, 0, 0.05)',
  },

  // 组件级样式
  components: {
    Footer: {
      colorBgContainer: '#ffffff',
      colorText: '#000000',
      colorTextSecondary: 'rgba(0, 0, 0, 0.65)',
      colorTextTertiary: 'rgba(0, 0, 0, 0.45)',
      colorBorder: 'rgba(0, 0, 0, 0.1)',
      borderRadius: 8,
      fontSize: 14,
      padding: '24px 0',
      margin: 0,
    },

    ServiceCard: {
      colorBgContainer: '#ffffff',
      colorBorder: 'rgba(0, 0, 0, 0.1)',
      borderRadius: 12,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      transitionDuration: '0.3s',
      '&:hover': {
        colorBgContainer: '#ffffff',
        borderColor: '#1890ff',
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
      },
    },

    PromotionBanner: {
      colorBgContainer: 'transparent',
      colorText: '#ffffff',
      borderRadius: 12,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
    },

    TopBar: {
      colorBgContainer: '#ffffff',
      colorBorder: 'rgba(0, 0, 0, 0.1)',
      height: 64,
      padding: '0 24px',
      '&.scrolled': {
        colorBgContainer: '#ffffffee',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      },
    },

    Navigation: {
      colorText: 'rgba(0, 0, 0, 0.85)',
      colorTextHover: '#1890ff',
      colorBgHover: 'rgba(24, 144, 255, 0.1)',
      borderRadius: 8,
      '& .ant-menu-item': {
        color: 'rgba(0, 0, 0, 0.85)',
        borderRadius: 8,
        margin: '0 4px',
        '&:hover': {
          color: '#1890ff',
          backgroundColor: 'rgba(24, 144, 255, 0.1)',
        },
        '&.ant-menu-item-selected': {
          color: '#1890ff',
          backgroundColor: 'rgba(24, 144, 255, 0.1)',
        },
      },
    },

    SocialSection: {
      colorBgIcon: 'rgba(0, 0, 0, 0.05)',
      colorBorderIcon: 'rgba(0, 0, 0, 0.1)',
      borderRadiusIcon: '50%',
      sizeIcon: 44,
      '& .social-link': {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        color: 'rgba(0, 0, 0, 0.65)',
        '&:hover': {
          color: '#1890ff',
          backgroundColor: 'rgba(24, 144, 255, 0.1)',
          borderColor: '#1890ff',
          transform: 'translateY(-2px)',
        },
      },
    },
  },

  // 响应式断点
  responsive: {
    xs: 480,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600,
  },

  // 动画配置
  animation: {
    durationSlow: '0.3s',
    durationBase: '0.2s',
    durationFast: '0.1s',
    easeBase: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// 高对比度亮色主题
export const lightHighContrastTheme: FooterTheme = {
  ...lightTheme,
  token: {
    ...lightTheme.token,
    colorBgFooter: '#ffffff',
    colorTextFooter: '#000000',
    colorTextFooterSecondary: '#000000',
    colorTextFooterTertiary: '#000000',
    colorBorderFooter: '#000000',
    colorPrimaryFooter: '#1890ff',
  },
  components: {
    ...lightTheme.components,
    Footer: {
      ...lightTheme.components?.Footer,
      colorBgContainer: '#ffffff',
      colorText: '#000000',
      colorTextSecondary: '#000000',
      colorTextTertiary: '#000000',
      colorBorder: '#000000',
    },
    ServiceCard: {
      ...lightTheme.components?.ServiceCard,
      colorBgContainer: '#ffffff',
      colorBorder: '#000000',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      '&:hover': {
        colorBgContainer: '#f0f0f0',
        colorBorder: '#1890ff',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
      },
    },
  },
};

export default lightTheme;