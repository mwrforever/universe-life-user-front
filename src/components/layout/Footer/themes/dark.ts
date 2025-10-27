import type { FooterTheme } from './types';

/**
 * 万象生活底栏暗色主题配置
 * 基于Ant Design Token系统，提供优雅的暗色体验
 */
export const darkTheme: FooterTheme = {
  token: {
    // 基础颜色
    colorBgFooter: '#001529',
    colorTextFooter: '#ffffff',
    colorTextFooterSecondary: 'rgba(255, 255, 255, 0.65)',
    colorTextFooterTertiary: 'rgba(255, 255, 255, 0.45)',
    colorBorderFooter: 'rgba(255, 255, 255, 0.1)',
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
    colorBgContainer: '#001529',
    colorText: '#ffffff',
    colorTextSecondary: 'rgba(255, 255, 255, 0.65)',
    colorTextTertiary: 'rgba(255, 255, 255, 0.45)',
    colorBorder: 'rgba(255, 255, 255, 0.1)',
    colorBgBase: '#141414',
    colorBgElevated: '#262626',
    colorFillContent: 'rgba(255, 255, 255, 0.04)',
    colorFillSecondary: 'rgba(255, 255, 255, 0.08)',
    colorFillTertiary: 'rgba(255, 255, 255, 0.12)',

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
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    boxShadowCard: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },

  // 组件级样式
  components: {
    Footer: {
      colorBgContainer: '#001529',
      colorText: '#ffffff',
      colorTextSecondary: 'rgba(255, 255, 255, 0.65)',
      colorTextTertiary: 'rgba(255, 255, 255, 0.45)',
      colorBorder: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 8,
      fontSize: 14,
      padding: '24px 0',
      margin: 0,
    },

    ServiceCard: {
      colorBgContainer: 'rgba(255, 255, 255, 0.04)',
      colorBorder: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 12,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      transitionDuration: '0.3s',
      '&:hover': {
        colorBgContainer: 'rgba(255, 255, 255, 0.08)',
        borderColor: '#1890ff',
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
      },
    },

    PromotionBanner: {
      colorBgContainer: 'transparent',
      colorText: '#ffffff',
      borderRadius: 12,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
      },
    },

    TopBar: {
      colorBgContainer: '#001529',
      colorBorder: 'rgba(255, 255, 255, 0.1)',
      height: 64,
      padding: '0 24px',
      '&.scrolled': {
        colorBgContainer: '#001529dd',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    },

    Navigation: {
      colorText: 'rgba(255, 255, 255, 0.85)',
      colorTextHover: '#1890ff',
      colorBgHover: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 8,
      '& .ant-menu-item': {
        color: 'rgba(255, 255, 255, 0.85)',
        borderRadius: 8,
        margin: '0 4px',
        '&:hover': {
          color: '#1890ff',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
        '&.ant-menu-item-selected': {
          color: '#1890ff',
          backgroundColor: 'rgba(24, 144, 255, 0.1)',
        },
      },
    },

    SocialSection: {
      colorBgIcon: 'rgba(255, 255, 255, 0.1)',
      colorBorderIcon: 'rgba(255, 255, 255, 0.2)',
      borderRadiusIcon: '50%',
      sizeIcon: 44,
      '& .social-link': {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: 'rgba(255, 255, 255, 0.65)',
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

// 高对比度暗色主题
export const darkHighContrastTheme: FooterTheme = {
  ...darkTheme,
  token: {
    ...darkTheme.token,
    colorBgFooter: '#000000',
    colorTextFooter: '#ffffff',
    colorTextFooterSecondary: '#ffffff',
    colorTextFooterTertiary: '#cccccc',
    colorBorderFooter: '#ffffff',
    colorPrimaryFooter: '#4096ff',
  },
  components: {
    ...darkTheme.components,
    Footer: {
      ...darkTheme.components?.Footer,
      colorBgContainer: '#000000',
      colorText: '#ffffff',
      colorTextSecondary: '#ffffff',
      colorTextTertiary: '#cccccc',
      colorBorder: '#ffffff',
    },
    ServiceCard: {
      ...darkTheme.components?.ServiceCard,
      colorBgContainer: 'transparent',
      colorBorder: '#ffffff',
      '&:hover': {
        colorBgContainer: '#ffffff',
        colorText: '#000000',
        colorBorder: '#4096ff',
      },
    },
  },
};

export default darkTheme;