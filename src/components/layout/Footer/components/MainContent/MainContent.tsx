import React from 'react';
import { Layout, Row, Col } from 'antd';
import styled from '@emotion/styled';
import { ServiceGrid } from './ServiceGrid';
import { PromotionBanner } from './PromotionBanner';
import { useFooterConfig } from '../../config/footerConfig';
import type { MainContentProps } from '../../../types/component';

const { Content } = Layout;

// 样式化主内容容器
const MainContentContainer = styled(Content)`
  background: ${({ theme }) => theme.token?.colorBgContainer || '#001529'};
  padding: 0 24px;
  width: 100%;

  .main-content-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 0;

    @media (max-width: 1200px) {
      max-width: 100%;
      padding: 32px 16px;
    }

    @media (max-width: 768px) {
      padding: 24px 12px;
    }

    @media (max-width: 576px) {
      padding: 20px 8px;
    }
  }

  // 内容区块间距
  .content-section {
    margin-bottom: 40px;

    &:last-child {
      margin-bottom: 0;
    }

    @media (max-width: 768px) {
      margin-bottom: 32px;
    }

    @media (max-width: 576px) {
      margin-bottom: 24px;
    }
  }

  // 区块标题样式
  .section-title {
    color: ${({ theme }) => theme.token?.colorText || '#ffffff'};
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 24px 0;
    text-align: center;

    @media (max-width: 768px) {
      font-size: 18px;
      margin-bottom: 20px;
    }

    @media (max-width: 576px) {
      font-size: 16px;
      margin-bottom: 16px;
    }
  }

  // 分割线样式
  .section-divider {
    height: 1px;
    background: ${({ theme }) => theme.token?.colorBorder || 'rgba(255, 255, 255, 0.1)'};
    margin: 40px 0;
    border: none;

    @media (max-width: 768px) {
      margin: 32px 0;
    }

    @media (max-width: 576px) {
      margin: 24px 0;
    }
  }

  // 加载状态
  &.loading {
    .main-content-inner {
      opacity: 0.6;
      pointer-events: none;
    }
  }
`;

// 样式化行容器
const StyledRow = styled(Row)`
  width: 100%;
`;

/**
 * 万象生活底栏主内容组件
 * 包含服务网格和推广横幅
 */
export const MainContent: React.FC<MainContentProps> = ({
  services,
  promotion,
  loading = false,
  className,
  gridCols,
  onServiceClick,
  onPromotionClick
}) => {
  // 获取默认配置
  const defaultConfig = useFooterConfig();

  // 合并配置
  const finalServices = services || defaultConfig.mainContent.services;
  const finalPromotion = promotion || defaultConfig.mainContent.promotion;

  return (
    <MainContentContainer
      className={`main-content ${loading ? 'loading' : ''} ${className || ''}`}
      role="main"
      aria-label="主要内容区域"
    >
      <div className="main-content-inner">
        <StyledRow gutter={[0, 0]} justify="center">
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
            {/* 推广横幅区域 */}
            {finalPromotion && (
              <div className="content-section promotion-section">
                <PromotionBanner
                  promotion={finalPromotion}
                  onClick={onPromotionClick}
                />
              </div>
            )}

            {/* 服务网格区域 */}
            <div className="content-section services-section">
              <h2 className="section-title">
                热门服务
              </h2>

              <ServiceGrid
                services={finalServices}
                loading={loading}
                gridCols={gridCols}
                onServiceClick={onServiceClick}
              />
            </div>
          </Col>
        </StyledRow>
      </div>
    </MainContentContainer>
  );
};

export default MainContent;