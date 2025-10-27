import React from 'react';
import { Row, Col, Space, Typography } from 'antd';
import styled from '@emotion/styled';
import { useFooterConfig } from '../hooks/useFooterConfig';
import type { BottomBarProps, FooterLink, LegalLinks, SocialLink } from '@/types/footer';
import { GithubOutlined, WechatOutlined } from '@ant-design/icons';

const { Text } = Typography;

// 样式化组件
const BottomBarContainer = styled.footer`
  background: #001529;
  border-top: 1px solid #434343;
  padding: 32px 24px 40px;
  color: #FFFFFF;

  @media (max-width: 768px) {
    padding: 24px 16px 32px;
  }
`;

const BottomBarContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const BottomBarSection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 16px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const SectionTitle = styled.h4`
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;

  @media (max-width: 768px) {
    font-size: 13px;
    margin-bottom: 8px;
  }
`;

const LinkList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const LinkItem = styled.a`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 13px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &:hover {
    color: #FFFFFF;
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 3px 6px;
    gap: 4px;
  }
`;

const ExternalIcon = styled.span`
  font-size: 12px;
  margin-left: 4px;

  @media (max-width: 768px) {
    font-size: 10px;
  margin-left: 2px;
  }
`;

const SocialIcon = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #FFFFFF;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }
`;

const QRCodeContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;

  @media (max-width: 768px) {
    font-size: 11px;
    gap: 6px;
  }
`;

const Copyright = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  border-top: 1px solid #434343;
  padding-top: 24px;

  @media (max-width: 768px) {
    font-size: 11px;
    padding-top: 16px;
  }
`;

const WechatQRImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 4px;

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }
`;

// BottomBar 组件
export const BottomBar: React.FC<BottomBarProps> = ({
  links = [],
  legal,
  social = [],
  className,
  onLinkClick,
  onSocialClick
}) => {
  const config = useFooterConfig();

  const handleLinkClick = (link: FooterLink) => {
    console.log('Footer link clicked:', link);
    if (link.external) {
      window.open(link.href, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = link.href;
    }
    onLinkClick?.(link);
  };

  const handleSocialClick = (social: SocialLink) => {
    console.log('Social link clicked:', social);
    if (social.href) {
      window.open(social.href, '_blank', 'noopener,noreferrer');
    }
    if (social.id === 'wechat') {
      // 显示微信二维码逻辑
      return;
    }
    onSocialClick?.(social);
  };

  return (
    <BottomBarContainer className={className}>
      <BottomBarContent>
        <Row gutter={[32, 16]}>
          {/* 公司信息和快速链接 */}
          <Col xs={24} sm={12} md={8}>
            <BottomBarSection>
              <SectionTitle>快速链接</SectionTitle>
              <LinkList>
                {links.map((link) => (
                  <LinkItem
                    key={link.id}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link);
                    }}
                    role="menuitem"
                  >
                    {link.title}
                    {link.external && <ExternalIcon>↗</ExternalIcon>}
                  </LinkItem>
                ))}
              </LinkList>
            </BottomBarSection>
          </Col>

          {/* 法律信息 */}
          <Col xs={24} sm={12} md={8}>
            <BottomBarSection>
              <SectionTitle>法律信息</SectionTitle>
              <LinkList>
                {legal.icp && (
                  <LinkItem
                    href="https://beian.miit.gov.cn/"
                    target="_blank"
                    rel="noopener,noreferrer"
                  >
                    ICP备案: {legal.icp}
                    <ExternalIcon>↗</ExternalIcon>
                  </LinkItem>
                )}
                {legal.police && (
                  <LinkItem
                    href="https://beian.miit.gov.cn/"
                    target="_blank"
                    rel="noopener,noreferrer"
                  >
                    公安备案: {legal.police}
                    <ExternalIcon>↗</ExternalIcon>
                  </LinkItem>
                )}
              </LinkList>
            </BottomBarSection>
          </Col>

          {/* 社交媒体 */}
          <Col xs={24} sm={12} md={8}>
            <BottomBarSection>
              <SectionTitle>关注我们</SectionTitle>
              <Space size={16} wrap>
                {social.map((social) => (
                  <SocialIcon
                    key={social.id}
                    href={social.href || '#'}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSocialClick(social);
                    }}
                    role="menuitem"
                    title={social.title}
                  >
                    {social.id === 'github' && <GithubOutlined />}
                    {social.id === 'wechat' && <WechatOutlined />}
                  </SocialIcon>
                ))}
              </Space>
            </BottomBarSection>
          </Col>
        </Row>

        {/* 版权信息 */}
        <Row>
          <Col span={24}>
            <Copyright>
              {legal.copyright || '© 2024 万象生活. 保留所有权利.'}
            </Copyright>
          </Col>
        </Row>
      </BottomBarContent>
    </BottomBarContainer>
  );
};

export default BottomBar;