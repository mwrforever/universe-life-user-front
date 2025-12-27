/**
 * 任务管理页面 - 淘宝风格
 * 统一管理需求发布和接单任务
 */

import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ConfigProvider,
  Card,
  Tag,
  Spin,
  message,
  Button,
  Input,
  Avatar,
  Dropdown,
  Modal,
  Rate,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  SearchOutlined,
  SendOutlined,
  InboxOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  StarFilled,
  AuditOutlined,
  FileDoneOutlined,
  PayCircleOutlined,
  DollarOutlined,
  UserOutlined,
  MoreOutlined,
  EyeOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { getTheme } from '@/components/layout/TopNavBar';
import { useAuth } from '@/hooks/useAuth';
import { PageContainer, ContentWrapper, HeaderRow, TitleArea } from '@/components/common';

// 任务类型：发布方 or 接单方
type TaskRole = 'publish' | 'accept';

// 发布方状态
type PublishStatus = 'audit' | 'recruiting' | 'pending' | 'progress' | 'review' | 'payment' | 'dispute' | 'completed' | 'rejected' | 'rate';

// 接单方状态
type AcceptStatus = 'pending' | 'progress' | 'submit' | 'payment' | 'dispute' | 'completed' | 'rejected' | 'rate';

// 任务项接口
interface TaskItem {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  // 发布方信息
  publisher?: {
    id: string;
    name: string;
    avatar?: string;
    rating?: number;
  };
  // 接单方信息
  acceptor?: {
    id: string;
    name: string;
    avatar?: string;
    rating?: number;
  };
  deadline?: string;
  tags?: string[];
}

// 控制区域
const ControlsArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

// 搜索框
const SearchBox = styled(Input)`
  width: 260px;

  .ant-input {
    font-size: 13px;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// 角色切换
const RoleTabs = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

// 角色标签
const RoleTab = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: ${(p) => (p.active ? '#fff' : '#fafafa')};
  border: 1px solid ${(p) => (p.active ? '#ff6000' : '#f0f0f0')};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;

  &:hover {
    border-color: #ff6000;
  }

  .role-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: ${(p) => (p.active ? '#fff5f0' : '#f5f5f5')};
    display: flex;
    align-items: center;
    justify-content: center;

    .anticon {
      font-size: 20px;
      color: ${(p) => (p.active ? '#ff6000' : '#999')};
    }
  }

  .role-info {
    flex: 1;

    .role-title {
      font-size: 14px;
      font-weight: 600;
      color: ${(p) => (p.active ? '#ff6000' : '#333')};
    }

    .role-desc {
      font-size: 12px;
      color: #999;
      margin-top: 2px;
    }
  }

  .role-count {
    font-size: 20px;
    font-weight: 700;
    color: ${(p) => (p.active ? '#ff6000' : '#999')};
  }
`;

// 主卡片
const MainCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

  .ant-card-body {
    padding: 0;
  }
`;

// 状态筛选
const StatusTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 18px;
  border-bottom: 1px solid #f2f2f2;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

// 状态标签
const StatusTab = styled.button<{ active?: boolean }>`
  padding: 6px 12px;
  border-radius: 16px;
  border: 1px solid ${(p) => (p.active ? '#ff6000' : '#e8e8e8')};
  background: ${(p) => (p.active ? '#fff5f0' : '#fff')};
  color: ${(p) => (p.active ? '#ff6000' : '#666')};
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    border-color: #ff6000;
    color: #ff6000;
  }

  .anticon {
    font-size: 12px;
  }

  .count {
    background: ${(p) => (p.active ? '#ff6000' : '#f0f0f0')};
    color: ${(p) => (p.active ? '#fff' : '#999')};
    font-size: 11px;
    padding: 0 6px;
    border-radius: 10px;
    margin-left: 4px;
  }
`;

// 任务列表
const TaskList = styled.div`
  padding: 16px;
`;

// 任务卡片
const TaskCard = styled.div`
  background: #fff;
  border-radius: 10px;
  border: 1px solid #f2f2f2;
  padding: 16px;
  transition: all 0.2s ease;

  & + & {
    margin-top: 12px;
  }

  &:hover {
    border-color: #ffe1d6;
    box-shadow: 0 6px 18px rgba(255, 96, 0, 0.08);
    transform: translateY(-1px);
  }
`;

// 任务头部
const TaskHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
`;

// 任务标题
const TaskTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px;
  cursor: pointer;

  &:hover {
    color: #ff6000;
  }
`;

// 任务描述
const TaskDesc = styled.p`
  font-size: 13px;
  color: #666;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

// 任务元信息
const TaskMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin: 12px 0;
`;

// 用户信息
const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;

  .user-name {
    color: #333;
    font-weight: 500;
  }

  .user-rating {
    display: flex;
    align-items: center;
    gap: 2px;
    color: #ffb400;
  }
`;

// 任务底部
const TaskFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #f5f5f5;
`;

// 价格区域
const PriceArea = styled.div`
  .price {
    font-size: 20px;
    font-weight: 700;
    color: #ff6000;

    .unit {
      font-size: 13px;
      margin-right: 2px;
    }
  }

  .time {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
  }
`;

// 操作按钮
const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// 加载容器
const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 380px;
`;

// 未登录卡片
const NotLoggedInCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 56px 40px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const NotLoggedInIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
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
  background: #ff6000;
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
    background: #e85500;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(255, 96, 0, 0.34);
  }

  &:active {
    transform: translateY(0);
  }
`;

// 空状态
const EmptyWrapper = styled.div`
  padding: 60px 20px;
  text-align: center;

  .empty-icon {
    width: 120px;
    height: 120px;
    margin: 0 auto 20px;
    background: #fafafa;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    .anticon {
      font-size: 48px;
      color: #ddd;
    }
  }

  .empty-title {
    font-size: 15px;
    color: #999;
    margin-bottom: 16px;
  }
`;

// 发布方状态配置
const publishStatusConfig: Record<PublishStatus, { label: string; icon: React.ReactNode; color: string }> = {
  audit: { label: '待审核', icon: <AuditOutlined />, color: '#fa8c16' },
  recruiting: { label: '招募中', icon: <SendOutlined />, color: '#13c2c2' },
  pending: { label: '待审批', icon: <ClockCircleOutlined />, color: '#faad14' },
  progress: { label: '进行中', icon: <SyncOutlined />, color: '#1890ff' },
  review: { label: '待验收', icon: <FileDoneOutlined />, color: '#722ed1' },
  payment: { label: '待支付', icon: <PayCircleOutlined />, color: '#eb2f96' },
  dispute: { label: '争议中', icon: <ExclamationCircleOutlined />, color: '#ff4d4f' },
  completed: { label: '已完成', icon: <CheckCircleOutlined />, color: '#52c41a' },
  rejected: { label: '已拒绝', icon: <CloseCircleOutlined />, color: '#8c8c8c' },
  rate: { label: '待评价', icon: <StarFilled />, color: '#ffb400' },
};

// 接单方状态配置
const acceptStatusConfig: Record<AcceptStatus, { label: string; icon: React.ReactNode; color: string }> = {
  pending: { label: '待审批', icon: <ClockCircleOutlined />, color: '#faad14' },
  progress: { label: '进行中', icon: <SyncOutlined />, color: '#1890ff' },
  submit: { label: '待确认', icon: <FileDoneOutlined />, color: '#722ed1' },
  payment: { label: '待收款', icon: <DollarOutlined />, color: '#52c41a' },
  dispute: { label: '争议中', icon: <ExclamationCircleOutlined />, color: '#ff4d4f' },
  completed: { label: '已完成', icon: <CheckCircleOutlined />, color: '#52c41a' },
  rejected: { label: '已拒绝', icon: <CloseCircleOutlined />, color: '#8c8c8c' },
  rate: { label: '待评价', icon: <StarFilled />, color: '#ffb400' },
};

// 模拟数据
const mockPublishTasks: TaskItem[] = [
  {
    id: 'PT001',
    title: '【游戏代练】王者荣耀 星耀→王者 上分代练',
    description: '需要一位高手帮忙上分，要求安全可靠，有售后保障。账号安全第一，希望能在3天内完成。',
    category: '游戏代练',
    price: 299,
    status: 'recruiting',
    createdAt: '2025-12-10 15:30',
    updatedAt: '2025-12-12 10:00',
    acceptor: undefined,
    deadline: '2025-12-15',
    tags: ['王者荣耀', '上分', '急单'],
  },
  {
    id: 'PT002',
    title: '【设计服务】电商详情页设计 淘宝风格',
    description: '需要设计一套电商详情页，风格参考淘宝天猫，需要原创设计，提供源文件。',
    category: '设计服务',
    price: 599,
    status: 'progress',
    createdAt: '2025-12-08 10:20',
    updatedAt: '2025-12-11 14:30',
    acceptor: {
      id: 'U002',
      name: '设计师小王',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=designer',
      rating: 4.9,
    },
    deadline: '2025-12-20',
    tags: ['电商', '详情页', 'UI设计'],
  },
  {
    id: 'PT003',
    title: '【企业服务】商业计划书撰写',
    description: '需要撰写一份完整的商业计划书，用于天使轮融资路演使用。',
    category: '企业服务',
    price: 1299,
    status: 'review',
    createdAt: '2025-12-05 09:00',
    updatedAt: '2025-12-12 16:00',
    acceptor: {
      id: 'U003',
      name: '商业顾问张总',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=consultant',
      rating: 5.0,
    },
    deadline: '2025-12-13',
    tags: ['BP', '融资', '商业计划'],
  },
  {
    id: 'PT004',
    title: '【校园服务】毕业论文指导',
    description: '计算机专业毕业论文，需要选题和写作指导，希望老师有相关经验。',
    category: '校园服务',
    price: 399,
    status: 'payment',
    createdAt: '2025-12-01 14:00',
    updatedAt: '2025-12-12 18:00',
    acceptor: {
      id: 'U004',
      name: '李博士',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=professor',
      rating: 4.8,
    },
    tags: ['论文', '计算机', '指导'],
  },
];

const mockAcceptTasks: TaskItem[] = [
  {
    id: 'AT001',
    title: '【游戏代练】LOL 钻石→大师 代练单',
    description: '需要在一周内完成，要求安全上分，不能使用外挂。',
    category: '游戏代练',
    price: 499,
    status: 'progress',
    createdAt: '2025-12-09 11:00',
    updatedAt: '2025-12-12 09:30',
    publisher: {
      id: 'P001',
      name: '游戏玩家小明',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gamer',
      rating: 4.7,
    },
    deadline: '2025-12-16',
    tags: ['LOL', '代练', '上分'],
  },
  {
    id: 'AT002',
    title: '【设计服务】Logo设计 品牌VI',
    description: '新创公司需要设计Logo和基础VI，风格现代简约。',
    category: '设计服务',
    price: 899,
    status: 'submit',
    createdAt: '2025-12-06 16:00',
    updatedAt: '2025-12-12 11:00',
    publisher: {
      id: 'P002',
      name: '创业者李总',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=startup',
      rating: 4.9,
    },
    deadline: '2025-12-14',
    tags: ['Logo', 'VI', '品牌'],
  },
  {
    id: 'AT003',
    title: '【企业服务】财务报表整理',
    description: '年度财务报表整理和分析，需要有会计从业资格。',
    category: '企业服务',
    price: 799,
    status: 'payment',
    createdAt: '2025-12-03 10:00',
    updatedAt: '2025-12-12 15:00',
    publisher: {
      id: 'P003',
      name: '企业主王总',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=boss',
      rating: 5.0,
    },
    tags: ['财务', '报表', '年报'],
  },
];

// 状态数量统计
const getStatusCounts = (tasks: TaskItem[], statusList: string[]) => {
  const counts: Record<string, number> = { all: tasks.length };
  statusList.forEach((status) => {
    counts[status] = tasks.filter((t) => t.status === status).length;
  });
  return counts;
};

const TasksPage: React.FC = () => {
  const navigate = useNavigate();
  const { role = 'publish', status = 'all' } = useParams<{ role: TaskRole; status: string }>();
    const { user, isAuthenticated, isLoading, login, toTopNavBarUser } = useAuth();

  const [keyword, setKeyword] = useState('');
  const [rateModalVisible, setRateModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  // 当前角色
  const currentRole: TaskRole = role === 'accept' ? 'accept' : 'publish';

  // 获取当前状态配置
  const statusConfig = currentRole === 'publish' ? publishStatusConfig : acceptStatusConfig;
  const statusList = Object.keys(statusConfig);

  // 获取任务列表
  const tasks = currentRole === 'publish' ? mockPublishTasks : mockAcceptTasks;

  // 状态数量
  const statusCounts = useMemo(() => getStatusCounts(tasks, statusList), [tasks, statusList]);

  // 过滤任务
  const filteredTasks = useMemo(() => {
    let result = tasks;

    // 按状态筛选
    if (status !== 'all' && statusList.includes(status)) {
      result = result.filter((t) => t.status === status);
    }

    // 按关键词搜索
    const kw = keyword.trim();
    if (kw) {
      result = result.filter(
        (t) => t.title.includes(kw) || t.description.includes(kw) || t.category.includes(kw)
      );
    }

    return result;
  }, [tasks, status, keyword, statusList]);

  // 切换角色
  const handleRoleChange = (newRole: TaskRole) => {
    navigate(`/tasks/${newRole}/all`);
  };

  // 切换状态
  const handleStatusChange = (newStatus: string) => {
    navigate(`/tasks/${currentRole}/${newStatus}`);
  };

  // 获取操作按钮
  const getActionButtons = (task: TaskItem) => {
    const buttons: React.ReactNode[] = [];

    if (currentRole === 'publish') {
      switch (task.status) {
        case 'audit':
          buttons.push(
            <Button key="edit" size="small" onClick={() => message.info('编辑功能待接入')}>
              编辑
            </Button>
          );
          break;
        case 'recruiting':
          buttons.push(
            <Button key="view" size="small" onClick={() => message.info('查看申请人')}>
              查看申请
            </Button>
          );
          break;
        case 'pending':
          buttons.push(
            <Button key="approve" size="small" type="primary" style={{ background: '#ff6000' }} onClick={() => message.info('审批功能待接入')}>
              审批
            </Button>
          );
          break;
        case 'progress':
          buttons.push(
            <Button key="contact" size="small" icon={<MessageOutlined />} onClick={() => message.info('联系功能待接入')}>
              联系
            </Button>
          );
          break;
        case 'review':
          buttons.push(
            <Button key="accept" size="small" type="primary" style={{ background: '#52c41a' }} onClick={() => message.info('验收功能待接入')}>
              验收
            </Button>,
            <Button key="dispute" size="small" danger onClick={() => message.info('发起争议')}>
              有问题
            </Button>
          );
          break;
        case 'payment':
          buttons.push(
            <Button key="pay" size="small" type="primary" style={{ background: '#ff6000' }} onClick={() => message.info('支付功能待接入')}>
              去支付
            </Button>
          );
          break;
        case 'rate':
          buttons.push(
            <Button key="rate" size="small" type="primary" style={{ background: '#ffb400' }} onClick={() => { setSelectedTask(task); setRateModalVisible(true); }}>
              去评价
            </Button>
          );
          break;
      }
    } else {
      switch (task.status) {
        case 'pending':
          buttons.push(
            <Button key="cancel" size="small" onClick={() => message.info('取消申请')}>
              取消申请
            </Button>
          );
          break;
        case 'progress':
          buttons.push(
            <Button key="submit" size="small" type="primary" style={{ background: '#ff6000' }} onClick={() => message.info('提交成果')}>
              提交成果
            </Button>,
            <Button key="contact" size="small" icon={<MessageOutlined />} onClick={() => message.info('联系功能待接入')}>
              联系
            </Button>
          );
          break;
        case 'submit':
          buttons.push(
            <Button key="contact" size="small" icon={<MessageOutlined />} onClick={() => message.info('联系功能待接入')}>
              催促确认
            </Button>
          );
          break;
        case 'payment':
          buttons.push(
            <Button key="check" size="small" onClick={() => message.info('查看收款进度')}>
              查看进度
            </Button>
          );
          break;
        case 'rate':
          buttons.push(
            <Button key="rate" size="small" type="primary" style={{ background: '#ffb400' }} onClick={() => { setSelectedTask(task); setRateModalVisible(true); }}>
              去评价
            </Button>
          );
          break;
      }
    }

    // 通用按钮
    buttons.push(
      <Button key="detail" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/task/${task.id}`)}>
        详情
      </Button>
    );

    return buttons;
  };

  // 更多操作菜单
  const getMoreMenuItems = (_task: TaskItem): MenuProps['items'] => [
    { key: 'detail', label: '查看详情', onClick: () => navigate(`/task/${_task.id}`) },
    { key: 'contact', label: '联系对方', onClick: () => message.info('联系功能待接入') },
    { type: 'divider' },
    { key: 'report', label: '举报', danger: true, onClick: () => message.info('举报功能待接入') },
  ];

  // 渲染状态标签
  const renderStatusTag = (taskStatus: string) => {
    const config = statusConfig[taskStatus as keyof typeof statusConfig];
    if (!config) return null;
    return (
      <Tag color={config.color} style={{ marginInlineEnd: 0 }}>
        {config.icon} {config.label}
      </Tag>
    );
  };

  // 加载中
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

  // 未登录
  if (!isAuthenticated || !user) {
    return (
      <ConfigProvider theme={getTheme('bright')}>
        <PageContainer>
          <TopNavBar user={toTopNavBarUser()} onNavigate={(path) => navigate(path)} showHomeLink={true} />
          <ContentWrapper>
            <div style={{ width: '100%', maxWidth: 560, margin: '40px auto' }}>
              <NotLoggedInCard>
                <NotLoggedInIcon>
                  <SendOutlined />
                </NotLoggedInIcon>
                <NotLoggedInTitle>登录后管理任务</NotLoggedInTitle>
                <NotLoggedInDesc>登录后可查看和管理您发布的需求和接受的任务</NotLoggedInDesc>
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
          {/* 头部 */}
          <HeaderRow>
            <TitleArea>
              {currentRole === 'publish' ? (
                <SendOutlined style={{ color: '#ff6000', fontSize: 20 }} />
              ) : (
                <InboxOutlined style={{ color: '#ff6000', fontSize: 20 }} />
              )}
              <div>
                <div className="title">{currentRole === 'publish' ? '需求管理' : '接单管理'}</div>
                <div className="subtitle">
                  {currentRole === 'publish' ? '管理您发布的所有需求' : '管理您接受的所有任务'}
                </div>
              </div>
            </TitleArea>

            <ControlsArea>
              <SearchBox
                allowClear
                placeholder="搜索任务标题/描述"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </ControlsArea>
          </HeaderRow>

          {/* 角色切换 */}
          <RoleTabs>
            <RoleTab active={currentRole === 'publish'} onClick={() => handleRoleChange('publish')}>
              <div className="role-icon">
                <SendOutlined />
              </div>
              <div className="role-info">
                <div className="role-title">需求管理</div>
                <div className="role-desc">我发布的需求</div>
              </div>
              <div className="role-count">{mockPublishTasks.length}</div>
            </RoleTab>
            <RoleTab active={currentRole === 'accept'} onClick={() => handleRoleChange('accept')}>
              <div className="role-icon">
                <InboxOutlined />
              </div>
              <div className="role-info">
                <div className="role-title">接单管理</div>
                <div className="role-desc">我接受的任务</div>
              </div>
              <div className="role-count">{mockAcceptTasks.length}</div>
            </RoleTab>
          </RoleTabs>

          {/* 主卡片 */}
          <MainCard>
            {/* 状态筛选 */}
            <StatusTabs>
              <StatusTab active={status === 'all'} onClick={() => handleStatusChange('all')}>
                全部
                <span className="count">{statusCounts.all}</span>
              </StatusTab>
              {statusList.map((s) => {
                const config = statusConfig[s as keyof typeof statusConfig];
                return (
                  <StatusTab key={s} active={status === s} onClick={() => handleStatusChange(s)}>
                    {config.icon}
                    {config.label}
                    {(statusCounts[s] || 0) > 0 && <span className="count">{statusCounts[s]}</span>}
                  </StatusTab>
                );
              })}
            </StatusTabs>

            {/* 任务列表 */}
            <TaskList>
              {filteredTasks.length === 0 ? (
                <EmptyWrapper>
                  <div className="empty-icon">
                    {currentRole === 'publish' ? <SendOutlined /> : <InboxOutlined />}
                  </div>
                  <div className="empty-title">
                    {keyword ? '没有找到匹配的任务' : '暂无任务'}
                  </div>
                  {currentRole === 'publish' && !keyword && (
                    <Button
                      type="primary"
                      style={{ background: '#ff6000', borderColor: '#ff6000' }}
                      onClick={() => navigate('/create-order')}
                    >
                      发布需求
                    </Button>
                  )}
                </EmptyWrapper>
              ) : (
                filteredTasks.map((task) => (
                  <TaskCard key={task.id}>
                    <TaskHeader>
                      <div style={{ flex: 1 }}>
                        <TaskTitle onClick={() => navigate(`/task/${task.id}`)}>
                          {task.title}
                        </TaskTitle>
                        <TaskDesc>{task.description}</TaskDesc>
                      </div>
                      <Dropdown menu={{ items: getMoreMenuItems(task) }} trigger={['click']}>
                        <Button type="text" size="small" icon={<MoreOutlined />} />
                      </Dropdown>
                    </TaskHeader>

                    <TaskMeta>
                      {renderStatusTag(task.status)}
                      <Tag style={{ marginInlineEnd: 0 }}>{task.category}</Tag>
                      {task.tags?.slice(0, 2).map((tag) => (
                        <Tag key={tag} color="default" style={{ marginInlineEnd: 0 }}>
                          {tag}
                        </Tag>
                      ))}
                    </TaskMeta>

                    {/* 对方信息 */}
                    {currentRole === 'publish' && task.acceptor && (
                      <UserInfo>
                        <Avatar size={24} src={task.acceptor.avatar} icon={<UserOutlined />} />
                        <span>接单方：</span>
                        <span className="user-name">{task.acceptor.name}</span>
                        {task.acceptor.rating && (
                          <span className="user-rating">
                            <StarFilled /> {task.acceptor.rating}
                          </span>
                        )}
                      </UserInfo>
                    )}
                    {currentRole === 'accept' && task.publisher && (
                      <UserInfo>
                        <Avatar size={24} src={task.publisher.avatar} icon={<UserOutlined />} />
                        <span>发布方：</span>
                        <span className="user-name">{task.publisher.name}</span>
                        {task.publisher.rating && (
                          <span className="user-rating">
                            <StarFilled /> {task.publisher.rating}
                          </span>
                        )}
                      </UserInfo>
                    )}

                    <TaskFooter>
                      <PriceArea>
                        <div className="price">
                          <span className="unit">¥</span>
                          {task.price}
                        </div>
                        <div className="time">更新于 {task.updatedAt}</div>
                      </PriceArea>
                      <ActionButtons>{getActionButtons(task)}</ActionButtons>
                    </TaskFooter>
                  </TaskCard>
                ))
              )}
            </TaskList>
          </MainCard>
        </ContentWrapper>

        {/* 评价弹窗 */}
        <Modal
          title="评价服务"
          open={rateModalVisible}
          onCancel={() => setRateModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setRateModalVisible(false)}>
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              style={{ background: '#ff6000', borderColor: '#ff6000' }}
              onClick={() => {
                message.success('评价成功');
                setRateModalVisible(false);
              }}
            >
              提交评价
            </Button>,
          ]}
        >
          <div style={{ padding: '20px 0', textAlign: 'center' }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>
                {selectedTask?.title}
              </div>
              <div style={{ color: '#999', fontSize: 13 }}>
                {currentRole === 'publish' ? selectedTask?.acceptor?.name : selectedTask?.publisher?.name}
              </div>
            </div>
            <Rate defaultValue={5} style={{ fontSize: 32 }} />
            <div style={{ marginTop: 16 }}>
              <Input.TextArea
                rows={3}
                placeholder="请输入您的评价（选填）"
                maxLength={200}
                showCount
              />
            </div>
          </div>
        </Modal>
      </PageContainer>
    </ConfigProvider>
  );
};

export default TasksPage;
