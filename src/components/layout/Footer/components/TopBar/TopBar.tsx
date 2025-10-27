import React from 'react';
import { Layout, Row, Col } from 'antd';
import styled from '@emotion/styled';
import Logo from './Logo';
import Navigation from './Navigation';
import UserActions from './UserActions';
import { useFooterConfig } from '../../config/footerConfig';
import type { TopBarProps } from '../../../types/component';

const { Header } = Layout;

// 样式化TopBar容器
const TopBarContainer = styled(Header)<{ fixed?: boolean }>`
  background: ${({ theme }) => theme.token?.colorBgContainer || '#001529'};
  padding: 0;
  height: auto;
  min-height: 64px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.token?.colorBorder || 'rgba(255, 255, 255, 0.1)'};
  position: ${({ fixed }) => fixed ? 'fixed' : 'relative'};
  top: ${({ fixed }) => fixed ? 0 : 'auto'};
  width: 100%;
  z-index: 1000;
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  // 内容器
  .topbar-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 64px;
  }

  // 响应式处理
  @media (max-width: 1200px) {
    .topbar-content {
      padding: 0 16px;
    }
  }

  @media (max-width: 768px) {
    .topbar-content {
      padding: 0 12px;
      min-height: 56px;
    }
  }

  @media (max-width: 576px) {
    .topbar-content {
      padding: 0 8px;
      min-height: 52px;
    }
  }

  // 滚动时样式变化
  &.scrolled {
    background: ${({ theme }) => theme.token?.colorBgContainer || '#001529'}dd;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

// 响应式布局容器
const ResponsiveRow = styled(Row)`
  width: 100%;
  align-items: center;

  .logo-col {
    display: flex;
    justify-content: flex-start;
  }

  .navigation-col {
    display: flex;
    justify-content: center;

    // 响应式隐藏导航
    @media (max-width: 768px) {
      display: none;
    }
  }

  .actions-col {
    display: flex;
    justify-content: flex-end;

    // 响应式调整按钮
    @media (max-width: 576px) {
      .ant-space {
        gap: 4px !important;
      }
    }
  }
`;

/**
 * 万象生活底栏顶部栏组件
 * 包含品牌Logo、主导航菜单、用户操作按钮
 */
export const TopBar: React.FC<TopBarProps> = ({
  logo,
  navigation,
  userActions,
  className,
  fixed = false,
  onNavigationClick,
  onUserActionClick
}) => {
  // 获取默认配置
  const defaultConfig = useFooterConfig();

  // 合并配置
  const finalLogo = logo || defaultConfig.topBar.logo;
  const finalNavigation = navigation || defaultConfig.topBar.navigation;
  const finalUserActions = userActions || defaultConfig.topBar.userActions;

  // 滚动状态管理（用于固定TopBar的样式变化）
  React.useEffect(() => {
    if (!fixed) return;

    const handleScroll = () => {
      const topBarElement = document.querySelector('.topbar-container');
      if (topBarElement) {
        if (window.scrollY > 10) {
          topBarElement.classList.add('scrolled');
        } else {
          topBarElement.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始检查

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [fixed]);

  return (
    <TopBarContainer
      className={`topbar-container ${className || ''}`}
      fixed={fixed}
      role="banner"
    >
      <div className="topbar-content">
        <ResponsiveRow gutter={[16, 0]} align="middle">
          {/* Logo区域 */}
          <Col className="logo-col" xs={8} sm={6} md={6} lg={6} xl={6}>
            <Logo logo={finalLogo} />
          </Col>

          {/* 导航区域 */}
          <Col className="navigation-col" xs={0} sm={12} md={12} lg={12} xl={12}>
            <Navigation
              items={finalNavigation}
              onItemClick={onNavigationClick}
            />
          </Col>

          {/* 用户操作区域 */}
          <Col className="actions-col" xs={16} sm={6} md={6} lg={6} xl={6}>
            <UserActions
              items={finalUserActions}
              onItemClick={onUserActionClick}
            />
          </Col>
        </ResponsiveRow>
      </div>
    </TopBarContainer>
  );
};

export default TopBar;