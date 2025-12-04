import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './index.css';

// 页面组件导入
import HomePageBasic from './pages/home/HomePageBasic';
import OrderMarketPage from './pages/market/OrderMarketPage';
import NotFoundPage from './pages/error/NotFoundPage';

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
    <Routes>
      {/* 首页路由 */}
      <Route path='/' element={<HomePageBasic />} />

      {/* 市场页面路由 */}
      <Route path='/market' element={<OrderMarketPage />} />

      {/* 404页面 */}
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={zhCN}>
        <Router>
          <AppContent />
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </Router>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
