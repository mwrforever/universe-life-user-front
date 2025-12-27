import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Avatar,
  Button,
  Space,
  Input,
  Select,
  Badge,
  Spin,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  HeartOutlined,
  MessageOutlined,
  ShareAltOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  UserOutlined,
  EnvironmentOutlined,
  StarOutlined,
  ThunderboltOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { ORDER_CATEGORIES } from '@/data/category-config';
import { getCategoryTheme } from '@/theme/themeConfig';
import { type Order, type MarketFilters } from '@/types/order-platform';
import moment from 'moment';
import { logger } from '@/utils/logger';

const { Title, Text } = Typography;
const { Search } = Input;

// ==================== 样式组件 ====================

const MarketContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  background: #f8fafc;
  min-height: calc(100vh - 200px);
`;


const FilterContainer = styled(Card)`
  margin-bottom: 32px;
  border: 1px solid #e2e8f0 !important;
  border-radius: 16px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;

  .ant-card-head {
    background: #ffffff;
    border-bottom: 1px solid #e2e8f0 !important;
    border-radius: 16px 16px 0 0 !important;

    .ant-card-head-title {
      color: #1f2937 !important;
      font-weight: 600 !important;
      font-size: 1.1rem !important;
    }
  }

  .ant-card-body {
    background: #ffffff;
    border-radius: 0 0 16px 16px !important;
  }
`;

const OrderCard = styled(Card)<{ categoryTheme?: { colors: { primary: string; accent: string } }; featured?: boolean }>`
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: ${props => (props.featured ? '2px solid #6366f1' : '1px solid #e2e8f0')} !important;
  border-radius: 16px !important;
  margin-bottom: 24px;
  background: #ffffff !important;

  ${props =>
    props.featured &&
    `
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.15) !important;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899);
      z-index: 2;
    }
  `}

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12);
  }

  .ant-card-body {
    padding: 24px !important;
  }

  .featured-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 3;
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;

  .order-title {
    flex: 1;
    margin: 0 !important;
    font-size: 1.2rem !important;
    font-weight: 600 !important;
    color: #1f2937 !important;
    line-height: 1.4 !important;
  }

  .budget-display {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.9rem;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }
`;

const CategoryBadge = styled(Tag)<{ categoryTheme?: { colors: { primary: string; accent: string } } }>`
  background: ${props => props.categoryTheme?.colors.primary || '#6366f1'} !important;
  border: none !important;
  color: white !important;
  font-weight: 500 !important;
  margin-bottom: 12px;
  padding: 4px 12px !important;
  border-radius: 12px !important;
  font-size: 0.85rem !important;
`;

const OrderDescription = styled(Paragraph)`
  color: #64748b !important;
  margin-bottom: 16px !important;
  line-height: 1.6 !important;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.95rem !important;
`;

const OrderMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;

  .meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #64748b;
    font-size: 0.9rem;

    .anticon {
      font-size: 14px;
    }
  }
`;

const PublisherInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 16px;

  .publisher-avatar {
    border: 2px solid #6366f1;
  }

  .publisher-details {
    flex: 1;

    .publisher-name {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .publisher-rating {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #f59e0b;
      font-size: 0.85rem;
    }
  }

  .verified-badge {
    color: #10b981;
    font-size: 12px;
  }
`;

const SkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;

  .skill-tag {
    background: #f1f5f9 !important;
    border: 1px solid #e2e8f0 !important;
    color: #475569 !important;
    font-size: 0.8rem !important;
    padding: 4px 10px !important;
    border-radius: 8px !important;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: space-between;
  align-items: center;

  .left-actions {
    display: flex;
    gap: 8px;
  }

  .right-actions {
    display: flex;
    gap: 8px;
  }

  .action-button {
    border-radius: 8px !important;
    font-weight: 500 !important;
    transition: all 0.3s ease !important;

    &.primary {
      background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
      border: none !important;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3) !important;

      &:hover {
        transform: translateY(-1px) !important;
        box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4) !important;
      }
    }

    &.secondary {
      background: #f8fafc !important;
      border: 1px solid #e2e8f0 !important;
      color: #64748b !important;

      &:hover {
        background: #f1f5f9 !important;
        border-color: #cbd5e1 !important;
        color: #475569 !important;
      }
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;

  .empty-icon {
    font-size: 64px;
    color: #cbd5e1;
    margin-bottom: 16px;
  }

  .empty-title {
    font-size: 1.2rem;
    color: #64748b;
    margin-bottom: 8px;
  }

  .empty-description {
    color: #94a3b8;
    margin-bottom: 24px;
  }
`;

// ==================== 模拟数据 ====================

const generateMockOrders = (): Order[] => {
  const categories = Object.values(ORDER_CATEGORIES);
  const skills = [
    'React',
    'Vue',
    'Node.js',
    'Python',
    'Java',
    'JavaScript',
    'TypeScript',
    'UI设计',
    '品牌设计',
    '游戏代练',
    '论文写作',
    '数学辅导',
  ];
  const titles = [
    '需要开发一个电商小程序',
    '寻找Python后端开发工程师',
    '企业官网改版设计项目',
    '寻找游戏代练上分服务',
    '学术论文写作指导',
    '品牌Logo设计需求',
    '需要Node.js全栈开发',
    '移动应用UI/UX设计',
    '寻找Java后端架构师',
    '游戏陪练服务需求',
  ];

  return Array.from({ length: 20 }, (_, index) => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const randomSkills = Array.from(
      { length: Math.floor(Math.random() * 4) + 1 },
      () => skills[Math.floor(Math.random() * skills.length)]
    ).slice(0, 3);

    const budget = Math.floor(Math.random() * 10000) + 1000;
    const urgency = ['low', 'medium', 'high', 'urgent'][Math.floor(Math.random() * 4)];

    return {
      id: `order-${index + 1}`,
      title: titles[index] || `项目需求 ${index + 1}`,
      description:
        '这是一个详细的项目描述，包含了项目的背景、具体需求和期望的成果。客户希望找到专业的服务提供者来完成这个任务，确保项目能够按时高质量地完成。',
      category,
      budget: {
        min: budget,
        max: budget + Math.floor(Math.random() * 5000),
        type: 'fixed',
        currency: 'CNY',
      },
      timeline: {
        urgency: urgency as 'low' | 'medium' | 'high',
        deadline: moment()
          .add(Math.floor(Math.random() * 30) + 1, 'days')
          .toISOString(),
      },
      categoryData: {},
      location: {
        type: Math.random() > 0.5 ? 'remote' : 'onsite',
        city: Math.random() > 0.5 ? '北京' : '上海',
        country: '中国',
      },
      skills: randomSkills,
      experienceLevel: 'intermediate',
      publisher: {
        id: `user-${index + 1}`,
        name: `客户${index + 1}`,
        avatar: undefined,
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
        reviewsCount: Math.floor(Math.random() * 50) + 1,
        isVerified: Math.random() > 0.3,
      },
      status: 'open',
      visibility: 'public',
      applicationsCount: Math.floor(Math.random() * 20),
      viewedCount: Math.floor(Math.random() * 100) + 20,
      savedCount: Math.floor(Math.random() * 15),
      attachments: [],
      tags: randomSkills.slice(0, 2),
    } as Order;
  });
};

// ==================== 主组件 ====================

interface OrderMarketListProps {
  category?: string;
  onOrderClick?: (order: Order) => void;
  onFilterChange?: (filters: MarketFilters) => void;
}

export const OrderMarketList: React.FC<OrderMarketListProps> = ({
  category,
  onOrderClick,
  onFilterChange,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<MarketFilters>({
    categories: category ? [category] : [],
    sortBy: 'newest',
    sortOrder: 'desc',
  });
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockOrders = generateMockOrders();

        let filteredOrders = mockOrders;

        // 应用分类筛选
        if (filters.categories?.length) {
          filteredOrders = filteredOrders.filter(order =>
            filters.categories!.includes(order.category.id)
          );
        }

        // 应用搜索筛选
        if (searchKeyword) {
          filteredOrders = filteredOrders.filter(
            order =>
              order.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
              order.description.toLowerCase().includes(searchKeyword.toLowerCase()) ||
              order.skills.some(skill => skill.toLowerCase().includes(searchKeyword.toLowerCase()))
          );
        }

        // 应用预算筛选
        if (filters.budget?.min !== undefined) {
          filteredOrders = filteredOrders.filter(
            order => order.budget.min >= (filters.budget?.min || 0)
          );
        }

        if (filters.budget?.max !== undefined) {
          filteredOrders = filteredOrders.filter(
            order => order.budget.max <= (filters.budget?.max || Infinity)
          );
        }

        // 应用排序
        switch (filters.sortBy) {
          case 'newest':
            filteredOrders.sort((a, b) => b.id.localeCompare(a.id));
            break;
          case 'budget_high':
            filteredOrders.sort((a, b) => b.budget.max - a.budget.max);
            break;
          case 'budget_low':
            filteredOrders.sort((a, b) => a.budget.min - b.budget.min);
            break;
          case 'deadline':
            filteredOrders.sort((a, b) => {
              const aDeadline = a.timeline.deadline
                ? new Date(a.timeline.deadline).getTime()
                : Infinity;
              const bDeadline = b.timeline.deadline
                ? new Date(b.timeline.deadline).getTime()
                : Infinity;
              return aDeadline - bDeadline;
            });
            break;
        }

        setOrders(filteredOrders);
      } catch (error) {
        logger.error('加载订单失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [filters, searchKeyword]);

  const handleOrderClick = (order: Order) => {
    if (onOrderClick) {
      onOrderClick(order);
    } else {
      navigate(`/order/${order.id}`);
    }
  };

  const handleFilterChange = (newFilters: Partial<MarketFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };

  const formatBudget = (budget: Order['budget']) => {
    if (budget.min === budget.max) {
      return `¥${budget.min.toLocaleString()}`;
    }
    return `¥${budget.min.toLocaleString()} - ¥${budget.max.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return moment(dateString).fromNow();
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return '#ef4444';
      case 'high':
        return '#f59e0b';
      case 'medium':
        return '#6366f1';
      case 'low':
        return '#10b981';
      default:
        return '#64748b';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return '特急';
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
      default:
        return '普通';
    }
  };

  if (loading) {
    return (
      <MarketContainer>
        <LoadingContainer>
          <Spin size='large' />
        </LoadingContainer>
      </MarketContainer>
    );
  }

  return (
    <MarketContainer>
      {/* 页面头部 */}
      <div className='market-header'>
        <Title level={1} className='header-title'>
          专业服务市场
        </Title>
        <Paragraph className='header-subtitle'>
          发现优质项目，展示专业技能，连接需求与服务
        </Paragraph>
      </div>

      {/* 筛选器 */}
      <FilterContainer
        title={
          <Space>
            <FilterOutlined />
            智能筛选
          </Space>
        }
        extra={
          <Button icon={<ReloadOutlined />} onClick={() => handleFilterChange({})} type='text'>
            重置
          </Button>
        }
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder='搜索项目、技能...'
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder='选择类别'
              value={filters.categories}
              onChange={categories => handleFilterChange({ categories })}
              style={{ width: '100%' }}
              mode='multiple'
              allowClear
            >
              {Object.values(ORDER_CATEGORIES).map(cat => (
                <Select.Option key={cat.id} value={cat.id}>
                  <Space>
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder='排序方式'
              value={filters.sortBy}
              onChange={sortBy => handleFilterChange({ sortBy })}
              style={{ width: '100%' }}
            >
              <Select.Option value='newest'>最新发布</Select.Option>
              <Select.Option value='budget_high'>预算从高到低</Select.Option>
              <Select.Option value='budget_low'>预算从低到高</Select.Option>
              <Select.Option value='deadline'>截止日期</Select.Option>
            </Select>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Select placeholder='项目状态' style={{ width: '100%' }}>
              <Select.Option value='open'>进行中</Select.Option>
              <Select.Option value='urgent'>紧急项目</Select.Option>
              <Select.Option value='featured'>推荐项目</Select.Option>
            </Select>
          </Col>
        </Row>
      </FilterContainer>

      {/* 订单列表 */}
      {orders.length === 0 ? (
        <EmptyState>
          <div className='empty-icon'>
            <SearchOutlined />
          </div>
          <div className='empty-title'>暂无匹配的项目</div>
          <div className='empty-description'>尝试调整筛选条件或搜索关键词</div>
          <Button type='primary' onClick={() => handleFilterChange({})}>
            清除筛选条件
          </Button>
        </EmptyState>
      ) : (
        <Row gutter={[24, 24]}>
          {orders.map((order, index) => {
            const categoryTheme = getCategoryTheme(order.category.id);
            const featured = index < 3; // 前3个为推荐项目

            return (
              <Col key={order.id} xs={24} sm={24} md={12} lg={8} xl={8}>
                <OrderCard
                  categoryTheme={categoryTheme}
                  featured={featured}
                  onClick={() => handleOrderClick(order)}
                >
                  {featured && (
                    <div className='featured-badge'>
                      <Badge count='推荐' style={{ backgroundColor: '#6366f1' }} />
                    </div>
                  )}

                  {/* 项目标题和预算 */}
                  <OrderHeader>
                    <Title level={4} className='order-title'>
                      {order.title}
                    </Title>
                    <div className='budget-display'>{formatBudget(order.budget)}</div>
                  </OrderHeader>

                  {/* 分类标签 */}
                  <CategoryBadge categoryTheme={categoryTheme}>
                    {order.category.icon} {order.category.name}
                  </CategoryBadge>

                  {/* 项目描述 */}
                  <OrderDescription>{order.description}</OrderDescription>

                  {/* 项目元信息 */}
                  <OrderMeta>
                    <MetaRow>
                      <div className='meta-item'>
                        <ThunderboltOutlined
                          style={{ color: getUrgencyColor(order.timeline.urgency) }}
                        />
                        <Text style={{ color: getUrgencyColor(order.timeline.urgency) }}>
                          {getUrgencyText(order.timeline.urgency)}
                        </Text>
                      </div>
                      <div className='meta-item'>
                        <ClockCircleOutlined />
                        <Text>{formatDate(order.timeline.deadline || '')}</Text>
                      </div>
                      <div className='meta-item'>
                        <EnvironmentOutlined />
                        <Text>
                          {order.location.type === 'remote' ? '远程' : order.location.city}
                        </Text>
                      </div>
                    </MetaRow>

                    <MetaRow>
                      <div className='meta-item'>
                        <EyeOutlined />
                        <Text>{order.viewedCount} 浏览</Text>
                      </div>
                      <div className='meta-item'>
                        <MessageOutlined />
                        <Text>{order.applicationsCount} 申请</Text>
                      </div>
                    </MetaRow>
                  </OrderMeta>

                  {/* 发布者信息 */}
                  <PublisherInfo>
                    <Avatar
                      size={40}
                      src={order.publisher.avatar}
                      icon={<UserOutlined />}
                      className='publisher-avatar'
                    />
                    <div className='publisher-details'>
                      <div className='publisher-name'>
                        {order.publisher.name}
                        {order.publisher.isVerified && (
                          <Badge status='success' text='已认证' className='verified-badge' />
                        )}
                      </div>
                      <div className='publisher-rating'>
                        <StarOutlined />
                        <span>{order.publisher.rating}</span>
                        <span>({order.publisher.reviewsCount})</span>
                      </div>
                    </div>
                  </PublisherInfo>

                  {/* 技能标签 */}
                  {order.skills.length > 0 && (
                    <SkillsContainer>
                      {order.skills.map(skill => (
                        <Tag key={skill} className='skill-tag'>
                          {skill}
                        </Tag>
                      ))}
                    </SkillsContainer>
                  )}

                  {/* 操作按钮 */}
                  <ActionButtons>
                    <div className='left-actions'>
                      <Button
                        icon={<HeartOutlined />}
                        className='action-button secondary'
                        size='small'
                      >
                        收藏
                      </Button>
                      <Button
                        icon={<ShareAltOutlined />}
                        className='action-button secondary'
                        size='small'
                      >
                        分享
                      </Button>
                    </div>

                    <div className='right-actions'>
                      <Button
                        icon={<MessageOutlined />}
                        className='action-button secondary'
                        size='small'
                      >
                        私信
                      </Button>
                      <Button
                        type='primary'
                        className='action-button primary'
                        onClick={e => {
                          e.stopPropagation();
                          handleOrderClick(order);
                        }}
                      >
                        立即申请
                      </Button>
                    </div>
                  </ActionButtons>
                </OrderCard>
              </Col>
            );
          })}
        </Row>
      )}
    </MarketContainer>
  );
};

export default OrderMarketList;
