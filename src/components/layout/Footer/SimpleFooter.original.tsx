import React, { useState, useCallback } from 'react';
import { Layout, Row, Col, Space, Typography, Divider } from 'antd';
import styled from '@emotion/styled';
import {
  GithubOutlined,
  WechatOutlined,
  WeiboOutlined,
  QqOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import {
  FOOTER_LAYOUT,
  FOOTER_SOCIAL,
  createMediaQuery
} from './styles';
import { useFooterInteraction } from './hooks/useFooterInteraction';
import { WeChatQRModal } from './components/WeChatQRModal';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

// 样式化Footer容器 - 使用CSS Variables和白色背景
const SimpleFooterContainer = styled(AntFooter)`
  /* 使用CSS Variables */
  background: var(--footer-bg, #ffffff);
  color: var(--footer-text-primary, rgba(0, 0, 0, 0.85));
  padding: var(--footer-space-xl, 32px) var(--footer-space-lg, 24px);
  border-top: 1px solid var(--footer-border, #e6e6e6);

  /* 内容容器 */
  .footer-content {
    max-width: ${FOOTER_LAYOUT.maxWidth}px;
    margin: 0 auto;
  }

  /* 响应式设计 */
  ${createMediaQuery('md')} {
    padding: var(--footer-space-lg, 24px) var(--footer-space-md, 16px);
  }
`;

// 品牌声明区域
const BrandSection = styled.div`
  text-align: center;
  margin-bottom: var(--footer-space-xl, 32px);
  padding-bottom: var(--footer-space-lg, 24px);
  border-bottom: 1px solid var(--footer-border-light, #f0f0f0);

  ${createMediaQuery('md')} {
    margin-bottom: var(--footer-space-lg, 24px);
    padding-bottom: var(--footer-space-md, 16px);
  }

  /* 超小屏优化 */
  @media (max-width: 575px) {
    margin-bottom: var(--footer-space-md, 16px);
    padding-bottom: var(--footer-space-sm, 8px);
  }

  /* 横屏模式优化 */
  @media (max-width: 767px) and (orientation: landscape) {
    margin-bottom: var(--footer-space-md, 16px);
    padding-bottom: var(--footer-space-sm, 8px);
  }
`;

const BrandLogo = styled.div`
  font-size: var(--footer-font-size-xxxl, 24px);
  font-weight: var(--footer-font-weight-bold, 700);
  color: var(--footer-primary, #1890ff);
  margin-bottom: var(--footer-space-sm, 8px);
  letter-spacing: 1px;

  ${createMediaQuery('md')} {
    font-size: var(--footer-font-size-xl, 20px);
    margin-bottom: var(--footer-space-xs, 4px);
  }

  /* 超小屏优化 */
  @media (max-width: 575px) {
    font-size: var(--footer-font-size-lg, 18px);
    margin-bottom: var(--footer-space-xs, 4px);
    letter-spacing: 0.5px;
  }
`;

const BrandSlogan = styled.p`
  font-size: var(--footer-font-size-base, 14px);
  color: var(--footer-text-secondary, rgba(0, 0, 0, 0.65));
  margin: 0;
  line-height: var(--footer-line-height-relaxed, 1.75);
  max-width: 600px;
  margin: 0 auto;

  ${createMediaQuery('md')} {
    font-size: var(--footer-font-size-sm, 13px);
    line-height: var(--footer-line-height-normal, 1.5);
    max-width: 500px;
    padding: 0 var(--footer-space-md, 16px);
  }

  /* 超小屏优化 */
  @media (max-width: 575px) {
    font-size: var(--footer-font-size-xs, 12px);
    line-height: var(--footer-line-height-normal, 1.5);
    max-width: 100%;
    padding: 0 var(--footer-space-sm, 8px);
  }

  /* 横屏模式优化 */
  @media (max-width: 767px) and (orientation: landscape) {
    font-size: var(--footer-font-size-xs, 12px);
    margin-bottom: var(--footer-space-xs, 4px);
  }
`;

// 导航区域
const NavigationSection = styled.div`
  margin-bottom: var(--footer-space-xl, 32px);

  ${createMediaQuery('md')} {
    margin-bottom: var(--footer-space-lg, 24px);
  }
`;

const FooterSection = styled.div`
  margin-bottom: var(--footer-space-lg, 24px);

  &:last-child {
    margin-bottom: 0;
  }

  ${createMediaQuery('md')} {
    margin-bottom: var(--footer-space-md, 16px);
    text-align: center;
  }
`;

const FooterTitle = styled.h4`
  color: var(--footer-text-primary, rgba(0, 0, 0, 0.85));
  font-size: var(--footer-font-size-lg, 16px);
  font-weight: var(--footer-font-weight-semibold, 600);
  margin-bottom: var(--footer-space-md, 16px);
  font-family: var(--footer-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto);

  ${createMediaQuery('md')} {
    margin-bottom: var(--footer-space-sm, 8px);
    font-size: var(--footer-font-size-base, 14px);
  }
`;

const FooterLink = styled.a`
  color: var(--footer-text-secondary, rgba(0, 0, 0, 0.65));
  text-decoration: none;
  transition: var(--footer-transition-color, color 0.3s cubic-bezier(0.4, 0, 0.2, 1));
  display: inline-flex;
  align-items: center;
  gap: var(--footer-space-xs, 4px);
  padding: var(--footer-space-xs, 4px) var(--footer-space-sm, 8px);
  border-radius: var(--footer-radius-base, 6px);
  font-size: var(--footer-font-size-base, 14px);
  line-height: var(--footer-line-height-normal, 1.5);

  &:hover {
    color: var(--footer-link-hover, #40a9ff);
    background: var(--footer-hover-bg, rgba(24, 144, 255, 0.04));
    transform: translateY(-1px);
  }

  &:active {
    color: var(--footer-link-active, #096dd9);
    background: var(--footer-active-bg, rgba(24, 144, 255, 0.08));
  }

  ${createMediaQuery('md')} {
    justify-content: center;
    font-size: var(--footer-font-size-sm, 12px);
    padding: var(--footer-space-xs, 2px) var(--footer-space-xs, 4px);
    min-height: var(--footer-touch-target-size, 44px);
    min-width: var(--footer-touch-target-size, 44px);
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  /* 超小屏优化 */
  @media (max-width: 575px) {
    font-size: var(--footer-font-size-xs, 10px);
    padding: var(--footer-space-xs, 4px) var(--footer-space-sm, 8px);
    min-height: var(--footer-touch-target-size, 44px);
    min-width: var(--footer-touch-target-size, 44px);
    border-radius: var(--footer-radius-sm, 4px);
  }
`;

const ExternalIcon = styled.span`
  font-size: var(--footer-font-size-xs, 10px);
  opacity: 0.6;
  transition: opacity var(--footer-transition-fast, 0.1s cubic-bezier(0.4, 0, 0.2, 1));

  ${FooterLink}:hover & {
    opacity: 1;
  }
`;

// 法律信息区域
const LegalSection = styled.div`
  border-top: 1px solid var(--footer-border-light, #f0f0f0);
  padding-top: var(--footer-space-lg, 24px);
  margin-top: var(--footer-space-lg, 24px);

  ${createMediaQuery('md')} {
    padding-top: var(--footer-space-md, 16px);
    margin-top: var(--footer-space-md, 16px);
  }
`;

const Copyright = styled.div`
  text-align: center;
  color: var(--footer-text-tertiary, rgba(0, 0, 0, 0.45));
  font-size: var(--footer-font-size-sm, 12px);
  line-height: var(--footer-line-height-relaxed, 1.75);
  margin-bottom: var(--footer-space-md, 16px);

  &:last-child {
    margin-bottom: 0;
  }

  ${createMediaQuery('md')} {
    font-size: var(--footer-font-size-xs, 10px);
    margin-bottom: var(--footer-space-sm, 8px);
  }
`;

const LegalLinks = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--footer-space-lg, 24px);
  flex-wrap: wrap;
  margin-bottom: var(--footer-space-md, 16px);

  ${createMediaQuery('md')} {
    gap: var(--footer-space-md, 16px);
    margin-bottom: var(--footer-space-sm, 8px);
  }
`;

const LegalLink = styled.a`
  color: var(--footer-text-tertiary, rgba(0, 0, 0, 0.45));
  text-decoration: none;
  font-size: var(--footer-font-size-sm, 12px);
  transition: var(--footer-transition-color, color 0.3s cubic-bezier(0.4, 0, 0.2, 1));
  padding: var(--footer-space-xs, 2px) var(--footer-space-sm, 8px);
  border-radius: var(--footer-radius-sm, 4px);

  &:hover {
    color: var(--footer-link-hover, #40a9ff);
    background: var(--footer-hover-bg, rgba(24, 144, 255, 0.04));
  }

  ${createMediaQuery('md')} {
    font-size: var(--footer-font-size-xs, 10px);
  }
`;

// 社交媒体图标
const SocialSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--footer-space-md, 16px);
  margin-top: var(--footer-space-md, 16px);

  ${createMediaQuery('md')} {
    gap: var(--footer-space-sm, 8px);
    margin-top: var(--footer-space-sm, 8px);
  }
`;

const SocialIcon = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${FOOTER_SOCIAL.size}px;
  height: ${FOOTER_SOCIAL.size}px;
  background: var(--footer-social-bg, rgba(0, 0, 0, 0.04));
  border-radius: var(--footer-radius-md, 8px);
  color: var(--footer-icon, rgba(0, 0, 0, 0.65));
  text-decoration: none;
  transition: var(--footer-transition-base, 0.3s cubic-bezier(0.4, 0, 0.2, 1));
  font-size: ${FOOTER_SOCIAL.iconSize}px;

  &:hover {
    background: var(--footer-social-bg-hover, rgba(0, 0, 0, 0.08));
    color: var(--footer-icon-hover, rgba(0, 0, 0, 0.85));
    transform: translateY(-2px);
    box-shadow: var(--footer-shadow-base, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06));
  }

  &:active {
    transform: translateY(0);
    color: var(--footer-primary, #1890ff);
  }

  ${createMediaQuery('md')} {
    width: ${FOOTER_SOCIAL.sizeSmall}px;
    height: ${FOOTER_SOCIAL.sizeSmall}px;
    font-size: 16px;
    min-width: var(--footer-touch-target-size, 44px);
    min-height: var(--footer-touch-target-size, 44px);
  }

  /* 超小屏优化 */
  @media (max-width: 575px) {
    width: var(--footer-social-size, 28px);
    height: var(--footer-social-size, 28px);
    font-size: var(--footer-social-icon-size, 14px);
    min-width: var(--footer-touch-target-size, 44px);
    min-height: var(--footer-touch-target-size, 44px);
    border-radius: var(--footer-radius-sm, 4px);
  }

  /* 触摸设备优化 */
  @media (hover: none) and (pointer: coarse) {
    &:hover {
      transform: none;
      box-shadow: none;
    }

    &:active {
      transform: scale(0.95);
      background: var(--footer-active-bg, rgba(24, 144, 255, 0.08));
    }
  }
`;

/**
 * 万象生活底栏组件 - 3栏布局设计
 * 第一栏：品牌声明 + 社交媒体
 * 第二栏：快速导航（产品服务 + 用户支持）
 * 第三栏：法律信息 + 联系方式
 */
export const SimpleFooter: React.FC = () => {
  // 状态管理
  const [wechatModalOpen, setWechatModalOpen] = useState(false);

  // 交互Hook
  const {
    hoveredElement,
    activeElement,
    isLoading,
    themeChanging,
    handleHoverStart,
    handleHoverEnd,
    handleClick,
    handleLongPressStart,
    handleLongPressEnd,
    handleKeyDown,
    handleFocus,
    handleBlur,
    isElementHovered,
    isElementActive,
  } = useFooterInteraction({
    enableAnalytics: process.env.NODE_ENV === 'production',
    longPressThreshold: 500,
    doubleClickThreshold: 300,
  });

  // 处理链接点击事件
  const handleLinkClick = useCallback((elementId: string, href: string, external = false) => {
    handleClick(elementId, href, external);
  }, [handleClick]);

  // 处理社交媒体点击
  const handleSocialClick = useCallback((platform: string) => {
    const urls: Record<string, string> = {
      github: 'https://github.com/universe-life',
      wechat: '#',
      weibo: 'https://weibo.com/universe-life',
      qq: '#',
    };

    if (platform === 'wechat') {
      // 显示微信二维码弹窗
      setWechatModalOpen(true);
      handleClick('social-wechat', '#', false);
      return;
    }

    const url = urls[platform];
    if (url && url !== '#') {
      handleClick(`social-${platform}`, url, true);
    }
  }, [handleClick]);

  // 关闭微信二维码弹窗
  const handleWechatModalClose = useCallback(() => {
    setWechatModalOpen(false);
  }, []);

  return (
    <SimpleFooterContainer>
      <div className="footer-content">
        {/* 第一栏：品牌声明 */}
        <BrandSection>
          <BrandLogo>万象生活</BrandLogo>
          <BrandSlogan>
            您的品质生活服务平台，提供全方位的生活服务解决方案。
            让生活更简单，让服务更贴心。
          </BrandSlogan>

          {/* 社交媒体图标 */}
          <SocialSection>
            <SocialIcon
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleSocialClick('github');
              }}
              title="GitHub"
              role="button"
              aria-label="访问 GitHub 主页"
            >
              <GithubOutlined />
            </SocialIcon>
            <SocialIcon
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleSocialClick('wechat');
              }}
              title="微信公众号"
              role="button"
              aria-label="关注微信公众号"
            >
              <WechatOutlined />
            </SocialIcon>
            <SocialIcon
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleSocialClick('weibo');
              }}
              title="微博"
              role="button"
              aria-label="访问官方微博"
            >
              <WeiboOutlined />
            </SocialIcon>
            <SocialIcon
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleSocialClick('qq');
              }}
              title="QQ群"
              role="button"
              aria-label="加入QQ群"
            >
              <QqOutlined />
            </SocialIcon>
          </SocialSection>
        </BrandSection>

        {/* 第二栏：快速导航 */}
        <NavigationSection>
          <Row gutter={[32, 24]}>
            {/* 产品服务 */}
            <Col xs={24} md={12}>
              <FooterSection>
                <FooterTitle>产品服务</FooterTitle>
                <Space direction="vertical" size={12}>
                  <FooterLink
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick('nav-home', '/');
                    }}
                    onMouseEnter={() => handleHoverStart('nav-home')}
                    onMouseLeave={handleHoverEnd}
                    onMouseDown={() => handleLongPressStart('nav-home')}
                    onMouseUp={handleLongPressEnd}
                    onFocus={() => handleFocus('nav-home')}
                    onBlur={handleBlur}
                    onKeyDown={(e) => handleKeyDown(e, 'nav-home', '/')}
                    role="menuitem"
                    tabIndex={0}
                    className={isElementHovered('nav-home') ? 'hovered' : ''}
                    style={{
                      opacity: isElementActive('nav-home') ? 0.7 : 1,
                      transform: isElementActive('nav-home') ? 'scale(0.98)' : 'translateY(0)',
                    }}
                  >
                    首页
                  </FooterLink>
                  <FooterLink
                    href="/services"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick('/services');
                    }}
                    role="menuitem"
                  >
                    生活服务
                  </FooterLink>
                  <FooterLink
                    href="/orders"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick('/orders');
                    }}
                    role="menuitem"
                  >
                    我的订单
                  </FooterLink>
                  <FooterLink
                    href="/profile"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick('/profile');
                    }}
                    role="menuitem"
                  >
                    个人中心
                  </FooterLink>
                </Space>
              </FooterSection>
            </Col>

            {/* 用户支持 */}
            <Col xs={24} md={12}>
              <FooterSection>
                <FooterTitle>用户支持</FooterTitle>
                <Space direction="vertical" size={12}>
                  <FooterLink
                    href="/help"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick('/help');
                    }}
                    role="menuitem"
                  >
                    帮助中心
                  </FooterLink>
                  <FooterLink
                    href="/contact"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick('/contact');
                    }}
                    role="menuitem"
                  >
                    联系我们
                  </FooterLink>
                  <FooterLink
                    href="/feedback"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick('/feedback');
                    }}
                    role="menuitem"
                  >
                    意见反馈
                  </FooterLink>
                  <FooterLink
                    href="/faq"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick('/faq');
                    }}
                    role="menuitem"
                  >
                    常见问题
                  </FooterLink>
                </Space>
              </FooterSection>
            </Col>
          </Row>
        </NavigationSection>

        {/* 第三栏：法律信息 */}
        <LegalSection>
          {/* 法律链接 */}
          <LegalLinks>
            <LegalLink
              href="/about"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('/about');
              }}
              role="menuitem"
            >
              公司介绍
            </LegalLink>
            <LegalLink
              href="/privacy"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('/privacy');
              }}
              role="menuitem"
            >
              隐私政策
            </LegalLink>
            <LegalLink
              href="/terms"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('/terms');
              }}
              role="menuitem"
            >
              服务条款
            </LegalLink>
            <LegalLink
              href="https://beian.miit.gov.cn/"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('https://beian.miit.gov.cn/', true);
              }}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
            >
              ICP备案: 京ICP备12345678号
              <ExternalIcon>↗</ExternalIcon>
            </LegalLink>
          </LegalLinks>

          {/* 联系信息 */}
          <Row gutter={[24, 16]} justify="center">
            <Col xs={24} sm={8} md={6}>
              <div style={{ textAlign: 'center' }}>
                <PhoneOutlined style={{ marginRight: '8px', color: 'var(--footer-text-tertiary)' }} />
                <Text style={{ color: 'var(--footer-text-tertiary)', fontSize: 'var(--footer-font-size-sm, 12px)' }}>
                  400-123-4567
                </Text>
              </div>
            </Col>
            <Col xs={24} sm={8} md={6}>
              <div style={{ textAlign: 'center' }}>
                <MailOutlined style={{ marginRight: '8px', color: 'var(--footer-text-tertiary)' }} />
                <Text style={{ color: 'var(--footer-text-tertiary)', fontSize: 'var(--footer-font-size-sm, 12px)' }}>
                  service@universe-life.com
                </Text>
              </div>
            </Col>
            <Col xs={24} sm={8} md={6}>
              <div style={{ textAlign: 'center' }}>
                <EnvironmentOutlined style={{ marginRight: '8px', color: 'var(--footer-text-tertiary)' }} />
                <Text style={{ color: 'var(--footer-text-tertiary)', fontSize: 'var(--footer-font-size-sm, 12px)' }}>
                  北京市朝阳区
                </Text>
              </div>
            </Col>
          </Row>

          {/* 版权信息 */}
          <Copyright>
            <Text style={{ color: 'var(--footer-text-tertiary)' }}>
              © 2024 万象生活科技有限公司. 保留所有权利. |
              京公网安备11010502012345号
            </Text>
          </Copyright>
        </LegalSection>

        {/* 加载状态指示器 */}
        {isLoading && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              backdropFilter: 'blur(4px)',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid var(--footer-border, #e6e6e6)',
                  borderTop: '3px solid var(--footer-primary, #1890ff)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 16px',
                }}
              />
              <Text style={{ color: 'var(--footer-text-secondary, rgba(0, 0, 0, 0.65))' }}>
                正在跳转...
              </Text>
            </div>
          </div>
        )}

        {/* 微信二维码弹窗 */}
        <WeChatQRModal
          open={wechatModalOpen}
          onClose={handleWechatModalClose}
          showFloatButton={false}
        />
      </div>

      {/* 添加动画样式 */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .footer-content a.hovered {
          z-index: 1;
        }

        /* 触摸设备优化 */
        @media (hover: none) and (pointer: coarse) {
          .footer-content a {
            transition: none !important;
          }
        }

        /* 减少动画 */
        @media (prefers-reduced-motion: reduce) {
          .footer-content * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </SimpleFooterContainer>
  );
};

export default SimpleFooter;