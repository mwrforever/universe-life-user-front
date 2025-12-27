/**
 * Universe Life 万象生活 - 路由配置
 * 完整的路由映射和权限配置
 */

import React from 'react';

// 路由类型定义
export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType<Record<string, unknown>>> | React.ComponentType<Record<string, unknown>>;
  title: string;
  description?: string;
  requiresAuth?: boolean;
  roles?: string[];
  hidden?: boolean;
  children?: RouteConfig[];
}

// 主路由配置
export const mainRoutes: RouteConfig[] = [
  {
    path: '/',
    component: React.lazy(() => import('../pages/home/HomePageBasic')),
    title: '首页',
    description: '万象生活专业接单平台首页',
    requiresAuth: false,
  },
  {
    path: '/hero',
    component: React.lazy(() => import('../pages/home/components/hero/HeroSection')),
    title: 'Hero展示',
    description: '现代化Hero区域展示页面',
    requiresAuth: false,
  },
  {
    path: '/categories',
    component: React.lazy(() => import('../pages/home/components/categories/CategoryBentoGrid')),
    title: '分类展示',
    description: '四大业务分类展示页面',
    requiresAuth: false,
  },
  {
    path: '/create-order',
    component: React.lazy(() => import('../pages/order/CreateOrderPage')),
    title: '发布需求',
    description: '项目需求发布向导',
    requiresAuth: true,
  },
  {
    path: '/category/:categoryId',
    component: React.lazy(() => import('../pages/market/components/OrderMarketList')),
    title: '分类市场',
    description: '特定分类的项目市场',
    requiresAuth: false,
  },
  {
    path: '/profile',
    component: React.lazy(() => import('../pages/profile/ProfilePage')),
    title: '个人中心',
    description: '用户个人中心页面',
    requiresAuth: false,
  },
  {
    path: '/user/orders',
    component: React.lazy(() => import('../pages/user/orders/UserOrdersPage')),
    title: '我的项目',
    description: '用户项目/订单列表管理页面',
    requiresAuth: true,
  },
  {
    path: '/user/wallet',
    component: React.lazy(() => import('../pages/user/wallet/UserWalletPage')),
    title: '钱包',
    description: '用户钱包与资金明细管理页面',
    requiresAuth: true,
  },
  {
    path: '/user/favorites',
    component: React.lazy(() => import('../pages/user/favorites/UserFavoritesPage')),
    title: '我的收藏',
    description: '用户收藏的服务和店铺管理页面',
    requiresAuth: true,
  },
  {
    path: '/settings',
    component: React.lazy(() => import('../pages/settings/SettingsPage')),
    title: '账户设置',
    description: '用户账户信息和安全设置管理页面',
    requiresAuth: true,
  },
  {
    path: '/tasks/:role/:status',
    component: React.lazy(() => import('../pages/tasks/TasksPage')),
    title: '任务管理',
    description: '需求管理和接单管理页面',
    requiresAuth: true,
  },
  {
    path: '/messages',
    component: React.lazy(() => import('../pages/messages/MessagesPage')),
    title: '消息中心',
    description: '私聊和群聊消息管理',
    requiresAuth: true,
  },
  {
    path: '/services',
    component: React.lazy(() => import('../pages/services/ServicesPage')),
    title: '服务大厅',
    description: '服务分类与热门服务展示页面',
    requiresAuth: false,
  },
  {
    path: '/task/:id',
    component: React.lazy(() => import('../pages/tasks/TaskDetailPage')),
    title: '任务详情',
    description: '任务/服务详情页面',
    requiresAuth: false,
  },
  {
    path: '/service/:id',
    component: React.lazy(() => import('../pages/tasks/TaskDetailPage')),
    title: '服务详情',
    description: '服务详情页面',
    requiresAuth: false,
  },
  {
    path: '/help',
    component: React.lazy(() => import('../pages/help/HelpCenterPage')),
    title: '帮助中心',
    description: '帮助中心、售后服务、常见问题',
    requiresAuth: false,
  },
  {
    path: '/help/service',
    component: React.lazy(() => import('../pages/help/CustomerServicePage')),
    title: '在线客服',
    description: '在线客服聊天页面',
    requiresAuth: false,
  },
  {
    path: '/auth/callback',
    component: React.lazy(() => import('../pages/auth/AuthCallbackPage')),
    title: '认证回调',
    description: 'OAuth2认证回调处理页面',
    requiresAuth: false,
    hidden: true,
  },
  {
    path: '/404',
    component: React.lazy(() => import('../pages/error/NotFoundPage')),
    title: '页面未找到',
    description: '404错误页面',
    requiresAuth: false,
    hidden: true,
  },
  {
    path: '/test/logout',
    component: React.lazy(() => import('../pages/test/LogoutTestPage')),
    title: '登出测试',
    description: 'OAuth2登出流程测试页面',
    requiresAuth: false,
  },
];

// 游客可访问路由
export const publicRoutes = mainRoutes.filter(route => !route.requiresAuth);

// 需要认证路由
export const protectedRoutes = mainRoutes.filter(route => route.requiresAuth);

// 隐藏路由（用于后台处理）
export const hiddenRoutes = mainRoutes.filter(route => route.hidden);

// 业务功能路由（公开可见）
export const businessRoutes = [
  '/', // 首页
  '/market', // 服务市场
  '/categories', // 分类展示
  '/help', // 帮助中心
  '/about', // 关于我们
];

// 用户功能路由（需要登录）
export const userRoutes = [
  '/create-order', // 发布需求
  '/user/profile', // 个人中心
  '/user/orders', // 我的项目
  '/user/favorites', // 我的收藏
  '/user/wallet', // 钱包
  '/messages', // 消息中心
  '/dashboard', // 仪表板
];

// 认证相关路由 - 暂时移除，后续可重新启用
export const authRoutes: string[] = [];

// 导航菜单配置
export const navigationMenu = [
  {
    key: 'home',
    label: '首页',
    path: '/',
    icon: 'HomeOutlined',
    requiresAuth: false,
  },
  {
    key: 'market',
    label: '订单广场',
    path: '/market',
    icon: 'ShoppingOutlined',
    requiresAuth: false,
  },
  {
    key: 'create-order',
    label: '发布需求',
    path: '/create-order',
    icon: 'PlusCircleOutlined',
    requiresAuth: true,
  },
  {
    key: 'orders',
    label: '我的项目',
    path: '/user/orders',
    icon: 'OrderedListOutlined',
    requiresAuth: true,
  },
  {
    key: 'messages',
    label: '消息',
    path: '/messages',
    icon: 'MessageOutlined',
    requiresAuth: true,
  },
];

// 面包屑导航配置
export const breadcrumbRoutes: Record<string, { title: string; parent?: string }> = {
  '/': { title: '首页' },
  '/market': { title: '订单广场', parent: '/' },
  '/category': { title: '分类市场', parent: '/market' },
  '/create-order': { title: '发布需求', parent: '/market' },
  '/user': { title: '个人中心', parent: '/' },
  '/user/profile': { title: '个人信息', parent: '/user' },
  '/user/orders': { title: '我的项目', parent: '/user' },
  '/user/favorites': { title: '我的收藏', parent: '/user' },
  '/user/wallet': { title: '钱包', parent: '/user' },
  '/messages': { title: '消息中心', parent: '/user' },
  '/help': { title: '帮助中心', parent: '/' },
  '/about': { title: '关于我们', parent: '/' },
};

// 路由权限检查函数
export function checkRoutePermission(routePath: string, isAuthenticated: boolean): boolean {
  const route = mainRoutes.find(r => {
    // 处理动态路由参数
    const routePattern = r.path.replace(/:[^/]+/g, '[^/]+');
    const pathRegex = new RegExp(`^${routePattern}$`);
    return pathRegex.test(routePath);
  });

  if (!route) return true;

  return !route.requiresAuth || isAuthenticated;
}

// 获取路由标题
export function getRouteTitle(routePath: string): string {
  const route = mainRoutes.find(r => {
    const routePattern = r.path.replace(/:[^/]+/g, '[^/]+');
    const pathRegex = new RegExp(`^${routePattern}$`);
    return pathRegex.test(routePath);
  });

  return route?.title || '万象生活';
}

// 根据角色获取可访问路由
export function getRoutesByRole(role: string | null): RouteConfig[] {
  if (!role) return publicRoutes;

  return [
    ...publicRoutes,
    ...protectedRoutes.filter(route => !route.roles || route.roles.includes(role)),
  ];
}

export default mainRoutes;
