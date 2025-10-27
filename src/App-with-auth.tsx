import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'react-redux';
import { store } from './store';
import './index.css';

// 页面组件导入
import HomePageBasic from '@/pages/home/HomePageBasic';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import RegisterInfoPage from '@/pages/auth/RegisterInfoPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import NotFoundPage from '@/pages/error/NotFoundPage';

// 创建React Query客户端
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5分钟
      refetchOnWindowFocus: false,
    },
  },
})

const AppContent: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 首页路由 */}
        <Route path="/" element={<HomePageBasic />} />

        {/* 认证页面路由 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register-info" element={<RegisterInfoPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* 404页面 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider locale={zhCN}>
          <AppContent />
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </ConfigProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;