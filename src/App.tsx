import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './index.css';

// 页面组件导入
import HomePageBasic from './pages/home/HomePageBasic';
import NotFoundPage from './pages/error/NotFoundPage';

// 新增业务页面组件
import HeroSection from './pages/home/components/hero/HeroSection';
import CategoryBentoGrid from './pages/home/components/categories/CategoryBentoGrid';
import OrderCreationWizard from './pages/order/components/OrderCreationWizard';
import OrderMarketList from './pages/market/components/OrderMarketList';

// 主题配置
import { getDynamicThemeConfig } from './theme/themeConfig';

// 认证组件导入
import { PopupAuthProvider } from './components/Auth/PopupAuthManager';

// 创建React Query客户端
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5分钟
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 首页路由 */}
        <Route path='/' element={<HomePageBasic />} />

        {/* 认证相关功能暂时隐藏，后续可重新启用 */}

        {/* 业务页面路由 */}
        <Route path='/hero' element={<HeroSection />} />
        <Route path='/categories' element={<CategoryBentoGrid />} />
        <Route path='/create-order' element={<OrderCreationWizard />} />
        <Route path='/market' element={<OrderMarketList />} />

        {/* 分类特定页面 */}
        <Route path='/category/:categoryId' element={<OrderMarketList />} />

        {/* 404页面 */}
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <PopupAuthProvider>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider locale={zhCN}>
          <AppContent />
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </ConfigProvider>
      </QueryClientProvider>
    </PopupAuthProvider>
  );
};

export default App;
