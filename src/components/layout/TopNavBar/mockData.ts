/**
 * TopNavBar组件的模拟数据
 * 用于开发、测试和演示
 */

import type { User, NavItem, NotificationItem } from './types';
import { uiLogger } from '@/utils/logger';

// 模拟用户数据
export const mockUsers: Record<string, User> = {
  guest: {
    id: 'guest-001',
    name: '访客用户',
    email: 'guest@example.com',
    role: 'guest',
    isOnline: false,
  },
  regularUser: {
    id: 'user-001',
    name: '张三',
    email: 'zhangsan@example.com',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    role: 'user',
    isOnline: true,
  },
  vendor: {
    id: 'vendor-001',
    name: '李四餐厅',
    email: 'vendor@example.com',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    role: 'vendor',
    isOnline: true,
  },
  admin: {
    id: 'admin-001',
    name: '管理员',
    email: 'admin@example.com',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    role: 'admin',
    isOnline: true,
  },
};

// 模拟导航项
export const mockNavigationItems: NavItem[] = [
  {
    key: 'home',
    label: '首页',
    path: '/',
    icon: null, // 在组件中会动态设置
  },
  {
    key: 'vendor-center',
    label: '供应商中心',
    path: '/vendor',
    icon: null,
  },
  {
    key: 'task-management',
    label: '任务管理',
    path: '/tasks',
    icon: null,
    badge: 3, // 模拟3个未完成任务
  },
  {
    key: 'help',
    label: '帮助',
    path: '/help',
    icon: null,
  },
];

// 模拟通知数据
export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-001',
    title: '新订单提醒',
    content: '您有一个新的订单待处理，请及时查看',
    time: new Date(Date.now() - 5 * 60 * 1000), // 5分钟前
    read: false,
    type: 'info',
  },
  {
    id: 'notif-002',
    title: '任务即将到期',
    content: '任务"完成今日报表"将在1小时后到期',
    time: new Date(Date.now() - 15 * 60 * 1000), // 15分钟前
    read: false,
    type: 'warning',
  },
  {
    id: 'notif-003',
    title: '系统维护通知',
    content: '系统将于今晚22:00-23:00进行维护升级',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
    read: true,
    type: 'info',
  },
  {
    id: 'notif-004',
    title: '订单完成',
    content: '订单#12345已完成，用户已确认收货',
    time: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3小时前
    read: true,
    type: 'success',
  },
  {
    id: 'notif-005',
    title: '支付异常',
    content: '订单#12347支付失败，请及时处理',
    time: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6小时前
    read: false,
    type: 'error',
  },
];

// 用户菜单项配置
export const mockUserMenuItems = [
  {
    key: 'profile',
    label: '个人资料',
    icon: null, // 在组件中会动态设置
    onClick: () => uiLogger.info('查看个人资料'),
  },
  {
    key: 'settings',
    label: '设置',
    icon: null,
    onClick: () => uiLogger.info('打开设置'),
  },
  {
    key: 'vendor-panel',
    label: '供应商面板',
    icon: null,
    onClick: () => uiLogger.info('进入供应商面板'),
  },
  {
    key: 'admin-panel',
    label: '管理后台',
    icon: null,
    onClick: () => uiLogger.info('进入管理后台'),
  },
  {
    key: 'logout',
    label: '退出登录',
    icon: null,
    onClick: () => uiLogger.info('用户退出登录'),
  },
];

// 工具函数：根据用户角色过滤菜单项
export const getUserMenuItems = (user: User) => {
  const baseItems = ['profile', 'settings'];
  const roleItems = {
    guest: [],
    user: [...baseItems],
    vendor: [...baseItems, 'vendor-panel'],
    admin: [...baseItems, 'vendor-panel', 'admin-panel'],
  };

  const allowedKeys = [...(roleItems[user.role] || baseItems), 'logout'];

  return mockUserMenuItems
    .filter(item => allowedKeys.includes(item.key))
    .map(item => ({
      ...item,
      onClick: () => {
        uiLogger.info(`用户 ${user.name} 点击了 ${item.label}`);
        item.onClick();
      },
    }));
};

// 工具函数：获取未读通知数量
export const getUnreadNotificationCount = (notifications: NotificationItem[]) => {
  return notifications.filter(n => !n.read).length;
};

// 工具函数：根据时间格式化显示
export const formatNotificationTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;

  return date.toLocaleDateString('zh-CN');
};

// 工具函数：根据用户角色获取导航项
export const getNavigationItems = (user: User): NavItem[] => {
  const baseItems = ['home', 'help'];
  const roleItems = {
    guest: [...baseItems],
    user: [...baseItems, 'task-management'],
    vendor: [...baseItems, 'vendor-center', 'task-management'],
    admin: [...baseItems, 'vendor-center', 'task-management'],
  };

  const allowedKeys = roleItems[user.role] || baseItems;

  return mockNavigationItems
    .filter(item => allowedKeys.includes(item.key))
    .map(item => ({
      ...item,
      // 动态更新任务徽章数量
      badge: item.key === 'task-management' ? Math.floor(Math.random() * 5) : item.badge,
    }));
};

// 预设的常用场景数据
export const scenarios = {
  // 访客模式
  guestUser: {
    user: mockUsers.guest,
    navigationItems: getNavigationItems(mockUsers.guest),
    notifications: [],
    userMenuItems: [{ key: 'login', label: '登录', onClick: () => {} }],
  },

  // 普通用户模式
  regularUser: {
    user: mockUsers.regularUser,
    navigationItems: getNavigationItems(mockUsers.regularUser),
    notifications: mockNotifications.slice(0, 3),
    userMenuItems: getUserMenuItems(mockUsers.regularUser),
  },

  // 供应商模式
  vendorUser: {
    user: mockUsers.vendor,
    navigationItems: getNavigationItems(mockUsers.vendor),
    notifications: mockNotifications,
    userMenuItems: getUserMenuItems(mockUsers.vendor),
  },

  // 管理员模式
  adminUser: {
    user: mockUsers.admin,
    navigationItems: getNavigationItems(mockUsers.admin),
    notifications: mockNotifications,
    userMenuItems: getUserMenuItems(mockUsers.admin),
  },
};
