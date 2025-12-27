/**
 * 在线客服页面
 * 独立的客服聊天界面
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfigProvider, Button } from 'antd';
import {
  CustomerServiceOutlined,
  UserOutlined,
  ArrowLeftOutlined,
  PhoneOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { getTheme } from '@/components/layout/TopNavBar';
import { useAuth } from '@/hooks/useAuth';
import ChatInput from '@/components/chat/ChatInput';

// 页面容器
const PageContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
`;

// 聊天容器
const ChatContainer = styled.div`
  flex: 1;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 600px;
`;

// 聊天头部
const ChatHeader = styled.div`
  padding: 16px 24px;
  background: linear-gradient(135deg, #ff6000 0%, #ff8533 100%);
  color: #fff;
  display: flex;
  align-items: center;
  gap: 16px;

  .back-btn {
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 50%;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    transition: background 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }

  .avatar {
    width: 48px;
    height: 48px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }

  .info {
    flex: 1;

    .name {
      font-size: 16px;
      font-weight: 600;
    }

    .status {
      font-size: 13px;
      opacity: 0.9;
      margin-top: 2px;
    }
  }

  .actions {
    display: flex;
    gap: 8px;
  }

  .action-btn {
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 50%;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    transition: background 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

// 消息列表区域
const ChatMessageList = styled.div`
  flex: 1;
  padding: 20px 24px;
  overflow-y: auto;
  background: #f9f9f9;
  display: flex;
  flex-direction: column;
  gap: 20px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 3px;
  }
`;

// 消息项
const ChatMessageItem = styled.div<{ isMe?: boolean }>`
  display: flex;
  flex-direction: ${p => p.isMe ? 'row-reverse' : 'row'};
  gap: 12px;
  align-items: flex-start;

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${p => p.isMe ? '#ff6000' : '#fff'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: ${p => p.isMe ? '#fff' : '#ff6000'};
    flex-shrink: 0;
    border: 1px solid ${p => p.isMe ? '#ff6000' : '#e8e8e8'};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .content {
    max-width: 60%;
  }

  .bubble {
    padding: 12px 16px;
    background: ${p => p.isMe ? '#ff6000' : '#fff'};
    color: ${p => p.isMe ? '#fff' : '#333'};
    border-radius: ${p => p.isMe ? '16px 4px 16px 16px' : '4px 16px 16px 16px'};
    font-size: 14px;
    line-height: 1.6;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    white-space: pre-wrap;
  }

  .time {
    font-size: 11px;
    color: #999;
    margin-top: 6px;
    text-align: ${p => p.isMe ? 'right' : 'left'};
    padding: 0 4px;
  }
`;

// 快捷问题区域
const QuickQuestionsSection = styled.div`
  padding: 16px 24px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
`;

const QuickQuestionsTitle = styled.div`
  font-size: 13px;
  color: #999;
  margin-bottom: 12px;
`;

const QuickQuestionsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const QuickQuestionBtn = styled.button`
  padding: 8px 16px;
  background: #fff5f0;
  border: 1px solid #ffcdb8;
  border-radius: 20px;
  color: #ff6000;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #ff6000;
    color: #fff;
    border-color: #ff6000;
  }
`;

// 侧边栏
const Sidebar = styled.div`
  width: 280px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
  margin-left: 20px;
  height: fit-content;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const SidebarTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
`;

const HotQuestionItem = styled.div`
  padding: 10px 0;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    color: #ff6000;
  }

  .icon {
    color: #ff6000;
    font-size: 12px;
  }
`;

const ContactInfo = styled.div`
  margin-top: 20px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;

  .title {
    font-size: 13px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
  }

  .item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }

    .icon {
      color: #ff6000;
    }
  }
`;

// 布局容器
const ContentLayout = styled.div`
  display: flex;
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
`;

// 快捷问题数据
const quickQuestions = [
  '如何申请退款？',
  '订单查询',
  '支付问题',
  '联系人工客服',
  '修改订单信息',
  '查看物流进度',
];

// 热门问题数据
const hotQuestions = [
  '如何申请退款退货？',
  '订单支付失败怎么办？',
  '如何联系服务商？',
  '如何取消订单？',
  '账户安全设置',
  '如何修改收货地址？',
];

// 智能回复映射
const autoReplies: Record<string, string> = {
  '如何申请退款？': '您可以按照以下步骤申请退款：\n\n1. 进入"我的订单"页面\n2. 找到需要退款的订单\n3. 点击"申请退款"按钮\n4. 选择退款原因并提交\n\n平台将在1-3个工作日内审核，审核通过后款项将在3-7个工作日内退回原支付账户。',
  '订单查询': '您可以通过以下方式查询订单：\n\n1. 进入"我的订单"页面查看所有订单\n2. 使用订单号搜索特定订单\n3. 按订单状态筛选查看\n\n如有问题，请提供订单号，我们为您查询。',
  '支付问题': '常见支付问题解决方案：\n\n1. 支付失败：请检查网络连接和账户余额\n2. 重复扣款：系统会自动处理，多余款项3-5个工作日退回\n3. 支付超时：请重新下单支付\n\n如仍有问题，可转人工客服处理。',
  '联系人工客服': '正在为您转接人工客服，请稍候...\n\n人工客服工作时间：9:00-21:00\n非工作时间请留言，我们会在工作时间第一时间回复您。\n\n您也可以拨打客服热线：400-888-8888',
  '修改订单信息': '订单信息修改说明：\n\n1. 未支付订单：可直接取消重新下单\n2. 已支付未接单：联系客服协助修改\n3. 已接单/进行中：需与服务商协商\n\n建议下单前仔细核对信息。',
  '查看物流进度': '查看物流进度方法：\n\n1. 进入"我的订单"页面\n2. 点击对应订单查看详情\n3. 在订单详情页查看物流信息\n\n部分服务类订单可能无物流信息，请以订单状态为准。',
};

const CustomerServicePage: React.FC = () => {
  const navigate = useNavigate();
  const { toTopNavBarUser } = useAuth();

  const [chatMessages, setChatMessages] = useState<Array<{ id: string; content: string; isMe: boolean; time: string }>>([]);
  const chatListRef = useRef<HTMLDivElement>(null);

  // 滚动到聊天底部
  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // 初始化欢迎消息
  useEffect(() => {
    if (chatMessages.length === 0) {
      setChatMessages([{
        id: 'welcome',
        content: '您好！我是智能客服小助手，很高兴为您服务。\n\n您可以直接输入问题，或点击下方快捷问题快速咨询。如需人工服务，请点击"联系人工客服"。',
        isMe: false,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      }]);
    }
  }, []);

  // 发送消息
  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    
    // 添加用户消息
    setChatMessages(prev => [
      ...prev,
      { id: `user-${Date.now()}`, content, isMe: true, time },
    ]);

    // 模拟智能回复
    setTimeout(() => {
      const reply = autoReplies[content] || 
        '感谢您的咨询！您的问题已收到，我们会尽快为您处理。\n\n如需紧急帮助，请拨打客服热线：400-888-8888\n\n您也可以点击下方快捷问题获取常见问题解答。';
      
      setChatMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          content: reply,
          isMe: false,
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 800);
  };

  // 点击快捷问题
  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  // 点击热门问题
  const handleHotQuestion = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <ConfigProvider theme={getTheme('bright')}>
      <PageContainer>
        <TopNavBar user={toTopNavBarUser()} onNavigate={(path) => navigate(path)} showHomeLink={true} />

        <ContentLayout>
          <ChatContainer>
            {/* 聊天头部 */}
            <ChatHeader>
              <button className="back-btn" onClick={() => navigate(-1)}>
                <ArrowLeftOutlined />
              </button>
              <div className="avatar">
                <CustomerServiceOutlined />
              </div>
              <div className="info">
                <div className="name">在线客服</div>
                <div className="status">● 在线 · 7×24小时服务</div>
              </div>
              <div className="actions">
                <button className="action-btn" onClick={() => navigate('/help')}>
                  <QuestionCircleOutlined />
                </button>
              </div>
            </ChatHeader>

            {/* 消息列表 */}
            <ChatMessageList ref={chatListRef}>
              {chatMessages.map((msg) => (
                <ChatMessageItem key={msg.id} isMe={msg.isMe}>
                  <div className="avatar">
                    {msg.isMe ? <UserOutlined /> : <CustomerServiceOutlined />}
                  </div>
                  <div className="content">
                    <div className="bubble">{msg.content}</div>
                    <div className="time">{msg.time}</div>
                  </div>
                </ChatMessageItem>
              ))}
            </ChatMessageList>

            {/* 快捷问题 */}
            <QuickQuestionsSection>
              <QuickQuestionsTitle>快捷问题</QuickQuestionsTitle>
              <QuickQuestionsList>
                {quickQuestions.map((q) => (
                  <QuickQuestionBtn key={q} onClick={() => handleQuickQuestion(q)}>
                    {q}
                  </QuickQuestionBtn>
                ))}
              </QuickQuestionsList>
            </QuickQuestionsSection>

            {/* 输入区域 */}
            <ChatInput
              placeholder="请输入您的问题..."
              onSend={handleSendMessage}
            />
          </ChatContainer>

          {/* 侧边栏 */}
          <Sidebar>
            <SidebarTitle>热门问题</SidebarTitle>
            {hotQuestions.map((q) => (
              <HotQuestionItem key={q} onClick={() => handleHotQuestion(q)}>
                <QuestionCircleOutlined className="icon" />
                {q}
              </HotQuestionItem>
            ))}

            <ContactInfo>
              <div className="title">其他联系方式</div>
              <div className="item">
                <PhoneOutlined className="icon" />
                客服热线：400-888-8888
              </div>
              <div className="item">
                <CustomerServiceOutlined className="icon" />
                服务时间：9:00-21:00
              </div>
            </ContactInfo>

            <Button 
              type="primary" 
              block 
              style={{ marginTop: 16, background: '#ff6000', borderColor: '#ff6000' }}
              onClick={() => navigate('/help')}
            >
              返回帮助中心
            </Button>
          </Sidebar>
        </ContentLayout>
      </PageContainer>
    </ConfigProvider>
  );
};

export default CustomerServicePage;
