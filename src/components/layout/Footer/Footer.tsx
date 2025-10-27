import React, { Suspense, lazy } from 'react';
import { Layout, Skeleton } from 'antd';
import styled from '@emotion/styled';
import { useFooterLazy } from './hooks/useFooterLazy';
import { useFooterAnalytics } from './hooks/useFooterAnalytics';
import { useFooterA11y } from './hooks/useFooterA11y';
import { useFooterConfig } from './hooks/useFooterConfig';
import { useFooterLocale } from './locales/useFooterLocale';
import { FooterThemeProvider, useFooterTheme } from './themes/index.tsx';
import type { FooterProps } from './types';

const { Footer: AntFooter } = Layout;

// 延迟加载组件
const TopBar = lazy(() => import('./components/TopBar').then(module => ({
  default: module.TopBar
})));

const MainContent = lazy(() => import('./components/MainContent').then(module => ({
  default: module.MainContent
})));

const BottomBar = lazy(() => import('./components/BottomBar').then(module => ({
  default: module.BottomBar
})));

// 样式化Footer骨架屏
const FooterSkeleton = styled.div`
  padding: 40px 24px;
  background: ${({ theme }) => theme.token?.colorBgContainer || '#001529'};

  .skeleton-content {
    max-width: 1200px;
    margin: 0 auto;

    .skeleton-section {
      margin-bottom: 32px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  @media (max-width: 768px) {
    padding: 24px 16px;

    .skeleton-section {
      margin-bottom: 24px;
    }
  }
`;

// 样式化Footer容器
interface FooterContainerProps {
  theme: any;
  className?: string;
  role?: string;
  'aria-label'?: string;
}

const FooterContainer = styled(AntFooter)<FooterContainerProps>`
  background: ${({ theme }) => theme.token?.colorBgFooter || theme.token?.colorBgContainer || '#001529'};
  color: ${({ theme }) => theme.token?.colorTextFooter || theme.token?.colorText || '#ffffff'};
  border-top: 1px solid ${({ theme }) => theme.token?.colorBorderFooter || theme.token?.colorBorder || 'rgba(255, 255, 255, 0.1)'};
  padding: 0;
  width: 100%;
  position: relative;
  overflow: hidden;

  // 性能优化：will-change属性
  will-change: transform;

  // 滚动优化
  @media (prefers-reduced-motion: no-preference) {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  // 打印样式
  @media print {
    background: white !important;
    color: black !important;
    border-top: 1px solid #000 !important;
  }

  // 高对比度模式支持
  @media (prefers-contrast: high) {
    border-top: 2px solid;
  }

  // 焦点管理
  &:focus-within {
    outline: 2px solid ${({ theme }) => theme.token?.colorPrimaryFooter || theme.token?.colorPrimary || '#1890ff'};
    outline-offset: -2px;
  }

  .footer-wrapper {
    width: 100%;
    max-width: none;
    margin: 0;
    padding: 0;
  }

  .footer-content {
    width: 100%;
    display: flex;
    flex-direction: column;

    // 性能优化：内容可见性
    contain: layout style paint;
  }

  // 加载状态样式
  &.loading {
    pointer-events: none;
    user-select: none;

    .footer-content {
      opacity: 0.6;
    }
  }

  // 错误状态样式
  &.error {
    background: ${({ theme }) => theme.token?.colorError || '#ff4d4f'}20;
    border-color: ${({ theme }) => theme.token?.colorError || '#ff4d4f'};

    .footer-content {
      opacity: 0.8;
    }
  }
`;

// 错误边界组件
interface FooterErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class FooterErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (error: Error) => void },
  FooterErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): FooterErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Footer Error Boundary caught an error:', error, errorInfo);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '20px',
            textAlign: 'center',
            background: '#fff2f0',
            border: '1px solid #ffccc7',
            borderRadius: '8px',
            margin: '20px',
          }}
          role="alert"
          aria-live="polite"
        >
          <h3 style={{ color: '#cf1322', margin: '0 0 8px 0' }}>
            底栏加载失败
          </h3>
          <p style={{ color: '#8c8c8c', margin: 0 }}>
            请刷新页面重试，或联系技术支持
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * 万象生活企业级底栏主组件
 * 整合所有子组件，提供统一的底栏解决方案
 */
export const Footer: React.FC<FooterProps> = ({
  config,
  className,
  loading = false,
  theme = 'auto',
  locale: propLocale,
  onConfigUpdate,
  onServiceClick,
  onNavigationClick,
  onUserActionClick,
  onSocialClick,
}) => {
  // Hook系统集成
  const analytics = useFooterAnalytics({
    enabled: process.env.NODE_ENV === 'production',
    debug: process.env.NODE_ENV === 'development',
  });

  const a11y = useFooterA11y({
    enabled: true,
    enableKeyboardNavigation: true,
    enableScreenReaderSupport: true,
    enableHighContrastDetection: true,
  });

  const footerConfig = useFooterConfig({
    enableCache: true,
    enableValidation: true,
    onUpdate: onConfigUpdate,
  });

  const { t: translate, locale: hookLocale } = useFooterLocale();
  const { currentTheme, setThemeMode } = useFooterTheme();

  // 延迟加载配置
  const {
    isVisible,
    isLoading: isLazyLoading,
    isLoaded,
    error,
    retry,
    ref: lazyRef,
  } = useFooterLazy(
    async () => {
      // 模拟异步加载时间
      await new Promise(resolve => setTimeout(resolve, 100));

      // 性能埋点
      analytics.trackComponentLoad('Footer', 100);

      // 页面访问埋点
      analytics.trackPageView('/footer', '万象生活底栏');
    },
    {
      enabled: true,
      rootMargin: '100px 0px',
      delay: 0,
      minWaitTime: 200,
    }
  );

  // 合并配置
  const finalConfig = React.useMemo(() => {
    if (!config) return footerConfig.config;
    return footerConfig.mergeConfig(config);
  }, [config, footerConfig]);

  // 处理各种事件回调（简化版，避免过度优化）
  const handleServiceClick = (item: any) => {
    analytics.trackInteraction('service_click', item.id);
    a11y.announceToScreenReader(`已选择${item.title}服务`);
    onServiceClick?.(item);
  };

  const handleNavigationClick = (item: any) => {
    analytics.trackInteraction('navigation_click', item.id);
    a11y.announceToScreenReader(`已导航到${item.title}`);
    onNavigationClick?.(item);
  };

  const handleUserActionClick = (item: any) => {
    analytics.trackInteraction('user_action_click', item.id);
    a11y.announceToScreenReader(`已点击${item.title}`);
    onUserActionClick?.(item);
  };

  const handleSocialClick = (item: any) => {
    analytics.trackInteraction('social_click', item.id);
    a11y.announceToScreenReader(`已打开${item.title}`);
    onSocialClick?.(item);
  };

  const handleError = (error: Error) => {
    analytics.trackError(error, 'Footer Component');
    a11y.announceToScreenReader('底栏加载出现错误', 'assertive');
  };

  // 主题处理
  React.useEffect(() => {
    if (theme !== 'auto') {
      setThemeMode(theme);
    }
  }, [theme, setThemeMode]);

  // 性能监控
  React.useEffect(() => {
    if (isLoaded) {
      const loadTime = performance.now();
      analytics.trackPerformance('footer_render_time', loadTime);
    }
  }, [isLoaded, analytics]);

  // 如果不可见，返回null（延迟加载）
  if (!isVisible) {
    return <div ref={lazyRef} aria-hidden="true" />;
  }

  // 错误状态
  if (error) {
    return (
      <FooterErrorBoundary onError={handleError}>
        <div ref={lazyRef} className={className}>
          {/* 错误UI已在上面的错误边界中处理 */}
        </div>
      </FooterErrorBoundary>
    );
  }

  return (
    <FooterThemeProvider>
      <FooterErrorBoundary onError={handleError}>
        <div ref={lazyRef}>
          <FooterContainer
            theme={currentTheme}
            className={`universe-footer ${loading || isLazyLoading ? 'loading' : ''} ${className || ''}`}
            role="contentinfo"
            aria-label="网站底部信息"
            {...a11y.addA11yAttributes({}, {
              'data-theme': theme,
              'data-locale': hookLocale,
            })}
          >
            <div className="footer-wrapper">
              <div className="footer-content">
                <Suspense
                  fallback={
                    <FooterSkeleton>
                      <div className="skeleton-content">
                        <div className="skeleton-section">
                          <Skeleton active paragraph={{ rows: 1, width: '100%' }} />
                        </div>
                        <div className="skeleton-section">
                          <Skeleton active paragraph={{ rows: 2, width: ['100%', '80%'] }} />
                        </div>
                        <div className="skeleton-section">
                          <Skeleton active paragraph={{ rows: 1, width: '60%' }} />
                        </div>
                      </div>
                    </FooterSkeleton>
                  }
                >
                  <TopBar
                    navigation={finalConfig.topBar.navigation}
                    userActions={finalConfig.topBar.userActions}
                    onNavigationClick={handleNavigationClick}
                    onUserActionClick={handleUserActionClick}
                  />

                  <MainContent
                    services={finalConfig.mainContent.services}
                    promotion={finalConfig.mainContent.promotion}
                    loading={loading || isLazyLoading}
                    onServiceClick={handleServiceClick}
                    onPromotionClick={(promotion) => {
                      analytics.trackInteraction('promotion_click', promotion.id);
                      a11y.announceToScreenReader(`已查看推广活动`);
                    }}
                  />

                  <BottomBar
                    links={finalConfig.bottomBar.links}
                    legal={finalConfig.bottomBar.legal}
                    social={finalConfig.bottomBar.social}
                    onLinkClick={(link) => {
                      analytics.trackInteraction('link_click', link.id);
                      a11y.announceToScreenReader(`已打开${link.title}链接`);
                    }}
                    onSocialClick={handleSocialClick}
                  />
                </Suspense>
              </div>
            </div>
          </FooterContainer>
        </div>
      </FooterErrorBoundary>
    </FooterThemeProvider>
  );
};

// 延迟加载版本的Footer组件
export const LazyFooter: React.FC<FooterProps> = (props) => {
  return (
    <FooterThemeProvider>
      <Footer {...props} />
    </FooterThemeProvider>
  );
};

export default Footer;