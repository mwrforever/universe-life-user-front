/**
 * 受保护的路由组件
 * 只有登录用户才能访问的路由
 */

import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin, Result, Button } from 'antd';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { selectAuthState, checkAuthStatus } from '../../store/slices/authSlice';
import { TokenManager } from '../../services';
import type { User } from '../../store/slices/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** 是否需要特定用户类型 */
  userType?: 'customer' | 'provider' | 'admin';
  /** 是否需要特定权限 */
  requiredPermissions?: string[];
  /** 登录页面的路由 */
  loginPath?: string;
  /** 自定义重定向逻辑 */
  customRedirect?: (isAuthenticated: boolean, user: User) => string | null;
}

/**
 * 受保护路由组件
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  userType,
  requiredPermissions = [],
  loginPath = '/login',
  customRedirect,
}) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isLoading } = useAppSelector(selectAuthState);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 如果本地有token，检查认证状态
        const token = TokenManager.getAccessToken();
        if (token && !isAuthenticated) {
          await dispatch(checkAuthStatus()).unwrap();
        }
      } catch (error) {
        console.error('认证状态检查失败:', error);
        // 清除无效的token
        TokenManager.clearTokens();
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [dispatch, isAuthenticated]);

  // 如果正在检查认证状态或加载中，显示加载指示器
  if (isLoading || isChecking) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <Spin size='large' />
        <div style={{ color: '#666', fontSize: '16px' }}>正在验证登录状态...</div>
      </div>
    );
  }

  // 如果有自定义重定向逻辑，优先使用
  if (customRedirect) {
    const redirectPath = customRedirect(isAuthenticated, user || null);
    if (redirectPath) {
      return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }
  }

  // 如果未认证，重定向到登录页面
  if (!isAuthenticated) {
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // 检查用户类型（如果指定）
  if (userType && user?.userType !== userType) {
    return (
      <Result
        status='403'
        title='权限不足'
        subTitle={`您需要${userType === 'customer' ? '客户' : userType === 'provider' ? '服务提供者' : '管理员'}权限才能访问此页面`}
        extra={
          <Button type='primary' onClick={() => window.history.back()}>
            返回上一页
          </Button>
        }
      />
    );
  }

  // 检查用户权限（如果指定）
  if (requiredPermissions.length > 0) {
    const userPermissions = user?.permissions || [];
    const hasRequiredPermissions = requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    );

    if (!hasRequiredPermissions) {
      return (
        <Result
          status='403'
          title='权限不足'
          subTitle='您没有访问此页面的权限'
          extra={
            <Button type='primary' onClick={() => window.history.back()}>
              返回上一页
            </Button>
          }
        />
      );
    }
  }

  // 通过所有检查，渲染子组件
  return <>{children}</>;
};

/**
 * 公开路由组件
 * 未登录用户可以访问，登录用户会被重定向
 */
export const PublicRoute: React.FC<{
  children: React.ReactNode;
  /** 登录用户的重定向路径 */
  redirectPath?: string;
}> = ({ children, redirectPath = '/' }) => {
  const { isAuthenticated } = useAppSelector(selectAuthState);
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

/**
 * 访客路由组件
 * 游客和未登录用户都可以访问
 */
export const GuestRoute: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <>{children}</>;
};

/**
 * 管理员路由组件
 * 只有管理员才能访问
 */
export const AdminRoute: React.FC<{
  children: React.ReactNode;
  loginPath?: string;
}> = ({ children, loginPath = '/admin/login' }) => {
  return (
    <ProtectedRoute userType='admin' loginPath={loginPath}>
      {children}
    </ProtectedRoute>
  );
};

/**
 * 服务提供者路由组件
 * 只有服务提供者才能访问
 */
export const ProviderRoute: React.FC<{
  children: React.ReactNode;
  loginPath?: string;
}> = ({ children, loginPath = '/login' }) => {
  return (
    <ProtectedRoute userType='provider' loginPath={loginPath}>
      {children}
    </ProtectedRoute>
  );
};

/**
 * 客户路由组件
 * 只有客户才能访问
 */
export const CustomerRoute: React.FC<{
  children: React.ReactNode;
  loginPath?: string;
}> = ({ children, loginPath = '/login' }) => {
  return (
    <ProtectedRoute userType='customer' loginPath={loginPath}>
      {children}
    </ProtectedRoute>
  );
};

export default ProtectedRoute;
