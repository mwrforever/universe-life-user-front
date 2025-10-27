/**
 * 万象生活底栏组件 - 简化版
 * 3栏响应式布局：品牌声明 + 快速导航 + 法律信息
 * 白色背景主题，移动端优先设计
 */

import React, { useState, useCallback } from 'react';
import { Layout, Row, Col, Space, Typography, Divider } from 'antd';
import {
  GithubOutlined,
  WechatOutlined,
  WeiboOutlined,
  QqOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { WeChatQRModal } from './components/WeChatQRModal';
import { useFooterInteraction } from './hooks/useFooterInteraction';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

// 简化版样式对象
const footerStyles = {
  container: {
    backgroundColor: '#ffffff',
    color: 'rgba(0, 0, 0, 0.85)',
    padding: '32px 24px',
    borderTop: '1px solid #e6e6e6',
    width: '100%'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  brandSection: {
    textAlign: 'center' as const,
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '1px solid #f0f0f0'
  },
  brandLogo: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#1890ff',
    marginBottom: '8px',
    letterSpacing: '1px'
  },
  brandSlogan: {
    fontSize: '14px',
    color: 'rgba(0, 0, 0, 0.65)',
    margin: '0 auto',
    lineHeight: 1.75,
    maxWidth: '600px'
  },
  socialSection: {
    marginTop: '24px',
    marginBottom: '16px'
  },
  socialIcon: {
    display: 'inline-block',
    width: '36px',
    height: '36px',
    margin: '0 8px',
    backgroundColor: '#1890ff',
    color: 'white',
    textAlign: 'center' as const,
    lineHeight: '36px',
    borderRadius: '50%',
    textDecoration: 'none',
    fontSize: '18px',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  socialIconHover: {
    backgroundColor: '#40a9ff',
    transform: 'translateY(-2px)'
  },
  navigationSection: {
    marginBottom: '32px'
  },
  footerSection: {
    marginBottom: '24px',
    textAlign: 'center' as const
  },
  footerTitle: {
    color: 'rgba(0, 0, 0, 0.85)',
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'
  },
  footerLink: {
    color: 'rgba(0, 0, 0, 0.65)',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '14px',
    lineHeight: 1.5,
    display: 'inline-block',
    marginBottom: '4px'
  },
  footerLinkHover: {
    color: '#40a9ff',
    backgroundColor: 'rgba(24, 144, 255, 0.04)'
  },
  legalSection: {
    textAlign: 'center' as const
  },
  copyright: {
    fontSize: '12px',
    color: 'rgba(0, 0, 0, 0.45)',
    marginBottom: '8px'
  },
  legalLinks: {
    marginBottom: '16px'
  },
  legalLink: {
    color: 'rgba(0, 0, 0, 0.45)',
    textDecoration: 'none',
    margin: '0 8px',
    fontSize: '12px',
    transition: 'color 0.3s ease'
  },
  legalLinkHover: {
    color: '#1890ff'
  },
  // 响应式样式
  '@media (max-width: 767px)': {
    container: {
      padding: '24px 16px'
    },
    brandSection: {
      marginBottom: '24px',
      paddingBottom: '16px'
    },
    brandLogo: {
      fontSize: '20px'
    },
    brandSlogan: {
      fontSize: '13px',
      padding: '0 16px'
    },
    socialIcon: {
      width: '32px',
      height: '32px',
      lineHeight: '32px',
      fontSize: '16px'
    },
    navigationSection: {
      marginBottom: '24px'
    },
    footerSection: {
      marginBottom: '16px'
    },
    footerTitle: {
      fontSize: '14px',
      marginBottom: '8px'
    },
    footerLink: {
      fontSize: '12px',
      padding: '2px 4px'
    }
  }
};

/**
 * 简化版底栏组件
 */
export const SimpleFooter: React.FC = () => {
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

  // 合并样式的辅助函数
  const mergeStyles = (base: any, hover: any, isHovered: boolean, isActive: boolean) => ({
    ...base,
    ...(isHovered ? hover : {}),
    ...(isActive ? { transform: 'translateY(0) scale(0.98)' } : {}),
    cursor: 'pointer'
  });

  return (
    <AntFooter style={footerStyles.container}>
      <div style={footerStyles.content}>
        {/* 第一栏：品牌声明 */}
        <div style={footerStyles.brandSection}>
          <div style={footerStyles.brandLogo}>万象生活</div>
          <p style={footerStyles.brandSlogan}>
            您的品质生活服务平台，提供全方位的生活服务解决方案。
            让生活更简单，让服务更贴心。
          </p>

          {/* 社交媒体图标 */}
          <div style={footerStyles.socialSection}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleSocialClick('github');
              }}
              style={mergeStyles(
                footerStyles.socialIcon,
                footerStyles.socialIconHover,
                isElementHovered('social-github'),
                isElementActive('social-github')
              )}
              title="GitHub"
              role="button"
              aria-label="访问 GitHub 主页"
            >
              <GithubOutlined />
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleSocialClick('wechat');
              }}
              style={mergeStyles(
                footerStyles.socialIcon,
                footerStyles.socialIconHover,
                isElementHovered('social-wechat'),
                isElementActive('social-wechat')
              )}
              title="微信公众号"
              role="button"
              aria-label="关注微信公众号"
            >
              <WechatOutlined />
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleSocialClick('weibo');
              }}
              style={mergeStyles(
                footerStyles.socialIcon,
                footerStyles.socialIconHover,
                isElementHovered('social-weibo'),
                isElementActive('social-weibo')
              )}
              title="微博"
              role="button"
              aria-label="访问官方微博"
            >
              <WeiboOutlined />
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleSocialClick('qq');
              }}
              style={mergeStyles(
                footerStyles.socialIcon,
                footerStyles.socialIconHover,
                isElementHovered('social-qq'),
                isElementActive('social-qq')
              )}
              title="QQ群"
              role="button"
              aria-label="加入QQ群"
            >
              <QqOutlined />
            </a>
          </div>
        </div>

        {/* 第二栏：快速导航 */}
        <Row gutter={[32, 24]} style={footerStyles.navigationSection}>
          <Col xs={24} sm={12} md={8}>
            <div style={footerStyles.footerSection}>
              <h4 style={footerStyles.footerTitle}>产品服务</h4>
              <Space direction="vertical" size="small">
                <Link
                  href="/"
                  onClick={() => handleLinkClick('nav-home', '/', false)}
                  style={mergeStyles(
                    footerStyles.footerLink,
                    footerStyles.footerLinkHover,
                    isElementHovered('nav-home'),
                    isElementActive('nav-home')
                  )}
                >
                  首页
                </Link>
                <Link
                  href="/services"
                  onClick={() => handleLinkClick('nav-services', '/services', false)}
                  style={mergeStyles(
                    footerStyles.footerLink,
                    footerStyles.footerLinkHover,
                    isElementHovered('nav-services'),
                    isElementActive('nav-services')
                  )}
                >
                  生活服务
                </Link>
                <Link
                  href="/orders"
                  onClick={() => handleLinkClick('nav-orders', '/orders', false)}
                  style={mergeStyles(
                    footerStyles.footerLink,
                    footerStyles.footerLinkHover,
                    isElementHovered('nav-orders'),
                    isElementActive('nav-orders')
                  )}
                >
                  我的订单
                </Link>
                <Link
                  href="/profile"
                  onClick={() => handleLinkClick('nav-profile', '/profile', false)}
                  style={mergeStyles(
                    footerStyles.footerLink,
                    footerStyles.footerLinkHover,
                    isElementHovered('nav-profile'),
                    isElementActive('nav-profile')
                  )}
                >
                  个人中心
                </Link>
              </Space>
            </div>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <div style={footerStyles.footerSection}>
              <h4 style={footerStyles.footerTitle}>帮助支持</h4>
              <Space direction="vertical" size="small">
                <Link
                  href="/help"
                  onClick={() => handleLinkClick('nav-help', '/help', false)}
                  style={mergeStyles(
                    footerStyles.footerLink,
                    footerStyles.footerLinkHover,
                    isElementHovered('nav-help'),
                    isElementActive('nav-help')
                  )}
                >
                  帮助中心
                </Link>
                <Link
                  href="/contact"
                  onClick={() => handleLinkClick('nav-contact', '/contact', false)}
                  style={mergeStyles(
                    footerStyles.footerLink,
                    footerStyles.footerLinkHover,
                    isElementHovered('nav-contact'),
                    isElementActive('nav-contact')
                  )}
                >
                  联系我们
                </Link>
                <Link
                  href="/feedback"
                  onClick={() => handleLinkClick('nav-feedback', '/feedback', false)}
                  style={mergeStyles(
                    footerStyles.footerLink,
                    footerStyles.footerLinkHover,
                    isElementHovered('nav-feedback'),
                    isElementActive('nav-feedback')
                  )}
                >
                  意见反馈
                </Link>
                <Link
                  href="/faq"
                  onClick={() => handleLinkClick('nav-faq', '/faq', false)}
                  style={mergeStyles(
                    footerStyles.footerLink,
                    footerStyles.footerLinkHover,
                    isElementHovered('nav-faq'),
                    isElementActive('nav-faq')
                  )}
                >
                  常见问题
                </Link>
              </Space>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div style={footerStyles.footerSection}>
              <h4 style={footerStyles.footerTitle}>联系方式</h4>
              <Space direction="vertical" size="small">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <PhoneOutlined style={{ color: '#1890ff' }} />
                  <Text style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.65)' }}>
                    400-123-4567
                  </Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <MailOutlined style={{ color: '#1890ff' }} />
                  <Link
                    href="mailto:service@universe-life.com"
                    style={{ fontSize: '14px' }}
                    onClick={() => handleLinkClick('contact-email', 'mailto:service@universe-life.com', true)}
                  >
                    service@universe-life.com
                  </Link>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <EnvironmentOutlined style={{ color: '#1890ff' }} />
                  <Text style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.65)' }}>
                    北京市朝阳区
                  </Text>
                </div>
              </Space>
            </div>
          </Col>
        </Row>

        {/* 第三栏：法律信息 */}
        <div style={footerStyles.legalSection}>
          <div style={footerStyles.copyright}>
            © 2024 万象生活科技有限公司. 保留所有权利.
          </div>
          <div style={footerStyles.legalLinks}>
            <Link
              href="/privacy"
              style={mergeStyles(
                footerStyles.legalLink,
                footerStyles.legalLinkHover,
                isElementHovered('legal-privacy'),
                isElementActive('legal-privacy')
              )}
              onClick={() => handleLinkClick('legal-privacy', '/privacy', false)}
            >
              隐私政策
            </Link>
            <Link
              href="/terms"
              style={mergeStyles(
                footerStyles.legalLink,
                footerStyles.legalLinkHover,
                isElementHovered('legal-terms'),
                isElementActive('legal-terms')
              )}
              onClick={() => handleLinkClick('legal-terms', '/terms', false)}
            >
              服务条款
            </Link>
            <Link
              href="/legal"
              style={mergeStyles(
                footerStyles.legalLink,
                footerStyles.legalLinkHover,
                isElementHovered('legal-info'),
                isElementActive('legal-info')
              )}
              onClick={() => handleLinkClick('legal-info', '/legal', false)}
            >
              法律声明
            </Link>
          </div>
          <div style={footerStyles.copyright}>
            京ICP备12345678号 | 京公网安备11010502012345号
          </div>
        </div>
      </div>

      {/* 微信二维码弹窗 */}
      <WeChatQRModal
        open={wechatModalOpen}
        onClose={handleWechatModalClose}
      />
    </AntFooter>
  );
};

export default SimpleFooter;