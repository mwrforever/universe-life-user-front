import React from 'react';
import { Card, Badge, Tooltip, Spin } from 'antd';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import type { ServiceGridItem } from '../../../types/component';

// 样式化服务卡片容器
const ServiceCardContainer = styled(Card)<{
  size: 'small' | 'medium' | 'large';
  color?: string;
  bordered?: boolean;
  shadow?: boolean;
  hoverable?: boolean;
}>`
  height: 100%;
  border-radius: ${({ theme }) => theme.token?.borderRadius || 12}px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;

  // 边框控制
  ${({ bordered }) => !bordered && `
    border: none;
  `}

  // 阴影控制
  ${({ shadow }) => shadow ? `
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  ` : ''}

  // 悬停效果
  ${({ hoverable }) => hoverable ? `
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      border-color: ${({ theme, color }) => color || theme.token?.colorPrimary || '#1890ff'};
    }
  ` : ''}

  // 尺寸配置
  ${({ size }) => {
    switch (size) {
      case 'small':
        return `
          .service-icon {
            font-size: 24px;
            width: 24px;
            height: 24px;
          }
          .service-title {
            font-size: 14px;
          }
          .service-description {
            font-size: 12px;
          }
        `;
      case 'large':
        return `
          .service-icon {
            font-size: 40px;
            width: 40px;
            height: 40px;
          }
          .service-title {
            font-size: 18px;
          }
          .service-description {
            font-size: 14px;
          }
        `;
      default: // medium
        return `
          .service-icon {
            font-size: 32px;
            width: 32px;
            height: 32px;
          }
          .service-title {
            font-size: 16px;
          }
          .service-description {
            font-size: 13px;
          }
        `;
    }
  }}

  // 主题色边框
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ color, theme }) => color || theme.token?.colorPrimary || '#1890ff'};
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  .ant-card-body {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    height: 100%;
    gap: 12px;

    @media (max-width: 768px) {
      padding: 16px;
      gap: 8px;
    }
  }

  // 状态样式
  &.status-inactive {
    opacity: 0.6;
    cursor: not-allowed;

    &:hover {
      transform: none;
      box-shadow: none;
    }
  }

  &.status-coming-soon {
    .service-title::after {
      content: '敬请期待';
      display: block;
      font-size: 10px;
      color: #52c41a;
      margin-top: 4px;
      font-weight: 500;
    }
  }
`;

// 服务图标容器
const ServiceIcon = styled.div<{ color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${({ color, theme }) =>
    color ? `${color}15` : `${theme.token?.colorPrimary}15` || '#1890ff15'
  };
  color: ${({ color, theme }) =>
    color || theme.token?.colorPrimary || '#1890ff'
  };
  font-size: 28px;
  margin-bottom: 8px;
  transition: all 0.3s ease;

  .service-icon:hover {
    transform: scale(1.1);
    background: ${({ color, theme }) =>
      color ? `${color}25` : `${theme.token?.colorPrimary}25` || '#1890ff25'
    };
  }

  // 如果是图片URL
  &.is-image {
    background: transparent;
    border-radius: ${({ theme }) => theme.token?.borderRadius || 8}px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;

// 服务标题
const ServiceTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.token?.colorText || '#ffffff'};
  margin: 0;
  line-height: 1.2;
`;

// 服务描述
const ServiceDescription = styled.div`
  color: ${({ theme }) => theme.token?.colorTextSecondary || 'rgba(255, 255, 255, 0.65)'};
  font-size: 13px;
  line-height: 1.4;
  margin: 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

// 状态徽章容器
const StatusBadges = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
`;

interface ServiceCardProps {
  service: ServiceGridItem;
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  bordered?: boolean;
  shadow?: boolean;
  hoverable?: boolean;
  onClick?: (item: ServiceGridItem) => void;
  className?: string;
}

/**
 * 万象生活服务卡片组件
 * 支持图标、徽章、状态标识、响应式布局
 */
export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  size = 'medium',
  loading = false,
  bordered = true,
  shadow = true,
  hoverable = true,
  onClick,
  className
}) => {
  const navigate = useNavigate();

  // 处理卡片点击
  const handleCardClick = () => {
    // 如果正在加载或服务不可用，不处理点击
    if (loading || service.status === 'inactive') {
      return;
    }

    // 触发外部事件回调
    onClick?.(service);

    // 发送分析事件
    if (service.analytics) {
      console.log('Analytics Event:', service.analytics);
    }

    // 导航处理
    if (service.href) {
      navigate(service.href);
    }
  };

  // 判断是否为图片URL
  const isImageUrl = (icon: React.ReactNode) => {
    return typeof icon === 'string' && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(icon);
  };

  // 渲染状态徽章
  const renderStatusBadges = () => {
    if (loading) {
      return (
        <StatusBadges>
          <Spin size="small" />
        </StatusBadges>
      );
    }

    const badges = [];

    // 新功能标识
    if (service.isNew) {
      badges.push(
        <Badge key="new" count="NEW" size="small" style={{ backgroundColor: '#52c41a' }} />
      );
    }

    // 热门标识
    if (service.isHot) {
      badges.push(
        <Badge key="hot" count="HOT" size="small" style={{ backgroundColor: '#ff4d4f' }} />
      );
    }

    // 数字徽章
    if (service.badge && service.badge > 0) {
      badges.push(
        <Badge key="badge" count={service.badge} size="small" />
      );
    }

    if (badges.length === 0) {
      return null;
    }

    return <StatusBadges>{badges}</StatusBadges>;
  };

  // 渲染服务图标
  const renderIcon = () => {
    const { icon, color } = service;

    if (isImageUrl(icon)) {
      return (
        <ServiceIcon className="service-icon is-image" color={color}>
          <img
            src={icon as string}
            alt={service.title}
            loading="lazy"
          />
        </ServiceIcon>
      );
    }

    return (
      <ServiceIcon className="service-icon" color={color}>
        {icon}
      </ServiceIcon>
    );
  };

  // 获取状态类名
  const getStatusClassName = () => {
    switch (service.status) {
      case 'inactive':
        return 'status-inactive';
      case 'coming-soon':
        return 'status-coming-soon';
      default:
        return '';
    }
  };

  return (
    <Tooltip title={service.description} placement="top">
      <ServiceCardContainer
        size={size}
        color={service.color}
        bordered={bordered}
        shadow={shadow}
        hoverable={hoverable}
        className={`service-card ${getStatusClassName()} ${className || ''}`}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        aria-label={`${service.title}: ${service.description}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
      >
        {renderStatusBadges()}

        <Card.Body className="ant-card-body">
          {renderIcon()}

          <ServiceTitle className="service-title">
            {service.title}
          </ServiceTitle>

          {service.description && (
            <ServiceDescription className="service-description">
              {service.description}
            </ServiceDescription>
          )}
        </Card.Body>
      </ServiceCardContainer>
    </Tooltip>
  );
};

export default ServiceCard;