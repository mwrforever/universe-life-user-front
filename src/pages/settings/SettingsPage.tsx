/**
 * 账户设置页面 - 淘宝风格
 * 用户账户信息和安全设置管理
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ConfigProvider,
  Card,
  Spin,
  message,
  Button,
  Input,
  Avatar,
  Upload,
  Form,
  Switch,
  Modal,
} from 'antd';
import type { UploadProps } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  SafetyCertificateOutlined,
  BellOutlined,
  LockOutlined,
  MobileOutlined,
  MailOutlined,
  CameraOutlined,
  RightOutlined,
  EditOutlined,
  KeyOutlined,
  WechatOutlined,
  AlipayCircleOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { getTheme } from '@/components/layout/TopNavBar';
import { useAuth } from '@/hooks/useAuth';
import { PageContainer, ContentWrapper } from '@/components/common';

// 设置菜单项类型
type SettingsTab = 'profile' | 'security' | 'notification' | 'bindAccount';

// 左侧菜单
const LeftMenu = styled.div`
  width: 220px;
  flex-shrink: 0;

  @media (max-width: 992px) {
    width: 100%;
  }
`;

// 菜单卡片
const MenuCard = styled.div`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

// 菜单标题
const MenuTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  padding: 20px 20px 16px;
  border-bottom: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  gap: 8px;

  .anticon {
    color: #ff6000;
  }
`;

// 菜单列表
const MenuList = styled.div`
  padding: 8px 0;
`;

// 菜单项
const MenuItem = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(p) => (p.active ? '#fff5f0' : 'transparent')};
  border-left: 3px solid ${(p) => (p.active ? '#ff6000' : 'transparent')};

  &:hover {
    background: #fff5f0;
  }

  .anticon {
    font-size: 18px;
    color: ${(p) => (p.active ? '#ff6000' : '#666')};
  }
`;

// 菜单项文字
const MenuItemText = styled.span<{ active?: boolean }>`
  font-size: 14px;
  color: ${(p) => (p.active ? '#ff6000' : '#333')};
  font-weight: ${(p) => (p.active ? 500 : 400)};
`;

// 右侧内容区
const RightContent = styled.div`
  flex: 1;
  min-width: 0;
`;

// 内容卡片
const ContentCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  .ant-card-head {
    border-bottom: 1px solid #f5f5f5;
    padding: 0 24px;
    min-height: 56px;
  }

  .ant-card-head-title {
    font-size: 16px;
    font-weight: 600;
    padding: 18px 0;
  }

  .ant-card-body {
    padding: 24px;
  }
`;

// 头像区域
const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0 32px;
  border-bottom: 1px solid #f5f5f5;
  margin-bottom: 24px;
`;

// 头像容器
const AvatarWrapper = styled.div`
  position: relative;
  cursor: pointer;
  margin-bottom: 12px;

  &:hover .avatar-overlay {
    opacity: 1;
  }

  &:hover .large-avatar {
    border-color: #ff6000;
  }
`;

// 大头像
const LargeAvatar = styled(Avatar)`
  width: 100px;
  height: 100px;
  font-size: 40px;
  border: 3px solid #f0f0f0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: border-color 0.2s ease;
`;

// 头像遮罩
const AvatarOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;

  .anticon {
    color: #fff;
    font-size: 24px;
  }

  .overlay-text {
    color: #fff;
    font-size: 12px;
  }
`;

// 头像提示
const AvatarTip = styled.div`
  font-size: 12px;
  color: #999;
  text-align: center;
`;

// 表单项
const FormItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
`;

// 表单标签
const FormLabel = styled.div`
  width: 100px;
  font-size: 14px;
  color: #666;
  padding-top: 5px;
  flex-shrink: 0;
`;

// 表单内容
const FormContent = styled.div`
  flex: 1;
  min-width: 0;
`;

// 表单值
const FormValue = styled.div`
  font-size: 14px;
  color: #1a1a1a;
  line-height: 32px;
`;

// 表单操作
const FormAction = styled.div`
  margin-left: 16px;
`;

// 安全项
const SecurityItem = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
`;

// 安全项图标
const SecurityIcon = styled.div<{ color?: string }>`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: ${(p) => p.color || '#f5f5f5'}15;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;

  .anticon {
    font-size: 22px;
    color: ${(p) => p.color || '#666'};
  }
`;

// 安全项信息
const SecurityInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

// 安全项标题
const SecurityTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

// 安全项描述
const SecurityDesc = styled.div`
  font-size: 12px;
  color: #999;
`;

// 状态标签
const StatusTag = styled.span<{ status: 'success' | 'warning' | 'error' }>`
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  background: ${(p) =>
    p.status === 'success'
      ? '#f6ffed'
      : p.status === 'warning'
        ? '#fffbe6'
        : '#fff2f0'};
  color: ${(p) =>
    p.status === 'success'
      ? '#52c41a'
      : p.status === 'warning'
        ? '#faad14'
        : '#ff4d4f'};
`;

// 通知设置项
const NotificationItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
`;

// 通知项信息
const NotificationInfo = styled.div`
  flex: 1;
`;

// 通知项标题
const NotificationTitle = styled.div`
  font-size: 14px;
  color: #1a1a1a;
  margin-bottom: 4px;
`;

// 通知项描述
const NotificationDesc = styled.div`
  font-size: 12px;
  color: #999;
`;

// 绑定账号项
const BindItem = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
`;

// 绑定图标
const BindIcon = styled.div<{ color: string }>`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: ${(p) => p.color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;

  .anticon {
    font-size: 24px;
    color: #fff;
  }
`;

// 加载容器
const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
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

// 菜单配置
const menuItems: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { key: 'profile', label: '个人资料', icon: <UserOutlined /> },
  { key: 'security', label: '账号安全', icon: <SafetyCertificateOutlined /> },
  { key: 'notification', label: '消息通知', icon: <BellOutlined /> },
  { key: 'bindAccount', label: '账号绑定', icon: <LockOutlined /> },
];

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, login, toTopNavBarUser } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [nicknameValue, setNicknameValue] = useState('');
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  // 通知设置状态
  const [notifications, setNotifications] = useState({
    orderUpdate: true,
    messageRemind: true,
    promotionPush: false,
    emailNotify: true,
    smsNotify: false,
  });

  // 处理头像上传
  const handleAvatarUpload: UploadProps['beforeUpload'] = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 格式的图片');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB');
      return false;
    }
    message.success('头像上传成功');
    return false;
  };

  // 处理昵称编辑
  const handleNicknameEdit = () => {
    setNicknameValue(user?.nickname || user?.username || '');
    setEditingField('nickname');
  };

  // 保存昵称
  const handleNicknameSave = () => {
    if (!nicknameValue.trim()) {
      message.warning('昵称不能为空');
      return;
    }
    message.success('昵称修改成功');
    setEditingField(null);
  };

  // 处理修改密码
  const handlePasswordChange = () => {
    setPasswordModalVisible(true);
  };

  // 渲染个人资料
  const renderProfile = () => (
    <ContentCard title="个人资料">
      <AvatarSection>
        <Upload
          showUploadList={false}
          beforeUpload={handleAvatarUpload}
          accept="image/jpeg,image/png"
        >
          <AvatarWrapper>
            <LargeAvatar className="large-avatar" src={user?.avatar} icon={<UserOutlined />} />
            <AvatarOverlay className="avatar-overlay">
              <CameraOutlined />
              <span className="overlay-text">更换头像</span>
            </AvatarOverlay>
          </AvatarWrapper>
        </Upload>
        <AvatarTip>点击头像更换，支持 JPG/PNG 格式</AvatarTip>
      </AvatarSection>

      <FormItem>
        <FormLabel>用户ID</FormLabel>
        <FormContent>
          <FormValue>{user?.id?.slice(0, 16) || '—'}...</FormValue>
        </FormContent>
      </FormItem>

      <FormItem>
        <FormLabel>用户名</FormLabel>
        <FormContent>
          <FormValue>{user?.username || '—'}</FormValue>
        </FormContent>
      </FormItem>

      <FormItem>
        <FormLabel>昵称</FormLabel>
        <FormContent>
          {editingField === 'nickname' ? (
            <Input
              value={nicknameValue}
              onChange={(e) => setNicknameValue(e.target.value)}
              style={{ width: 200 }}
              maxLength={20}
              placeholder="请输入昵称"
            />
          ) : (
            <FormValue>{user?.nickname || user?.username || '—'}</FormValue>
          )}
        </FormContent>
        <FormAction>
          {editingField === 'nickname' ? (
            <>
              <Button size="small" onClick={() => setEditingField(null)} style={{ marginRight: 8 }}>
                取消
              </Button>
              <Button
                size="small"
                type="primary"
                style={{ background: '#ff6000', borderColor: '#ff6000' }}
                onClick={handleNicknameSave}
              >
                保存
              </Button>
            </>
          ) : (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={handleNicknameEdit}
              style={{ color: '#ff6000' }}
            >
              修改
            </Button>
          )}
        </FormAction>
      </FormItem>

      <FormItem>
        <FormLabel>手机号</FormLabel>
        <FormContent>
          <FormValue>
            {user?.phone ? user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '未绑定'}
          </FormValue>
        </FormContent>
        <FormAction>
          <Button type="link" style={{ color: '#ff6000' }}>
            {user?.phone ? '换绑' : '绑定'}
          </Button>
        </FormAction>
      </FormItem>

      <FormItem>
        <FormLabel>邮箱</FormLabel>
        <FormContent>
          <FormValue>
            {user?.email ? user.email.replace(/(.{3}).+(@.+)/, '$1***$2') : '未绑定'}
          </FormValue>
        </FormContent>
        <FormAction>
          <Button type="link" style={{ color: '#ff6000' }}>
            {user?.email ? '换绑' : '绑定'}
          </Button>
        </FormAction>
      </FormItem>
    </ContentCard>
  );

  // 渲染账号安全
  const renderSecurity = () => (
    <ContentCard title="账号安全">
      <SecurityItem>
        <SecurityIcon color="#ff6000">
          <LockOutlined />
        </SecurityIcon>
        <SecurityInfo>
          <SecurityTitle>
            登录密码
            <StatusTag status="success">已设置</StatusTag>
          </SecurityTitle>
          <SecurityDesc>定期更换密码可以保护账号安全</SecurityDesc>
        </SecurityInfo>
        <Button type="link" style={{ color: '#ff6000' }} onClick={handlePasswordChange}>
          修改
        </Button>
      </SecurityItem>

      <SecurityItem>
        <SecurityIcon color="#52c41a">
          <MobileOutlined />
        </SecurityIcon>
        <SecurityInfo>
          <SecurityTitle>
            手机绑定
            {user?.phone ? (
              <StatusTag status="success">已绑定</StatusTag>
            ) : (
              <StatusTag status="warning">未绑定</StatusTag>
            )}
          </SecurityTitle>
          <SecurityDesc>
            {user?.phone
              ? `已绑定手机 ${user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}`
              : '绑定手机可用于登录、找回密码等'}
          </SecurityDesc>
        </SecurityInfo>
        <Button type="link" style={{ color: '#ff6000' }}>
          {user?.phone ? '换绑' : '绑定'}
        </Button>
      </SecurityItem>

      <SecurityItem>
        <SecurityIcon color="#1890ff">
          <MailOutlined />
        </SecurityIcon>
        <SecurityInfo>
          <SecurityTitle>
            邮箱绑定
            {user?.email ? (
              <StatusTag status="success">已绑定</StatusTag>
            ) : (
              <StatusTag status="warning">未绑定</StatusTag>
            )}
          </SecurityTitle>
          <SecurityDesc>
            {user?.email
              ? `已绑定邮箱 ${user.email.replace(/(.{3}).+(@.+)/, '$1***$2')}`
              : '绑定邮箱可用于找回密码和接收通知'}
          </SecurityDesc>
        </SecurityInfo>
        <Button type="link" style={{ color: '#ff6000' }}>
          {user?.email ? '换绑' : '绑定'}
        </Button>
      </SecurityItem>

      <SecurityItem>
        <SecurityIcon color="#faad14">
          <SafetyCertificateOutlined />
        </SecurityIcon>
        <SecurityInfo>
          <SecurityTitle>
            实名认证
            <StatusTag status="warning">未认证</StatusTag>
          </SecurityTitle>
          <SecurityDesc>完成实名认证后可享受更多服务</SecurityDesc>
        </SecurityInfo>
        <Button type="link" style={{ color: '#ff6000' }}>
          去认证
        </Button>
      </SecurityItem>

      <SecurityItem>
        <SecurityIcon color="#722ed1">
          <KeyOutlined />
        </SecurityIcon>
        <SecurityInfo>
          <SecurityTitle>
            登录设备管理
          </SecurityTitle>
          <SecurityDesc>查看和管理已登录的设备，保障账号安全</SecurityDesc>
        </SecurityInfo>
        <Button type="link" style={{ color: '#ff6000' }}>
          管理 <RightOutlined />
        </Button>
      </SecurityItem>
    </ContentCard>
  );

  // 渲染消息通知
  const renderNotification = () => (
    <ContentCard title="消息通知">
      <NotificationItem>
        <NotificationInfo>
          <NotificationTitle>订单动态通知</NotificationTitle>
          <NotificationDesc>接收订单状态变更、进度更新等通知</NotificationDesc>
        </NotificationInfo>
        <Switch
          checked={notifications.orderUpdate}
          onChange={(checked) => setNotifications({ ...notifications, orderUpdate: checked })}
          style={{ background: notifications.orderUpdate ? '#ff6000' : undefined }}
        />
      </NotificationItem>

      <NotificationItem>
        <NotificationInfo>
          <NotificationTitle>消息提醒</NotificationTitle>
          <NotificationDesc>接收私信、系统消息等提醒</NotificationDesc>
        </NotificationInfo>
        <Switch
          checked={notifications.messageRemind}
          onChange={(checked) => setNotifications({ ...notifications, messageRemind: checked })}
          style={{ background: notifications.messageRemind ? '#ff6000' : undefined }}
        />
      </NotificationItem>

      <NotificationItem>
        <NotificationInfo>
          <NotificationTitle>营销推送</NotificationTitle>
          <NotificationDesc>接收优惠活动、促销信息等推送</NotificationDesc>
        </NotificationInfo>
        <Switch
          checked={notifications.promotionPush}
          onChange={(checked) => setNotifications({ ...notifications, promotionPush: checked })}
          style={{ background: notifications.promotionPush ? '#ff6000' : undefined }}
        />
      </NotificationItem>

      <NotificationItem>
        <NotificationInfo>
          <NotificationTitle>邮件通知</NotificationTitle>
          <NotificationDesc>通过邮件接收重要通知</NotificationDesc>
        </NotificationInfo>
        <Switch
          checked={notifications.emailNotify}
          onChange={(checked) => setNotifications({ ...notifications, emailNotify: checked })}
          style={{ background: notifications.emailNotify ? '#ff6000' : undefined }}
        />
      </NotificationItem>

      <NotificationItem>
        <NotificationInfo>
          <NotificationTitle>短信通知</NotificationTitle>
          <NotificationDesc>通过短信接收重要通知</NotificationDesc>
        </NotificationInfo>
        <Switch
          checked={notifications.smsNotify}
          onChange={(checked) => setNotifications({ ...notifications, smsNotify: checked })}
          style={{ background: notifications.smsNotify ? '#ff6000' : undefined }}
        />
      </NotificationItem>
    </ContentCard>
  );

  // 渲染账号绑定
  const renderBindAccount = () => (
    <ContentCard title="账号绑定">
      <BindItem>
        <BindIcon color="#07c160">
          <WechatOutlined />
        </BindIcon>
        <SecurityInfo>
          <SecurityTitle>
            微信
            <StatusTag status="warning">未绑定</StatusTag>
          </SecurityTitle>
          <SecurityDesc>绑定微信后可使用微信快捷登录</SecurityDesc>
        </SecurityInfo>
        <Button type="link" style={{ color: '#ff6000' }}>
          绑定
        </Button>
      </BindItem>

      <BindItem>
        <BindIcon color="#1677ff">
          <AlipayCircleOutlined />
        </BindIcon>
        <SecurityInfo>
          <SecurityTitle>
            支付宝
            <StatusTag status="warning">未绑定</StatusTag>
          </SecurityTitle>
          <SecurityDesc>绑定支付宝后可使用支付宝快捷登录和收款</SecurityDesc>
        </SecurityInfo>
        <Button type="link" style={{ color: '#ff6000' }}>
          绑定
        </Button>
      </BindItem>
    </ContentCard>
  );

  // 渲染内容
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfile();
      case 'security':
        return renderSecurity();
      case 'notification':
        return renderNotification();
      case 'bindAccount':
        return renderBindAccount();
      default:
        return renderProfile();
    }
  };

  // 加载中
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

  // 未登录
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
            <div style={{ width: '100%', maxWidth: 560, margin: '40px auto' }}>
              <NotLoggedInCard>
                <NotLoggedInIcon>
                  <SettingOutlined />
                </NotLoggedInIcon>
                <NotLoggedInTitle>登录后管理账户设置</NotLoggedInTitle>
                <NotLoggedInDesc>
                  登录后可修改个人资料、账号安全、消息通知等设置
                </NotLoggedInDesc>
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
        <TopNavBar
          user={toTopNavBarUser()}
          onNavigate={(path) => navigate(path)}
          showHomeLink={true}
        />

        <ContentWrapper>
          {/* 左侧菜单 */}
          <LeftMenu>
            <MenuCard>
              <MenuTitle>
                <SettingOutlined />
                账户设置
              </MenuTitle>
              <MenuList>
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.key}
                    active={activeTab === item.key}
                    onClick={() => setActiveTab(item.key)}
                  >
                    {item.icon}
                    <MenuItemText active={activeTab === item.key}>{item.label}</MenuItemText>
                  </MenuItem>
                ))}
              </MenuList>
            </MenuCard>
          </LeftMenu>

          {/* 右侧内容 */}
          <RightContent>{renderContent()}</RightContent>
        </ContentWrapper>

        {/* 修改密码弹窗 */}
        <Modal
          title="修改密码"
          open={passwordModalVisible}
          onCancel={() => setPasswordModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setPasswordModalVisible(false)}>
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              style={{ background: '#ff6000', borderColor: '#ff6000' }}
              onClick={() => {
                message.success('密码修改成功');
                setPasswordModalVisible(false);
              }}
            >
              确认修改
            </Button>,
          ]}
        >
          <Form layout="vertical" style={{ marginTop: 16 }}>
            <Form.Item label="当前密码" required>
              <Input.Password placeholder="请输入当前密码" />
            </Form.Item>
            <Form.Item label="新密码" required>
              <Input.Password placeholder="请输入新密码（6-20位）" />
            </Form.Item>
            <Form.Item label="确认新密码" required>
              <Input.Password placeholder="请再次输入新密码" />
            </Form.Item>
          </Form>
        </Modal>
      </PageContainer>
    </ConfigProvider>
  );
};

export default SettingsPage;
