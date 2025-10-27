import React from 'react';
import { Menu, Badge, Tooltip } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import type { NavigationItem } from '../../../types/component';
import type { MenuProps } from 'antd';

// 样式化导航容器
const NavigationContainer = styled.nav`
  display: flex;
  align-items: center;

  .ant-menu {
    background: transparent;
    border: none;

    .ant-menu-item {
      color: rgba(255, 255, 255, 0.85);
      border-radius: ${({ theme }) => theme.token?.borderRadius || 8}px;
      margin: 0 4px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        color: ${({ theme }) => theme.token?.colorPrimary || '#1890ff'};
        background: rgba(255, 255, 255, 0.1);
      }

      &.ant-menu-item-selected {
        color: ${({ theme }) => theme.token?.colorPrimary || '#1890ff'};
        background: rgba(24, 144, 255, 0.1);

        &::after {
          display: none;
        }
      }

      .navigation-badge {
        margin-left: 4px;
      }

      .new-indicator {
        display: inline-flex;
        align-items: center;
        margin-left: 4px;
        padding: 2px 6px;
        background: #52c41a;
        color: white;
        border-radius: 10px;
        font-size: 10px;
        font-weight: 500;
        line-height: 1;
      }
    }
  }

  // 响应式处理
  @media (max-width: 768px) {
    .ant-menu {
      font-size: 14px;

      .ant-menu-item {
        margin: 0 2px;
        padding: 8px 12px;
      }
    }
  }

  @media (max-width: 576px) {
    .ant-menu {
      font-size: 13px;

      .ant-menu-item {
        margin: 0 1px;
        padding: 6px 8px;
      }
    }
  }
`;

interface NavigationProps {
  items: NavigationItem[];
  onItemClick?: (item: NavigationItem) => void;
  className?: string;
}

/**
 * 万象生活底栏导航组件
 * 支持徽章、新功能标识、响应式布局
 */
export const Navigation: React.FC<NavigationProps> = ({
  items,
  onItemClick,
  className
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 处理导航点击
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const item = items.find(navItem => navItem.id === e.key);

    if (!item) return;

    // 触发外部事件回调
    onItemClick?.(item);

    // 发送分析事件
    if (item.analytics) {
      // 这里可以集成 Google Analytics 或其他分析工具
      console.log('Analytics Event:', item.analytics);
    }

    // 导航处理
    if (item.href) {
      if (item.external) {
        // 外部链接在新窗口打开
        window.open(item.href, '_blank', 'noopener,noreferrer');
      } else {
        // 内部路由导航
        navigate(item.href);
      }
    }
  };

  // 转换菜单项
  const menuItems: MenuProps['items'] = items.map((item) => {
    // 渲染徽章或新功能标识
    const renderBadge = () => {
      if (item.badge && item.badge > 0) {
        return (
          <Badge
            count={item.badge}
            size="small"
            className="navigation-badge"
            showZero={false}
          />
        );
      }

      if (item.isNew) {
        return <span className="new-indicator">NEW</span>;
      }

      return null;
    };

    return {
      key: item.id,
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {item.icon && <span>{item.icon}</span>}
          <span>{item.title}</span>
          {renderBadge()}
        </span>
      ),
      'aria-label': item.description,
      title: item.description,
    };
  });

  // 获取当前选中的菜单项
  const selectedKeys = React.useMemo(() => {
    const currentPath = location.pathname;

    // 精确匹配
    const exactMatch = items.find(item =>
      !item.external && item.href === currentPath
    );

    if (exactMatch) {
      return [exactMatch.id];
    }

    // 前缀匹配（适用于嵌套路由）
    const prefixMatch = items.find(item =>
      !item.external &&
      item.href !== '/' &&
      currentPath.startsWith(item.href)
    );

    if (prefixMatch) {
      return [prefixMatch.id];
    }

    // 默认选中首页
    if (currentPath === '/') {
      const homeItem = items.find(item => item.id === 'home');
      return homeItem ? [homeItem.id] : [];
    }

    return [];
  }, [location.pathname, items]);

  return (
    <NavigationContainer className={className}>
      <Menu
        mode="horizontal"
        selectedKeys={selectedKeys}
        items={menuItems}
        onClick={handleMenuClick}
        aria-label="主导航菜单"
      />
    </NavigationContainer>
  );
};

export default Navigation;