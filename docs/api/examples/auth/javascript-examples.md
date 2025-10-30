# 认证接口 JavaScript/TypeScript 调用示例

本文档提供了认证系统各接口的JavaScript和TypeScript调用示例，包括原生fetch、axios以及项目中的实际使用方式。

## 基础配置

```typescript
// 配置信息
const API_BASE_URL = 'http://localhost:8080';
const API_BASE_PATH = '/api';

// 通用请求配置
const defaultHeaders = {
  'Content-Type': 'application/json',
};

// Token管理
let accessToken: string | null = null;
let refreshToken: string | null = null;
```

## 1. 原生 fetch 示例

### 1.1 用户注册

```typescript
interface RegisterRequest {
  username: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  verificationCode: string;
  agreement: boolean;
}

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
  requestId: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserInfo;
  expiresIn: number;
  tokenType: 'Bearer';
}

interface UserInfo {
  id: number;
  username: string;
  phone: string;
  email: string;
  nickname: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'banned';
  userType: string;
  createdAt: string;
  updatedAt: string;
}

// 发送验证码
async function sendVerificationCode(type: 'register' | 'login' | 'reset_password', target: string) {
  try {
    const response = await fetch(`${API_BASE_URL}${API_BASE_PATH}/auth/send-verification-code`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ type, target }),
    });

    const result: ApiResponse<null> = await response.json();

    if (result.code === 0) {
      console.log('验证码发送成功');
      return true;
    } else {
      console.error('验证码发送失败:', result.message);
      return false;
    }
  } catch (error) {
    console.error('网络错误:', error);
    return false;
  }
}

// 用户注册
async function register(userData: RegisterRequest): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_BASE_PATH}/auth/register`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(userData),
    });

    const result: ApiResponse<AuthResponse> = await response.json();

    if (result.code === 0) {
      // 保存token
      accessToken = result.data.accessToken;
      refreshToken = result.data.refreshToken;

      // 保存到localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      console.log('注册成功:', result.data.user);
      return true;
    } else {
      console.error('注册失败:', result.message);
      return false;
    }
  } catch (error) {
    console.error('网络错误:', error);
    return false;
  }
}

// 使用示例
async function exampleRegister() {
  const userData: RegisterRequest = {
    username: 'newuser123',
    phone: '13800138000',
    email: 'newuser@example.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    verificationCode: '123456',
    agreement: true,
  };

  // 先发送验证码
  const codeSent = await sendVerificationCode('register', userData.phone);
  if (codeSent) {
    // 然后注册
    const success = await register(userData);
    if (success) {
      console.log('用户注册并登录成功');
    }
  }
}
```

### 1.2 用户登录

```typescript
interface LoginRequest {
  username: string;
  password: string;
  captcha?: string;
  remember?: boolean;
}

// 用户登录
async function login(credentials: LoginRequest): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_BASE_PATH}/auth/login`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(credentials),
    });

    const result: ApiResponse<AuthResponse> = await response.json();

    if (result.code === 0) {
      // 保存token
      accessToken = result.data.accessToken;
      refreshToken = result.data.refreshToken;

      // 保存到localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      console.log('登录成功:', result.data.user);
      return true;
    } else {
      console.error('登录失败:', result.message);
      return false;
    }
  } catch (error) {
    console.error('网络错误:', error);
    return false;
  }
}

// 使用示例
async function exampleLogin() {
  const credentials: LoginRequest = {
    username: 'newuser123',
    password: 'Password123!',
    remember: true,
  };

  const success = await login(credentials);
  if (success) {
    console.log('用户登录成功');
  }
}
```

### 1.3 获取用户信息

```typescript
// 获取认证头
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('accessToken') || accessToken;
  return token ? { ...defaultHeaders, Authorization: `Bearer ${token}` } : defaultHeaders;
}

// 获取用户信息
async function getUserInfo(): Promise<UserInfo | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_BASE_PATH}/auth/profile`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result: ApiResponse<UserInfo> = await response.json();

    if (result.code === 0) {
      console.log('获取用户信息成功:', result.data);
      return result.data;
    } else {
      console.error('获取用户信息失败:', result.message);
      return null;
    }
  } catch (error) {
    console.error('网络错误:', error);
    return null;
  }
}

// 使用示例
async function exampleGetUserInfo() {
  const userInfo = await getUserInfo();
  if (userInfo) {
    console.log('当前用户:', userInfo.nickname);
  }
}
```

### 1.4 刷新Token

```typescript
// 刷新Token
async function refreshAccessToken(): Promise<boolean> {
  try {
    const refresh_token = localStorage.getItem('refreshToken') || refreshToken;
    if (!refresh_token) {
      console.error('没有refresh token');
      return false;
    }

    const response = await fetch(`${API_BASE_URL}${API_BASE_PATH}/auth/refresh`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ refreshToken: refresh_token }),
    });

    const result: ApiResponse<AuthResponse> = await response.json();

    if (result.code === 0) {
      // 更新token
      accessToken = result.data.accessToken;
      refreshToken = result.data.refreshToken;

      // 更新localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      console.log('Token刷新成功');
      return true;
    } else {
      console.error('Token刷新失败:', result.message);
      // 刷新失败，清除本地token
      logout();
      return false;
    }
  } catch (error) {
    console.error('网络错误:', error);
    return false;
  }
}

// 带自动刷新的请求包装器
async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  let response = await fetch(url, {
    ...options,
    headers: { ...getAuthHeaders(), ...options.headers },
  });

  // 如果401错误，尝试刷新token
  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // 使用新token重试请求
      response = await fetch(url, {
        ...options,
        headers: { ...getAuthHeaders(), ...options.headers },
      });
    }
  }

  return response;
}
```

### 1.5 用户登出

```typescript
// 用户登出
async function logout(): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}${API_BASE_PATH}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error('登出请求失败:', error);
  } finally {
    // 清除本地token
    accessToken = null;
    refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    console.log('用户已登出');
  }
}
```

## 2. Axios 示例

### 2.1 基础配置

```typescript
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// 创建axios实例
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}${API_BASE_PATH}`,
  headers: defaultHeaders,
  timeout: 10000,
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 添加认证头
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401错误，尝试刷新token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh_token = localStorage.getItem('refreshToken');
      if (refresh_token) {
        try {
          const response = await axios.post(`${API_BASE_URL}${API_BASE_PATH}/auth/refresh`, {
            refreshToken: refresh_token,
          });

          if (response.data.code === 0) {
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;

            // 更新token
            localStorage.setItem('accessToken', newAccessToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            // 重试原始请求
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          // 刷新失败，清除token并跳转登录
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);
```

### 2.2 认证服务类

```typescript
class AuthService {
  // 发送验证码
  static async sendVerificationCode(type: string, target: string): Promise<boolean> {
    try {
      const response = await apiClient.post('/auth/send-verification-code', {
        type,
        target,
      });

      return response.data.code === 0;
    } catch (error) {
      console.error('发送验证码失败:', error);
      return false;
    }
  }

  // 用户注册
  static async register(userData: RegisterRequest): Promise<AuthResponse | null> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', userData);

      if (response.data.code === 0) {
        const { accessToken, refreshToken, user } = response.data.data;

        // 保存token
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('注册失败:', error);
      return null;
    }
  }

  // 用户登录
  static async login(credentials: LoginRequest): Promise<AuthResponse | null> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);

      if (response.data.code === 0) {
        const { accessToken, refreshToken, user } = response.data.data;

        // 保存token
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('登录失败:', error);
      return null;
    }
  }

  // 获取用户信息
  static async getUserInfo(): Promise<UserInfo | null> {
    try {
      const response = await apiClient.get<ApiResponse<UserInfo>>('/auth/profile');

      if (response.data.code === 0) {
        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return null;
    }
  }

  // 更新用户信息
  static async updateProfile(userData: Partial<UserInfo>): Promise<UserInfo | null> {
    try {
      const response = await apiClient.put<ApiResponse<UserInfo>>('/auth/profile', userData);

      if (response.data.code === 0) {
        return response.data.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('更新用户信息失败:', error);
      return null;
    }
  }

  // 修改密码
  static async changePassword(passwordData: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<boolean> {
    try {
      const response = await apiClient.post('/auth/change-password', passwordData);
      return response.data.code === 0;
    } catch (error) {
      console.error('修改密码失败:', error);
      return false;
    }
  }

  // 用户登出
  static async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('登出请求失败:', error);
    } finally {
      // 清除本地token
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  // 忘记密码
  static async forgotPassword(email: string): Promise<boolean> {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response.data.code === 0;
    } catch (error) {
      console.error('发送重置密码邮件失败:', error);
      return false;
    }
  }

  // 重置密码
  static async resetPassword(resetData: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<boolean> {
    try {
      const response = await apiClient.post('/auth/reset-password', resetData);
      return response.data.code === 0;
    } catch (error) {
      console.error('重置密码失败:', error);
      return false;
    }
  }
}
```

## 3. React Hook 示例

### 3.1 认证Hook

```typescript
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  user: UserInfo | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<UserInfo>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // 初始化认证状态
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const userInfo = await AuthService.getUserInfo();
        if (userInfo) {
          setUser(userInfo);
        } else {
          // token无效，清除本地存储
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // 登录
  const login = async (credentials: LoginRequest): Promise<boolean> => {
    setLoading(true);
    try {
      const authData = await AuthService.login(credentials);
      if (authData) {
        setUser(authData.user);
        return true;
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 注册
  const register = async (userData: RegisterRequest): Promise<boolean> => {
    setLoading(true);
    try {
      const authData = await AuthService.register(userData);
      if (authData) {
        setUser(authData.user);
        return true;
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 登出
  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await AuthService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 更新用户信息
  const updateUser = async (userData: Partial<UserInfo>): Promise<boolean> => {
    try {
      const updatedUser = await AuthService.updateProfile(userData);
      if (updatedUser) {
        setUser(updatedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('更新用户信息失败:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

### 3.2 登录组件示例

```typescript
import React, { useState } from 'react';
import { useAuth } from './AuthProvider';

interface LoginFormData {
  username: string;
  password: string;
  remember: boolean;
}

const LoginForm: React.FC = () => {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
    remember: false,
  });
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const success = await login(formData);
      if (!success) {
        setError('登录失败，请检查用户名和密码');
      }
    } catch (error) {
      setError('登录过程中发生错误，请稍后重试');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">用户名/手机号/邮箱</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label htmlFor="password">密码</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <input
          type="checkbox"
          id="remember"
          name="remember"
          checked={formData.remember}
          onChange={handleInputChange}
        />
        <label htmlFor="remember">记住登录状态</label>
      </div>

      {error && <div className="error">{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? '登录中...' : '登录'}
      </button>
    </form>
  );
};

export default LoginForm;
```

### 3.3 注册组件示例

```typescript
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';

interface RegisterFormData {
  username: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  verificationCode: string;
  agreement: boolean;
}

const RegisterForm: React.FC = () => {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
    agreement: false,
  });
  const [error, setError] = useState<string>('');
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 倒计时逻辑
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // 发送验证码
  const handleSendCode = async () => {
    if (!formData.phone) {
      setError('请输入手机号');
      return;
    }

    try {
      const success = await AuthService.sendVerificationCode('register', formData.phone);
      if (success) {
        setCodeSent(true);
        setCountdown(60);
        setError('');
      } else {
        setError('验证码发送失败');
      }
    } catch (error) {
      setError('发送验证码时发生错误');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 验证密码
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (!formData.agreement) {
      setError('请同意用户协议');
      return;
    }

    try {
      const success = await register(formData);
      if (!success) {
        setError('注册失败，请检查信息是否正确');
      }
    } catch (error) {
      setError('注册过程中发生错误，请稍后重试');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">用户名</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label htmlFor="phone">手机号</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label htmlFor="email">邮箱</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label htmlFor="verificationCode">验证码</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            id="verificationCode"
            name="verificationCode"
            value={formData.verificationCode}
            onChange={handleInputChange}
            required
          />
          <button
            type="button"
            onClick={handleSendCode}
            disabled={countdown > 0 || !formData.phone}
          >
            {countdown > 0 ? `${countdown}s` : '发送验证码'}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="password">密码</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label htmlFor="confirmPassword">确认密码</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <input
          type="checkbox"
          id="agreement"
          name="agreement"
          checked={formData.agreement}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="agreement">我已阅读并同意用户协议</label>
      </div>

      {error && <div className="error">{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? '注册中...' : '注册'}
      </button>
    </form>
  );
};

export default RegisterForm;
```

## 4. 错误处理工具

```typescript
// API错误处理工具
class ApiError extends Error {
  constructor(
    message: string,
    public code: number,
    public requestId?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 处理API响应
function handleApiResponse<T>(response: ApiResponse<T>): T {
  if (response.code === 0) {
    return response.data;
  } else {
    throw new ApiError(response.message, response.code, response.requestId);
  }
}

// 错误处理映射
const errorMessages: Record<number, string> = {
  1001: '参数错误，请检查输入信息',
  1002: '用户不存在',
  1003: '密码错误',
  1004: '账户已被禁用',
  1005: '验证码错误',
  1006: '验证码已过期',
  1007: '用户名已存在',
  1008: '手机号已注册',
  1009: '邮箱已注册',
  1010: '登录已过期，请重新登录',
  1011: 'Token无效',
};

// 获取用户友好的错误信息
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return errorMessages[error.code] || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return '未知错误，请稍后重试';
}
```

## 5. 完整使用示例

```typescript
// 在React应用中使用
import React from 'react';
import { AuthProvider, useAuth } from './AuthProvider';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

// 受保护的路由组件
const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// 个人资料页面
const ProfilePage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ nickname: user?.nickname || '' });

  const handleSave = async () => {
    const success = await updateUser({ nickname: formData.nickname });
    if (success) {
      setEditing(false);
    }
  };

  return (
    <div>
      <h1>个人资料</h1>
      {user && (
        <div>
          <p>用户名: {user.username}</p>
          <p>手机号: {user.phone}</p>
          <p>邮箱: {user.email}</p>

          <div>
            {editing ? (
              <>
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ nickname: e.target.value })}
                />
                <button onClick={handleSave}>保存</button>
                <button onClick={() => setEditing(false)}>取消</button>
              </>
            ) : (
              <>
                <p>昵称: {user.nickname}</p>
                <button onClick={() => setEditing(true)}>编辑</button>
              </>
            )}
          </div>

          <button onClick={logout}>退出登录</button>
        </div>
      )}
    </div>
  );
};
```

---

**更新时间：** 2023-11-04
**维护人员：** 万象生活开发团队
**版本：** v1.0.0