import React from 'react';
import { Space, Typography, Row, Col, Divider } from 'antd';
import styled from '@emotion/styled';

const { Text, Link } = Typography;

// 样式化底部容器
const FooterContainer = styled.footer`
  background: #001529;
  color: #fff;
  padding: 40px 20px 20px;
  margin-top: 60px;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterSection = styled.div`
  margin-bottom: 24px;
`;

const FooterTitle = styled(Text)`
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
  display: block;
`;

const FooterLink = styled(Link)`
  color: rgba(255, 255, 255, 0.65);
  display: block;
  margin-bottom: 8px;

  &:hover {
    color: #1890ff;
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.45);
`;

// 底部组件
export const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <Row gutter={[32, 24]}>
          {/* 关于我们 */}
          <Col xs={24} sm={12} md={6}>
            <FooterSection>
              <FooterTitle>关于我们</FooterTitle>
              <FooterLink href="/about">公司介绍</FooterLink>
              <FooterLink href="/contact">联系我们</FooterLink>
              <FooterLink href="/join">加入我们</FooterLink>
              <FooterLink href="/news">新闻动态</FooterLink>
            </FooterSection>
          </Col>

          {/* 用户服务 */}
          <Col xs={24} sm={12} md={6}>
            <FooterSection>
              <FooterTitle>用户服务</FooterTitle>
              <FooterLink href="/help">帮助中心</FooterLink>
              <FooterLink href="/feedback">意见反馈</FooterLink>
              <FooterLink href="/complaint">投诉举报</FooterLink>
              <FooterLink href="/service">服务协议</FooterLink>
            </FooterSection>
          </Col>

          {/* 商务合作 */}
          <Col xs={24} sm={12} md={6}>
            <FooterSection>
              <FooterTitle>商务合作</FooterTitle>
              <FooterLink href="/merchant">商户入驻</FooterLink>
              <FooterLink href="/partner">合作伙伴</FooterLink>
              <FooterLink href="/advert">广告投放</FooterLink>
              <FooterLink href="/api">API接入</FooterLink>
            </FooterSection>
          </Col>

          {/* 下载APP */}
          <Col xs={24} sm={12} md={6}>
            <FooterSection>
              <FooterTitle>下载APP</FooterTitle>
              <Space direction="vertical" size={8}>
                <Text style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                  扫码下载万象生活APP
                </Text>
                {/* 这里可以放二维码图片 */}
                <div style={{
                  width: 120,
                  height: 120,
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                }}>
                  <Text style={{ color: '#000' }}>二维码</Text>
                </div>
              </Space>
            </FooterSection>
          </Col>
        </Row>

        {/* 版权信息 */}
        <Copyright>
          <Space split={<Divider type="vertical" />}>
            <Text>© 2024 万象生活</Text>
            <Link href="/privacy" style={{ color: 'rgba(255, 255, 255, 0.45)' }}>
              隐私政策
            </Link>
            <Link href="/terms" style={{ color: 'rgba(255, 255, 255, 0.45)' }}>
              服务条款
            </Link>
            <Link href="/license" style={{ color: 'rgba(255, 255, 255, 0.45)' }}>
              营业执照
            </Link>
          </Space>
          <div style={{ marginTop: 8 }}>
            <Text style={{ color: 'rgba(255, 255, 255, 0.45)' }}>
              ICP备案号：京ICP备12345678号
            </Text>
          </div>
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;