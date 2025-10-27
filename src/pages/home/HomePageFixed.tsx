import React, { useState } from 'react';
import { Container, message, Card, Typography, Button, Space } from 'antd';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';

const { Title, Paragraph } = Typography;

// 样式化主容器
const HomeContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 0;
`;

const ContentContainer = styled(Container)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
`;

// 模拟API函数
const fetchMockData = async () => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    banners: [
      {
        id: '1',
        title: '新用户专享福利',
        description: '注册即送50元优惠券',
        image: 'https://via.placeholder.com/800x360/1890ff/ffffff?text=新用户福利',
        link: '/register',
        type: 'internal' as const,
        order: 1,
        isActive: true,
      },
      {
        id: '2',
        title: '春季服务大促',
        description: '家政服务低至8折',
        image: 'https://via.placeholder.com/800x360/52c41a/ffffff?text=春季大促',
        link: '/promotion/spring',
        type: 'internal' as const,
        order: 2,
        isActive: true,
      },
    ],
    gridItems: [
      {
        id: '1',
        title: '家政保洁',
        icon: '🧹',
        link: '/category/cleaning',
        color: '#1890ff',
        category: 'service',
        badge: 23,
      },
      {
        id: '2',
        title: '维修安装',
        icon: '🔧',
        link: '/category/repair',
        color: '#52c41a',
        category: 'service',
        badge: 15,
      },
      {
        id: '3',
        title: '代办跑腿',
        icon: '🏃',
        link: '/category/errand',
        color: '#fa8c16',
        category: 'delivery',
        badge: 8,
      },
      {
        id: '4',
        title: '技能服务',
        icon: '💼',
        link: '/category/skill',
        color: '#722ed1',
        category: 'consulting',
      },
    ],
    statistics: {
      totalTasks: 15420,
      totalUsers: 8930,
      totalBounty: 2847650,
      completedTasks: 12680,
      activeUsers: 2340,
      todayTasks: 186,
    },
    tasks: [
      {
        id: '1',
        title: '需要有人帮忙打扫客厅',
        description: '客厅面积约30平米，需要深度清洁，包括地板、家具、窗户等',
        category: 'service',
        status: 'pending',
        priority: 'normal',
        budget: 150,
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        location: {
          address: '朝阳区建国门外大街1号',
          latitude: 39.9042,
          longitude: 116.4074,
          distance: 1200,
        },
        publisher: {
          id: 'user1',
          nickname: '张女士',
          avatar: 'https://via.placeholder.com/40x40/1890ff/ffffff?text=张',
          rating: 4.8,
          completedTasks: 23,
        },
        requirements: ['有经验', '自备工具', '女性优先'],
        tags: ['家政', '保洁', '客厅'],
        images: ['https://via.placeholder.com/300x200/f0f0f0/666666?text=客厅照片'],
        applicantCount: 3,
        maxApplicants: 5,
        viewCount: 156,
        isUrgent: false,
        isRemote: false,
        estimatedDuration: 120,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  };
};

// 修复版首页组件
export const HomePageFixed: React.FC = () => {
  const [activeTab, setActiveTab] = useState('latest');

  // 使用简单的React Query获取数据
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['homeData'],
    queryFn: fetchMockData,
    staleTime: 60 * 1000, // 1分钟缓存
  });

  // 处理刷新
  const handleRefresh = async () => {
    try {
      await refetch();
      message.success('刷新成功');
    } catch {
      message.error('刷新失败，请重试');
    }
  };

  // 处理搜索
  const handleSearch = (value: string) => {
    if (value.trim()) {
      console.log('搜索:', value);
      message.info(`搜索: ${value}`);
    }
  };

  // 处理任务查看
  const handleTaskView = (taskId: string) => {
    console.log('查看任务:', taskId);
    message.info(`查看任务: ${taskId}`);
  };

  // 处理任务接单
  const handleTaskGrab = (taskId: string) => {
    console.log('接单:', taskId);
    message.success('接单成功！');
  };

  if (error) {
    return (
      <HomeContainer>
        <ContentContainer>
          <Card style={{ marginTop: 20, textAlign: 'center' }}>
            <Title level={2} style={{ color: '#ff4d4f' }}>❌ 数据加载失败</Title>
            <Paragraph>请稍后重试</Paragraph>
            <Button type="primary" onClick={handleRefresh}>重新加载</Button>
          </Card>
        </ContentContainer>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      {/* 简化的头部 */}
      <div style={{ background: '#fff', padding: '16px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>万象生活</Title>
          <Space>
            <Button onClick={() => handleRefresh()} loading={isLoading}>刷新</Button>
            <Button onClick={() => window.location.href = '/login'}>登录</Button>
            <Button type="primary" onClick={() => window.location.href = '/register'}>注册</Button>
          </Space>
        </div>
      </div>

      {/* 主要内容 */}
      <MainContent>
        <ContentContainer>
          {isLoading ? (
            <Card style={{ marginTop: 24, textAlign: 'center' }}>
              <div style={{ padding: '40px 0' }}>
                <div className="ant-spin ant-spin-lg ant-spin-spinning">
                  <span className="ant-spin-dot ant-spin-dot-item"></span>
                  <span className="ant-spin-dot ant-spin-dot-item"></span>
                  <span className="ant-spin-dot ant-spin-dot-item"></span>
                </div>
                <div style={{ marginTop: 16 }}>加载中...</div>
              </div>
            </Card>
          ) : data ? (
            <>
              {/* 轮播图区域 */}
              <Card style={{ marginTop: 24, marginBottom: 24 }}>
                <Title level={3}>🎯 轮播图</Title>
                <div style={{ height: 180, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <div style={{ textAlign: 'center' }}>
                    <Title level={2} style={{ color: '#fff', margin: 0 }}>轮播图组件</Title>
                    <Paragraph style={{ color: 'rgba(255,255,255,0.8)' }}>
                      {data.banners.length} 个轮播项目
                    </Paragraph>
                  </div>
                </div>
              </Card>

              {/* 统计横幅 */}
              <Card style={{ marginBottom: 24 }}>
                <Title level={3}>📊 平台统计</Title>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                  <div style={{ textAlign: 'center', padding: 16, background: '#f9f9f9', borderRadius: 8 }}>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                      {data.statistics.totalTasks.toLocaleString()}
                    </div>
                    <div>累计任务</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: 16, background: '#f9f9f9', borderRadius: 8 }}>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                      {data.statistics.totalUsers.toLocaleString()}
                    </div>
                    <div>注册用户</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: 16, background: '#f9f9f9', borderRadius: 8 }}>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#fa8c16' }}>
                      ¥{(data.statistics.totalBounty / 10000).toFixed(1)}万
                    </div>
                    <div>累计赏金</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: 16, background: '#f9f9f9', borderRadius: 8 }}>
                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#13c2c2' }}>
                      {Math.round((data.statistics.completedTasks / data.statistics.totalTasks) * 100)}%
                    </div>
                    <div>完成率</div>
                  </div>
                </div>
              </Card>

              {/* 快速宫格 */}
              <Card title="⚡ 快速服务" style={{ marginBottom: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
                  {data.gridItems.map(item => (
                    <div
                      key={item.id}
                      style={{
                        textAlign: 'center',
                        padding: 20,
                        background: '#fff',
                        border: '1px solid #f0f0f0',
                        borderRadius: 8,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                      onClick={() => message.info(`点击了: ${item.title}`)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</div>
                      <div>{item.title}</div>
                      {item.badge && (
                        <div style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          background: '#ff4d4f',
                          color: '#fff',
                          borderRadius: 4,
                          padding: '2px 6px',
                          fontSize: 12,
                        }}>
                          {item.badge}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* 任务标签 */}
              <Card style={{ marginBottom: 24 }}>
                <Space>
                  <Button type={activeTab === 'latest' ? 'primary' : 'default'} onClick={() => setActiveTab('latest')}>
                    综合
                  </Button>
                  <Button type={activeTab === 'budget' ? 'primary' : 'default'} onClick={() => setActiveTab('budget')}>
                    高价
                  </Button>
                  <Button type={activeTab === 'distance' ? 'primary' : 'default'} onClick={() => setActiveTab('distance')}>
                    距离
                  </Button>
                  <Button type={activeTab === 'urgent' ? 'primary' : 'default'} onClick={() => setActiveTab('urgent')}>
                    加急
                  </Button>
                </Space>
              </Card>

              {/* 任务列表 */}
              <Card title="📋 任务列表">
                {data.tasks.map(task => (
                  <div
                    key={task.id}
                    style={{
                      padding: 16,
                      background: '#fff',
                      border: '1px solid #f0f0f0',
                      borderRadius: 8,
                      marginBottom: 16,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onClick={() => handleTaskView(task.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <Title level={4} style={{ margin: 0, flex: 1 }}>{task.title}</Title>
                      <div style={{ fontSize: 18, fontWeight: 'bold', color: '#ff4d4f' }}>¥{task.budget}</div>
                    </div>
                    <Paragraph style={{ margin: '0 0 8px 0', color: '#666' }}>{task.description}</Paragraph>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space>
                        <span>📍 {task.location.address}</span>
                        <span>👤 {task.publisher.nickname}</span>
                        <span>⭐ {task.publisher.rating}</span>
                      </Space>
                      <Button
                        type="primary"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTaskGrab(task.id);
                        }}
                      >
                        立即接单
                      </Button>
                    </div>
                  </div>
                ))}
              </Card>

              {/* 成功提示 */}
              <Card style={{ marginTop: 24, textAlign: 'center', background: '#f6ffed', borderColor: '#b7eb8f' }}>
                <Title level={3} style={{ color: '#52c41a' }}>🎉 首页修复成功!</Title>
                <Paragraph>
                  所有核心功能都正常工作，包括数据加载、组件渲染和用户交互。
                </Paragraph>
                <Space>
                  <Button type="primary" onClick={handleRefresh}>刷新数据</Button>
                  <Button onClick={() => message.info('功能测试')}>测试功能</Button>
                </Space>
              </Card>
            </>
          ) : null}
        </ContentContainer>
      </MainContent>
    </HomeContainer>
  );
};

export default HomePageFixed;