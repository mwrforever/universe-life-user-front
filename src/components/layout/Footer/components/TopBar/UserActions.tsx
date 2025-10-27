import React from 'react';
import { Button, Space, Tooltip, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import type { UserActionItem } from '../../../types/component';

// 样式化用户操作容器
const UserActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.token?.paddingSM || 8}px;

  .action-button {
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 500;
    border-radius: ${({ theme }) => theme.token?.borderRadius || 8}px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &:active {
      transform: translateY(0);
    }

    &.ant-btn-primary {
      background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
      border: none;

      &:hover {
        background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%);
      }
    }

    &.ant-btn-default {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: rgba(255, 255, 255, 0.85);

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.3);
        color: #ffffff;
      }
    }
  }

  // 响应式处理
  @media (max-width: 768px) {
    .action-button {
      padding: 8px 16px;
      font-size: 14px;
    }
  }

  @media (max-width: 576px) {
    gap: 4px;

    .action-button {
      padding: 6px 12px;
      font-size: 13px;

      .button-text {
        display: none;
      }

      .button-icon {
        margin: 0;
      }
    }
  }
`;

interface UserActionsProps {
  items: UserActionItem[];
  onItemClick?: (item: UserActionItem) => void;
  className?: string;
}

/**
 * 万象生活底栏用户操作组件
 * 支持登录/注册按钮、加载状态、响应式布局
 */
export const UserActions: React.FC<UserActionsProps> = ({
  items,
  onItemClick,
  className
}) => {
  const navigate = useNavigate();

  // 处理按钮点击
  const handleActionClick = (item: UserActionItem) => {
    // 如果按钮被禁用或正在加载，不处理点击
    if (item.disabled || item.loading) {
      return;
    }

    // 触发外部事件回调
    onItemClick?.(item);

    // 发送分析事件
    if (item.analytics) {
      // 这里可以集成 Google Analytics 或其他分析工具
      console.log('Analytics Event:', item.analytics);
    }

    // 导航处理
    if (item.href) {
      navigate(item.href);
    }
  };

  // 渲染单个操作按钮
  const renderActionButton = (item: UserActionItem) => {
    const buttonProps = {
      type: item.type as any,
      size: item.size || 'middle',
      disabled: item.disabled,
      loading: item.loading,
      icon: item.icon,
      onClick: () => handleActionClick(item),
      'aria-label': item.title,
      className: 'action-button',
    };

    // 如果有加载状态，显示Spin组件
    if (item.loading) {
      return (
        <Tooltip key={item.id} title={item.title} placement="bottom">
          <Button {...buttonProps}>
            <Spin size="small" />
            <span className="button-text">{item.title}</span>
          </Button>
        </Tooltip>
      );
    }

    return (
      <Tooltip key={item.id} title={item.title} placement="bottom">
        <Button {...buttonProps}>
          {item.icon && <span className="button-icon">{item.icon}</span>}
          <span className="button-text">{item.title}</span>
        </Button>
      </Tooltip>
    );
  };

  return (
    <UserActionsContainer className={className}>
      <Space size="small" wrap={false}>
        {items.map(renderActionButton)}
      </Space>
    </UserActionsContainer>
  );
};

export default UserActions;