/**
 * 任务/服务详情页 - 淘宝风格
 * 用于首页任务列表和服务大厅的详情展示
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ConfigProvider,
  Button,
  Tag,
  Avatar,
  Rate,
  Divider,
  message,
  Spin,
  Breadcrumb,
  Tabs,
  Modal,
  Input,
} from 'antd';
import {
  ArrowLeftOutlined,
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  StarFilled,
  UserOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  MessageOutlined,
  ShopOutlined,
  TagOutlined,
  FileTextOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  CustomerServiceOutlined,
  WarningOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { getTheme } from '@/components/layout/TopNavBar';
import { useAuth } from '@/hooks/useAuth';
import { getCategoryIcon, getCategoryColors } from '@/data/category-icons';
import { PageContainer, ContentWrapper } from '@/components/common';

const { TextArea } = Input;

// 详情数据接口
interface TaskDetail {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  rating: number;
  orderCount: number;
  viewCount: number;
  favoriteCount: number;
  tags: string[];
  provider: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    orderCount: number;
    responseTime: string;
    isVerified: boolean;
    joinDate: string;
  };
  images?: string[];
  requirements?: string[];
  deliverables?: string[];
  faqs?: { question: string; answer: string }[];
  reviews?: {
    id: string;
    user: string;
    avatar?: string;
    rating: number;
    content: string;
    date: string;
    reply?: string;
  }[];
  createdAt: string;
  deadline?: string;
  location?: string;
  status: 'available' | 'busy' | 'offline';
}

const BreadcrumbWrapper = styled.div`
  margin-bottom: 16px;
  
  .ant-breadcrumb {
    font-size: 13px;
  }
  
  .ant-breadcrumb a {
    color: #666;
    
    &:hover {
      color: #ff6000;
    }
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 20px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 992px) {
    order: -1;
  }
`;

// 主信息卡片
const MainCard = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #f2f2f2;
`;

const CategoryBadge = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: ${p => p.$color}10;
  color: ${p => p.$color};
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 12px;

  .anticon {
    font-size: 14px;
  }
`;

const TaskTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 16px;
  line-height: 1.4;
`;

const TaskMeta = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 13px;
  color: #999;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  .anticon {
    color: #bbb;
  }
`;

const PriceSection = styled.div`
  padding: 20px 24px;
  background: linear-gradient(135deg, #fff8f5 0%, #ffffff 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
`;

const PriceInfo = styled.div`
  .current-price {
    font-size: 32px;
    font-weight: 800;
    color: #ff6000;
    font-family: 'DIN', 'Roboto', sans-serif;

    .unit {
      font-size: 16px;
      margin-right: 2px;
    }

    .suffix {
      font-size: 14px;
      font-weight: 400;
      color: #999;
      margin-left: 4px;
    }
  }

  .original-price {
    font-size: 14px;
    color: #999;
    text-decoration: line-through;
    margin-top: 4px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PrimaryButton = styled(Button)`
  height: 44px;
  padding: 0 32px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 22px;
  background: linear-gradient(135deg, #ff6000 0%, #ff8c00 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(255, 96, 0, 0.3);

  &:hover {
    background: linear-gradient(135deg, #ff8c00 0%, #ff6000 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255, 96, 0, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SecondaryButton = styled(Button)`
  height: 44px;
  width: 44px;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e8e8e8;
  color: #666;

  &:hover {
    border-color: #ff6000;
    color: #ff6000;
  }

  &.favorited {
    border-color: #ff6000;
    color: #ff6000;
    background: #fff5f0;
  }
`;

const TagsSection = styled.div`
  padding: 16px 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const TaskTag = styled(Tag)`
  margin: 0;
  padding: 4px 12px;
  border-radius: 14px;
  font-size: 12px;
  border: none;
  background: #f5f5f5;
  color: #666;
`;

// 详情内容区域
const DetailSection = styled.div`
  padding: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  .anticon {
    color: #ff6000;
  }
`;

const DetailContent = styled.div`
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap;
`;

const RequirementList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 8px 0;
    font-size: 14px;
    color: #333;

    .anticon {
      color: #52c41a;
      margin-top: 4px;
    }
  }
`;

const DeliverableList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DeliverableItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 8px;
  font-size: 13px;
  color: #333;

  .anticon {
    color: #ff6000;
    font-size: 16px;
  }
`;

// 服务商卡片
const ProviderCard = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 20px;
`;

const ProviderHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const ProviderAvatar = styled(Avatar)`
  flex-shrink: 0;
`;

const ProviderInfo = styled.div`
  flex: 1;
  min-width: 0;

  .provider-name {
    font-size: 15px;
    font-weight: 600;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .provider-meta {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
  }
`;

const VerifiedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px 6px;
  background: #e6f7ff;
  color: #1890ff;
  font-size: 10px;
  border-radius: 4px;

  .anticon {
    font-size: 10px;
  }
`;

const ProviderStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 16px 0;
  border-top: 1px solid #f2f2f2;
  border-bottom: 1px solid #f2f2f2;
  margin: 16px 0;
`;

const StatItem = styled.div`
  text-align: center;

  .stat-value {
    font-size: 18px;
    font-weight: 700;
    color: #1a1a1a;
  }

  .stat-label {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
  }
`;

const ProviderActions = styled.div`
  display: flex;
  gap: 10px;

  button {
    flex: 1;
  }
`;

const ContactButton = styled(Button)`
  height: 40px;
  border-radius: 20px;
  font-weight: 500;

  &.primary {
    background: linear-gradient(135deg, #ff6000 0%, #ff8c00 100%);
    border: none;
    color: #fff;

    &:hover {
      background: linear-gradient(135deg, #ff8c00 0%, #ff6000 100%);
    }
  }
`;

// 服务保障卡片
const GuaranteeCard = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 20px;
`;

const GuaranteeTitle = styled.h4`
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  .anticon {
    color: #52c41a;
  }
`;

const GuaranteeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const GuaranteeItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;

  .anticon {
    color: #52c41a;
    margin-top: 2px;
  }

  .guarantee-text {
    color: #333;

    .highlight {
      color: #ff6000;
      font-weight: 500;
    }
  }
`;

// 评价区域
const ReviewsSection = styled.div`
  padding: 24px;
`;

const ReviewSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const RatingBig = styled.div`
  text-align: center;

  .rating-value {
    font-size: 36px;
    font-weight: 700;
    color: #ff6000;
    line-height: 1;
  }

  .rating-label {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
  }
`;

const RatingBreakdown = styled.div`
  flex: 1;
  font-size: 13px;
  color: #666;
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ReviewItem = styled.div`
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const ReviewerInfo = styled.div`
  flex: 1;

  .reviewer-name {
    font-size: 14px;
    font-weight: 500;
    color: #333;
  }

  .review-date {
    font-size: 12px;
    color: #999;
    margin-top: 2px;
  }
`;

const ReviewContent = styled.div`
  font-size: 14px;
  color: #333;
  line-height: 1.6;
`;

const ReviewReply = styled.div`
  margin-top: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 6px;
  border-left: 3px solid #ff6000;

  .reply-label {
    font-size: 12px;
    color: #ff6000;
    font-weight: 500;
    margin-bottom: 6px;
  }

  .reply-content {
    font-size: 13px;
    color: #666;
  }
`;

// FAQ区域
const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FAQItem = styled.div`
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;

  .faq-question {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 8px;

    .q-label {
      color: #ff6000;
      font-weight: 600;
    }
  }

  .faq-answer {
    font-size: 13px;
    color: #666;
    padding-left: 24px;
    line-height: 1.6;
  }
`;

// 加载状态
const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`;

// 底部固定操作栏（移动端）
const MobileBottomBar = styled.div`
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 12px 16px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
`;

const MobilePrice = styled.div`
  .price {
    font-size: 22px;
    font-weight: 700;
    color: #ff6000;

    .unit {
      font-size: 14px;
    }
  }
`;

const MobileActions = styled.div`
  display: flex;
  gap: 10px;
`;

// 模拟数据
const mockTaskDetail: TaskDetail = {
  id: 'TASK001',
  title: '【专业代练】王者荣耀 星耀→王者 安全上分 效率保障 售后无忧',
  description: '专业代练团队，7年游戏经验，安全稳定上分，不使用任何外挂辅助软件',
  content: `🎮 服务说明：
专业王者荣耀代练服务，由资深玩家团队提供。我们拥有7年以上的游戏经验，深谙各个段位的上分技巧和策略。

📋 服务流程：
1. 下单后10分钟内安排代练师接单
2. 添加微信沟通，确认账号信息
3. 开始代练，实时汇报进度
4. 完成后验收，确认无误好评

⏰ 完成时间：
- 星耀→王者：3-5天
- 根据账号情况可能有所浮动

🔒 安全保障：
- 全程手打，绝不使用任何外挂
- VPN保护，防止异地登录风险
- 完整售后，上分期间掉段包赔`,
  category: '游戏代练',
  categoryId: 'gaming',
  price: 299,
  originalPrice: 399,
  rating: 4.9,
  orderCount: 2847,
  viewCount: 12580,
  favoriteCount: 892,
  tags: ['效率高', '安全可靠', '售后保障', '急单可接'],
  provider: {
    id: 'P001',
    name: '王者代练工作室',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gaming',
    rating: 4.9,
    orderCount: 15680,
    responseTime: '5分钟内',
    isVerified: true,
    joinDate: '2020-03-15',
  },
  requirements: [
    '提供游戏账号和密码（建议使用扫码登录）',
    '代练期间请勿登录账号',
    '如有特殊英雄要求请提前说明',
    '确保账号安全状态正常',
  ],
  deliverables: [
    '段位提升至目标段位',
    '每日进度汇报',
    '代练完成截图证明',
    '7天售后保障',
  ],
  faqs: [
    {
      question: '代练期间账号安全吗？',
      answer: '我们全程使用VPN登录，模拟本地网络环境，且不使用任何第三方软件，确保账号安全。',
    },
    {
      question: '如果掉段了怎么办？',
      answer: '代练期间如果出现掉段，我们会免费补回，直到达到目标段位。',
    },
    {
      question: '可以指定英雄或位置吗？',
      answer: '可以的，下单时请备注您希望使用的英雄或位置，我们会尽量满足。',
    },
  ],
  reviews: [
    {
      id: 'R001',
      user: '游戏小白',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
      rating: 5,
      content: '非常专业！3天就从星耀五打到了王者，而且全程胜率很高，账号也很安全，下次还会找这家！',
      date: '2025-12-10',
      reply: '感谢您的认可！欢迎下次再来，祝您游戏愉快~',
    },
    {
      id: 'R002',
      user: '不想掉分的萌新',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
      rating: 5,
      content: '服务态度很好，有问必答，进度也每天都会汇报，很放心。',
      date: '2025-12-08',
    },
    {
      id: 'R003',
      user: '懒人玩家',
      rating: 4,
      content: '整体不错，就是时间比预计的多了一天，不过最后还是顺利上王者了。',
      date: '2025-12-05',
      reply: '感谢您的反馈，近期匹配机制有调整导致上分难度增加，我们会继续努力提高效率！',
    },
  ],
  createdAt: '2025-12-01',
  status: 'available',
};

// 分类名称映射
const getCategoryName = (categoryId: string): string => {
  const names: Record<string, string> = {
    gaming: '游戏服务',
    enterprise: '企业服务',
    campus: '校园生态',
    design: '设计创意',
  };
  return names[categoryId] || '其他服务';
};

const TaskDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toTopNavBarUser, isAuthenticated, login } = useAuth();

  const [loading, setLoading] = useState(true);
  const [taskDetail, setTaskDetail] = useState<TaskDetail | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState('detail');
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  useEffect(() => {
    // 模拟加载数据
    setLoading(true);
    setTimeout(() => {
      setTaskDetail(mockTaskDetail);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleFavorite = () => {
    if (!isAuthenticated) {
      message.info('请先登录');
      login();
      return;
    }
    setIsFavorited(!isFavorited);
    message.success(isFavorited ? '已取消收藏' : '收藏成功');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success('链接已复制到剪贴板');
  };

  const handleGrabOrder = () => {
    if (!isAuthenticated) {
      message.info('请先登录');
      login();
      return;
    }
    message.success('已提交接单申请，请等待服务商确认');
  };

  // 在线咨询 - 创建公共会话
  const handleConsult = () => {
    if (!isAuthenticated) {
      message.info('请先登录');
      login();
      return;
    }
    // 创建公共会话并跳转到消息页面
    message.success('已添加到公共会话');
    navigate(`/messages?type=public&providerId=${taskDetail?.provider.id}&taskId=${taskDetail?.id}`);
  };

  // 添加好友
  const handleAddFriend = () => {
    if (!isAuthenticated) {
      message.info('请先登录');
      login();
      return;
    }
    // 发送好友请求并跳转到消息页面
    message.success('好友请求已发送');
    navigate(`/messages?type=friend&providerId=${taskDetail?.provider.id}`);
  };

  const handleContact = () => {
    if (!isAuthenticated) {
      message.info('请先登录');
      login();
      return;
    }
    setContactModalVisible(true);
  };

  const handleSendMessage = () => {
    if (!contactMessage.trim()) {
      message.warning('请输入咨询内容');
      return;
    }
    message.success('消息已发送，服务商将尽快回复');
    setContactModalVisible(false);
    setContactMessage('');
  };

  if (loading) {
    return (
      <ConfigProvider theme={getTheme('bright')}>
        <PageContainer>
          <TopNavBar user={toTopNavBarUser()} onNavigate={(path) => navigate(path)} showHomeLink={true} />
          <LoadingWrapper>
            <Spin size="large" />
          </LoadingWrapper>
        </PageContainer>
      </ConfigProvider>
    );
  }

  if (!taskDetail) {
    return (
      <ConfigProvider theme={getTheme('bright')}>
        <PageContainer>
          <TopNavBar user={toTopNavBarUser()} onNavigate={(path) => navigate(path)} showHomeLink={true} />
          <ContentWrapper>
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <WarningOutlined style={{ fontSize: 48, color: '#999' }} />
              <div style={{ marginTop: 16, color: '#999' }}>任务不存在或已下架</div>
              <Button type="primary" onClick={() => navigate('/')} style={{ marginTop: 20 }}>
                返回首页
              </Button>
            </div>
          </ContentWrapper>
        </PageContainer>
      </ConfigProvider>
    );
  }

  const categoryColors = getCategoryColors(taskDetail.categoryId);
  const CategoryIcon = getCategoryIcon(taskDetail.categoryId);

  return (
    <ConfigProvider theme={getTheme('bright')}>
      <PageContainer>
        <TopNavBar user={toTopNavBarUser()} onNavigate={(path) => navigate(path)} showHomeLink={true} />

        <ContentWrapper>
          {/* 面包屑导航 */}
          <BreadcrumbWrapper>
            <Breadcrumb
              items={[
                { title: <><HomeOutlined /> 首页</>, href: '/', onClick: (e) => { e.preventDefault(); navigate('/'); } },
                { title: '服务大厅', href: '/services', onClick: (e) => { e.preventDefault(); navigate('/services'); } },
                { title: getCategoryName(taskDetail.categoryId) },
                { title: taskDetail.title.slice(0, 20) + '...' },
              ]}
            />
          </BreadcrumbWrapper>

          <MainContent>
            {/* 左侧主要内容 */}
            <LeftSection>
              <MainCard>
                <CardHeader>
                  {/* 返回按钮 */}
                  <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={handleBack}
                    style={{ marginBottom: 12, padding: '4px 0', color: '#666' }}
                  >
                    返回
                  </Button>

                  {/* 分类标签 */}
                  <CategoryBadge $color={categoryColors.primary}>
                    {CategoryIcon}
                    {getCategoryName(taskDetail.categoryId)}
                  </CategoryBadge>

                  {/* 标题 */}
                  <TaskTitle>{taskDetail.title}</TaskTitle>

                  {/* 元信息 */}
                  <TaskMeta>
                    <MetaItem>
                      <StarFilled style={{ color: '#faad14' }} />
                      <span style={{ color: '#333', fontWeight: 500 }}>{taskDetail.rating}</span>
                    </MetaItem>
                    <MetaItem>
                      <TeamOutlined />
                      <span>{taskDetail.orderCount}人已购买</span>
                    </MetaItem>
                    <MetaItem>
                      <ClockCircleOutlined />
                      <span>发布于 {taskDetail.createdAt}</span>
                    </MetaItem>
                  </TaskMeta>
                </CardHeader>

                {/* 价格区域 */}
                <PriceSection>
                  <PriceInfo>
                    <div className="current-price">
                      <span className="unit">¥</span>
                      {taskDetail.price}
                      <span className="suffix">起</span>
                    </div>
                    {taskDetail.originalPrice && (
                      <div className="original-price">¥{taskDetail.originalPrice}</div>
                    )}
                  </PriceInfo>
                  <ActionButtons>
                    <SecondaryButton
                      className={isFavorited ? 'favorited' : ''}
                      onClick={handleFavorite}
                      icon={isFavorited ? <HeartFilled /> : <HeartOutlined />}
                    />
                    <SecondaryButton onClick={handleShare} icon={<ShareAltOutlined />} />
                    <PrimaryButton type="primary" icon={<ShopOutlined />} onClick={handleGrabOrder}>
                      立即下单
                    </PrimaryButton>
                  </ActionButtons>
                </PriceSection>

                {/* 标签 */}
                <TagsSection>
                  {taskDetail.tags.map((tag, idx) => (
                    <TaskTag key={idx}>{tag}</TaskTag>
                  ))}
                </TagsSection>
              </MainCard>

              {/* 详情内容 */}
              <MainCard>
                <Tabs
                  activeKey={activeTab}
                  onChange={setActiveTab}
                  items={[
                    { key: 'detail', label: '服务详情' },
                    { key: 'reviews', label: `评价(${taskDetail.reviews?.length || 0})` },
                    { key: 'faq', label: '常见问题' },
                  ]}
                  style={{ padding: '0 24px' }}
                />

                {activeTab === 'detail' && (
                  <DetailSection>
                    <SectionTitle>
                      <FileTextOutlined />
                      服务说明
                    </SectionTitle>
                    <DetailContent>{taskDetail.content}</DetailContent>

                    <Divider />

                    {taskDetail.requirements && taskDetail.requirements.length > 0 && (
                      <>
                        <SectionTitle>
                          <TagOutlined />
                          服务要求
                        </SectionTitle>
                        <RequirementList>
                          {taskDetail.requirements.map((req, idx) => (
                            <li key={idx}>
                              <CheckCircleOutlined />
                              <span>{req}</span>
                            </li>
                          ))}
                        </RequirementList>
                        <Divider />
                      </>
                    )}

                    {taskDetail.deliverables && taskDetail.deliverables.length > 0 && (
                      <>
                        <SectionTitle>
                          <ThunderboltOutlined />
                          交付内容
                        </SectionTitle>
                        <DeliverableList>
                          {taskDetail.deliverables.map((item, idx) => (
                            <DeliverableItem key={idx}>
                              <CheckCircleOutlined />
                              {item}
                            </DeliverableItem>
                          ))}
                        </DeliverableList>
                      </>
                    )}
                  </DetailSection>
                )}

                {activeTab === 'reviews' && (
                  <ReviewsSection>
                    <ReviewSummary>
                      <RatingBig>
                        <div className="rating-value">{taskDetail.rating}</div>
                        <div className="rating-label">综合评分</div>
                      </RatingBig>
                      <RatingBreakdown>
                        <div style={{ marginBottom: 8 }}>
                          <Rate disabled value={taskDetail.rating} style={{ fontSize: 14 }} />
                        </div>
                        <div>共 {taskDetail.reviews?.length || 0} 条评价，{taskDetail.orderCount} 人已购买</div>
                      </RatingBreakdown>
                    </ReviewSummary>

                    <ReviewList>
                      {taskDetail.reviews?.map((review) => (
                        <ReviewItem key={review.id}>
                          <ReviewHeader>
                            <Avatar size={36} src={review.avatar} icon={<UserOutlined />} />
                            <ReviewerInfo>
                              <div className="reviewer-name">{review.user}</div>
                              <div className="review-date">{review.date}</div>
                            </ReviewerInfo>
                            <Rate disabled value={review.rating} style={{ fontSize: 12 }} />
                          </ReviewHeader>
                          <ReviewContent>{review.content}</ReviewContent>
                          {review.reply && (
                            <ReviewReply>
                              <div className="reply-label">商家回复</div>
                              <div className="reply-content">{review.reply}</div>
                            </ReviewReply>
                          )}
                        </ReviewItem>
                      ))}
                    </ReviewList>
                  </ReviewsSection>
                )}

                {activeTab === 'faq' && (
                  <DetailSection>
                    <FAQList>
                      {taskDetail.faqs?.map((faq, idx) => (
                        <FAQItem key={idx}>
                          <div className="faq-question">
                            <span className="q-label">Q</span>
                            {faq.question}
                          </div>
                          <div className="faq-answer">{faq.answer}</div>
                        </FAQItem>
                      ))}
                    </FAQList>
                  </DetailSection>
                )}
              </MainCard>
            </LeftSection>

            {/* 右侧边栏 */}
            <RightSection>
              {/* 服务商卡片 */}
              <ProviderCard>
                <ProviderHeader>
                  <ProviderAvatar
                    size={56}
                    src={taskDetail.provider.avatar}
                    icon={<UserOutlined />}
                  />
                  <ProviderInfo>
                    <div className="provider-name">
                      {taskDetail.provider.name}
                      {taskDetail.provider.isVerified && (
                        <VerifiedBadge>
                          <SafetyCertificateOutlined />
                          已认证
                        </VerifiedBadge>
                      )}
                    </div>
                    <div className="provider-meta">
                      入驻于 {taskDetail.provider.joinDate}
                    </div>
                  </ProviderInfo>
                </ProviderHeader>

                <ProviderStats>
                  <StatItem>
                    <div className="stat-value">{taskDetail.provider.rating}</div>
                    <div className="stat-label">评分</div>
                  </StatItem>
                  <StatItem>
                    <div className="stat-value">{taskDetail.provider.orderCount}</div>
                    <div className="stat-label">成交量</div>
                  </StatItem>
                  <StatItem>
                    <div className="stat-value">{taskDetail.provider.responseTime}</div>
                    <div className="stat-label">响应时间</div>
                  </StatItem>
                </ProviderStats>

                <ProviderActions>
                  <ContactButton icon={<MessageOutlined />} onClick={handleConsult}>
                    在线咨询
                  </ContactButton>
                  <ContactButton className="primary" icon={<CustomerServiceOutlined />} onClick={handleAddFriend}>
                    添加好友
                  </ContactButton>
                </ProviderActions>
              </ProviderCard>

              {/* 服务保障 */}
              <GuaranteeCard>
                <GuaranteeTitle>
                  <SafetyCertificateOutlined />
                  服务保障
                </GuaranteeTitle>
                <GuaranteeList>
                  <GuaranteeItem>
                    <CheckCircleOutlined />
                    <div className="guarantee-text">
                      <span className="highlight">平台担保</span> 资金安全有保障
                    </div>
                  </GuaranteeItem>
                  <GuaranteeItem>
                    <CheckCircleOutlined />
                    <div className="guarantee-text">
                      <span className="highlight">极速响应</span> {taskDetail.provider.responseTime}响应
                    </div>
                  </GuaranteeItem>
                  <GuaranteeItem>
                    <CheckCircleOutlined />
                    <div className="guarantee-text">
                      <span className="highlight">售后无忧</span> 7天内可申请退款
                    </div>
                  </GuaranteeItem>
                  <GuaranteeItem>
                    <CheckCircleOutlined />
                    <div className="guarantee-text">
                      <span className="highlight">隐私保护</span> 信息严格保密
                    </div>
                  </GuaranteeItem>
                </GuaranteeList>
              </GuaranteeCard>
            </RightSection>
          </MainContent>
        </ContentWrapper>

        {/* 移动端底部操作栏 */}
        <MobileBottomBar>
          <MobilePrice>
            <div className="price">
              <span className="unit">¥</span>
              {taskDetail.price}
            </div>
          </MobilePrice>
          <MobileActions>
            <Button icon={<MessageOutlined />} onClick={handleContact}>
              咨询
            </Button>
            <Button
              type="primary"
              icon={<ShopOutlined />}
              onClick={handleGrabOrder}
              style={{ background: '#ff6000', borderColor: '#ff6000' }}
            >
              立即下单
            </Button>
          </MobileActions>
        </MobileBottomBar>

        {/* 联系弹窗 */}
        <Modal
          title="在线咨询"
          open={contactModalVisible}
          onCancel={() => setContactModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setContactModalVisible(false)}>
              取消
            </Button>,
            <Button key="send" type="primary" style={{ background: '#ff6000' }} onClick={handleSendMessage}>
              发送
            </Button>,
          ]}
        >
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
              向 <strong>{taskDetail.provider.name}</strong> 发送咨询消息
            </div>
            <TextArea
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              placeholder="请输入您想咨询的内容..."
              rows={4}
              maxLength={500}
              showCount
            />
          </div>
        </Modal>
      </PageContainer>
    </ConfigProvider>
  );
};

export default TaskDetailPage;
