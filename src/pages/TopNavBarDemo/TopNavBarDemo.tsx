/**
 * TopNavBar 组件演示页面
 * 展示不同用户角色和主题下的导航栏效果
 */

import React, { useState } from 'react';
import { ConfigProvider, Card, Radio, Switch, Space, Typography, Divider, Alert } from 'antd';
import { ResponsiveTopNavBar } from '../../components/layout/TopNavBar';
import { scenarios, getTheme } from '../../components/layout/TopNavBar';
import type { User, NotificationItem } from '../../components/layout/TopNavBar';
import { uiLogger } from '@/utils/logger';

const { Title, Text } = Typography;
const { Content } = Layout;

const TopNavBarDemo: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>(scenarios.regularUser.user);
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('dark');
  const [currentLanguage, setCurrentLanguage] = useState<'zh-CN' | 'en-US'>('zh-CN');
  const [blurBackground, setBlurBackground] = useState(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    scenarios.regularUser.notifications
  );

  // 场景切换处理
  const handleScenarioChange = (scenario: string) => {
    const selectedScenario = scenarios[scenario as keyof typeof scenarios];
    setCurrentUser(selectedScenario.user);
    setNotifications(selectedScenario.notifications);
  };

  // 主题切换处理
  const handleThemeChange = (theme: 'dark' | 'light') => {
    setCurrentTheme(theme);
  };

  // 语言切换处理
  const handleLanguageChange = (language: 'zh-CN' | 'en-US') => {
    setCurrentLanguage(language);
  };

  // 通知点击处理
  const handleNotificationClick = (notification: NotificationItem) => {
    uiLogger.info('用户点击通知', { notificationId: notification.id, title: notification.title });
    // 标记为已读
    setNotifications(prev => prev.map(n => (n.id === notification.id ? { ...n, read: true } : n)));
  };

  // 导航处理
  const handleNavigation = (path: string) => {
    uiLogger.info('用户导航', { path });
  };

  // 当前场景配置
  const currentScenario =
    Object.entries(scenarios).find(([, scenario]) => scenario.user.id === currentUser.id)?.[0] ||
    'regularUser';

  return (
    <ConfigProvider theme={getTheme(currentTheme)}>
      <div
        style={{
          minHeight: '100vh',
          background: currentTheme === 'dark' ? '#0f172a' : '#f8fafc',
        }}
      >
        {/* 顶部导航栏 */}
        <ResponsiveTopNavBar
          user={currentUser}
          navigationItems={
            currentScenario
              ? scenarios[currentScenario as keyof typeof scenarios].navigationItems
              : []
          }
          notifications={notifications}
          theme={currentTheme}
          language={currentLanguage}
          blurBackground={blurBackground}
          userMenuItems={
            currentScenario
              ? scenarios[currentScenario as keyof typeof scenarios].userMenuItems
              : []
          }
          onThemeChange={handleThemeChange}
          onLanguageChange={handleLanguageChange}
          onNotificationClick={handleNotificationClick}
          onNavigate={handleNavigation}
        />

        {/* 内容区域 */}
        <Content style={{ padding: '24px', marginTop: 48 }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {/* 标题 */}
            <div style={{ marginBottom: 32 }}>
              <Title
                level={2}
                style={{
                  color: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.95)' : '#0f172a',
                  marginBottom: 8,
                }}
              >
                TopNavBar 组件演示
              </Title>
              <Text
                style={{ color: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#64748b' }}
              >
                高端订餐平台响应式顶部导航栏，支持多种用户角色和主题切换
              </Text>
            </div>

            {/* 控制面板 */}
            <Card
              title='控制面板'
              style={{
                background: currentTheme === 'dark' ? '#1e293b' : '#ffffff',
                borderColor: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0',
                marginBottom: 24,
              }}
            >
              <Space direction='vertical' style={{ width: '100%' }} size={24}>
                {/* 用户场景切换 */}
                <div>
                  <Text
                    strong
                    style={{
                      color: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : '#0f172a',
                      marginBottom: 12,
                      display: 'block',
                    }}
                  >
                    用户场景
                  </Text>
                  <Radio.Group
                    value={currentScenario}
                    onChange={e => handleScenarioChange(e.target.value)}
                  >
                    <Space wrap>
                      <Radio.Button value='guestUser'>访客用户</Radio.Button>
                      <Radio.Button value='regularUser'>普通用户</Radio.Button>
                      <Radio.Button value='vendorUser'>供应商</Radio.Button>
                      <Radio.Button value='adminUser'>管理员</Radio.Button>
                    </Space>
                  </Radio.Group>
                </div>

                <Divider />

                {/* 主题设置 */}
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                    <Text
                      strong
                      style={{
                        color: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : '#0f172a',
                      }}
                    >
                      主题模式
                    </Text>
                    <br />
                    <Text type='secondary'>切换深色/浅色主题</Text>
                  </div>
                  <Switch
                    checked={currentTheme === 'dark'}
                    onChange={checked => handleThemeChange(checked ? 'dark' : 'light')}
                    checkedChildren='深色'
                    unCheckedChildren='浅色'
                  />
                </div>

                <Divider />

                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                    <Text
                      strong
                      style={{
                        color: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : '#0f172a',
                      }}
                    >
                      背景模糊效果
                    </Text>
                    <br />
                    <Text type='secondary'>滚动时的玻璃拟态效果</Text>
                  </div>
                  <Switch
                    checked={blurBackground}
                    onChange={setBlurBackground}
                    checkedChildren='开启'
                    unCheckedChildren='关闭'
                  />
                </div>
              </Space>
            </Card>

            {/* 当前状态信息 */}
            <Card
              title='当前状态'
              style={{
                background: currentTheme === 'dark' ? '#1e293b' : '#ffffff',
                borderColor: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0',
                marginBottom: 24,
              }}
            >
              <Space direction='vertical' style={{ width: '100%' }}>
                <div>
                  <Text strong>用户信息：</Text>
                  <Text style={{ marginLeft: 8 }}>
                    {currentUser.name} ({currentUser.role}) - {currentUser.email}
                  </Text>
                </div>
                <div>
                  <Text strong>未读通知：</Text>
                  <Text style={{ marginLeft: 8 }}>
                    {notifications.filter(n => !n.read).length} 条
                  </Text>
                </div>
                <div>
                  <Text strong>导航项数量：</Text>
                  <Text style={{ marginLeft: 8 }}>
                    {scenarios[currentScenario as keyof typeof scenarios]?.navigationItems
                      ?.length || 0}{' '}
                    项
                  </Text>
                </div>
              </Space>
            </Card>

            {/* 功能特性说明 */}
            <Card
              title='功能特性'
              style={{
                background: currentTheme === 'dark' ? '#1e293b' : '#ffffff',
                borderColor: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0',
                marginBottom: 24,
              }}
            >
              <Space direction='vertical' style={{ width: '100%' }}>
                <Alert
                  message='响应式设计'
                  description='支持桌面端、平板和移动端的自适应布局，移动端使用抽屉菜单'
                  type='info'
                  showIcon
                  style={{ marginBottom: 8 }}
                />
                <Alert
                  message='主题系统'
                  description='深色/浅色主题切换，使用Ant Design Token自定义样式'
                  type='info'
                  showIcon
                  style={{ marginBottom: 8 }}
                />
                <Alert
                  message='角色权限'
                  description='根据用户角色显示不同的导航项和菜单选项'
                  type='info'
                  showIcon
                  style={{ marginBottom: 8 }}
                />
                <Alert
                  message='玻璃拟态效果'
                  description='滚动时的背景模糊和半透明效果，提升视觉层次'
                  type='info'
                  showIcon
                />
              </Space>
            </Card>

            {/* 使用说明 */}
            <Card
              title='使用说明'
              style={{
                background: currentTheme === 'dark' ? '#1e293b' : '#ffffff',
                borderColor: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0',
              }}
            >
              <pre
                style={{
                  background: currentTheme === 'dark' ? '#0f172a' : '#f8fafc',
                  padding: 16,
                  borderRadius: 8,
                  overflow: 'auto',
                  fontSize: 12,
                  color: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : '#0f172a',
                }}
              >
                {`import { ResponsiveTopNavBar } from '@/components/layout/TopNavBar';

<ResponsiveTopNavBar
  user={currentUser}
  navigationItems={navigationItems}
  notifications={notifications}
  theme="dark"
  language="zh-CN"
  blurBackground={true}
  onThemeChange={handleThemeChange}
  onLanguageChange={handleLanguageChange}
  onNotificationClick={handleNotificationClick}
  onNavigate={handleNavigation}
/>`}
              </pre>
            </Card>
          </div>
        </Content>

        {/* 模拟内容区域 - 用于测试滚动效果 */}
        <div style={{ height: 2000, padding: '0 24px' }}>
          <div
            style={{
              textAlign: 'center',
              padding: 40,
              background:
                currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
              borderRadius: 8,
            }}
          >
            <Text
              style={{ color: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : '#94a3b8' }}
            >
              滚动页面查看导航栏背景模糊效果
            </Text>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default TopNavBarDemo;
