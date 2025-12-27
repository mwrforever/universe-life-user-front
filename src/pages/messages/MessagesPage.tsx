/**
 * 消息中心页面 - 淘宝/微信风格
 * 支持私聊和群聊功能
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ConfigProvider,
  Input,
  Avatar,
  Badge,
  Spin,
  Tooltip,
  Dropdown,
  Empty,
  Modal,
  Form,
  Button,
  message,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  TeamOutlined,
  PlusOutlined,
  MoreOutlined,
  SendOutlined,
  CheckOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  PushpinOutlined,
  DeleteOutlined,
  BellOutlined,
  StopOutlined,
  StarOutlined,
  StarFilled,
  UsergroupAddOutlined,
  UserAddOutlined,
  GlobalOutlined,
  CopyOutlined,
  QrcodeOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { TopNavBar } from '@/components/layout/TopNavBar';
import ChatInput from '@/components/chat/ChatInput';
import { getTheme } from '@/components/layout/TopNavBar';
import { useAuth } from '@/hooks/useAuth';
import { PageContainer } from '@/components/common';

// 消息类型
type MessageType = 'text' | 'image' | 'file' | 'system' | 'task';

// 会话分类类型
type ConversationCategory = 'all' | 'public' | 'friend' | 'group';

// 会话类型
type ConversationType = 'public' | 'friend' | 'group' | 'system';

// 消息接口
interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: MessageType;
  timestamp: string;
  status: 'sending' | 'sent' | 'read' | 'failed';
  isMe?: boolean;
}

// 会话接口
interface Conversation {
  id: string;
  type: ConversationType;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isPinned?: boolean;
  isMuted?: boolean;
  isStarred?: boolean;
  // 私聊相关（公共/好友）
  userId?: string;
  userStatus?: 'online' | 'offline' | 'busy';
  // 群聊相关
  memberCount?: number;
  groupCode?: string; // 群聊唯一编码
  // 任务相关（公共会话）
  taskId?: string;
  taskTitle?: string;
}

// 消息主体
const MessageBody = styled.div`
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 16px 20px;
  display: flex;
  gap: 16px;
  height: calc(100vh - 60px);
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 12px;
    gap: 0;
  }
`;

// 左侧会话列表
const ConversationPanel = styled.div<{ isHidden?: boolean }>`
  width: 320px;
  background: #fff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    display: ${(p) => (p.isHidden ? 'none' : 'flex')};
    border-radius: 0;
  }
`;

// 会话头部
const ConversationHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f2f2f2;
`;

// 头部标题行
const HeaderTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  .title {
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
  }

  .actions {
    display: flex;
    gap: 8px;
  }
`;

// 图标按钮
const IconButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;

  &:hover {
    background: #fff5f0;
    color: #ff6000;
  }
`;

// 搜索框
const SearchBox = styled(Input)`
  border-radius: 20px;
  background: #f5f5f5;
  border: none;

  &:hover,
  &:focus {
    background: #f0f0f0;
  }

  .ant-input {
    background: transparent;
  }
`;

// 会话分类标签
const ConversationTabs = styled.div`
  display: flex;
  gap: 4px;
  padding: 0 16px 12px;
  border-bottom: 1px solid #f5f5f5;
`;

// 分类标签
const TabItem = styled.button<{ active?: boolean }>`
  padding: 6px 14px;
  border: none;
  border-radius: 16px;
  background: ${(p) => (p.active ? '#ff6000' : '#f5f5f5')};
  color: ${(p) => (p.active ? '#fff' : '#666')};
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(p) => (p.active ? '#e85500' : '#f0f0f0')};
  }
`;

// 会话列表
const ConversationList = styled.div`
  flex: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #e0e0e0;
    border-radius: 2px;
  }
`;

// 会话项
const ConversationItem = styled.div<{ active?: boolean; isPinned?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  background: ${(p) => (p.active ? '#fff5f0' : p.isPinned ? '#fafafa' : '#fff')};
  border-left: 3px solid ${(p) => (p.active ? '#ff6000' : 'transparent')};
  transition: all 0.15s ease;

  &:hover {
    background: ${(p) => (p.active ? '#fff5f0' : '#fafafa')};
  }
`;

// 会话头像
const ConversationAvatar = styled.div`
  position: relative;
  flex-shrink: 0;

  .online-dot {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 10px;
    height: 10px;
    background: #52c41a;
    border: 2px solid #fff;
    border-radius: 50%;
  }
`;

// 会话信息
const ConversationInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

// 会话名称行
const ConversationNameRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;

  .name {
    font-size: 14px;
    font-weight: 500;
    color: #1a1a1a;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .time {
    font-size: 11px;
    color: #999;
    flex-shrink: 0;
  }
`;

// 会话消息行
const ConversationMsgRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .msg {
    font-size: 12px;
    color: #999;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }

  .badge {
    flex-shrink: 0;
    margin-left: 8px;
  }
`;

// 右侧聊天区域
const ChatPanel = styled.div<{ isHidden?: boolean }>`
  flex: 1;
  background: #fff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    display: ${(p) => (p.isHidden ? 'none' : 'flex')};
    border-radius: 0;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
  }
`;

// 聊天头部
const ChatHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// 聊天标题
const ChatTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .back-btn {
    display: none;
    @media (max-width: 768px) {
      display: block;
    }
  }

  .info {
    .name {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
    }

    .status {
      font-size: 12px;
      color: #52c41a;
      display: flex;
      align-items: center;
      gap: 4px;

      &.offline {
        color: #999;
      }
    }

    .task-link {
      font-size: 12px;
      color: #ff6000;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

// 聊天操作
const ChatActions = styled.div`
  display: flex;
  gap: 8px;
`;

// 消息列表
const MessageList = styled.div`
  flex: 1;
  padding: 16px 20px;
  overflow-y: auto;
  background: #f9f9f9;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #e0e0e0;
    border-radius: 3px;
  }
`;

// 消息日期分隔
const MessageDateDivider = styled.div`
  text-align: center;
  margin: 16px 0;

  span {
    background: #e8e8e8;
    color: #999;
    font-size: 11px;
    padding: 4px 12px;
    border-radius: 10px;
  }
`;

// 消息气泡容器
const MessageBubbleWrapper = styled.div<{ isMe?: boolean }>`
  display: flex;
  justify-content: ${(p) => (p.isMe ? 'flex-end' : 'flex-start')};
  margin-bottom: 16px;
  gap: 10px;

  .avatar {
    flex-shrink: 0;
    order: ${(p) => (p.isMe ? 2 : 0)};
  }

  .content {
    max-width: 70%;
    order: 1;
  }
`;

// 消息发送者名称
const MessageSender = styled.div<{ isMe?: boolean }>`
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
  text-align: ${(p) => (p.isMe ? 'right' : 'left')};
`;

// 消息气泡
const MessageBubble = styled.div<{ isMe?: boolean; type?: MessageType }>`
  padding: 10px 14px;
  border-radius: ${(p) => (p.isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px')};
  background: ${(p) => {
    if (p.type === 'system') return '#f5f5f5';
    return p.isMe ? '#ff6000' : '#fff';
  }};
  color: ${(p) => {
    if (p.type === 'system') return '#999';
    return p.isMe ? '#fff' : '#333';
  }};
  font-size: 14px;
  line-height: 1.5;
  box-shadow: ${(p) => (p.type === 'system' ? 'none' : '0 1px 2px rgba(0,0,0,0.06)')};
  word-break: break-word;

  .task-card {
    background: ${(p) => (p.isMe ? 'rgba(255,255,255,0.15)' : '#f9f9f9')};
    border-radius: 8px;
    padding: 10px 12px;
    margin-top: 8px;

    .task-title {
      font-weight: 500;
      margin-bottom: 4px;
    }

    .task-price {
      color: ${(p) => (p.isMe ? '#ffe0cc' : '#ff6000')};
      font-weight: 600;
    }
  }
`;

// 消息状态
const MessageStatus = styled.div<{ isMe?: boolean }>`
  font-size: 11px;
  color: #999;
  margin-top: 4px;
  text-align: ${(p) => (p.isMe ? 'right' : 'left')};
  display: flex;
  align-items: center;
  justify-content: ${(p) => (p.isMe ? 'flex-end' : 'flex-start')};
  gap: 4px;

  .read {
    color: #52c41a;
  }
`;

// 空状态
const EmptyChat = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;

  .icon {
    font-size: 64px;
    color: #e0e0e0;
    margin-bottom: 16px;
  }

  .text {
    font-size: 14px;
  }
`;

// 未登录卡片
const NotLoggedInCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 56px 40px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  max-width: 400px;
  margin: 40px auto;
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
  }
`;

// 加载容器
const LoadingContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 模拟会话数据
const mockConversations: Conversation[] = [
  {
    id: 'c1',
    type: 'public',
    name: '设计师小王',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=designer',
    lastMessage: '好的，我已经完成了初稿，请您查看',
    lastMessageTime: '10:30',
    unreadCount: 2,
    isPinned: true,
    userStatus: 'online',
    taskId: 'T001',
    taskTitle: '电商详情页设计',
  },
  {
    id: 'c2',
    type: 'public',
    name: '游戏代练小李',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gamer',
    lastMessage: '今晚可以开始上分吗？',
    lastMessageTime: '昨天',
    unreadCount: 0,
    userStatus: 'offline',
    taskId: 'T002',
    taskTitle: '王者荣耀上分代练',
  },
  {
    id: 'c3',
    type: 'group',
    name: '项目交流群',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=group1',
    lastMessage: '张三: 大家好，项目进度如何？',
    lastMessageTime: '周一',
    unreadCount: 5,
    memberCount: 12,
    groupCode: 'PRJ2024001',
  },
  {
    id: 'c4',
    type: 'friend',
    name: '商业顾问张总',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=consultant',
    lastMessage: '商业计划书已发送至您的邮箱',
    lastMessageTime: '12/10',
    unreadCount: 0,
    userStatus: 'busy',
    isStarred: true,
  },
  {
    id: 'c5',
    type: 'system',
    name: '系统通知',
    lastMessage: '您的任务【电商详情页设计】已进入验收阶段',
    lastMessageTime: '12/09',
    unreadCount: 1,
  },
  {
    id: 'c6',
    type: 'group',
    name: '设计师交流群',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=group2',
    lastMessage: '新人: 有没有好的素材网站推荐？',
    lastMessageTime: '12/08',
    unreadCount: 0,
    memberCount: 56,
    groupCode: 'DSN2024002',
    isMuted: true,
  },
  {
    id: 'c7',
    type: 'friend',
    name: '前端开发小明',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=developer',
    lastMessage: '代码已经提交了',
    lastMessageTime: '12/07',
    unreadCount: 0,
    userStatus: 'online',
  },
  {
    id: 'c8',
    type: 'public',
    name: '王者代练工作室',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gaming',
    lastMessage: '您好，有什么可以帮您的？',
    lastMessageTime: '12/06',
    unreadCount: 0,
    userStatus: 'online',
    taskId: 'TASK001',
    taskTitle: '王者荣耀代练服务',
  },
];

// 模拟消息数据
const mockMessages: Record<string, Message[]> = {
  c1: [
    {
      id: 'm1',
      conversationId: 'c1',
      senderId: 'u1',
      senderName: '设计师小王',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=designer',
      content: '您好，我是设计师小王，很高兴接到您的订单！',
      type: 'text',
      timestamp: '10:00',
      status: 'read',
    },
    {
      id: 'm2',
      conversationId: 'c1',
      senderId: 'me',
      senderName: '我',
      content: '你好，请问大概多久可以完成初稿？',
      type: 'text',
      timestamp: '10:05',
      status: 'read',
      isMe: true,
    },
    {
      id: 'm3',
      conversationId: 'c1',
      senderId: 'u1',
      senderName: '设计师小王',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=designer',
      content: '预计3天内可以完成初稿，我会先出几个方案供您选择',
      type: 'text',
      timestamp: '10:08',
      status: 'read',
    },
    {
      id: 'm4',
      conversationId: 'c1',
      senderId: 'me',
      senderName: '我',
      content: '好的，麻烦你了',
      type: 'text',
      timestamp: '10:10',
      status: 'read',
      isMe: true,
    },
    {
      id: 'm5',
      conversationId: 'c1',
      senderId: 'system',
      senderName: '系统',
      content: '任务【电商详情页设计】已开始进行',
      type: 'system',
      timestamp: '10:15',
      status: 'read',
    },
    {
      id: 'm6',
      conversationId: 'c1',
      senderId: 'u1',
      senderName: '设计师小王',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=designer',
      content: '好的，我已经完成了初稿，请您查看',
      type: 'text',
      timestamp: '10:30',
      status: 'sent',
    },
  ],
};

const MessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, isLoading, login, toTopNavBarUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState<ConversationCategory>('all');
  const [createGroupModalVisible, setCreateGroupModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addModalType, setAddModalType] = useState<'friend' | 'group'>('friend');
  const [groupName, setGroupName] = useState('');
  const [addCode, setAddCode] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const messageListRef = useRef<HTMLDivElement>(null);

  // 从URL参数获取初始会话
  useEffect(() => {
    const conversationId = searchParams.get('id');
    if (conversationId) {
      const conversation = mockConversations.find((c) => c.id === conversationId);
      if (conversation) {
        setSelectedConversation(conversation);
      }
    }
  }, [searchParams]);

  // 加载消息
  useEffect(() => {
    if (selectedConversation) {
      setMessages(mockMessages[selectedConversation.id] || []);
      // 滚动到底部
      setTimeout(() => {
        if (messageListRef.current) {
          messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [selectedConversation]);

  // 过滤会话
  const filteredConversations = mockConversations.filter((c) => {
    if (activeTab === 'public' && c.type !== 'public') return false;
    if (activeTab === 'friend' && c.type !== 'friend') return false;
    if (activeTab === 'group' && c.type !== 'group') return false;
    if (searchKeyword && !c.name.includes(searchKeyword)) return false;
    return true;
  });

  // 创建群聊
  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      message.warning('请输入群聊名称');
      return;
    }
    const newGroupCode = `GRP${Date.now().toString(36).toUpperCase()}`;
    message.success(`群聊创建成功！群编码: ${newGroupCode}`);
    setCreateGroupModalVisible(false);
    setGroupName('');
  };

  // 添加好友/加入群聊
  const handleAddByCode = () => {
    if (!addCode.trim()) {
      message.warning('请输入编码');
      return;
    }
    if (addModalType === 'friend') {
      message.success('好友请求已发送');
    } else {
      message.success('已申请加入群聊');
    }
    setAddModalVisible(false);
    setAddCode('');
  };

  // 打开添加弹窗
  const openAddModal = (type: 'friend' | 'group') => {
    setAddModalType(type);
    setAddModalVisible(true);
  };

  // 会话更多操作
  const getConversationMenuItems = (conversation: Conversation): MenuProps['items'] => [
    {
      key: 'pin',
      label: conversation.isPinned ? '取消置顶' : '置顶会话',
      icon: <PushpinOutlined />,
    },
    {
      key: 'star',
      label: conversation.isStarred ? '取消标星' : '标星',
      icon: conversation.isStarred ? <StarFilled style={{ color: '#ffb400' }} /> : <StarOutlined />,
    },
    {
      key: 'mute',
      label: conversation.isMuted ? '取消免打扰' : '消息免打扰',
      icon: conversation.isMuted ? <BellOutlined /> : <StopOutlined />,
    },
    { type: 'divider' },
    {
      key: 'delete',
      label: '删除会话',
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];

  // 渲染会话头像
  const renderConversationAvatar = (conversation: Conversation) => {
    if (conversation.type === 'system') {
      return (
        <Avatar size={48} style={{ background: '#ff6000' }}>
          <BellOutlined />
        </Avatar>
      );
    }

    if (conversation.type === 'group') {
      return (
        <Avatar size={48} src={conversation.avatar} icon={<TeamOutlined />} />
      );
    }

    // public 和 friend 类型
    return (
      <ConversationAvatar>
        <Avatar size={48} src={conversation.avatar} icon={<UserOutlined />} />
        {conversation.userStatus === 'online' && <div className="online-dot" />}
      </ConversationAvatar>
    );
  };

  // 渲染消息状态
  const renderMessageStatus = (message: Message) => {
    if (!message.isMe) return null;

    switch (message.status) {
      case 'sending':
        return <ClockCircleOutlined />;
      case 'sent':
        return <CheckOutlined />;
      case 'read':
        return <CheckCircleFilled className="read" />;
      case 'failed':
        return <span style={{ color: '#ff4d4f' }}>发送失败</span>;
      default:
        return null;
    }
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
          <NotLoggedInCard>
            <NotLoggedInIcon>
              <SendOutlined />
            </NotLoggedInIcon>
            <NotLoggedInTitle>登录后查看消息</NotLoggedInTitle>
            <NotLoggedInDesc>登录后可与任务发布者或接单者进行沟通</NotLoggedInDesc>
            <LoginButton onClick={() => login()}>立即登录</LoginButton>
          </NotLoggedInCard>
        </PageContainer>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider theme={getTheme('bright')}>
      <PageContainer>
        <TopNavBar user={toTopNavBarUser()} onNavigate={(path) => navigate(path)} showHomeLink={true} />

        <MessageBody>
          {/* 左侧会话列表 */}
          <ConversationPanel isHidden={!!selectedConversation}>
            <ConversationHeader>
              <HeaderTitleRow>
                <span className="title">消息</span>
                <div className="actions">
                  <Tooltip title="创建群聊">
                    <IconButton onClick={() => setCreateGroupModalVisible(true)}>
                      <UsergroupAddOutlined />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="添加好友/群聊">
                    <Dropdown
                      menu={{
                        items: [
                          { key: 'friend', label: '添加好友', icon: <UserAddOutlined />, onClick: () => openAddModal('friend') },
                          { key: 'group', label: '加入群聊', icon: <TeamOutlined />, onClick: () => openAddModal('group') },
                        ],
                      }}
                      trigger={['click']}
                    >
                      <IconButton>
                        <PlusOutlined />
                      </IconButton>
                    </Dropdown>
                  </Tooltip>
                </div>
              </HeaderTitleRow>
              <SearchBox
                placeholder="搜索联系人或群聊"
                prefix={<SearchOutlined style={{ color: '#999' }} />}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                allowClear
              />
            </ConversationHeader>

            <ConversationTabs>
              <TabItem active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
                全部
              </TabItem>
              <TabItem active={activeTab === 'public'} onClick={() => setActiveTab('public')}>
                <GlobalOutlined /> 公共
              </TabItem>
              <TabItem active={activeTab === 'friend'} onClick={() => setActiveTab('friend')}>
                <UserOutlined /> 好友
              </TabItem>
              <TabItem active={activeTab === 'group'} onClick={() => setActiveTab('group')}>
                <TeamOutlined /> 群聊
              </TabItem>
            </ConversationTabs>

            <ConversationList>
              {filteredConversations.length === 0 ? (
                <Empty description="暂无会话" style={{ padding: 40 }} />
              ) : (
                filteredConversations
                  .sort((a, b) => (a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1))
                  .map((conversation) => (
                    <Dropdown
                      key={conversation.id}
                      menu={{ items: getConversationMenuItems(conversation) }}
                      trigger={['contextMenu']}
                    >
                      <ConversationItem
                        active={selectedConversation?.id === conversation.id}
                        isPinned={conversation.isPinned}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        {renderConversationAvatar(conversation)}

                        <ConversationInfo>
                          <ConversationNameRow>
                            <span className="name">
                              {conversation.name}
                              {conversation.type === 'group' && (
                                <span style={{ color: '#999', fontSize: 12, marginLeft: 4 }}>
                                  ({conversation.memberCount})
                                </span>
                              )}
                            </span>
                            <span className="time">{conversation.lastMessageTime}</span>
                          </ConversationNameRow>
                          <ConversationMsgRow>
                            <span className="msg">
                              {conversation.isMuted && (
                                <StopOutlined style={{ marginRight: 4, fontSize: 11 }} />
                              )}
                              {conversation.lastMessage}
                            </span>
                            {conversation.unreadCount > 0 && (
                              <Badge
                                count={conversation.unreadCount}
                                size="small"
                                className="badge"
                                style={{ backgroundColor: conversation.isMuted ? '#999' : '#ff6000' }}
                              />
                            )}
                          </ConversationMsgRow>
                        </ConversationInfo>
                      </ConversationItem>
                    </Dropdown>
                  ))
              )}
            </ConversationList>
          </ConversationPanel>

          {/* 右侧聊天区域 */}
          <ChatPanel isHidden={!selectedConversation}>
            {selectedConversation ? (
              <>
                <ChatHeader>
                  <ChatTitle>
                    <IconButton
                      className="back-btn"
                      onClick={() => setSelectedConversation(null)}
                    >
                      ←
                    </IconButton>
                    <Avatar
                      size={40}
                      src={selectedConversation.avatar}
                      icon={selectedConversation.type === 'group' ? <TeamOutlined /> : <UserOutlined />}
                    />
                    <div className="info">
                      <div className="name">{selectedConversation.name}</div>
                      {(selectedConversation.type === 'public' || selectedConversation.type === 'friend') && (
                        <div className={`status ${selectedConversation.userStatus === 'online' ? '' : 'offline'}`}>
                          {selectedConversation.userStatus === 'online' ? '在线' : '离线'}
                        </div>
                      )}
                      {selectedConversation.taskTitle && (
                        <div
                          className="task-link"
                          onClick={() => navigate(`/tasks/publish/all?taskId=${selectedConversation.taskId}`)}
                        >
                          关联任务: {selectedConversation.taskTitle}
                        </div>
                      )}
                    </div>
                  </ChatTitle>
                  <ChatActions>
                    <Tooltip title="更多操作">
                      <Dropdown menu={{ items: getConversationMenuItems(selectedConversation) }}>
                        <IconButton>
                          <MoreOutlined />
                        </IconButton>
                      </Dropdown>
                    </Tooltip>
                  </ChatActions>
                </ChatHeader>

                <MessageList ref={messageListRef}>
                  <MessageDateDivider>
                    <span>今天</span>
                  </MessageDateDivider>

                  {messages.map((message) => (
                    <MessageBubbleWrapper key={message.id} isMe={message.isMe}>
                      {!message.isMe && message.type !== 'system' && (
                        <Avatar
                          className="avatar"
                          size={36}
                          src={message.senderAvatar}
                          icon={<UserOutlined />}
                        />
                      )}
                      <div className="content">
                        {!message.isMe && message.type !== 'system' && selectedConversation.type === 'group' && (
                          <MessageSender>{message.senderName}</MessageSender>
                        )}
                        <MessageBubble isMe={message.isMe} type={message.type}>
                          {message.content}
                        </MessageBubble>
                        <MessageStatus isMe={message.isMe}>
                          <span>{message.timestamp}</span>
                          {renderMessageStatus(message)}
                        </MessageStatus>
                      </div>
                      {message.isMe && (
                        <Avatar
                          className="avatar"
                          size={36}
                          src={user.avatar}
                          icon={<UserOutlined />}
                        />
                      )}
                    </MessageBubbleWrapper>
                  ))}
                </MessageList>

                <ChatInput
                  onSend={(content, attachments) => {
                    // 发送文本消息
                    if (content) {
                      const newMessage: Message = {
                        id: `m${Date.now()}`,
                        conversationId: selectedConversation.id,
                        senderId: 'me',
                        senderName: '我',
                        content,
                        type: 'text',
                        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
                        status: 'sending',
                        isMe: true,
                      };
                      setMessages((prev) => [...prev, newMessage]);
                      // 模拟发送成功
                      setTimeout(() => {
                        setMessages((prev) =>
                          prev.map((m) => (m.id === newMessage.id ? { ...m, status: 'sent' } : m))
                        );
                      }, 500);
                    }
                    // 发送附件消息
                    attachments.forEach((attachment) => {
                      const attachmentMessage: Message = {
                        id: `m${Date.now()}-${attachment.id}`,
                        conversationId: selectedConversation.id,
                        senderId: 'me',
                        senderName: '我',
                        content: `[${attachment.type === 'image' ? '图片' : '文件'}] ${attachment.name}`,
                        type: attachment.type === 'image' ? 'image' : 'file',
                        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
                        status: 'sending',
                        isMe: true,
                      };
                      setMessages((prev) => [...prev, attachmentMessage]);
                      // 模拟上传成功
                      setTimeout(() => {
                        setMessages((prev) =>
                          prev.map((m) => (m.id === attachmentMessage.id ? { ...m, status: 'sent' } : m))
                        );
                      }, 1000);
                    });
                    // 滚动到底部
                    setTimeout(() => {
                      if (messageListRef.current) {
                        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
                      }
                    }, 100);
                  }}
                  placeholder="输入消息，支持拖拽或粘贴文件..."
                />
              </>
            ) : (
              <EmptyChat>
                <SendOutlined className="icon" />
                <div className="text">选择一个会话开始聊天</div>
              </EmptyChat>
            )}
          </ChatPanel>
        </MessageBody>

        {/* 创建群聊弹窗 */}
        <Modal
          title="创建群聊"
          open={createGroupModalVisible}
          onCancel={() => { setCreateGroupModalVisible(false); setGroupName(''); }}
          footer={[
            <Button key="cancel" onClick={() => { setCreateGroupModalVisible(false); setGroupName(''); }}>
              取消
            </Button>,
            <Button key="create" type="primary" style={{ background: '#ff6000' }} onClick={handleCreateGroup}>
              创建
            </Button>,
          ]}
        >
          <Form layout="vertical">
            <Form.Item label="群聊名称" required>
              <Input
                placeholder="请输入群聊名称"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                maxLength={20}
                showCount
              />
            </Form.Item>
            <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
              <QrcodeOutlined style={{ marginRight: 4 }} />
              创建后将生成唯一群编码，可分享给好友加入
            </div>
          </Form>
        </Modal>

        {/* 添加好友/加入群聊弹窗 */}
        <Modal
          title={addModalType === 'friend' ? '添加好友' : '加入群聊'}
          open={addModalVisible}
          onCancel={() => { setAddModalVisible(false); setAddCode(''); }}
          footer={[
            <Button key="cancel" onClick={() => { setAddModalVisible(false); setAddCode(''); }}>
              取消
            </Button>,
            <Button key="add" type="primary" style={{ background: '#ff6000' }} onClick={handleAddByCode}>
              {addModalType === 'friend' ? '添加' : '申请加入'}
            </Button>,
          ]}
        >
          <Form layout="vertical">
            <Form.Item 
              label={addModalType === 'friend' ? '好友用户ID' : '群聊编码'} 
              required
            >
              <Input
                placeholder={addModalType === 'friend' ? '请输入好友的用户ID' : '请输入群聊唯一编码'}
                value={addCode}
                onChange={(e) => setAddCode(e.target.value)}
                prefix={addModalType === 'friend' ? <UserAddOutlined /> : <CopyOutlined />}
              />
            </Form.Item>
            <div style={{ fontSize: 12, color: '#999' }}>
              {addModalType === 'friend' 
                ? '输入对方的用户ID发送好友请求'
                : '输入群聊唯一编码申请加入群聊'
              }
            </div>
          </Form>
        </Modal>
      </PageContainer>
    </ConfigProvider>
  );
};

export default MessagesPage;
