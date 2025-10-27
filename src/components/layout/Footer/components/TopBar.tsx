import React, { useState } from 'react';
import { Button, Drawer } from 'antd';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { TopBarProps, NavigationItem, UserActionItem } from '../types/component';

// 样式化组件
const TopBarContainer = styled.header`
  position: relative;
  width: 100%;
  background: #001529;
  border-bottom: 1px solid #434343;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const TopBarContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;

  @media (max-width: 768px) {
    padding: 0 16px;
    height: 56px;
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;

  &:hover {
    transform: translateY(-1px);
  }
`;

const LogoIcon = styled.div`
  font-size: 28px;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.2);

  @media (max-width: 768px) {
    font-size: 24px;
    width: 32px;
    height: 32px;
  }
`;

const LogoText = styled.div`
  h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 1;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 18px;
    }
  }
`;

const NavigationSection = styled.nav`
  display: flex;
  align-items: center;
  gap: 32px;
  flex: 1;
  justify-content: center;

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

const NavigationList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 24px;

  @media (max-width: 768px) {
    gap: 16px;
    /* 移动端隐藏部分导航，显示汉堡菜单 */
    display: none;
  }
`;

const StyledNavigationItem = styled.li`
  margin: 0;
`;

const NavigationLink = styled.a<{ isActive?: boolean }>`
  color: ${props => props.isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)'};
  text-decoration: none;
  font-size: 15px;
  font-weight: ${props => props.isActive ? 600 : 400};
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    color: #FFFFFF;
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }

  ${props => props.isActive && `
    background: rgba(255, 255, 255, 0.15);
  `}

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 6px 12px;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background: #FF4D4F;
  color: #FFFFFF;
  font-size: 10px;
  font-weight: 500;
  padding: 2px 4px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
`;

const UserActionsSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    /* 移动端隐藏用户操作，显示在抽屉中 */
    display: none;
  }
`;

const ActionButton = styled(Button)<{ variant?: 'primary' | 'default' }>`
  ${props => props.variant === 'primary' ? `
    background: #FF6B35;
    border-color: #FF6B35;
    color: #FFFFFF;

    &:hover {
      background: #FF8C42;
      border-color: #FF8C42;
    }
  ` : `
    background: transparent;
    border-color: rgba(255, 255, 255, 0.3);
    color: #FFFFFF;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
    }
  `}

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 14px;
  }
`;

const MobileMenuButton = styled(Button)`
  display: none;
  background: transparent;
  border-color: rgba(255, 255, 255, 0.3);
  color: #FFFFFF;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const DrawerNavigationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const DrawerNavigationItem = styled.li`
  margin-bottom: 8px;
`;

const DrawerNavigationLink = styled.a<{ isActive?: boolean }>`
  display: block;
  color: ${props => props.isActive ? '#FF6B35' : '#666666'};
  text-decoration: none;
  font-size: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    color: #FF6B35;
    background: rgba(255, 107, 53, 0.05);
  }
`;

const DrawerUserActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px 16px;
  border-top: 1px solid #f0f0f0;
  margin-top: 24px;
`;

// TopBar 组件
export const TopBar: React.FC<TopBarProps> = ({
  logo,
  navigation = [],
  userActions = [],
  className,
  onNavigationClick,
  onUserActionClick
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // 检查当前页面路径以确定活动状态
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

  const handleNavigationClick = (item: NavigationItem) => {
    if (item.external) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = item.href;
    }
    onNavigationClick?.(item);
    setMobileDrawerOpen(false);
  };

  const handleUserActionClick = (item: UserActionItem) => {
    if (item.external) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = item.href;
    }
    onUserActionClick?.(item);
    setMobileDrawerOpen(false);
  };

  const handleLogoClick = () => {
    if (logo?.href) {
      window.location.href = logo.href;
    }
  };

  const handleMobileMenuClose = () => {
    setMobileDrawerOpen(false);
  };

  return (
    <TopBarContainer className={className}>
      <TopBarContent>
        {/* Logo 区域 */}
        {logo && (
          <LogoSection onClick={handleLogoClick}>
            <LogoIcon>{logo.icon}</LogoIcon>
            <LogoText>
              <h1>{logo.text}</h1>
            </LogoText>
          </LogoSection>
        )}

        {/* 导航区域 - 桌面端 */}
        <NavigationSection>
          <NavigationList role="menubar">
            {navigation.map((item) => (
              <StyledNavigationItem key={item.id} role="none">
                <NavigationLink
                  href={item.href}
                  isActive={currentPath === item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigationClick(item);
                  }}
                  role="menuitem"
                  aria-current={currentPath === item.href ? 'page' : undefined}
                >
                  {item.title}
                  {item.badge && <Badge>{item.badge}</Badge>}
                </NavigationLink>
              </StyledNavigationItem>
            ))}
          </NavigationList>
        </NavigationSection>

        {/* 用户操作区域 - 桌面端 */}
        {userActions.length > 0 && (
          <UserActionsSection>
            {userActions.map((action) => (
              <ActionButton
                key={action.id}
                variant={action.type}
                onClick={() => handleUserActionClick(action)}
              >
                {action.title}
              </ActionButton>
            ))}
          </UserActionsSection>
        )}

        {/* 移动端汉堡菜单 */}
        <MobileMenuButton
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setMobileDrawerOpen(true)}
        >
          菜单
        </MobileMenuButton>
      </TopBarContent>

      {/* 移动端抽屉导航 */}
      <Drawer
        title="万象生活"
        placement="right"
        onClose={handleMobileMenuClose}
        open={mobileDrawerOpen}
        width={280}
        bodyStyle={{ padding: 0 }}
      >
        <DrawerNavigationList>
          {navigation.map((item) => (
            <DrawerNavigationItem key={item.id}>
              <DrawerNavigationLink
                href={item.href}
                isActive={currentPath === item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigationClick(item);
                }}
                role="menuitem"
                aria-current={currentPath === item.href ? 'page' : undefined}
              >
                {item.title}
                {item.badge && <Badge>{item.badge}</Badge>}
              </DrawerNavigationLink>
            </DrawerNavigationItem>
          ))}
        </DrawerNavigationList>

        {userActions.length > 0 && (
          <DrawerUserActions>
            {userActions.map((action) => (
              <ActionButton
                key={action.id}
                variant={action.type}
                block
                onClick={() => handleUserActionClick(action)}
              >
                {action.title}
              </ActionButton>
            ))}
          </DrawerUserActions>
        )}
      </Drawer>
    </TopBarContainer>
  );
};

export default TopBar;