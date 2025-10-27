import React from 'react';
import { Card, Typography, Button, Space } from 'antd';
import styled from '@emotion/styled';

const { Title, Paragraph } = Typography;

// 样式化容器
const HomeContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
`;

// 最简化的首页 - 不使用任何自定义Hook
export const HomePageSimple: React.FC = () => {
  // 模拟数据
  const mockBanners = [
    { id: 1, title: '测试轮播图1', image: '/images/banner1.jpg' },
    { id: 2, title: '测试轮播图2', image: '/images/banner2.jpg' },
  ];

  const mockGridItems = [
    { id: 1, title: '家政保洁', icon: '🧹' },
    { id: 2, title: '维修安装', icon: '🔧' },
    { id: 3, title: '代办跑腿', icon: '🏃' },
    { id: 4, title: '技能服务', icon: '💼' },
  ];

  const mockTasks = [
    {
      id: 1,
      title: '需要有人帮忙打扫客厅',
      budget: 150,
      location: '朝阳区建国门外大街1号',
      publisher: '张女士',
    },
    {
      id: 2,
      title: '急！需要人帮忙取快递',
      budget: 50,
      location: '海淀区中关村大街27号',
      publisher: '李先生',
    },
  ];

  return (
    <HomeContainer>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* 标题 */}
        <Card style={{ marginBottom: 24, textAlign: 'center' }}>
          <Title level={1} style={{ color: '#1890ff', margin: 0 }}>
            🎉 万象生活
          </Title>
          <Paragraph>您身边的生活服务专家</Paragraph>
        </Card>

        {/* 轮播图区域 */}
        <Card title="轮播图" style={{ marginBottom: 24 }}>
          <div style={{ height: 180, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>
            <div>
              <h3>轮播图组件位置</h3>
              <p>{mockBanners.length} 个轮播项目</p>
            </div>
          </div>
        </Card>

        {/* 统计数据 */}
        <Card title="平台统计" style={{ marginBottom: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div style={{ textAlign: 'center', padding: 16, background: '#f9f9f9', borderRadius: 8 }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>15,420</div>
              <div>累计任务</div>
            </div>
            <div style={{ textAlign: 'center', padding: 16, background: '#f9f9f9', borderRadius: 8 }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>8,930</div>
              <div>注册用户</div>
            </div>
            <div style={{ textAlign: 'center', padding: 16, background: '#f9f9f9', borderRadius: 8 }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#fa8c16' }}>284万</div>
              <div>累计赏金</div>
            </div>
            <div style={{ textAlign: 'center', padding: 16, background: '#f9f9f9', borderRadius: 8 }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#13c2c2' }}>82%</div>
              <div>完成率</div>
            </div>
          </div>
        </Card>

        {/* 快速宫格 */}
        <Card title="快速服务" style={{ marginBottom: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
            {mockGridItems.map(item => (
              <div key={item.id} style={{ textAlign: 'center', padding: 20, background: '#fff', border: '1px solid #f0f0f0', borderRadius: 8, cursor: 'pointer' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</div>
                <div>{item.title}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* 任务标签 */}
        <Card title="任务分类" style={{ marginBottom: 24 }}>
          <Space>
            <Button type="primary">综合</Button>
            <Button>最新</Button>
            <Button>高价</Button>
            <Button>距离</Button>
          </Space>
        </Card>

        {/* 任务列表 */}
        <Card title="任务列表" style={{ marginBottom: 24 }}>
          {mockTasks.map(task => (
            <div key={task.id} style={{ padding: 16, background: '#fff', border: '1px solid #f0f0f0', borderRadius: 8, marginBottom: 16 }}>
              <h4>{task.title}</h4>
              <p>预算: ¥{task.budget}</p>
              <p>位置: {task.location}</p>
              <p>发布者: {task.publisher}</p>
              <Button type="primary" style={{ marginTop: 8 }}>立即接单</Button>
            </div>
          ))}
        </Card>

        {/* 成功提示 */}
        <Card style={{ textAlign: 'center', background: '#f6ffed', borderColor: '#b7eb8f' }}>
          <Title level={3} style={{ color: '#52c41a' }}>✅ 首页组件测试成功!</Title>
          <Paragraph>
            基础布局和样式都正常工作。问题可能在于自定义Hook或数据加载部分。
          </Paragraph>
          <Space>
            <Button type="primary">继续调试</Button>
            <Button>查看详情</Button>
          </Space>
        </Card>
      </div>
    </HomeContainer>
  );
};

export default HomePageSimple;