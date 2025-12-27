/**
 * 帮助中心页面 - 菜单导航式布局
 * 包含：官方客服、消息中心、意见反馈、举报中心
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfigProvider, Input, Button, Modal, Form, message, Upload, Empty, Tag } from 'antd';
import type { UploadFile } from 'antd';
import {
  CustomerServiceOutlined,
  MessageOutlined,
  FormOutlined,
  WarningOutlined,
  RightOutlined,
  PhoneOutlined,
  QuestionCircleOutlined,
  PlusOutlined,
  BellOutlined,
  TeamOutlined,
  CommentOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { getTheme } from '@/components/layout/TopNavBar';
import { useAuth } from '@/hooks/useAuth';
import { PageContainer } from '@/components/common';

const { TextArea } = Input;

// 菜单类型
type MenuKey = 'service' | 'message' | 'feedback' | 'report';

// 主内容布局
const ContentLayout = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;
  display: flex;
  gap: 20px;
  min-height: calc(100vh - 64px);

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// 侧边菜单
const Sidebar = styled.div`
  width: 240px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SidebarCard = styled.div`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const SidebarTitle = styled.div`
  padding: 20px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
`;

const MenuList = styled.div`
  padding: 8px 0;
`;

const MenuItem = styled.div<{ active?: boolean }>`
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${p => p.active ? '#fff5f0' : 'transparent'};
  color: ${p => p.active ? '#ff6000' : '#333'};
  font-weight: ${p => p.active ? '500' : '400'};
  border-left: 3px solid ${p => p.active ? '#ff6000' : 'transparent'};

  &:hover {
    background: ${p => p.active ? '#fff5f0' : '#fafafa'};
    color: #ff6000;
  }

  .icon {
    font-size: 18px;
  }

  .text {
    flex: 1;
    font-size: 14px;
  }

  .badge {
    background: #ff4d4f;
    color: #fff;
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 10px;
    min-width: 18px;
    text-align: center;
  }
`;

// 主内容区
const MainContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ContentCard = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
`;

const ContentHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .subtitle {
    font-size: 13px;
    color: #999;
    margin-top: 4px;
  }
`;

const ContentBody = styled.div`
  padding: 24px;
`;

// 官方客服模块样式
const ServiceSection = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ServiceTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '';
    width: 3px;
    height: 14px;
    background: #ff6000;
    border-radius: 2px;
  }
`;

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ServiceCard = styled.div`
  padding: 20px;
  background: #fafafa;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;

  &:hover {
    background: #fff5f0;
    border-color: #ffcdb8;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
  }

  .icon {
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, #ff6000 0%, #ff8533 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #fff;
  }

  .info {
    flex: 1;
  }

  .name {
    font-size: 15px;
    font-weight: 600;
    color: #333;
  }

  .status {
    font-size: 12px;
    color: #52c41a;
    margin-top: 2px;
  }

  .desc {
    font-size: 13px;
    color: #666;
    line-height: 1.5;
  }
`;

const ContactInfo = styled.div`
  padding: 16px 20px;
  background: #f9f9f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 16px;

  .icon {
    width: 40px;
    height: 40px;
    background: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #ff6000;
  }

  .info {
    flex: 1;
  }

  .label {
    font-size: 13px;
    color: #999;
  }

  .value {
    font-size: 15px;
    font-weight: 600;
    color: #333;
    margin-top: 2px;
  }
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
`;

const FAQItem = styled.div`
  padding: 14px 0;
  border-bottom: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  color: #333;
  font-size: 14px;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    color: #ff6000;
  }

  .question {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .icon {
    color: #ff6000;
    font-size: 14px;
  }
`;

// 消息中心样式
const MessageTabs = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 12px;
`;

const MessageTab = styled.div<{ active?: boolean }>`
  font-size: 14px;
  color: ${p => p.active ? '#ff6000' : '#666'};
  font-weight: ${p => p.active ? '600' : '400'};
  cursor: pointer;
  position: relative;
  padding-bottom: 12px;
  margin-bottom: -13px;
  display: flex;
  align-items: center;
  gap: 6px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${p => p.active ? '#ff6000' : 'transparent'};
    border-radius: 1px;
  }

  &:hover {
    color: #ff6000;
  }

  .badge {
    background: #ff4d4f;
    color: #fff;
    font-size: 10px;
    padding: 1px 5px;
    border-radius: 8px;
    min-width: 16px;
    text-align: center;
  }
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
`;

const MessageItem = styled.div`
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #ff6000;
    background: #fffbf8;
  }

  &:last-child {
    margin-bottom: 0;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .title {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .time {
    font-size: 12px;
    color: #999;
  }

  .content {
    font-size: 13px;
    color: #666;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .unread {
    width: 8px;
    height: 8px;
    background: #ff4d4f;
    border-radius: 50%;
  }
`;

// 反馈/举报表单样式
const FeedbackForm = styled.div`
  max-width: 600px;
`;

const FormSection = styled.div`
  margin-bottom: 24px;
`;

const FormLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  
  .required {
    color: #ff4d4f;
    margin-left: 4px;
  }
`;

const TypeSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const TypeOption = styled.div<{ active?: boolean }>`
  padding: 10px 20px;
  background: ${p => p.active ? '#fff5f0' : '#f5f5f5'};
  border: 1px solid ${p => p.active ? '#ff6000' : '#e8e8e8'};
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: ${p => p.active ? '#ff6000' : '#666'};
  transition: all 0.2s ease;

  &:hover {
    border-color: #ff6000;
    color: #ff6000;
  }
`;

const UploadArea = styled.div`
  .ant-upload-list {
    margin-top: 12px;
  }
`;

// 举报记录样式
const RecordList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RecordItem = styled.div`
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .type {
    font-size: 14px;
    font-weight: 500;
    color: #333;
  }

  .content {
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;
    line-height: 1.5;
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    color: #999;
  }
`;

// 菜单数据
const menuItems: { key: MenuKey; icon: React.ReactNode; label: string; badge?: number }[] = [
  { key: 'service', icon: <CustomerServiceOutlined />, label: '官方客服' },
  { key: 'message', icon: <MessageOutlined />, label: '消息中心', badge: 3 },
  { key: 'feedback', icon: <FormOutlined />, label: '意见反馈' },
  { key: 'report', icon: <WarningOutlined />, label: '举报中心' },
];

// 常见问题数据
const faqList = [
  '如何申请退款？',
  '订单多久可以完成？',
  '如何保障交易安全？',
  '如何成为认证服务商？',
  '平台服务费是多少？',
];

// 消息数据
const mockMessages = {
  system: [
    { id: '1', title: '系统升级通知', content: '平台将于今晚22:00-次日2:00进行系统维护升级，届时部分功能可能无法正常使用...', time: '今天 10:30', unread: true },
    { id: '2', title: '账户安全提醒', content: '检测到您的账户在新设备登录，如非本人操作请及时修改密码...', time: '昨天 15:20', unread: true },
    { id: '3', title: '订单完成通知', content: '您的订单 #20231201001 已完成，感谢您的使用...', time: '12-10 09:15', unread: false },
  ],
  interact: [
    { id: '4', title: '服务商回复了您', content: '关于您咨询的设计需求，我们已经准备好方案...', time: '今天 14:20', unread: true },
    { id: '5', title: '您有新的订单评价', content: '买家对您的服务给出了5星好评，继续保持...', time: '昨天 18:30', unread: false },
  ],
  notice: [
    { id: '6', title: '平台活动通知', content: '年终大促活动开启，发布任务立享9折优惠...', time: '12-08 10:00', unread: false },
    { id: '7', title: '规则更新通知', content: '平台服务协议已更新，请查看最新条款...', time: '12-05 16:00', unread: false },
  ],
};

// 反馈类型
const feedbackTypes = [
  { value: 'bug', label: '功能异常' },
  { value: 'suggestion', label: '功能建议' },
  { value: 'experience', label: '体验优化' },
  { value: 'complaint', label: '服务投诉' },
  { value: 'other', label: '其他问题' },
];

// 举报类型
const reportTypes = [
  { value: 'fraud', label: '欺诈行为' },
  { value: 'fake', label: '虚假信息' },
  { value: 'abuse', label: '辱骂骚扰' },
  { value: 'infringement', label: '侵权内容' },
  { value: 'illegal', label: '违法违规' },
  { value: 'other', label: '其他问题' },
];

// 举报记录模拟数据
const mockReports = [
  { id: '1', type: '欺诈行为', target: '用户 张***', content: '该用户存在虚假交易行为...', time: '2023-12-10 14:30', status: 'processing' },
  { id: '2', type: '虚假信息', target: '服务 设计服务***', content: '服务描述与实际不符...', time: '2023-12-08 10:20', status: 'resolved' },
];

const HelpCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const { toTopNavBarUser } = useAuth();

  const [activeMenu, setActiveMenu] = useState<MenuKey>('service');
  const [messageTab, setMessageTab] = useState<'system' | 'interact' | 'notice'>('system');
  const [feedbackType, setFeedbackType] = useState('');
  const [reportType, setReportType] = useState('');
  const [feedbackForm] = Form.useForm();
  const [reportForm] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [faqModalVisible, setFaqModalVisible] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState('');

  // 处理菜单点击
  const handleMenuClick = (key: MenuKey) => {
    setActiveMenu(key);
  };

  // 提交反馈
  const handleSubmitFeedback = () => {
    if (!feedbackType) {
      message.warning('请选择反馈类型');
      return;
    }
    feedbackForm.validateFields().then(values => {
      console.log('反馈提交:', { type: feedbackType, ...values, files: fileList });
      message.success('感谢您的反馈，我们会认真处理！');
      setFeedbackType('');
      feedbackForm.resetFields();
      setFileList([]);
    });
  };

  // 提交举报
  const handleSubmitReport = () => {
    if (!reportType) {
      message.warning('请选择举报类型');
      return;
    }
    reportForm.validateFields().then(values => {
      console.log('举报提交:', { type: reportType, ...values, files: fileList });
      message.success('举报已提交，我们会尽快核实处理！');
      setReportType('');
      reportForm.resetFields();
      setFileList([]);
    });
  };

  // 跳转在线客服
  const handleGoToService = () => {
    navigate('/help/service');
  };

  // 跳转消息模块
  const handleGoToMessages = () => {
    navigate('/messages');
  };

  // FAQ答案
  const faqAnswers: Record<string, string> = {
    '如何申请退款？': '在"我的订单"中找到对应订单，点击"申请退款"按钮，选择退款原因并提交申请。平台将在1-3个工作日内审核，审核通过后款项将在3-7个工作日内退回原支付账户。',
    '订单多久可以完成？': '订单完成时间取决于具体服务类型和服务商，一般在下单时会显示预计完成时间。您可以在订单详情页查看进度。',
    '如何保障交易安全？': '平台采用担保交易模式，您支付的款项由平台托管。只有在您确认验收后，款项才会打给服务商。',
    '如何成为认证服务商？': '点击"我要接单"进行服务商认证，需要提交身份信息、技能证明等材料。审核通过后即可在平台接单。',
    '平台服务费是多少？': '平台向服务商收取一定比例的技术服务费，买家无需支付额外费用。具体费率根据服务类目有所不同。',
  };

  // 渲染官方客服内容
  const renderServiceContent = () => (
    <>
      <ServiceSection>
        <ServiceTitle>在线服务</ServiceTitle>
        <ServiceGrid>
          <ServiceCard onClick={handleGoToService}>
            <div className="header">
              <div className="icon"><CustomerServiceOutlined /></div>
              <div className="info">
                <div className="name">智能客服</div>
                <div className="status">● 在线</div>
              </div>
            </div>
            <div className="desc">7×24小时智能服务，快速解答常见问题</div>
          </ServiceCard>
          <ServiceCard onClick={handleGoToService}>
            <div className="header">
              <div className="icon"><UserOutlined /></div>
              <div className="info">
                <div className="name">人工客服</div>
                <div className="status">● 在线 (9:00-21:00)</div>
              </div>
            </div>
            <div className="desc">专业客服一对一服务，解决复杂问题</div>
          </ServiceCard>
        </ServiceGrid>
      </ServiceSection>

      <ServiceSection>
        <ServiceTitle>联系方式</ServiceTitle>
        <ContactInfo>
          <div className="icon"><PhoneOutlined /></div>
          <div className="info">
            <div className="label">客服热线</div>
            <div className="value">400-888-8888</div>
          </div>
          <Button type="primary" style={{ background: '#ff6000', borderColor: '#ff6000' }}>
            拨打电话
          </Button>
        </ContactInfo>
      </ServiceSection>

      <ServiceSection>
        <ServiceTitle>常见问题</ServiceTitle>
        <FAQList>
          {faqList.map((q, index) => (
            <FAQItem key={index} onClick={() => { setSelectedFaq(q); setFaqModalVisible(true); }}>
              <span className="question">
                <QuestionCircleOutlined className="icon" />
                {q}
              </span>
              <RightOutlined style={{ fontSize: 12, color: '#999' }} />
            </FAQItem>
          ))}
        </FAQList>
      </ServiceSection>
    </>
  );

  // 渲染消息中心内容
  const renderMessageContent = () => (
    <>
      <MessageTabs>
        <MessageTab active={messageTab === 'system'} onClick={() => setMessageTab('system')}>
          <BellOutlined /> 系统通知
          {mockMessages.system.filter(m => m.unread).length > 0 && (
            <span className="badge">{mockMessages.system.filter(m => m.unread).length}</span>
          )}
        </MessageTab>
        <MessageTab active={messageTab === 'interact'} onClick={() => setMessageTab('interact')}>
          <CommentOutlined /> 互动消息
          {mockMessages.interact.filter(m => m.unread).length > 0 && (
            <span className="badge">{mockMessages.interact.filter(m => m.unread).length}</span>
          )}
        </MessageTab>
        <MessageTab active={messageTab === 'notice'} onClick={() => setMessageTab('notice')}>
          <TeamOutlined /> 平台公告
        </MessageTab>
      </MessageTabs>

      <MessageList>
        {mockMessages[messageTab].length > 0 ? (
          mockMessages[messageTab].map(msg => (
            <MessageItem key={msg.id} onClick={handleGoToMessages}>
              <div className="header">
                <div className="title">
                  {msg.unread && <span className="unread" />}
                  {msg.title}
                </div>
                <div className="time">{msg.time}</div>
              </div>
              <div className="content">{msg.content}</div>
            </MessageItem>
          ))
        ) : (
          <Empty description="暂无消息" />
        )}
      </MessageList>

      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <Button type="link" onClick={handleGoToMessages}>
          查看全部消息 <RightOutlined />
        </Button>
      </div>
    </>
  );

  // 渲染意见反馈内容
  const renderFeedbackContent = () => (
    <FeedbackForm>
      <FormSection>
        <FormLabel>反馈类型<span className="required">*</span></FormLabel>
        <TypeSelector>
          {feedbackTypes.map(type => (
            <TypeOption
              key={type.value}
              active={feedbackType === type.value}
              onClick={() => setFeedbackType(type.value)}
            >
              {type.label}
            </TypeOption>
          ))}
        </TypeSelector>
      </FormSection>

      <Form form={feedbackForm} layout="vertical">
        <Form.Item name="content" label="反馈内容" rules={[{ required: true, message: '请输入反馈内容' }]}>
          <TextArea rows={5} placeholder="请详细描述您遇到的问题或建议（最多500字）" maxLength={500} showCount />
        </Form.Item>

        <Form.Item label="上传截图（选填）">
          <UploadArea>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              maxCount={5}
            >
              {fileList.length < 5 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8, fontSize: 12 }}>上传图片</div>
                </div>
              )}
            </Upload>
          </UploadArea>
        </Form.Item>

        <Form.Item name="contact" label="联系方式（选填）">
          <Input placeholder="方便我们与您联系" />
        </Form.Item>

        <Button 
          type="primary" 
          size="large"
          style={{ background: '#ff6000', borderColor: '#ff6000' }}
          onClick={handleSubmitFeedback}
        >
          提交反馈
        </Button>
      </Form>
    </FeedbackForm>
  );

  // 渲染举报中心内容
  const renderReportContent = () => (
    <>
      <FeedbackForm>
        <FormSection>
          <FormLabel>举报类型<span className="required">*</span></FormLabel>
          <TypeSelector>
            {reportTypes.map(type => (
              <TypeOption
                key={type.value}
                active={reportType === type.value}
                onClick={() => setReportType(type.value)}
              >
                {type.label}
              </TypeOption>
            ))}
          </TypeSelector>
        </FormSection>

        <Form form={reportForm} layout="vertical">
          <Form.Item name="target" label="举报对象" rules={[{ required: true, message: '请输入举报对象' }]}>
            <Input placeholder="请输入被举报的用户名/订单号/服务名称" />
          </Form.Item>

          <Form.Item name="content" label="举报内容" rules={[{ required: true, message: '请输入举报内容' }]}>
            <TextArea rows={5} placeholder="请详细描述违规行为和相关证据（最多500字）" maxLength={500} showCount />
          </Form.Item>

          <Form.Item label="上传证据（选填）">
            <UploadArea>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                beforeUpload={() => false}
                maxCount={5}
              >
                {fileList.length < 5 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8, fontSize: 12 }}>上传证据</div>
                  </div>
                )}
              </Upload>
            </UploadArea>
          </Form.Item>

          <Button 
            type="primary" 
            size="large"
            style={{ background: '#ff6000', borderColor: '#ff6000' }}
            onClick={handleSubmitReport}
          >
            提交举报
          </Button>
        </Form>
      </FeedbackForm>

      {mockReports.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <ServiceTitle>举报记录</ServiceTitle>
          <RecordList>
            {mockReports.map(record => (
              <RecordItem key={record.id}>
                <div className="header">
                  <div className="type">
                    <ExclamationCircleOutlined style={{ color: '#ff6000', marginRight: 8 }} />
                    {record.type}
                  </div>
                  <Tag color={record.status === 'processing' ? 'processing' : 'success'}>
                    {record.status === 'processing' ? (
                      <><ClockCircleOutlined /> 处理中</>
                    ) : (
                      <><CheckCircleOutlined /> 已处理</>
                    )}
                  </Tag>
                </div>
                <div className="content">举报对象：{record.target}</div>
                <div className="content">{record.content}</div>
                <div className="footer">
                  <span>提交时间：{record.time}</span>
                </div>
              </RecordItem>
            ))}
          </RecordList>
        </div>
      )}
    </>
  );

  // 获取当前内容标题
  const getContentTitle = () => {
    switch (activeMenu) {
      case 'service': return { title: '官方客服', subtitle: '为您提供专业的客户服务' };
      case 'message': return { title: '消息中心', subtitle: '查看系统通知和互动消息' };
      case 'feedback': return { title: '意见反馈', subtitle: '您的建议是我们进步的动力' };
      case 'report': return { title: '举报中心', subtitle: '维护平台秩序，共建安全环境' };
    }
  };

  const contentInfo = getContentTitle();

  return (
    <ConfigProvider theme={getTheme('bright')}>
      <PageContainer>
        <TopNavBar user={toTopNavBarUser()} onNavigate={(path) => navigate(path)} showHomeLink={true} />

        <ContentLayout>
          {/* 侧边菜单 */}
          <Sidebar>
            <SidebarCard>
              <SidebarTitle>帮助中心</SidebarTitle>
              <MenuList>
                {menuItems.map(item => (
                  <MenuItem
                    key={item.key}
                    active={activeMenu === item.key}
                    onClick={() => handleMenuClick(item.key)}
                  >
                    <span className="icon">{item.icon}</span>
                    <span className="text">{item.label}</span>
                    {item.badge && <span className="badge">{item.badge}</span>}
                  </MenuItem>
                ))}
              </MenuList>
            </SidebarCard>
          </Sidebar>

          {/* 主内容区 */}
          <MainContent>
            <ContentCard>
              <ContentHeader>
                <div>
                  <div className="title">
                    {menuItems.find(m => m.key === activeMenu)?.icon}
                    {contentInfo.title}
                  </div>
                  <div className="subtitle">{contentInfo.subtitle}</div>
                </div>
              </ContentHeader>
              <ContentBody>
                {activeMenu === 'service' && renderServiceContent()}
                {activeMenu === 'message' && renderMessageContent()}
                {activeMenu === 'feedback' && renderFeedbackContent()}
                {activeMenu === 'report' && renderReportContent()}
              </ContentBody>
            </ContentCard>
          </MainContent>
        </ContentLayout>

        {/* FAQ详情弹窗 */}
        <Modal
          title={selectedFaq}
          open={faqModalVisible}
          onCancel={() => setFaqModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setFaqModalVisible(false)}>关闭</Button>,
            <Button key="service" type="primary" style={{ background: '#ff6000' }} onClick={() => {
              setFaqModalVisible(false);
              handleGoToService();
            }}>
              联系客服
            </Button>,
          ]}
        >
          <div style={{ padding: '16px 0', color: '#666', lineHeight: 1.8 }}>
            {faqAnswers[selectedFaq] || '该问题的详细解答正在整理中，您可以通过在线客服获取帮助。'}
          </div>
        </Modal>
      </PageContainer>
    </ConfigProvider>
  );
};

export default HelpCenterPage;
