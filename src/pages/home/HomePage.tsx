import React, { useState } from 'react';
import { message } from 'antd';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { Header, Navigation, Footer } from './components/layout';
import { BannerCarousel } from './components/banner';
import { QuickGrid } from './components/grid';
import { TaskList } from './components/tasks';
import { PullToRefresh, ErrorBoundary } from './components/ui';
import { CustomerService, AntiFraudModal, StatisticsBanner } from './components/special';
import { useHomeData, useTaskFilter } from './hooks';
import { Task, Banner, GridItem } from './types';

// 样式化主容器
const HomeContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 0;
`;

const ContentContainer = styled(Container)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
`;

// 首页组件
export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('latest');
  const { filter } = useTaskFilter();

  // 获取首页数据
  const {
    banners,
    gridItems,
    statistics,
    isLoading,
    refetchAll,
  } = useHomeData();

  // 处理刷新
  const handleRefresh = async () => {
    try {
      await refetchAll();
      message.success('刷新成功');
    } catch {
      message.error('刷新失败，请重试');
    }
  };

  // 处理搜索
  const handleSearch = (value: string) => {
    if (value.trim()) {
      // 实现搜索逻辑
      console.log('搜索:', value);
      // 可以跳转到搜索结果页或更新筛选条件
    }
  };

  // 处理Logo点击
  const handleLogoClick = () => {
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 处理Banner点击
  const handleBannerClick = (banner: Banner) => {
    console.log('Banner点击:', banner);
    // 实现Banner跳转逻辑
  };

  // 处理宫格项点击
  const handleGridItemClick = (item: GridItem) => {
    console.log('宫格项点击:', item);
    // 实现宫格项跳转逻辑
  };

  // 处理任务查看
  const handleTaskView = (task: Task) => {
    console.log('查看任务:', task);
    // 使用React Router进行路由跳转
    navigate(`/task/${task.id}`);
  };

  // 处理任务接单
  const handleTaskGrab = (taskId: string) => {
    console.log('接单:', taskId);
    // 实现接单逻辑
    message.success('接单成功！');
  };

  // 处理任务收藏
  const handleTaskFavorite = (taskId: string, isFavorite: boolean) => {
    console.log('收藏任务:', taskId, isFavorite);
    // 实现收藏逻辑
    message.success(isFavorite ? '已添加收藏' : '已取消收藏');
  };

  return (
    <ErrorBoundary>
      <HomeContainer>
        {/* 头部导航 */}
        <Header
          onSearch={handleSearch}
          onLogoClick={handleLogoClick}
        />

        {/* 主要内容 */}
        <MainContent>
          <PullToRefresh onRefresh={handleRefresh}>
            <ContentContainer>
              <ErrorBoundary>
                {/* 轮播图 */}
                <BannerCarousel
                  banners={banners}
                  loading={isLoading}
                  onBannerClick={handleBannerClick}
                />
              </ErrorBoundary>

              <ErrorBoundary>
                {/* 统计横幅 */}
                <StatisticsBanner
                  statistics={statistics}
                  loading={isLoading}
                />
              </ErrorBoundary>

              <ErrorBoundary>
                {/* 快速宫格 */}
                <QuickGrid
                  gridItems={gridItems}
                  loading={isLoading}
                  onItemClick={handleGridItemClick}
                />
              </ErrorBoundary>

              <ErrorBoundary>
                {/* 导航标签 */}
                <Navigation
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              </ErrorBoundary>

              <ErrorBoundary>
                {/* 任务列表 */}
                <TaskList
                  filter={filter}
                  onTaskView={handleTaskView}
                  onTaskGrab={handleTaskGrab}
                  onTaskFavorite={handleTaskFavorite}
                />
              </ErrorBoundary>
            </ContentContainer>
          </PullToRefresh>
        </MainContent>

        {/* 底部 */}
        <Footer />

        {/* 客服支持 */}
        <CustomerService />

        {/* 防骗弹窗 */}
        <AntiFraudModal />
      </HomeContainer>
    </ErrorBoundary>
  );
};

export default HomePage;