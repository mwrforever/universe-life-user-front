import React from 'react';
import { Card, Typography, Row, Col, Statistic } from 'antd';

const { Title } = Typography;

const DashboardPage: React.FC = () => {
  return (
    <div>
      <Title level={2} style={{ marginBottom: '24px' }}>
        数据概览
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='总用户数'
              value={1128}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='今日订单'
              value={93}
              precision={0}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='总收入'
              value={112893}
              precision={2}
              prefix='¥'
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='活跃率'
              value={93.2}
              precision={1}
              suffix='%'
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title='最近订单' style={{ height: '300px' }}>
            <p>订单列表开发中...</p>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title='用户增长' style={{ height: '300px' }}>
            <p>用户增长图表开发中...</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
