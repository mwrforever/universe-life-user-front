/**
 * ResponsiveTopNavBar - 响应式顶部导航栏
 * 包含移动端适配和断点处理
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Drawer, Button, Space } from 'antd';
import {
  MenuOutlined,
  CloseOutlined,
  HomeOutlined,
  ShopOutlined,
  QuestionCircleOutlined,
  CheckSquareOutlined,
  BellOutlined,
  UserOutlined,
  SunOutlined,
  MoonOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { useMediaQuery } from '../hooks/useMediaQuery';
import TopNavBar from './TopNavBar';
import type { TopNavBarProps } from './types';

const { Header } = Layout;

// 响应式断点配置
const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1200,
} as const;

// 移动端抽屉样式
const MobileDrawer = styled(Drawer)`
  .ant-drawer-body {
    padding: 0;
    background: #0f172a;
  }

  .ant-drawer-header {
    background: #0f172a;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .ant-drawer-title {
    color: rgba(255, 255, 255, 0.95);
  }
`;

const MobileNavigationSection = styled.div`
  padding: 16px 0;
`;

const MobileActionSection = styled.div`
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
`;

const MobileNavButton = styled(Button)<{ $active?: boolean }>`
  width: 100%;
  background: transparent;
  border: none;
  color: ${props => (props.$active ? '#fbbf24' : 'rgba(255, 255, 255, 0.9)')};
  font-weight: ${props => (props.$active ? 600 : 500)};
  font-size: 14px;
  padding: 12px 20px;
  margin-bottom: 4px;
  border-radius: 0;
  justify-content: flex-start;
  text-align: left;
  transition: all 0.2s ease;

  &:hover,
  &:focus {
    background: rgba(251, 191, 36, 0.1);
    color: #fbbf24;
  }
`;

const MobileActionGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const MobileActionText = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
`;

const MobileIconButton = styled(Button)`
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.2);
  color: #fbbf24;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover,
  &:focus {
    background: rgba(251, 191, 36, 0.2);
    border-color: #fbbf24;
  }
`;

interface ResponsiveTopNavBarProps extends TopNavBarProps {
  /** 响应式断点配置 */
  breakpoints?: typeof BREAKPOINTS;
  /** 移动端菜单标题 */
  mobileMenuTitle?: string;
}

const ResponsiveTopNavBar: React.FC<ResponsiveTopNavBarProps> = ({
  user,
  navigationItems = [],
  notifications = [],
  theme = 'dark',
  language = 'zh-CN',
  fixed = true,
  blurBackground = true,
  userMenuItems = [],
  breakpoints = BREAKPOINTS,
  mobileMenuTitle = '菜单',
  onThemeChange,
  onLanguageChange,
  onNotificationClick,
  onNavigate,
}) => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');

  // 响应式hook
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.MOBILE - 1}px)`);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isTablet = useMediaQuery(
    `(min-width: ${breakpoints.MOBILE}px) and (max-width: ${breakpoints.TABLET - 1}px)`
  );

  // 关闭移动端菜单
  const closeMobileMenu = useCallback(() => {
    setMobileMenuVisible(false);
  }, []);

  // 打开移动端菜单
  const openMobileMenu = useCallback(() => {
    setMobileMenuVisible(true);
  }, []);

  // 处理导航点击
  const handleNavigationClick = useCallback(
    (path: string) => {
      setCurrentPath(path);
      onNavigate?.(path);
      if (isMobile) {
        closeMobileMenu();
      }
    },
    [onNavigate, isMobile, closeMobileMenu]
  );

  // 处理主题切换
  const handleThemeChange = useCallback(
    (newTheme: 'light' | 'dark') => {
      onThemeChange?.(newTheme);
    },
    [onThemeChange]
  );

  // 处理语言切换
  const handleLanguageChange = useCallback(
    (newLanguage: 'zh-CN' | 'en-US') => {
      onLanguageChange?.(newLanguage);
    },
    [onLanguageChange]
  );

  // 获取导航图标
  const getNavIcon = (key: string) => {
    const icons = {
      home: <HomeOutlined />,
      'vendor-center': <ShopOutlined />,
      'task-management': <CheckSquareOutlined />,
      help: <QuestionCircleOutlined />,
    };
    return icons[key as keyof typeof icons] || null;
  };

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      if (!isMobile && mobileMenuVisible) {
        closeMobileMenu();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, mobileMenuVisible, closeMobileMenu]);

  // 移动端渲染
  if (isMobile) {
    const unreadNotificationCount = notifications.filter(n => !n.read).length;

    return (
      <>
        {/* 移动端顶部栏 */}
        <Header
          style={{
            position: fixed ? 'sticky' : 'static',
            top: 0,
            zIndex: 1000,
            height: 48,
            lineHeight: '48px',
            padding: '0 16px',
            background: blurBackground ? 'rgba(15, 23, 42, 0.95)' : '#0f172a',
            backdropFilter: blurBackground ? 'blur(12px)' : 'none',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* 左侧菜单按钮 */}
          <Button
            type='text'
            icon={<MenuOutlined />}
            onClick={openMobileMenu}
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: 16,
              width: 36,
              height: 36,
            }}
          />

          {/* 右侧核心操作按钮 */}
          <Space size={12}>
            {/* 通知 */}
            <Button
              type='text'
              icon={<BellOutlined />}
              onClick={() => onNotificationClick?.(notifications[0])}
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: 16,
                width: 36,
                height: 36,
                position: 'relative',
              }}
            >
              {unreadNotificationCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: '#ef4444',
                    color: '#fff',
                    fontSize: 10,
                    minWidth: 16,
                    height: 16,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                  }}
                >
                  {unreadNotificationCount}
                </span>
              )}
            </Button>

            {/* 主题切换 */}
            <Button
              type='text'
              icon={theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
              onClick={() => handleThemeChange(theme === 'dark' ? 'light' : 'dark')}
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: 16,
                width: 36,
                height: 36,
              }}
            />

            {/* 用户头像 */}
            {user && user.role !== 'guest' && (
              <Button
                type='text'
                icon={
                  user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                      }}
                    />
                  ) : (
                    <UserOutlined />
                  )
                }
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: 16,
                  width: 36,
                  height: 36,
                }}
              />
            )}
          </Space>
        </Header>

        {/* 移动端抽屉菜单 */}
        <MobileDrawer
          title={mobileMenuTitle}
          placement='left'
          open={mobileMenuVisible}
          onClose={closeMobileMenu}
          width={280}
          closable={true}
          closeIcon={<CloseOutlined style={{ color: 'rgba(255, 255, 255, 0.9)' }} />}
        >
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* 导航部分 */}
            <MobileNavigationSection>
              {navigationItems.map(item => (
                <MobileNavButton
                  key={item.key}
                  type='text'
                  icon={getNavIcon(item.key)}
                  $active={currentPath === item.path}
                  onClick={() => handleNavigationClick(item.path)}
                >
                  <Space size={8}>
                    {item.label}
                    {item.badge && item.badge > 0 && (
                      <span
                        style={{
                          background: '#ef4444',
                          color: '#fff',
                          fontSize: 10,
                          padding: '2px 6px',
                          borderRadius: 4,
                          marginLeft: 4,
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Space>
                </MobileNavButton>
              ))}
            </MobileNavigationSection>

            {/* 操作部分 */}
            <MobileActionSection>
              {/* 用户信息 */}
              {user && user.role !== 'guest' && (
                <MobileActionGroup>
                  <MobileActionText>用户: {user.name}</MobileActionText>
                  <MobileIconButton icon={<UserOutlined />} size='small'>
                    个人资料
                  </MobileIconButton>
                </MobileActionGroup>
              )}

              {/* 设置操作 */}
              <MobileActionGroup>
                <MobileActionText>主题</MobileActionText>
                <MobileIconButton
                  icon={theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
                  size='small'
                  onClick={() => handleThemeChange(theme === 'dark' ? 'light' : 'dark')}
                >
                  {theme === 'dark' ? '浅色' : '深色'}
                </MobileIconButton>
              </MobileActionGroup>

              <MobileActionGroup>
                <MobileActionText>语言</MobileActionText>
                <MobileIconButton
                  icon={<GlobalOutlined />}
                  size='small'
                  onClick={() => handleLanguageChange(language === 'zh-CN' ? 'en-US' : 'zh-CN')}
                >
                  {language === 'zh-CN' ? 'EN' : '中'}
                </MobileIconButton>
              </MobileActionGroup>

              {/* 访客登录按钮 */}
              {user?.role === 'guest' && (
                <MobileNavButton
                  type='primary'
                  icon={<UserOutlined />}
                  onClick={() => {
                    /* 处理登录 */
                  }}
                >
                  登录
                </MobileNavButton>
              )}
            </MobileActionSection>
          </div>
        </MobileDrawer>
      </>
    );
  }

  // 桌面端渲染 - 使用原始TopNavBar组件
  return (
    <TopNavBar
      user={user}
      navigationItems={navigationItems}
      notifications={notifications}
      theme={theme}
      language={language}
      fixed={fixed}
      blurBackground={blurBackground}
      userMenuItems={userMenuItems}
      onThemeChange={handleThemeChange}
      onLanguageChange={handleLanguageChange}
      onNotificationClick={onNotificationClick}
      onNavigate={handleNavigationClick}
    />
  );
};

export default ResponsiveTopNavBar;
