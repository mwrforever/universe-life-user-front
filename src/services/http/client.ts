/**
 * 万象生活HTTP客户端
 * 统一的API请求工具，支持JWT认证、自动刷新、错误处理
 */

import axios, { AxiosError } from 'axios';
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// AxiosInstance类型定义（从axios内部获取）
type AxiosInstance = ReturnType<typeof axios.create>;
import { message } from 'antd';
import type { ApiResponse } from '../types/api';
import { ApiErrorCode } from '../types/api';
import { apiLogger } from '@/utils/logger';

// 用户信息接口
// 注意：根据OAuth2服务端规范，只有username和avatar字段来自ID Token
interface UserInfo {
  id: number;
  username: string; // 从ID Token获取
  nickname: string; // 使用username作为显示名
  phone: string; // ID Token不提供，设为空字符串
  email: string; // ID Token不提供，设为空字符串
  avatar?: string; // 从ID Token获取，可选字段
  createdAt: string;
  updatedAt: string;
}

// ========== 配置常量 ==========

/**
 * HTTP客户端配置
 */
const HTTP_CONFIG = {
  /** API基础URL */
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8099',
  /** 请求超时时间（毫秒） */
  TIMEOUT: 30000,
  /** 重试次数 */
  RETRY_COUNT: 3,
  /** 重试延迟（毫秒） */
  RETRY_DELAY: 1000,
} as const;

/**
 * Token存储键名
 */
const TOKEN_KEYS = {
  /** 访问令牌 */
  ACCESS_TOKEN: 'universe_access_token',
  /** 刷新令牌 */
  REFRESH_TOKEN: 'universe_refresh_token',
  /** ID Token - OpenID Connect 标准令牌 */
  ID_TOKEN: 'universe_id_token',
  /** 用户信息 */
  USER_INFO: 'universe_user_info',
  /** 令牌过期时间 */
  TOKEN_EXPIRES_AT: 'universe_token_expires_at',
} as const;

// ========== Token管理工具 ==========

/**
 * Token管理器
 */
class TokenManager {
  /**
   * 存储访问令牌
   */
  static setAccessToken(token: string, expiresIn: number): void {
    const expiresAt = Date.now() + expiresIn * 1000;
    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, token);
    localStorage.setItem(TOKEN_KEYS.TOKEN_EXPIRES_AT, expiresAt.toString());
  }

  /**
   * 获取访问令牌
   * @param allowExpired 是否允许返回过期的token（用于刷新场景）
   */
  static getAccessToken(allowExpired: boolean = false): string | null {
    const token = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    const expiresAt = localStorage.getItem(TOKEN_KEYS.TOKEN_EXPIRES_AT);

    if (!token || !expiresAt) {
      return null;
    }

    // 检查是否过期
    if (Date.now() >= parseInt(expiresAt, 10)) {
      // 注意：不要清除所有token，保留refresh_token用于刷新
      // 只清除access_token相关数据
      if (!allowExpired) {
        localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(TOKEN_KEYS.TOKEN_EXPIRES_AT);
        return null;
      }
    }

    return token;
  }

  /**
   * 检查access token是否已过期
   */
  static isAccessTokenExpired(): boolean {
    const expiresAt = localStorage.getItem(TOKEN_KEYS.TOKEN_EXPIRES_AT);
    if (!expiresAt) return true;
    return Date.now() >= parseInt(expiresAt, 10);
  }

  /**
   * 存储刷新令牌
   */
  static setRefreshToken(token: string): void {
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, token);
  }

  /**
   * 获取刷新令牌
   */
  static getRefreshToken(): string | null {
    return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
  }

  /**
   * 存储用户信息
   */
  static setUserInfo(userInfo: UserInfo): void {
    localStorage.setItem(TOKEN_KEYS.USER_INFO, JSON.stringify(userInfo));
  }

  /**
   * 获取用户信息
   */
  static getUserInfo(): UserInfo | null {
    const userInfo = localStorage.getItem(TOKEN_KEYS.USER_INFO);
    return userInfo ? JSON.parse(userInfo) : null;
  }

  /**
   * 清除所有令牌
   */
  static clearTokens(): void {
    Object.values(TOKEN_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  /**
   * 存储ID Token - OpenID Connect 标准令牌
   */
  static setIDToken(token: string): void {
    localStorage.setItem(TOKEN_KEYS.ID_TOKEN, token);
  }

  /**
   * 获取ID Token - OpenID Connect 标准令牌
   */
  static getIDToken(): string | null {
    return localStorage.getItem(TOKEN_KEYS.ID_TOKEN);
  }

  /**
   * 检查令牌是否即将过期（5分钟内）
   */
  static isTokenExpiringSoon(): boolean {
    const expiresAt = localStorage.getItem(TOKEN_KEYS.TOKEN_EXPIRES_AT);
    if (!expiresAt) return false;

    const fiveMinutes = 5 * 60 * 1000; // 5分钟的毫秒数
    return Date.now() >= parseInt(expiresAt, 10) - fiveMinutes;
  }
}

// ========== HTTP客户端类 ==========

/**
 * 万象生活HTTP客户端
 */
class UniverseHttpClient {
  private axiosInstance: AxiosInstance;
  private isRefreshing: boolean = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: HTTP_CONFIG.BASE_URL,
      timeout: HTTP_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * 设置请求和响应拦截器
   */
  private setupInterceptors(): void {
    // 请求拦截器
    this.axiosInstance.interceptors.request.use(this.handleRequest, this.handleRequestError);

    // 响应拦截器
    this.axiosInstance.interceptors.response.use(this.handleResponse, this.handleResponseError);
  }

  /**
   * 处理请求 - 支持异步token刷新
   */
  private handleRequest = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    // 检查token是否即将过期或已过期，主动刷新
    const refreshToken = TokenManager.getRefreshToken();
    if (refreshToken && (TokenManager.isAccessTokenExpired() || TokenManager.isTokenExpiringSoon())) {
      // 如果正在刷新，等待刷新完成
      if (this.isRefreshing) {
        await new Promise<void>(resolve => {
          this.refreshSubscribers.push(() => resolve());
        });
      } else {
        // 开始刷新流程
        this.isRefreshing = true;
        try {
          apiLogger.info('🔄 Token即将过期或已过期，主动刷新...');
          const { OAuth2Service } = await import('../oauth2/authService');
          const refreshSuccess = await OAuth2Service.refreshAccessToken();
          if (refreshSuccess) {
            apiLogger.info('✅ Token主动刷新成功');
          } else {
            apiLogger.warn('⚠️ Token主动刷新失败');
            // 检查是否还有refresh_token（可能是服务器临时错误）
            const stillHasRefreshToken = TokenManager.getRefreshToken();
            if (!stillHasRefreshToken) {
              // refresh_token已被清除，说明真正失效了，跳转登录
              this.redirectToOAuth2Login();
              throw new Error('登录已过期，请重新登录');
            }
            // 如果还有refresh_token，允许请求继续（可能是临时网络问题）
          }
        } catch (err) {
          apiLogger.error('❌ Token主动刷新异常:', err);
          // 如果是我们主动抛出的登录过期错误，向上传递
          if (err instanceof Error && err.message === '登录已过期，请重新登录') {
            throw err;
          }
        } finally {
          this.isRefreshing = false;
          // 通知所有等待的请求
          this.refreshSubscribers.forEach(callback => callback(''));
          this.refreshSubscribers = [];
        }
      }
    }

    // 添加认证令牌
    const token = TokenManager.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 添加请求ID（用于问题追踪）
    if (config.headers) {
      config.headers['X-Request-ID'] = this.generateRequestId();
      config.headers['X-Timestamp'] = Date.now().toString();
    }

    return config;
  };

  /**
   * 处理请求错误
   */
  private handleRequestError = (error: AxiosError): Promise<never> => {
    apiLogger.error('请求配置错误:', error);
    return Promise.reject(error);
  };

  /**
   * 处理响应
   */
  private handleResponse = (response: AxiosResponse): AxiosResponse<ApiResponse> => {
    const { data } = response;

    // 检查响应格式
    if (!this.isValidApiResponse(data)) {
      throw new Error('API响应格式不正确');
    }

    // 检查业务状态码
    if (data.code !== ApiErrorCode.SUCCESS) {
      throw new Error(data.message || '请求失败');
    }

    return response;
  };

  /**
   * 处理响应错误
   */
  private handleResponseError = async (error: AxiosError): Promise<never> => {
    const { response, config } = error;

    // 网络错误
    if (!response) {
      if (error.code === 'ECONNABORTED') {
        message.error('请求超时，请检查网络连接');
      } else {
        message.error('网络连接失败，请检查网络设置');
      }
      return Promise.reject(error);
    }

    const { status, data } = response;
    const errorResponse = data as ApiResponse;

    // 处理不同的HTTP状态码
    switch (status) {
      case 401:
        // 401未授权 - 尝试刷新令牌
        return this.handleUnauthorizedError(config);

      case 403:
        message.error('访问被拒绝，权限不足');
        break;

      case 404:
        message.error('请求的资源不存在');
        break;

      case 429:
        message.error('请求过于频繁，请稍后再试');
        break;

      case 500:
        message.error('服务器内部错误，请稍后再试');
        break;

      default:
        // 处理业务错误码
        this.handleBusinessError(errorResponse);
        break;
    }

    return Promise.reject(error);
  };

  /**
   * 处理401未授权错误
   * 统一使用OAuth2Service刷新token，而不是调用内部API
   */
  private handleUnauthorizedError = async (
    originalRequest: InternalAxiosRequestConfig | undefined
  ): Promise<never> => {
    if (!originalRequest) {
      return Promise.reject(new Error('原始请求配置不存在'));
    }

    // 如果正在刷新令牌，将请求加入队列
    if (this.isRefreshing) {
      return new Promise(resolve => {
        this.refreshSubscribers.push((token: string) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          resolve(this.axiosInstance(originalRequest));
        });
      });
    }

    this.isRefreshing = true;

    try {
      // 检查是否有refresh token
      const refreshToken = TokenManager.getRefreshToken();
      if (!refreshToken) {
        // 没有刷新令牌，跳转到OAuth2登录
        this.redirectToOAuth2Login();
        return Promise.reject(new Error('登录已过期，请重新登录'));
      }

      // 使用OAuth2Service刷新token
      const { OAuth2Service } = await import('../oauth2/authService');
      const refreshSuccess = await OAuth2Service.refreshAccessToken();

      if (!refreshSuccess) {
        // 刷新失败，跳转到OAuth2登录
        this.redirectToOAuth2Login();
        return Promise.reject(new Error('Token刷新失败，请重新登录'));
      }

      // 获取新的access token
      const newAccessToken = TokenManager.getAccessToken();
      if (!newAccessToken) {
        this.redirectToOAuth2Login();
        return Promise.reject(new Error('Token刷新后获取失败'));
      }

      // 通知所有等待的请求
      this.refreshSubscribers.forEach(callback => callback(newAccessToken));
      this.refreshSubscribers = [];
      this.isRefreshing = false;

      // 重新发送原始请求
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }
      return this.axiosInstance(originalRequest);
    } catch (refreshError) {
      // 刷新令牌失败，清除所有令牌并跳转到OAuth2登录
      this.refreshSubscribers = [];
      this.isRefreshing = false;
      this.redirectToOAuth2Login();
      return Promise.reject(refreshError);
    }
  };

  /**
   * 处理业务错误
   * 注意：TOKEN_EXPIRED和TOKEN_INVALID应该通过401响应处理，这里作为备用处理
   */
  private handleBusinessError(errorResponse: ApiResponse): void {
    const { code, message: errorMessage } = errorResponse;

    switch (code) {
      case ApiErrorCode.TOKEN_EXPIRED:
      case ApiErrorCode.TOKEN_INVALID:
        // Token相关错误：尝试使用refresh_token刷新，而不是直接跳转登录
        this.handleTokenExpiredBusiness();
        break;

      case ApiErrorCode.PERMISSION_DENIED:
        message.error('权限不足，无法执行此操作');
        break;

      case ApiErrorCode.RESOURCE_NOT_FOUND:
        message.error('请求的资源不存在');
        break;

      case ApiErrorCode.RATE_LIMIT_EXCEEDED:
        message.error('操作过于频繁，请稍后再试');
        break;

      default:
        message.error(errorMessage || '操作失败');
        break;
    }
  }

  /**
   * 处理业务层Token过期错误
   * 尝试使用refresh_token刷新，如果失败则跳转OAuth2登录
   */
  private handleTokenExpiredBusiness(): void {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      apiLogger.warn('⚠️ 业务层Token过期，无refresh_token，跳转登录');
      message.error('登录已过期，请重新登录');
      this.redirectToOAuth2Login();
      return;
    }

    // 异步刷新token
    apiLogger.info('🔄 业务层Token过期，尝试刷新...');
    import('../oauth2/authService').then(async ({ OAuth2Service }) => {
      const refreshSuccess = await OAuth2Service.refreshAccessToken();
      if (refreshSuccess) {
        apiLogger.info('✅ Token刷新成功，请重试操作');
        message.info('登录状态已恢复，请重试操作');
      } else {
        apiLogger.warn('⚠️ Token刷新失败，跳转登录');
        message.error('登录已过期，请重新登录');
        this.redirectToOAuth2Login();
      }
    }).catch((err) => {
      apiLogger.error('❌ Token刷新异常:', err);
      message.error('登录已过期，请重新登录');
      this.redirectToOAuth2Login();
    });
  }

  /**
   * 验证API响应格式
   */
  private isValidApiResponse(data: unknown): data is ApiResponse {
    return (
      data !== null &&
      typeof data === 'object' &&
      'code' in data &&
      typeof data.code === 'number' &&
      'message' in data &&
      typeof data.message === 'string' &&
      'timestamp' in data &&
      typeof data.timestamp === 'number'
    );
  }

  /**
   * 生成请求ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 跳转到OAuth2登录页
   */
  private redirectToOAuth2Login(): void {
    TokenManager.clearTokens();
    // 清理所有OAuth2相关数据
    localStorage.removeItem('oauth2_code_verifier');
    localStorage.removeItem('oauth2_state');
    localStorage.removeItem('oauth2_redirect_url');

    // 跳转到OAuth2授权服务器
    import('../oauth2/authService').then(({ OAuth2Service }) => {
      OAuth2Service.initiateAuthorization();
    }).catch(() => {
      // 如果OAuth2服务加载失败，跳转到普通登录页
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    });
  }

  // ========== 公共方法 ==========

  /**
   * GET请求
   */
  async get<T = unknown>(
    url: string,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get(url, { params, ...config });
    return response.data;
  }

  /**
   * POST请求
   */
  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post(url, data, config);
    return response.data;
  }

  /**
   * PUT请求
   */
  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.put(url, data, config);
    return response.data;
  }

  /**
   * DELETE请求
   */
  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete(url, config);
    return response.data;
  }

  /**
   * PATCH请求
   */
  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.patch(url, data, config);
    return response.data;
  }

  /**
   * 上传文件
   */
  async upload<T = unknown>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: progressEvent => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    };

    const response = await this.axiosInstance.post(url, formData, config);
    return response.data;
  }

  /**
   * 取消请求
   */
  createCancelToken() {
    return axios.CancelToken.source();
  }

  /**
   * 检查请求是否被取消
   */
  isCancel(error: unknown): boolean {
    return axios.isCancel(error);
  }

  /**
   * 获取原始axios实例
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// ========== 创建单例实例 ==========

/**
 * HTTP客户端实例
 */
export const httpClient = new UniverseHttpClient();

/**
 * 导出Token管理器
 */
export { TokenManager };

export default httpClient;
