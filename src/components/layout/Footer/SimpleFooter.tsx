/**
 * 万象生活底栏组件 - 极简版
 * 3栏响应式布局：品牌声明 + 快速导航 + 法律信息
 * 白色背景主题，移动端优先设计
 */

import React from 'react';
import { Layout, Row, Col, Space, Typography } from 'antd';
import {
  WechatOutlined,
  WeiboOutlined,
  QqOutlined,
  AlipayOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

// 简化版样式对象
const footerStyles = {
  container: {
    backgroundColor: '#ffffff',
    color: 'rgba(0, 0, 0, 0.85)',
    padding: '32px 24px',
    borderTop: '1px solid #e6e6e6',
  },
  section: {
    marginBottom: '24px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'rgba(0, 0, 0, 0.85)',
    marginBottom: '16px',
  },
  link: {
    color: 'rgba(0, 0, 0, 0.65)',
    fontSize: '14px',
    lineHeight: '22px',
    transition: 'color 0.3s',
  },
  socialIcon: {
    fontSize: '20px',
    color: 'rgba(0, 0, 0, 0.45)',
    marginRight: '16px',
    cursor: 'pointer',
    transition: 'color 0.3s',
  },
  copyright: {
    textAlign: 'center' as const,
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid #f0f0f0',
    color: 'rgba(0, 0, 0, 0.45)',
    fontSize: '14px',
  },
};

const SimpleFooter: React.FC = () => {
  return (
    <AntFooter style={footerStyles.container}>
      <Row gutter={[32, 24]}>
        {/* 品牌介绍 */}
        <Col xs={24} md={8}>
          <div style={footerStyles.section}>
            <Text strong style={footerStyles.title}>
              万象生活
            </Text>
            <div>
              <Text style={footerStyles.link}>
                万象生活是您身边的生活服务专家，致力于为您提供便捷、优质的生活服务体验。
              </Text>
            </div>
            <Space size='middle' style={{ marginTop: '16px' }}>
              <WechatOutlined style={footerStyles.socialIcon} />
              <WeiboOutlined style={footerStyles.socialIcon} />
              <QqOutlined style={footerStyles.socialIcon} />
              <AlipayOutlined style={footerStyles.socialIcon} />
            </Space>
          </div>
        </Col>

        {/* 快速导航 */}
        <Col xs={24} md={8}>
          <div style={footerStyles.section}>
            <Text strong style={footerStyles.title}>
              快速导航
            </Text>
            <div>
              <div>
                <Link href='/' style={{ ...footerStyles.link, display: 'block' }}>
                  首页
                </Link>
                <Link href='/services' style={{ ...footerStyles.link, display: 'block' }}>
                  服务项目
                </Link>
                <Link href='/about' style={{ ...footerStyles.link, display: 'block' }}>
                  关于我们
                </Link>
                <Link href='/contact' style={{ ...footerStyles.link, display: 'block' }}>
                  联系我们
                </Link>
              </div>
            </div>
          </div>
        </Col>

        {/* 联系方式 */}
        <Col xs={24} md={8}>
          <div style={footerStyles.section}>
            <Text strong style={footerStyles.title}>
              联系我们
            </Text>
            <div>
              <div style={{ marginBottom: '8px' }}>
                <PhoneOutlined style={{ marginRight: '8px' }} />
                <Text style={footerStyles.link}>400-123-4567</Text>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <MailOutlined style={{ marginRight: '8px' }} />
                <Text style={footerStyles.link}>service@wanxiangshenghuo.com</Text>
              </div>
              <div>
                <EnvironmentOutlined style={{ marginRight: '8px' }} />
                <Text style={footerStyles.link}>北京市朝阳区某某大厦1001室</Text>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* 版权信息 */}
      <div style={footerStyles.copyright}>
        <Text>
          © 2024 万象生活平台. All rights reserved. |
          <Link href='/privacy' style={{ marginLeft: '8px' }}>
            隐私政策
          </Link>{' '}
          |
          <Link href='/terms' style={{ marginLeft: '8px' }}>
            服务条款
          </Link>
        </Text>
      </div>
    </AntFooter>
  );
};

export default SimpleFooter;
