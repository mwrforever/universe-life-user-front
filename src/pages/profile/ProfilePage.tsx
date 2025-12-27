/**
 * 个人中心页面 - 淘宝风格
 * 现代化设计，简洁明亮，电商级体验
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfigProvider, Avatar, Card, Empty, Spin, message } from 'antd';
import {
  UserOutlined,
  EditOutlined,
  WalletOutlined,
  StarOutlined,
  UnorderedListOutlined,
  SettingOutlined,
  SafetyCertificateOutlined,
  RightOutlined,
  CrownOutlined,
  FireOutlined,
  TrophyOutlined,
  HeartOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { getTheme } from '@/components/layout/TopNavBar';
import { useAuth } from '@/hooks/useAuth';
import { PageContainer, ContentWrapper } from '@/components/common';

// 左侧边栏
const LeftSidebar = styled.div`
  width: 280px;
  flex-shrink: 0;

  @media (max-width: 992px) {
    width: 100%;
  }
`;

// 右侧内容区
const RightContent = styled.div`
  flex: 1;
  min-width: 0;
`;

// 用户信息卡片
const UserInfoCard = styled.div`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

// 用户头部背景
const UserHeader = styled.div`
  background: linear-gradient(135deg, #fff8f5 0%, #fff0eb 100%);
  padding: 24px;
  position: relative;
`;

// 用户信息行
const UserInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

// 用户头像容器
const AvatarWrapper = styled.div`
  position: relative;
`;

// 样式化头像
const StyledAvatar = styled(Avatar)`
  width: 72px;
  height: 72px;
  border: 3px solid #fff;
  box-shadow: 0 4px 12px rgba(255, 96, 0, 0.15);
`;

// VIP 徽章
const VipBadge = styled.div`
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: linear-gradient(135deg, #ff6000 0%, #ff8c00 100%);
  color: #fff;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(255, 96, 0, 0.3);
`;

// 用户名称区域
const UserNameArea = styled.div`
  flex: 1;
`;

// 用户名
const UserName = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
`;

// 用户 ID
const UserId = styled.div`
  font-size: 12px;
  color: #999;
`;

// 编辑按钮
const EditButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &:hover {
    background: #fff5f0;
    transform: scale(1.05);
  }

  .anticon {
    color: #ff6000;
    font-size: 14px;
  }
`;

// 用户统计
const UserStats = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 20px;
  border-bottom: 1px solid #f5f5f5;
`;

// 统计项
const StatItem = styled.div`
  text-align: center;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: background 0.2s ease;

  &:hover {
    background: #fff5f0;
  }
`;

// 统计数值
const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.2;
`;

// 统计标签
const StatLabel = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 4px;
`;

// 资产信息
const AssetSection = styled.div`
  padding: 16px 20px;
`;

// 资产项
const AssetItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    .asset-value {
      color: #ff6000;
    }
  }
`;

// 资产左侧
const AssetLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

// 资产图标
const AssetIcon = styled.div<{ color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${props => props.color}15;
  display: flex;
  align-items: center;
  justify-content: center;

  .anticon {
    font-size: 18px;
    color: ${props => props.color};
  }
`;

// 资产标签
const AssetLabel = styled.div`
  font-size: 14px;
  color: #333;
`;

// 资产右侧
const AssetRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// 资产值
const AssetValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  transition: color 0.2s ease;
`;

// 菜单卡片
const MenuCard = styled.div`
  background: #fff;
  border-radius: 12px;
  margin-top: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

// 菜单标题
const MenuTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  padding: 16px 20px 12px;
  border-bottom: 1px solid #f5f5f5;
`;

// 菜单列表
const MenuList = styled.div`
  padding: 8px 0;
`;

// 菜单项
const MenuItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #fff5f0;
  }
`;

// 菜单项左侧
const MenuItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .anticon {
    font-size: 18px;
    color: #666;
  }
`;

// 菜单项文字
const MenuItemText = styled.span`
  font-size: 14px;
  color: #333;
`;

// 菜单项右侧图标
const MenuItemArrow = styled(RightOutlined)`
  font-size: 12px;
  color: #ccc;
`;

// 订单卡片
const OrderCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  .ant-card-head {
    border-bottom: 1px solid #f5f5f5;
    padding: 0 20px;
    min-height: 52px;
  }

  .ant-card-head-title {
    font-size: 16px;
    font-weight: 600;
    padding: 16px 0;
  }

  .ant-card-extra {
    font-size: 13px;
    color: #666;
    cursor: pointer;

    &:hover {
      color: #ff6000;
    }
  }

  .ant-card-body {
    padding: 0;
  }
`;

// 订单状态网格
const OrderStatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  padding: 20px 0;

  @media (max-width: 576px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
`;

// 订单状态项
const OrderStatusItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 12px 8px;
  border-radius: 8px;
  transition: background 0.2s ease;

  &:hover {
    background: #fff5f0;

    .status-icon {
      color: #ff6000;
      transform: scale(1.1);
    }
  }
`;

// 状态图标
const StatusIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #666;
  transition: all 0.2s ease;
`;

// 状态文字
const StatusText = styled.span`
  font-size: 13px;
  color: #333;
`;

// 状态徽章
const StatusBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background: #ff4d4f;
  color: #fff;
  font-size: 10px;
  padding: 0 5px;
  border-radius: 10px;
  min-width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
`;

// 状态图标包装
const StatusIconWrapper = styled.div`
  position: relative;
`;

// 收藏卡片
const CollectionCard = styled(Card)`
  border-radius: 12px;
  margin-top: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  .ant-card-head {
    border-bottom: 1px solid #f5f5f5;
    padding: 0 20px;
    min-height: 52px;
  }

  .ant-card-head-title {
    font-size: 16px;
    font-weight: 600;
    padding: 16px 0;
  }

  .ant-card-body {
    padding: 20px;
  }
`;

// 收藏网格
const CollectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

// 收藏项
const CollectionItem = styled.div`
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #fff5f0;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 96, 0, 0.1);
  }
`;

// 收藏项图标
const CollectionIcon = styled.div`
  width: 48px;
  height: 48px;
  margin: 0 auto 12px;
  background: linear-gradient(135deg, #fff 0%, #f5f5f5 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #ff6000;
`;

// 收藏项标题
const CollectionTitle = styled.div`
  font-size: 14px;
  color: #333;
  font-weight: 500;
`;

// 收藏项描述
const CollectionDesc = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 4px;
`;

// 等级进度卡片
const LevelCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-top: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

// 等级头部
const LevelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

// 等级标题
const LevelTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;

  .anticon {
    color: #ff6000;
  }
`;

// 等级徽章
const LevelBadgeStyled = styled.div`
  background: linear-gradient(135deg, #ff6000 0%, #ff8c00 100%);
  color: #fff;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 600;
`;

// 进度条容器
const ProgressContainer = styled.div`
  margin-bottom: 12px;
`;

// 进度条背景
const ProgressBar = styled.div`
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
`;

// 进度条填充
const ProgressFill = styled.div<{ percent: number }>`
  height: 100%;
  width: ${props => props.percent}%;
  background: linear-gradient(90deg, #ff6000 0%, #ff8c00 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
`;

// 进度信息
const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
  margin-top: 8px;
`;

// 加载容器
const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`;

// 未登录提示
const NotLoggedInCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const NotLoggedInIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: #fff5f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  .anticon {
    font-size: 36px;
    color: #ff6000;
  }
`;

const NotLoggedInTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
`;

const NotLoggedInDesc = styled.div`
  font-size: 14px;
  color: #999;
  margin-bottom: 24px;
`;

const LoginButton = styled.button`
  background: linear-gradient(135deg, #ff6000 0%, #ff8c00 100%);
  color: #fff;
  border: none;
  padding: 12px 48px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(255, 96, 0, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255, 96, 0, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

// 模拟数据
const mockUserData = {
  orderCounts: {
    pending: 2,
    processing: 3,
    shipping: 1,
    completed: 15,
    review: 2,
  },
  collections: [
    { id: '1', title: '游戏代练', desc: '5个服务', icon: <FireOutlined /> },
    { id: '2', title: '设计服务', desc: '3个服务', icon: <StarOutlined /> },
    { id: '3', title: '企业咨询', desc: '2个服务', icon: <TeamOutlined /> },
    { id: '4', title: '校园帮助', desc: '8个服务', icon: <HeartOutlined /> },
  ],
};

/**
 * 个人中心页面组件
 */
const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, login, toTopNavBarUser } = useAuth();

  // 处理菜单点击
  const handleMenuClick = (path: string) => {
    if (!isAuthenticated) {
      message.info('请先登录');
      login();
      return;
    }
    navigate(path);
  };

  // 加载状态
  if (isLoading) {
    return (
      <ConfigProvider theme={getTheme('bright')}>
        <PageContainer>
          <TopNavBar
            user={toTopNavBarUser()}
            onNavigate={(path) => navigate(path)}
            showHomeLink={true}
          />
          <LoadingContainer>
            <Spin size="large" />
          </LoadingContainer>
        </PageContainer>
      </ConfigProvider>
    );
  }

  // 未登录状态
  if (!isAuthenticated || !user) {
    return (
      <ConfigProvider theme={getTheme('bright')}>
        <PageContainer>
          <TopNavBar
            user={toTopNavBarUser()}
            onNavigate={(path) => navigate(path)}
            showHomeLink={true}
          />
          <ContentWrapper>
            <div style={{ width: '100%', maxWidth: '500px', margin: '40px auto' }}>
              <NotLoggedInCard>
                <NotLoggedInIcon>
                  <UserOutlined />
                </NotLoggedInIcon>
                <NotLoggedInTitle>登录后查看个人中心</NotLoggedInTitle>
                <NotLoggedInDesc>
                  登录后可查看订单、收藏、钱包等信息
                </NotLoggedInDesc>
                <LoginButton onClick={() => login()}>
                  立即登录
                </LoginButton>
              </NotLoggedInCard>
            </div>
          </ContentWrapper>
        </PageContainer>
      </ConfigProvider>
    );
  }

  // 已登录状态 - 完整的个人中心
  return (
    <ConfigProvider theme={getTheme('bright')}>
      <PageContainer>
        <TopNavBar
          user={toTopNavBarUser()}
          onNavigate={(path) => navigate(path)}
          showHomeLink={true}
        />

        <ContentWrapper>
            {/* 左侧边栏 */}
            <LeftSidebar>
              {/* 用户信息卡片 */}
              <UserInfoCard>
                <UserHeader>
                  <UserInfoRow>
                    <AvatarWrapper>
                      <StyledAvatar
                        src={user.avatar}
                        icon={<UserOutlined />}
                      />
                      <VipBadge>
                        <CrownOutlined /> V{user.level || 1}
                      </VipBadge>
                    </AvatarWrapper>
                    <UserNameArea>
                      <UserName>{user.nickname || user.username}</UserName>
                      <UserId>ID: {user.id?.slice(0, 8)}...</UserId>
                    </UserNameArea>
                    <EditButton onClick={() => handleMenuClick('/settings/profile')}>
                      <EditOutlined />
                    </EditButton>
                  </UserInfoRow>
                </UserHeader>

                {/* 用户统计 */}
                <UserStats>
                  <StatItem onClick={() => handleMenuClick('/user/orders')}>
                    <StatValue>{mockUserData.orderCounts.completed}</StatValue>
                    <StatLabel>已完成</StatLabel>
                  </StatItem>
                  <StatItem onClick={() => handleMenuClick('/user/favorites')}>
                    <StatValue>18</StatValue>
                    <StatLabel>收藏</StatLabel>
                  </StatItem>
                  <StatItem onClick={() => handleMenuClick('/user/following')}>
                    <StatValue>6</StatValue>
                    <StatLabel>关注</StatLabel>
                  </StatItem>
                </UserStats>

                {/* 资产信息 */}
                <AssetSection>
                  <AssetItem onClick={() => handleMenuClick('/user/wallet')}>
                    <AssetLeft>
                      <AssetIcon color="#ff6000">
                        <WalletOutlined />
                      </AssetIcon>
                      <AssetLabel>我的钱包</AssetLabel>
                    </AssetLeft>
                    <AssetRight>
                      <AssetValue className="asset-value">
                        ¥{(user.balance || 0).toFixed(2)}
                      </AssetValue>
                      <RightOutlined style={{ fontSize: 12, color: '#ccc' }} />
                    </AssetRight>
                  </AssetItem>
                  <AssetItem onClick={() => handleMenuClick('/user/earnings')}>
                    <AssetLeft>
                      <AssetIcon color="#52c41a">
                        <TrophyOutlined />
                      </AssetIcon>
                      <AssetLabel>累计收益</AssetLabel>
                    </AssetLeft>
                    <AssetRight>
                      <AssetValue className="asset-value">
                        ¥{(user.totalEarned || 0).toFixed(2)}
                      </AssetValue>
                      <RightOutlined style={{ fontSize: 12, color: '#ccc' }} />
                    </AssetRight>
                  </AssetItem>
                </AssetSection>
              </UserInfoCard>

              {/* 等级进度 */}
              <LevelCard>
                <LevelHeader>
                  <LevelTitle>
                    <CrownOutlined />
                    成长等级
                  </LevelTitle>
                  <LevelBadgeStyled>Lv.{user.level || 1}</LevelBadgeStyled>
                </LevelHeader>
                <ProgressContainer>
                  <ProgressBar>
                    <ProgressFill percent={(user.experience || 0) % 100} />
                  </ProgressBar>
                  <ProgressInfo>
                    <span>经验值: {user.experience || 0}</span>
                    <span>距离下一级: {100 - ((user.experience || 0) % 100)}</span>
                  </ProgressInfo>
                </ProgressContainer>
              </LevelCard>

              {/* 功能菜单 */}
              <MenuCard>
                <MenuTitle>常用功能</MenuTitle>
                <MenuList>
                  <MenuItem onClick={() => handleMenuClick('/user/orders')}>
                    <MenuItemLeft>
                      <UnorderedListOutlined />
                      <MenuItemText>我的项目</MenuItemText>
                    </MenuItemLeft>
                    <MenuItemArrow />
                  </MenuItem>
                  <MenuItem onClick={() => handleMenuClick('/user/favorites')}>
                    <MenuItemLeft>
                      <StarOutlined />
                      <MenuItemText>我的收藏</MenuItemText>
                    </MenuItemLeft>
                    <MenuItemArrow />
                  </MenuItem>
                  <MenuItem onClick={() => handleMenuClick('/settings')}>
                    <MenuItemLeft>
                      <SettingOutlined />
                      <MenuItemText>账号设置</MenuItemText>
                    </MenuItemLeft>
                    <MenuItemArrow />
                  </MenuItem>
                  <MenuItem onClick={() => handleMenuClick('/settings/security')}>
                    <MenuItemLeft>
                      <SafetyCertificateOutlined />
                      <MenuItemText>安全中心</MenuItemText>
                    </MenuItemLeft>
                    <MenuItemArrow />
                  </MenuItem>
                </MenuList>
              </MenuCard>
            </LeftSidebar>

            {/* 右侧内容区 */}
            <RightContent>
              {/* 订单状态卡片 */}
              <OrderCard
                title="我的订单"
                extra={
                  <span onClick={() => handleMenuClick('/user/orders')}>
                    查看全部 <RightOutlined />
                  </span>
                }
              >
                <OrderStatusGrid>
                  <OrderStatusItem onClick={() => handleMenuClick('/user/orders?status=pending')}>
                    <StatusIconWrapper>
                      <StatusIcon className="status-icon">
                        <ClockCircleOutlined />
                      </StatusIcon>
                      {mockUserData.orderCounts.pending > 0 && (
                        <StatusBadge>{mockUserData.orderCounts.pending}</StatusBadge>
                      )}
                    </StatusIconWrapper>
                    <StatusText>待接单</StatusText>
                  </OrderStatusItem>
                  <OrderStatusItem onClick={() => handleMenuClick('/user/orders?status=processing')}>
                    <StatusIconWrapper>
                      <StatusIcon className="status-icon">
                        <FireOutlined />
                      </StatusIcon>
                      {mockUserData.orderCounts.processing > 0 && (
                        <StatusBadge>{mockUserData.orderCounts.processing}</StatusBadge>
                      )}
                    </StatusIconWrapper>
                    <StatusText>进行中</StatusText>
                  </OrderStatusItem>
                  <OrderStatusItem onClick={() => handleMenuClick('/user/orders?status=shipping')}>
                    <StatusIconWrapper>
                      <StatusIcon className="status-icon">
                        <SafetyCertificateOutlined />
                      </StatusIcon>
                      {mockUserData.orderCounts.shipping > 0 && (
                        <StatusBadge>{mockUserData.orderCounts.shipping}</StatusBadge>
                      )}
                    </StatusIconWrapper>
                    <StatusText>待确认</StatusText>
                  </OrderStatusItem>
                  <OrderStatusItem onClick={() => handleMenuClick('/user/orders?status=completed')}>
                    <StatusIconWrapper>
                      <StatusIcon className="status-icon">
                        <CheckCircleOutlined />
                      </StatusIcon>
                    </StatusIconWrapper>
                    <StatusText>已完成</StatusText>
                  </OrderStatusItem>
                  <OrderStatusItem onClick={() => handleMenuClick('/user/orders?status=review')}>
                    <StatusIconWrapper>
                      <StatusIcon className="status-icon">
                        <StarOutlined />
                      </StatusIcon>
                      {mockUserData.orderCounts.review > 0 && (
                        <StatusBadge>{mockUserData.orderCounts.review}</StatusBadge>
                      )}
                    </StatusIconWrapper>
                    <StatusText>待评价</StatusText>
                  </OrderStatusItem>
                </OrderStatusGrid>
              </OrderCard>

              {/* 我的收藏 */}
              <CollectionCard
                title="我的收藏"
                extra={
                  <span 
                    onClick={() => handleMenuClick('/user/favorites')}
                    style={{ cursor: 'pointer', fontSize: 13, color: '#666' }}
                  >
                    查看全部 <RightOutlined />
                  </span>
                }
              >
                <CollectionGrid>
                  {mockUserData.collections.map(item => (
                    <CollectionItem
                      key={item.id}
                      onClick={() => handleMenuClick(`/category/${item.id}`)}
                    >
                      <CollectionIcon>{item.icon}</CollectionIcon>
                      <CollectionTitle>{item.title}</CollectionTitle>
                      <CollectionDesc>{item.desc}</CollectionDesc>
                    </CollectionItem>
                  ))}
                </CollectionGrid>
                {mockUserData.collections.length === 0 && (
                  <Empty description="暂无收藏" />
                )}
              </CollectionCard>
            </RightContent>
        </ContentWrapper>
      </PageContainer>
    </ConfigProvider>
  );
};

export default ProfilePage;
