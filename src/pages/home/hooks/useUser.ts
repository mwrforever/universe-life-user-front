import { useQuery } from '@tanstack/react-query';
import { getCurrentUser, getUnreadCount } from '../services';
import { User, UnreadCount } from '../types';

// 获取当前用户信息
export const useCurrentUser = () => {
  return useQuery<User, Error>({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5分钟缓存
    enabled: !!localStorage.getItem('token'),
  });
};

// 获取未读消息数量
export const useUnreadCount = () => {
  return useQuery<UnreadCount, Error>({
    queryKey: ['unreadCount'],
    queryFn: getUnreadCount,
    refetchInterval: 30 * 1000, // 30秒轮询
    staleTime: 10 * 1000, // 10秒缓存
    enabled: !!localStorage.getItem('token'),
  });
};

// 综合用户信息Hook
export const useUser = () => {
  const userQuery = useCurrentUser();
  const unreadCountQuery = useUnreadCount();

  return {
    user: userQuery.data,
    userLoading: userQuery.isLoading,
    userError: userQuery.error,
    unreadCount: unreadCountQuery.data,
    unreadLoading: unreadCountQuery.isLoading,
    unreadError: unreadCountQuery.error,
    isAuthenticated: !!localStorage.getItem('token') && !userQuery.error,
    refetchUser: userQuery.refetch,
    refetchUnread: unreadCountQuery.refetch,
  };
};