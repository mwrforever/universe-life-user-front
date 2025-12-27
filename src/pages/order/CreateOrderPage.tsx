/**
 * CreateOrderPage - 发布需求页面
 * 复用TopNavBar导航栏 + 精简发布向导
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfigProvider, message } from 'antd';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { getTheme } from '@/components/layout/TopNavBar';
import { OrderCreationWizard } from './components/OrderCreationWizard';
import type { User } from '@/components/layout/TopNavBar/types';
import { useAuth } from '@/hooks/useAuth';
import { uiLogger } from '@/utils/logger';
import { PageContainer, ContentWrapper } from '@/components/common';

const CreateOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { toTopNavBarUser } = useAuth();
  const [currentUser] = useState<User | undefined>(() => toTopNavBarUser());

  const handleSuccess = (orderId: string) => {
    uiLogger.info('需求发布成功:', orderId);
    message.success('需求发布成功！');
    navigate(`/task/${orderId}`);
  };

  const handleCancel = () => navigate(-1);

  return (
    <ConfigProvider theme={getTheme('bright')}>
      <PageContainer>
        {/* TopNavBar导航栏 */}
        <TopNavBar user={currentUser} onNavigate={(path) => navigate(path)} showHomeLink />

        {/* 发布需求向导 */}
        <ContentWrapper>
          <OrderCreationWizard onSuccess={handleSuccess} onCancel={handleCancel} />
        </ContentWrapper>
      </PageContainer>
    </ConfigProvider>
  );
};

export default CreateOrderPage;
