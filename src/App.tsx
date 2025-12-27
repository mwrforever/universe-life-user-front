import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './index.css';

// 页面组件导入
import HomePageBasic from './pages/home/HomePageBasic';
import AuthCallbackPage from './pages/auth/AuthCallbackPage';
import NotFoundPage from './pages/error/NotFoundPage';
import ProfilePage from './pages/profile/ProfilePage';
import UserOrdersPage from './pages/user/orders/UserOrdersPage';
import UserWalletPage from './pages/user/wallet/UserWalletPage';
import UserFavoritesPage from './pages/user/favorites/UserFavoritesPage';
import SettingsPage from './pages/settings/SettingsPage';
import TasksPage from './pages/tasks/TasksPage';
import MessagesPage from './pages/messages/MessagesPage';
import ServicesPage from './pages/services/ServicesPage';
import TaskDetailPage from './pages/tasks/TaskDetailPage';
import CreateOrderPage from './pages/order/CreateOrderPage';
import HelpCenterPage from './pages/help/HelpCenterPage';
import CustomerServicePage from './pages/help/CustomerServicePage';
import ScrollToTop from './components/common/ScrollToTop';

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

      {/* 个人中心路由 */}
      <Route path='/profile' element={<ProfilePage />} />

      {/* 我的项目路由 */}
      <Route path='/user/orders' element={<UserOrdersPage />} />

      {/* 钱包路由 */}
      <Route path='/user/wallet' element={<UserWalletPage />} />

      {/* 我的收藏路由 */}
      <Route path='/user/favorites' element={<UserFavoritesPage />} />

      {/* 账户设置路由 */}
      <Route path='/settings' element={<SettingsPage />} />

      {/* 任务管理路由 */}
      <Route path='/tasks/:role/:status' element={<TasksPage />} />

      {/* 消息中心路由 */}
      <Route path='/messages' element={<MessagesPage />} />

      {/* 服务大厅路由 */}
      <Route path='/services' element={<ServicesPage />} />

      {/* 发布需求路由 */}
      <Route path='/create-order' element={<CreateOrderPage />} />

      {/* 任务/服务详情页路由 */}
      <Route path='/task/:id' element={<TaskDetailPage />} />
      <Route path='/service/:id' element={<TaskDetailPage />} />

      {/* 帮助中心路由 */}
      <Route path='/help' element={<HelpCenterPage />} />
      <Route path='/help/service' element={<CustomerServicePage />} />

      {/* OAuth2 认证回调路由 */}
      <Route path='/auth/callback' element={<AuthCallbackPage />} />

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
          <ScrollToTop />
          <AppContent />
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </Router>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
