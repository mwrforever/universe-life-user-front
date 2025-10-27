/**
 * 万象生活HTTP客户端
 * 统一的API请求工具，支持JWT认证、自动刷新、错误处理
 */

import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

// AxiosInstance类型定义（从axios内部获取）
type AxiosInstance = ReturnType<typeof axios.create>;
import { message } from 'antd';
import type { ApiResponse, ApiErrorCode } from '../../types/api';

// ========== 配置常量 ==========

/**
 * HTTP客户端配置
 */
const HTTP_CONFIG = {
  /** API基础URL */
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
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
   */
  static getAccessToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    const expiresAt = localStorage.getItem(TOKEN_KEYS.TOKEN_EXPIRES_AT);

    if (!token || !expiresAt) {
      return null;
    }

    // 检查是否过期
    if (Date.now() >= parseInt(expiresAt, 10)) {
      this.clearTokens();
      return null;
    }

    return token;
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
  static setUserInfo(userInfo: any): void {
    localStorage.setItem(TOKEN_KEYS.USER_INFO, JSON.stringify(userInfo));
  }

  /**
   * 获取用户信息
   */
  static getUserInfo(): any | null {
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
   * 检查令牌是否即将过期（5分钟内）
   */
  static isTokenExpiringSoon(): boolean {
    const expiresAt = localStorage.getItem(TOKEN_KEYS.TOKEN_EXPIRES_AT);
    if (!expiresAt) return false;

    const fiveMinutes = 5 * 60 * 1000; // 5分钟的毫秒数
    return Date.now() >= (parseInt(expiresAt, 10) - fiveMinutes);
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
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * 设置请求和响应拦截器
   */
  private setupInterceptors(): void {
    // 请求拦截器
    this.axiosInstance.interceptors.request.use(
      this.handleRequest,
      this.handleRequestError
    );

    // 响应拦截器
    this.axiosInstance.interceptors.response.use(
      this.handleResponse,
      this.handleResponseError
    );
  }

  /**
   * 处理请求
   */
  private handleRequest = (
    config: InternalAxiosRequestConfig
  ): InternalAxiosRequestConfig => {
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
    console.error('请求配置错误:', error);
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
   */
  private handleUnauthorizedError = async (
    originalRequest: InternalAxiosRequestConfig | undefined
  ): Promise<never> => {
    if (!originalRequest) {
      return Promise.reject(new Error('原始请求配置不存在'));
    }

    // 如果正在刷新令牌，将请求加入队列
    if (this.isRefreshing) {
      return new Promise((resolve) => {
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
      const refreshToken = TokenManager.getRefreshToken();
      if (!refreshToken) {
        // 没有刷新令牌，跳转到登录页
        this.redirectToLogin();
        return Promise.reject(new Error('登录已过期，请重新登录'));
      }

      // 调用刷新令牌接口
      const response = await this.refreshToken(refreshToken);
      const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data.data;

      // 更新令牌
      TokenManager.setAccessToken(accessToken, expiresIn);
      TokenManager.setRefreshToken(newRefreshToken);

      // 重试原始请求
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }

      // 通知队列中的请求
      this.refreshSubscribers.forEach(callback => callback(accessToken));
      this.refreshSubscribers = [];

      return this.axiosInstance(originalRequest);
    } catch (refreshError) {
      // 刷新令牌失败，清除所有令牌并跳转登录页
      TokenManager.clearTokens();
      this.redirectToLogin();
      return Promise.reject(refreshError);
    } finally {
      this.isRefreshing = false;
    }
  };

  /**
   * 处理业务错误
   */
  private handleBusinessError(errorResponse: ApiResponse): void {
    const { code, message: errorMessage } = errorResponse;

    switch (code) {
      case ApiErrorCode.TOKEN_EXPIRED:
        message.error('登录已过期，请重新登录');
        this.redirectToLogin();
        break;

      case ApiErrorCode.TOKEN_INVALID:
        message.error('登录状态无效，请重新登录');
        this.redirectToLogin();
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
   * 验证API响应格式
   */
  private isValidApiResponse(data: any): data is ApiResponse {
    return (
      data &&
      typeof data === 'object' &&
      typeof data.code === 'number' &&
      typeof data.message === 'string' &&
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
   * 刷新令牌
   */
  private async refreshToken(refreshToken: string): Promise<AxiosResponse<ApiResponse>> {
    return this.axiosInstance.post('/api/auth/refresh', {
      refreshToken,
    });
  }

  /**
   * 跳转到登录页
   */
  private redirectToLogin(): void {
    TokenManager.clearTokens();
    // 使用React Router的方式跳转，这里暂时使用location
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  // ========== 公共方法 ==========

  /**
   * GET请求
   */
  async get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get(url, { params, ...config });
    return response.data;
  }

  /**
   * POST请求
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post(url, data, config);
    return response.data;
  }

  /**
   * PUT请求
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.put(url, data, config);
    return response.data;
  }

  /**
   * DELETE请求
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete(url, config);
    return response.data;
  }

  /**
   * PATCH请求
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.patch(url, data, config);
    return response.data;
  }

  /**
   * 上传文件
   */
  async upload<T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
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
  isCancel(error: any): boolean {
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
