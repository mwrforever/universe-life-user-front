import React from 'react';
import { Row, Col, Empty, Skeleton } from 'antd';
import styled from '@emotion/styled';
import ServiceCard from './ServiceCard';
import type { ServiceGridItem } from '../../../types/component';

// 样式化服务网格容器
const ServiceGridContainer = styled.div`
  width: 100%;
  padding: 24px 0;

  .service-grid {
    .service-grid-item {
      margin-bottom: 16px;
    }
  }

  // 网格间距优化
  @media (max-width: 1200px) {
    .service-grid-item {
      margin-bottom: 12px;
    }
  }

  @media (max-width: 768px) {
    .service-grid-item {
      margin-bottom: 8px;
    }
  }

  // 加载状态样式
  .loading-skeleton {
    .ant-skeleton {
      .ant-skeleton-content {
        padding: 20px;
      }
    }
  }

  // 空状态样式
  .empty-state {
    padding: 60px 20px;
    text-align: center;

    .ant-empty-description {
      color: ${({ theme }) => theme.token?.colorTextSecondary || 'rgba(255, 255, 255, 0.65)'};
    }
  }
`;

interface ServiceGridProps {
  services: ServiceGridItem[];
  loading?: boolean;
  gridCols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    xxl?: number;
  };
  cardSize?: 'small' | 'medium' | 'large';
  cardBordered?: boolean;
  cardShadow?: boolean;
  cardHoverable?: boolean;
  onServiceClick?: (item: ServiceGridItem) => void;
  className?: string;
}

/**
 * 万象生活服务网格组件
 * 支持响应式布局、多种尺寸、加载状态
 */
export const ServiceGrid: React.FC<ServiceGridProps> = ({
  services,
  loading = false,
  gridCols = {
    xs: 12,
    sm: 8,
    md: 6,
    lg: 6,
    xl: 4,
    xxl: 4
  },
  cardSize = 'medium',
  cardBordered = true,
  cardShadow = true,
  cardHoverable = true,
  onServiceClick,
  className
}) => {
  // 渲染加载状态
  if (loading) {
    return (
      <ServiceGridContainer className={`loading-skeleton ${className || ''}`}>
        <Row gutter={[16, 16]} className="service-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <Col
              key={`skeleton-${index}`}
              {...gridCols}
              className="service-grid-item"
            >
              <Skeleton
                active
                avatar={{ shape: 'circle', size: 64 }}
                paragraph={{ rows: 2, width: ['100%', '80%'] }}
              />
            </Col>
          ))}
        </Row>
      </ServiceGridContainer>
    );
  }

  // 渲染空状态
  if (!services || services.length === 0) {
    return (
      <ServiceGridContainer className={`empty-state ${className || ''}`}>
        <Empty
          description="暂无可用服务"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </ServiceGridContainer>
    );
  }

  // 过滤有效服务
  const validServices = services.filter(service => service && service.id);

  // 渲染服务网格
  return (
    <ServiceGridContainer className={className}>
      <Row
        gutter={[16, 16]}
        className="service-grid"
        role="grid"
        aria-label="服务网格"
      >
        {validServices.map((service) => (
          <Col
            key={service.id}
            {...gridCols}
            className="service-grid-item"
            role="gridcell"
          >
            <ServiceCard
              service={service}
              size={cardSize}
              bordered={cardBordered}
              shadow={cardShadow}
              hoverable={cardHoverable}
              onClick={onServiceClick}
            />
          </Col>
        ))}
      </Row>
    </ServiceGridContainer>
  );
};

export default ServiceGrid;