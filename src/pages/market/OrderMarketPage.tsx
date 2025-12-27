import React, { useState } from 'react';
import { Typography } from 'antd';
import styled from '@emotion/styled';
import OrderFeedContainer from './components/OrderFeedContainer';
import { logger } from '@/utils/logger';

// FilterType 类型定义
type FilterType = 'comprehensive' | 'price' | 'newest';

const { Title } = Typography;

// 页面容器
const PageContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
`;

// 页面内容
const PageContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;

  @media (max-width: 768px) {
    padding: 16px 12px;
  }
`;

// 页面标题
const PageHeader = styled.div`
  margin-bottom: 24px;
  text-align: center;

  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

const PageTitle = styled(Title)`
  color: #1a1a1a !important;
  font-size: 28px !important;
  font-weight: 700 !important;
  margin-bottom: 8px !important;

  @media (max-width: 768px) {
    font-size: 24px !important;
  }
`;

const PageSubtitle = styled.p`
  color: #666;
  font-size: 16px;
  margin: 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

// OrderMarketPage 组件
const OrderMarketPage: React.FC = () => {
  const [filterType] = useState<FilterType>('comprehensive');

  const handleGrabOrder = (orderId: string) => {
    logger.info('抢单操作:', { orderId });
    // 这里可以添加抢单逻辑
  };

  const handleLoadComplete = (loadedCount: number) => {
    logger.info('订单加载完成:', { loadedCount });
  };

  return (
    <PageContainer>
      <PageContent>
        <PageHeader>
          <PageTitle level={1}>订单广场</PageTitle>
          <PageSubtitle>
            发现优质服务需求，开启接单赚钱之旅
          </PageSubtitle>
        </PageHeader>

        <OrderFeedContainer
          initialFilterType={filterType}
          onGrabOrder={handleGrabOrder}
          onLoadComplete={handleLoadComplete}
          enableInfiniteScroll={true}
        />
      </PageContent>
    </PageContainer>
  );
};

export default OrderMarketPage;