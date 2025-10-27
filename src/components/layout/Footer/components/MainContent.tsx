import React, { useState } from 'react';
import { Row, Col, Card, Badge, Button, Skeleton, Spin } from 'antd';
import styled from '@emotion/styled';
import { useFooterConfig } from '../hooks/useFooterConfig';
import { MainContentProps, ServiceGridItem, PromotionBanner as PromotionBannerType } from '../types/component';
import { PromotionBanner } from './MainContent/PromotionBanner/PromotionBanner';

// 样式化组件
const MainContentContainer = styled.div<{ loading?: boolean }>`
  padding: 40px 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 300px;
  position: relative;
  overflow: hidden;

  ${props => props.loading && `
    opacity: 0.6;
    pointer-events: none;
  `}
`;

const ServiceGrid = styled(Row)`
  margin-bottom: 32px;

  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
`;

const ServiceCard = styled(Card)`
  height: 100%;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e8e8e8;
  background: #ffffff;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    border-color: #FF6B35;
  }

  .ant-card-body {
    padding: 24px;
    text-align: center;
  }

  @media (max-width: 768px) {
    .ant-card-body {
      padding: 16px;
    }
  }
`;

const ServiceIcon = styled.div<{ color?: string }>`
  font-size: 48px;
  margin-bottom: 16px;
  color: ${props => props.color || '#FF6B35'};
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    font-size: 36px;
    margin-bottom: 12px;
  }
`;

const ServiceTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;

  @media (max-width: 768px) {
    font-size: 16px;
    margin: 0 0 8px 0;
  }
`;

const ServiceDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: #666666;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const LoadingPlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background: #f5f5f5;
  border-radius: 8px;
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 8px;
  color: #ff4d4f;
  font-size: 16px;
`;

// MainContent 组件
export const MainContent: React.FC<MainContentProps> = ({
  className,
  loading = false,
  error = null,
  onServiceClick,
  onPromotionClick
}) => {
  const { config } = useFooterConfig();
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  // 处理服务卡片点击
  const handleServiceClick = (service: ServiceGridItem) => {
    if (loading || error) return;

    onServiceClick?.(service);

    // 发送分析事件
    if (process.env.NODE_ENV === 'production') {
      console.log('Service clicked:', service);
    }
  };

  // 处理推广横幅点击
  const handlePromotionClick = (promotion: PromotionBannerType) => {
    if (loading || error) return;

    onPromotionClick?.(promotion);

    // 发送分析事件
    if (process.env.NODE_ENV === 'production') {
      console.log('Promotion clicked:', promotion);
    }
  };

  // 错误状态
  if (error) {
    return (
      <MainContentContainer className={className}>
        <ErrorMessage>
          {typeof error === 'string' ? error : '加载失败，请稍后重试'}
        </ErrorMessage>
      </MainContentContainer>
    );
  }

  // 加载状态
  if (loading) {
    return (
      <MainContentContainer className={className} loading>
        <Spin size="large" tip="正在加载...">
          <div style={{ padding: '100px 0' }} />
        </Spin>
      </MainContentContainer>
    );
  }

  return (
    <MainContentContainer className={className}>
      {/* 推广横幅 */}
      {config.promotionBanner && (
        <PromotionBanner
          promotion={config.promotionBanner}
          onClick={handlePromotionClick}
        />
      )}

      {/* 服务网格 */}
      <ServiceGrid gutter={[24, 24]}>
        {config.services.map((service) => (
          <Col
            key={service.id}
            xs={12}
            sm={12}
            md={8}
            lg={6}
            xl={4}
          >
            <ServiceCard
              hoverable
              onClick={() => handleServiceClick(service)}
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
            >
              <ServiceIcon color={service.color}>
                {service.icon}
              </ServiceIcon>
              <ServiceTitle>{service.title}</ServiceTitle>
              <ServiceDescription>{service.description}</ServiceDescription>
              {service.badge && (
                <Badge
                  count={service.badge}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                  }}
                />
              )}
            </ServiceCard>
          </Col>
        ))}
      </ServiceGrid>
    </MainContentContainer>
  );
};

export default MainContent;