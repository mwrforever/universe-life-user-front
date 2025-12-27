/**
 * 认证按钮组组件
 * 在导航栏显示登录/注册按钮或用户信息
 */

import React from 'react';
import { Space, Button, Avatar, Dropdown, Badge } from 'antd';
import {
  UserOutlined,
  LoginOutlined,
  UserAddOutlined,
  UnorderedListOutlined,
  MessageOutlined,
  CustomerServiceOutlined,
  CaretDownOutlined,
  LogoutOutlined,
  SettingOutlined,
  IdcardOutlined,
  WalletOutlined,
  StarOutlined,
  SendOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import type { MenuProps } from 'antd';
import { useAuth } from '@/hooks/useAuth';
import type { NotificationItem } from '@/components/layout/TopNavBar/types';

// 样式化组件
const AuthContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const NavItemBase = styled.span`
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  line-height: 1;

  &:hover {
    color: #ff6000;
    background-color: #fff5f0;
  }
`;

const UserAvatar = styled(Avatar)`
  width: 20px;
  height: 20px;
  font-size: 10px;
  border: 1px solid #f0f0f0;
`;

const MessageBadge = styled(Badge)`
  .ant-badge-count {
    background: #ff6000;
    border: none;
    font-size: 10px;
    min-width: 16px;
    height: 16px;
    line-height: 16px;
    padding: 0 4px;
  }
`;

const StyledDropdown = styled(Dropdown)`
  .ant-dropdown {
    .ant-dropdown-menu {
      box-shadow: 0 6px 16px -8px rgba(0,0,0,0.08);
      border: 1px solid #f0f0f0;
      border-radius: 8px;
      padding: 8px 0;

      .ant-dropdown-menu-item {
        font-size: 12px;
        padding: 8px 16px;
        color: #666;

        &:hover {
          background-color: #fff5f0;
          color: #ff6000;
        }

        &:active {
          background-color: #ffe7d6;
        }
      }
    }
  }
`;

const LoginButton = styled(Button)`
  height: 28px;
  font-size: 12px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    border-color: #ff6000;
    color: #ff6000;
  }
`;

const RegisterButton = styled(Button)`
  height: 28px;
  font-size: 12px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Separator = styled.span`
  color: #e8e8e8;
  margin: 0 8px;
`;

interface AuthButtonGroupProps {
  /** 通知列表 */
  notifications?: NotificationItem[];
  /** 导航回调 */
  onNavigate?: (path: string) => void;
}

/**
 * 认证按钮组组件
 */
const AuthButtonGroup: React.FC<AuthButtonGroupProps> = ({
  notifications = [],
  onNavigate,
}) => {
  const { user, isAuthenticated, isLoading, login, logout, toTopNavBarUser } = useAuth();

  // 任务管理菜单（简化版 - 只显示两个大分类）
  const taskMenuItems: MenuProps['items'] = [
    {
      key: 'publish',
      label: (
        <span>
          <SendOutlined style={{ marginRight: 8 }} />
          需求管理
        </span>
      ),
      onClick: () => onNavigate?.('/tasks/publish/all'),
    },
    {
      key: 'accept',
      label: (
        <span>
          <InboxOutlined style={{ marginRight: 8 }} />
          接单管理
        </span>
      ),
      onClick: () => onNavigate?.('/tasks/accept/all'),
    },
  ];

  // 用户菜单项
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <span>
          <IdcardOutlined style={{ marginRight: 8 }} />
          个人中心
        </span>
      ),
      onClick: () => onNavigate?.('/profile'),
    },
    {
      key: 'orders',
      label: (
        <span>
          <UnorderedListOutlined style={{ marginRight: 8 }} />
          我的项目
        </span>
      ),
      onClick: () => onNavigate?.('/user/orders'),
    },
    {
      key: 'wallet',
      label: (
        <span>
          <WalletOutlined style={{ marginRight: 8 }} />
          钱包
        </span>
      ),
      onClick: () => onNavigate?.('/user/wallet'),
    },
    {
      key: 'favorites',
      label: (
        <span>
          <StarOutlined style={{ marginRight: 8 }} />
          我的收藏
        </span>
      ),
      onClick: () => onNavigate?.('/user/favorites'),
    },
    {
      key: 'settings',
      label: (
        <span>
          <SettingOutlined style={{ marginRight: 8 }} />
          账号设置
        </span>
      ),
      onClick: () => onNavigate?.('/settings'),
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: (
        <span style={{ color: '#ff4d4f' }}>
          <LogoutOutlined style={{ marginRight: 8 }} />
          退出登录
        </span>
      ),
      onClick: () => logout(),
    },
  ];

  // 渲染加载状态
  if (isLoading) {
    return (
      <AuthContainer>
        <UserAvatar size="small" icon={<UserOutlined />} />
      </AuthContainer>
    );
  }

  // 已登录状态
  if (isAuthenticated && user) {
    const topNavBarUser = toTopNavBarUser();
    const unreadMessageCount = notifications.filter(n => !n.read).length;

    return (
      <AuthContainer>
        {/* 用户信息下拉菜单 */}
        <StyledDropdown menu={{ items: userMenuItems }} trigger={['click']}>
          <NavItemBase>
            <UserAvatar
              size="small"
              src={user.avatar}
              icon={<UserOutlined />}
            />
            <span>{topNavBarUser?.name || user.nickname || user.username}</span>
            <CaretDownOutlined style={{ fontSize: '10px' }} />
          </NavItemBase>
        </StyledDropdown>

        <Separator>|</Separator>

        {/* 我的任务下拉菜单 */}
        <StyledDropdown 
          menu={{ items: taskMenuItems }} 
          trigger={['click']}
          overlayStyle={{ minWidth: 180 }}
        >
          <NavItemBase>
            <UnorderedListOutlined />
            <span>我的任务</span>
            <CaretDownOutlined style={{ fontSize: '10px' }} />
          </NavItemBase>
        </StyledDropdown>

        <Separator>|</Separator>

        {/* 消息中心 */}
        <NavItemBase onClick={() => onNavigate?.('/messages')}>
          <MessageBadge count={unreadMessageCount} size="small">
            <MessageOutlined />
          </MessageBadge>
          <span>消息</span>
        </NavItemBase>

        <Separator>|</Separator>

        {/* 帮助中心 */}
        <NavItemBase onClick={() => onNavigate?.('/help')}>
          <CustomerServiceOutlined />
          <span>帮助中心</span>
        </NavItemBase>
      </AuthContainer>
    );
  }

  // 未登录状态
  return (
    <AuthContainer>
      <Space size={8}>
        {/* 登录按钮 */}
        <LoginButton
          type="text"
          icon={<LoginOutlined />}
          onClick={() => login()}
        >
          登录
        </LoginButton>

        <Separator>|</Separator>

        {/* 注册按钮 */}
        <RegisterButton
          type="text"
          icon={<UserAddOutlined />}
          onClick={() => login()}
        >
          注册
        </RegisterButton>
      </Space>
    </AuthContainer>
  );
};

export default AuthButtonGroup;