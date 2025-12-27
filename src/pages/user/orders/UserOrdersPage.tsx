/**
 * 我的项目（订单）页面 - 淘宝风格
 */

import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ConfigProvider, Card, Tag, Empty, Spin, message, Button, Segmented, Input } from 'antd';
import {
  UnorderedListOutlined,
  ClockCircleOutlined,
  FireOutlined,
  CheckCircleOutlined,
  StarOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { getTheme } from '@/components/layout/TopNavBar';
import { useAuth } from '@/hooks/useAuth';

type OrderStatus = 'pending' | 'processing' | 'shipping' | 'completed' | 'review';

type FilterStatus = 'all' | OrderStatus;

interface UserOrderItem {
  id: string;
  title: string;
  status: OrderStatus;
  category: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 18px 20px 28px;

  @media (max-width: 768px) {
    padding: 14px 12px 22px;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 12px 0 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const TitleArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  .title {
    font-size: 20px;
    font-weight: 700;
    color: #1a1a1a;
    line-height: 1.2;
  }

  .subtitle {
    font-size: 12px;
    color: #999;
    margin-top: 2px;
  }
`;

const ControlsArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const SearchBox = styled(Input)`
  width: 260px;

  .ant-input {
    font-size: 13px;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ListCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

  .ant-card-body {
    padding: 0;
  }
`;

const ListHeader = styled.div`
  padding: 16px 18px;
  border-bottom: 1px solid #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ListHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 600;

  .anticon {
    color: #ff6000;
  }
`;

const ListHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const OrdersList = styled.div`
  padding: 12px;
`;

const OrderItemCard = styled.div`
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #f2f2f2;
  padding: 14px 14px 12px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  transition: all 0.2s ease;

  & + & {
    margin-top: 10px;
  }

  &:hover {
    border-color: #ffe1d6;
    box-shadow: 0 6px 18px rgba(255, 96, 0, 0.08);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const OrderMain = styled.div`
  min-width: 0;

  .title {
    font-size: 15px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    font-size: 12px;
    color: #777;
  }
`;

const OrderSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;

  @media (max-width: 768px) {
    align-items: flex-start;
    flex-direction: row;
    justify-content: space-between;
  }
`;

const PriceText = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #ff6000;
  line-height: 1;

  .unit {
    font-size: 12px;
    font-weight: 600;
    margin-right: 2px;
  }
`;

const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 380px;
`;

const NotLoggedInCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 56px 40px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const NotLoggedInTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 10px;
`;

const NotLoggedInDesc = styled.div`
  font-size: 13px;
  color: #999;
  margin-bottom: 18px;
`;

const LoginButton = styled.button`
  background: linear-gradient(135deg, #ff6000 0%, #ff8c00 100%);
  color: #fff;
  border: none;
  padding: 10px 44px;
  border-radius: 22px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(255, 96, 0, 0.28);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(255, 96, 0, 0.34);
  }

  &:active {
    transform: translateY(0);
  }
`;

const statusLabel: Record<OrderStatus, string> = {
  pending: '待接单',
  processing: '进行中',
  shipping: '待确认',
  completed: '已完成',
  review: '待评价',
};

const statusTagColor: Record<OrderStatus, string> = {
  pending: 'orange',
  processing: 'gold',
  shipping: 'blue',
  completed: 'green',
  review: 'magenta',
};

const mockOrders: UserOrderItem[] = [
  {
    id: 'UO-20251212-0001',
    title: '【游戏】LOL 代练上分（钻石→大师）',
    status: 'processing',
    category: '游戏代练',
    price: 699,
    createdAt: '2025-12-10 19:12',
    updatedAt: '2025-12-12 10:08',
  },
  {
    id: 'UO-20251212-0002',
    title: '【设计】电商详情页 UI 设计（淘宝风）',
    status: 'review',
    category: '设计服务',
    price: 1280,
    createdAt: '2025-12-09 11:40',
    updatedAt: '2025-12-12 09:12',
  },
  {
    id: 'UO-20251212-0003',
    title: '【企业】PRD 需求梳理与评审（2小时）',
    status: 'completed',
    category: '企业服务',
    price: 499,
    createdAt: '2025-12-05 16:20',
    updatedAt: '2025-12-06 14:05',
  },
  {
    id: 'UO-20251212-0004',
    title: '【校园】论文排版+查重建议',
    status: 'pending',
    category: '校园生态',
    price: 199,
    createdAt: '2025-12-12 12:26',
    updatedAt: '2025-12-12 12:26',
  },
];

const statusSegmentOptions: { label: string; value: FilterStatus; icon?: React.ReactNode }[] = [
  { label: '全部', value: 'all' },
  { label: '待接单', value: 'pending', icon: <ClockCircleOutlined /> },
  { label: '进行中', value: 'processing', icon: <FireOutlined /> },
  { label: '待确认', value: 'shipping' },
  { label: '已完成', value: 'completed', icon: <CheckCircleOutlined /> },
  { label: '待评价', value: 'review', icon: <StarOutlined /> },
];

const UserOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated, isLoading, login, toTopNavBarUser } = useAuth();

  const initialStatus = (searchParams.get('status') as FilterStatus) || 'all';
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(initialStatus);
  const [keyword, setKeyword] = useState('');

  const filteredOrders = useMemo(() => {
    const byStatus = filterStatus === 'all'
      ? mockOrders
      : mockOrders.filter(o => o.status === filterStatus);

    const kw = keyword.trim();
    if (!kw) return byStatus;

    return byStatus.filter(o => o.title.includes(kw) || o.id.includes(kw) || o.category.includes(kw));
  }, [filterStatus, keyword]);

  const handleStatusChange = (value: FilterStatus) => {
    setFilterStatus(value);

    const next = new URLSearchParams(searchParams);
    if (value === 'all') {
      next.delete('status');
    } else {
      next.set('status', value);
    }
    setSearchParams(next, { replace: true });
  };

  const handleGoDetail = (orderId: string) => {
    message.info(`订单详情待接入：${orderId}`);
  };

  const handlePrimaryAction = (o: UserOrderItem) => {
    if (o.status === 'pending') {
      message.info('该订单处于待接单状态');
      return;
    }

    if (o.status === 'review') {
      message.info('评价功能待接入');
      return;
    }

    message.info('操作功能待接入');
  };

  if (isLoading) {
    return (
      <ConfigProvider theme={getTheme('bright')}>
        <PageContainer>
          <TopNavBar user={toTopNavBarUser()} onNavigate={(path) => navigate(path)} showHomeLink={true} />
          <LoadingContainer>
            <Spin size="large" />
          </LoadingContainer>
        </PageContainer>
      </ConfigProvider>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <ConfigProvider theme={getTheme('bright')}>
        <PageContainer>
          <TopNavBar user={toTopNavBarUser()} onNavigate={(path) => navigate(path)} showHomeLink={true} />
          <ContentWrapper>
            <div style={{ width: '100%', maxWidth: 560, margin: '40px auto' }}>
              <NotLoggedInCard>
                <NotLoggedInTitle>登录后查看“我的项目”</NotLoggedInTitle>
                <NotLoggedInDesc>你可以在这里管理订单进度、查看历史记录与待评价项目</NotLoggedInDesc>
                <LoginButton onClick={() => login()}>立即登录</LoginButton>
              </NotLoggedInCard>
            </div>
          </ContentWrapper>
        </PageContainer>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider theme={getTheme('bright')}>
      <PageContainer>
        <TopNavBar user={toTopNavBarUser()} onNavigate={(path) => navigate(path)} showHomeLink={true} />

        <ContentWrapper>
          <HeaderRow>
            <TitleArea>
              <UnorderedListOutlined style={{ color: '#ff6000', fontSize: 18 }} />
              <div>
                <div className="title">我的项目</div>
                <div className="subtitle">订单与项目进度一站式管理</div>
              </div>
            </TitleArea>

            <ControlsArea>
              <SearchBox
                allowClear
                placeholder="搜索订单ID/标题/分类"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </ControlsArea>
          </HeaderRow>

          <ListCard>
            <ListHeader>
              <ListHeaderLeft>
                <span>筛选</span>
              </ListHeaderLeft>
              <ListHeaderRight>
                <Segmented
                  options={statusSegmentOptions}
                  value={filterStatus}
                  onChange={(v) => handleStatusChange(v as FilterStatus)}
                />
              </ListHeaderRight>
            </ListHeader>

            <OrdersList>
              {filteredOrders.length === 0 ? (
                <div style={{ padding: '40px 0' }}>
                  <Empty description="暂无符合条件的项目" />
                </div>
              ) : (
                filteredOrders.map(o => (
                  <OrderItemCard key={o.id}>
                    <OrderMain>
                      <div className="title" title={o.title}>{o.title}</div>
                      <div className="meta">
                        <Tag color={statusTagColor[o.status]} style={{ marginInlineEnd: 0 }}>
                          {statusLabel[o.status]}
                        </Tag>
                        <Tag color="default" style={{ marginInlineEnd: 0 }}>{o.category}</Tag>
                        <span>订单号：{o.id}</span>
                        <span>更新：{o.updatedAt}</span>
                      </div>
                    </OrderMain>

                    <OrderSide>
                      <PriceText>
                        <span className="unit">¥</span>
                        {o.price}
                      </PriceText>
                      <ActionsRow>
                        <Button size="small" onClick={() => handleGoDetail(o.id)}>
                          查看
                        </Button>
                        <Button
                          size="small"
                          type="primary"
                          style={{ background: '#ff6000' }}
                          onClick={() => handlePrimaryAction(o)}
                        >
                          {o.status === 'review' ? '去评价' : '操作'}
                        </Button>
                      </ActionsRow>
                    </OrderSide>
                  </OrderItemCard>
                ))
              )}
            </OrdersList>
          </ListCard>
        </ContentWrapper>
      </PageContainer>
    </ConfigProvider>
  );
};

export default UserOrdersPage;
