/**
 * 淘宝风格页脚组件 - 专业级实现
 * 符合NASDAQ上市公司标准的页脚设计
 * 三段式布局：服务保证 + 网站地图 + 法律信息
 */

import React from 'react';
import { Layout, Typography, Space, Divider } from 'antd';
import {
  SafetyOutlined,
  ThunderboltOutlined,
  SecurityScanOutlined,
  CustomerServiceOutlined,
  WechatOutlined,
  WeiboOutlined,
  QqOutlined,
  AlipayOutlined,
  SendOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

// 样式化组件
const FooterContainer = styled(AntFooter)`
  background: linear-gradient(to bottom, #f5f5f5, #ffffff);
  border-top: 2px solid #e8e8e8;
  padding: 0;
  min-height: auto;
`;

const ServiceGuaranteeSection = styled.div`
  background: #ffffff;
  padding: 12px 0;
  border-bottom: 1px solid #e8e8e8;
`;

const SiteMapSection = styled.div`
  background: #fafafa;
  padding: 35px 0 20px;
`;

const LegalSection = styled.div`
  background: #ffffff;
  padding: 20px 0;
  border-top: 1px solid #e8e8e8;
  text-align: center;
`;

const ServiceCard = styled.div`
  text-align: center;
  padding: 16px 12px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);

    .service-icon {
      color: #ff6000;
      transform: scale(1.05);
    }

    .service-title {
      color: #ff6000;
    }
  }
`;

const ServiceIcon = styled.div`
  font-size: 36px;
  color: #666;
  margin-bottom: 12px;
  transition: all 0.3s ease;
`;

const ServiceTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
  transition: color 0.3s ease;
`;

const ServiceDesc = styled.div`
  font-size: 13px;
  color: #888;
  line-height: 1.3;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;

  @media (min-width: 992px) {
    text-align: center;
  }
`;

const FooterLink = styled(Link)`
  display: block;
  color: #888;
  font-size: 14px;
  line-height: 2.2;
  transition: color 0.3s ease;
  text-decoration: none;
  text-align: center;

  &:hover {
    color: #ff6000;
  }

  @media (min-width: 992px) {
    text-align: center;
  }
`;

const SocialIcon = styled.a`
  font-size: 24px;
  color: #999;
  margin: 0 12px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    color: #ff6000;
    transform: translateY(-2px);
  }
`;

const CopyrightText = styled(Text)`
  font-size: 13px;
  color: #999;
  line-height: 1.6;
`;

const LegalLink = styled(Link)`
  color: #999;
  font-size: 13px;
  margin: 0 8px;
  transition: color 0.3s ease;

  &:hover {
    color: #ff6000;
  }
`;

// 网站地图专用容器 - 精确居中布局
const SiteMapContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`;

const SiteMapRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;

  @media (max-width: 1199px) {
    gap: 20px;
  }

  @media (max-width: 991px) {
    gap: 16px;
  }

  @media (max-width: 767px) {
    gap: 16px;
    justify-content: center;
  }
`;

const SiteMapCol = styled.div`
  flex: 0 0 auto;
  width: 200px;
  text-align: center;

  @media (max-width: 1199px) {
    width: 180px;
  }

  @media (max-width: 991px) {
    flex: 0 0 calc(50% - 8px);
    width: auto;
    min-width: 160px;
  }

  @media (max-width: 767px) {
    flex: 0 0 100%;
    width: 100%;
    max-width: 300px;
  }
`;

// 服务保证专用布局
const ServiceGuaranteeRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;

  @media (max-width: 1199px) {
    gap: 20px;
  }

  @media (max-width: 767px) {
    gap: 16px;
  }

  @media (max-width: 479px) {
    gap: 12px;
  }
`;

const ServiceGuaranteeCol = styled.div`
  flex: 0 0 auto;
  width: 200px;

  @media (max-width: 1199px) {
    width: 180px;
  }

  @media (max-width: 767px) {
    flex: 0 0 calc(50% - 8px);
    width: auto;
  }

  @media (max-width: 479px) {
    flex: 0 0 100%;
    width: 100%;
    max-width: 280px;
  }
`;

// 服务保证数据
const serviceGuarantees = [
  {
    icon: <SafetyOutlined />,
    title: '安全支付',
    description: '支付宝担保交易，资金安全有保障',
  },
  {
    icon: <ThunderboltOutlined />,
    title: '极速发货',
    description: '24小时内发货，闪电配送',
  },
  {
    icon: <SecurityScanOutlined />,
    title: '品质保证',
    description: '正品行货，七天无理由退换',
  },
  {
    icon: <CustomerServiceOutlined />,
    title: '售后无忧',
    description: '专业客服团队，全程贴心服务',
  },
];

// 网站地图数据 - 针对Universe Life平台定制
const siteMapData = [
  {
    title: '平台服务',
    links: ['游戏代练', '校园服务', '企业服务', '设计创作', '任务发布'],
  },
  {
    title: '用户指南',
    links: ['新手指南', '下单流程', '支付方式', '服务保障', '常见问题'],
  },
  {
    title: '服务者中心',
    links: ['成为服务者', '任务管理', '收益提现', '服务规范', '帮助中心'],
  },
  {
    title: '关于平台',
    links: ['平台介绍', '联系我们', '加入团队', '新闻动态', '合作伙伴'],
  },
  {
    title: '帮助支持',
    links: ['在线客服', '用户反馈', '商务合作', '投诉建议', '安全问题'],
  },
];

const TaobaoFooter: React.FC = () => {
  return (
    <FooterContainer>
      {/* Section A: Service Guarantee */}
      <ServiceGuaranteeSection>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <ServiceGuaranteeRow>
            {serviceGuarantees.map((service, index) => (
              <ServiceGuaranteeCol key={index}>
                <ServiceCard>
                  <ServiceIcon className="service-icon">
                    {service.icon}
                  </ServiceIcon>
                  <ServiceTitle className="service-title">
                    {service.title}
                  </ServiceTitle>
                  <ServiceDesc>{service.description}</ServiceDesc>
                </ServiceCard>
              </ServiceGuaranteeCol>
            ))}
          </ServiceGuaranteeRow>
        </div>
      </ServiceGuaranteeSection>

      {/* Section B: Site Map */}
      <SiteMapSection>
        <SiteMapContainer>
          <SiteMapRow>
            {siteMapData.map((section, index) => (
              <SiteMapCol key={index}>
                <SectionTitle>{section.title}</SectionTitle>
                {section.links.map((link, linkIndex) => (
                  <FooterLink key={linkIndex} href="#">
                    {link}
                  </FooterLink>
                ))}
              </SiteMapCol>
            ))}
          </SiteMapRow>
        </SiteMapContainer>
      </SiteMapSection>

      {/* Section C: Legal */}
      <LegalSection>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          {/* 社交媒体和联系方式图标 */}
          <Space size="large" style={{ marginBottom: '16px' }}>
            <SocialIcon title="微信公众号">
              <WechatOutlined />
            </SocialIcon>
            <SocialIcon title="新浪微博">
              <WeiboOutlined />
            </SocialIcon>
            <SocialIcon title="QQ客服">
              <QqOutlined />
            </SocialIcon>
            <SocialIcon title="支付宝">
              <AlipayOutlined />
            </SocialIcon>
            <SocialIcon title="飞书协作">
              <SendOutlined />
            </SocialIcon>
          </Space>

          {/* 版权信息 */}
          <div style={{ marginBottom: '12px' }}>
            <CopyrightText>
              © 2024 Universe Life 万象生活平台. All rights reserved. |
              宇宙生活（北京）科技有限公司 |
              京ICP备2024123456号 |
              京公网安备11010802012345号
            </CopyrightText>
          </div>

          {/* 法律链接 */}
          <Space split={<Divider type="vertical" />}>
            <LegalLink href="/legal/privacy">隐私政策</LegalLink>
            <LegalLink href="/legal/terms">用户协议</LegalLink>
            <LegalLink href="/legal/compliance">平台规则</LegalLink>
            <LegalLink href="/legal/disclaimer">免责声明</LegalLink>
            <LegalLink href="/help">帮助中心</LegalLink>
          </Space>
        </div>
      </LegalSection>
    </FooterContainer>
  );
};

export default TaobaoFooter;