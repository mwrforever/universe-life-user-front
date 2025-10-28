import React from 'react';
import { Row, Col, Statistic, Card } from 'antd';
import { UserOutlined, TeamOutlined, DollarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { HomeStatistics } from '../../types';

// 样式化统计容器
const StatisticsContainer = styled.div`
  margin-bottom: 24px;
`;

const StatisticsCard = styled(Card)`
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;

  .ant-statistic-title {
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 8px;
  }

  .ant-statistic-content {
    color: #fff;
  }

  .ant-statistic-content-value {
    color: #fff;
    font-weight: bold;
  }
`;

const StatItem = styled(motion.div)`
  text-align: center;
  padding: 20px;
`;

const StatIcon = styled.div<{ color: string }>`
  font-size: 32px;
  margin-bottom: 12px;
  color: ${props => props.color};
`;

// 统计横幅组件属性
interface StatisticsBannerProps {
  statistics?: HomeStatistics;
  loading?: boolean;
}

// 统计横幅组件
export const StatisticsBanner: React.FC<StatisticsBannerProps> = ({ statistics, loading }) => {
  // 模拟数据（当没有真实数据时使用）
  const mockData: HomeStatistics = {
    totalTasks: 15420,
    totalUsers: 8930,
    totalBounty: 2847650,
    completedTasks: 12680,
    activeUsers: 2340,
    todayTasks: 186,
  };

  const data = statistics || mockData;

  // 统计项配置
  const statItems = [
    {
      key: 'totalTasks',
      title: '累计任务',
      value: data.totalTasks,
      icon: <TeamOutlined />,
      color: '#1890ff',
      suffix: '个',
      formatter: (value: number) => value.toLocaleString(),
    },
    {
      key: 'totalUsers',
      title: '注册用户',
      value: data.totalUsers,
      icon: <UserOutlined />,
      color: '#52c41a',
      suffix: '人',
      formatter: (value: number) => value.toLocaleString(),
    },
    {
      key: 'totalBounty',
      title: '累计赏金',
      value: data.totalBounty,
      icon: <DollarOutlined />,
      color: '#fa8c16',
      suffix: '元',
      formatter: (value: number) => `¥${(value / 10000).toFixed(1)}万`,
      precision: 1,
    },
    {
      key: 'completedTasks',
      title: '完成率',
      value: data.totalTasks > 0 ? (data.completedTasks / data.totalTasks) * 100 : 0,
      icon: <CheckCircleOutlined />,
      color: '#13c2c2',
      suffix: '%',
      precision: 1,
    },
  ];

  // 容器动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // 子项动画变体
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  if (loading) {
    return (
      <StatisticsContainer>
        <StatisticsCard loading />
      </StatisticsContainer>
    );
  }

  return (
    <StatisticsContainer>
      <StatisticsCard>
        <motion.div variants={containerVariants} initial='hidden' animate='visible'>
          <Row gutter={[24, 24]}>
            {statItems.map(item => (
              <Col xs={12} sm={12} md={6} key={item.key}>
                <motion.div variants={itemVariants}>
                  <StatItem>
                    <StatIcon color={item.color}>{item.icon}</StatIcon>
                    <Statistic
                      title={item.title}
                      value={item.value}
                      suffix={item.suffix}
                      formatter={item.formatter}
                      precision={item.precision}
                      valueStyle={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        color: '#fff',
                      }}
                    />
                  </StatItem>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      </StatisticsCard>
    </StatisticsContainer>
  );
};

export default StatisticsBanner;
