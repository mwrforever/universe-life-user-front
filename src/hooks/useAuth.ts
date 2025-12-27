/**
 * 认证状态管理Hook
 * 提供统一的认证状态管理和操作方法
 */

import { useState, useEffect, useCallback } from 'react';
import { OAuth2Service } from '@/services/oauth2/authService';
import type { User } from '@/pages/home/types/user';
import type { User as TopNavBarUser } from '@/components/layout/TopNavBar/types';
import { authLogger } from '@/utils/logger';

export interface UseAuthReturn {
  /** 当前用户 */
  user: User | null;
  /** 是否已登录 */
  isAuthenticated: boolean;
  /** 是否正在加载 */
  isLoading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 登录 */
  login: (redirectUrl?: string) => void;
  /** 登出 */
  logout: () => Promise<void>;
  /** 刷新用户信息 */
  refreshUser: () => void;
  /** 转换为TopNavBar用户格式 */
  toTopNavBarUser: () => TopNavBarUser | undefined;
}

/**
 * 认证状态管理Hook
 */
export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 刷新用户信息
   */
  const refreshUser = useCallback(() => {
    try {
      const currentUser = OAuth2Service.getCurrentUser();
      setUser(currentUser);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取用户信息失败');
      setUser(null);
    }
  }, []);

  /**
   * 登录处理
   */
  const login = useCallback((redirectUrl?: string) => {
    try {
      setError(null);
      OAuth2Service.initiateAuthorization(redirectUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    }
  }, []);

  /**
   * 登出处理
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 执行 OIDC 登出流程（基于 AJAX 请求）
      // 1. 发送 GET 请求到服务端 /connect/logout 端点清除 Session
      // 2. 撤销 token 并清理本地数据
      // 3. 返回成功结果
      const result = await OAuth2Service.logout();
      authLogger.info('📋 登出结果:', result.message);

      // 清除本地用户状态
      setUser(null);

      // 登出成功后跳转到首页
      if (result.success) {
        authLogger.info('✅ 登出成功，准备跳转到首页...');
        // 使用 window.location.href 进行完全刷新，确保所有状态都被清理
        window.location.href = '/';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '登出失败');
      // 即使出错也要清理本地状态并跳转
      setUser(null);
      window.location.href = '/';
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 转换为TopNavBar用户格式
   */
  const toTopNavBarUser = useCallback((): TopNavBarUser | undefined => {
    if (!user) return undefined;

    return {
      id: user.id,
      name: user.nickname || user.username, // 优先使用nickname，它实际上就是username
      email: user.email || `${user.username}@example.com`, // 如果email为空，提供默认邮箱格式
      avatar: user.avatar || '/default-avatar.png', // 提供默认头像
      role: 'user',
      isOnline: true,
    };
  }, [user]);

  /**
   * 检查认证状态
   */
  const checkAuthStatus = useCallback(() => {
    try {
      const isAuthenticated = OAuth2Service.isLoggedIn();
      if (isAuthenticated) {
        refreshUser();
      } else {
        setUser(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '检查认证状态失败');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [refreshUser]);

  /**
   * 监听Token变化（跨标签页同步）
   */
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'universe_access_token' ||
          e.key === 'universe_user_info') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [checkAuthStatus]);

  /**
   * 页面可见性变化时检查认证状态
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAuthStatus();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [checkAuthStatus]);

  /**
   * 定期检查Token是否需要刷新
   */
  useEffect(() => {
    const interval = setInterval(async () => {
      if (OAuth2Service.isLoggedIn()) {
        await OAuth2Service.autoRefreshToken();
        refreshUser();
      }
    }, 5 * 60 * 1000); // 每5分钟检查一次

    return () => clearInterval(interval);
  }, [refreshUser]);

  /**
   * 初始化认证状态
   */
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    refreshUser,
    toTopNavBarUser,
  };
};

export default useAuth;