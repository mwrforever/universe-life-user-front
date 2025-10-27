/**
 * 认证相关API服务
 * 提供登录、注册、用户信息等功能
 */

import { httpClient } from '../http/client';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserInfo,
  ApiResponse,
} from '../types/api';

/**
 * 认证API服务类
 */
export class AuthApiService {
  /**
   * 用户登录
   */
  static async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return httpClient.post('/api/auth/login', credentials);
  }

  /**
   * 用户注册
   */
  static async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return httpClient.post('/api/auth/register', userData);
  }

  /**
   * 用户登出
   */
  static async logout(): Promise<ApiResponse<null>> {
    const response = await httpClient.post('/api/auth/logout');
    // 清除本地存储的令牌
    const { TokenManager } = await import('../http/client');
    TokenManager.clearTokens();
    return response;
  }

  /**
   * 刷新令牌
   */
  static async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    return httpClient.post('/api/auth/refresh', { refreshToken });
  }

  /**
   * 获取用户信息
   */
  static async getProfile(): Promise<ApiResponse<UserInfo>> {
    return httpClient.get('/api/auth/profile');
  }

  /**
   * 更新用户信息
   */
  static async updateProfile(userData: Partial<UserInfo>): Promise<ApiResponse<UserInfo>> {
    return httpClient.put('/api/auth/profile', userData);
  }

  /**
   * 修改密码
   */
  static async changePassword(data: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse<null>> {
    return httpClient.post('/api/auth/change-password', data);
  }

  /**
   * 忘记密码
   */
  static async forgotPassword(email: string): Promise<ApiResponse<null>> {
    return httpClient.post('/api/auth/forgot-password', { email });
  }

  /**
   * 重置密码
   */
  static async resetPassword(data: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse<null>> {
    return httpClient.post('/api/auth/reset-password', data);
  }

  /**
   * 发送验证码
   */
  static async sendVerificationCode(data: {
    type: 'register' | 'login' | 'reset_password';
    target: string; // 手机号或邮箱
  }): Promise<ApiResponse<null>> {
    return httpClient.post('/api/auth/send-verification-code', data);
  }

  /**
   * 验证验证码
   */
  static async verifyCode(data: {
    type: 'register' | 'login' | 'reset_password';
    target: string;
    code: string;
  }): Promise<ApiResponse<{ valid: boolean }>> {
    return httpClient.post('/api/auth/verify-code', data);
  }

  /**
   * 绑定手机号
   */
  static async bindPhone(data: {
    phone: string;
    verificationCode: string;
  }): Promise<ApiResponse<null>> {
    return httpClient.post('/api/auth/bind-phone', data);
  }

  /**
   * 绑定邮箱
   */
  static async bindEmail(data: {
    email: string;
    verificationCode: string;
  }): Promise<ApiResponse<null>> {
    return httpClient.post('/api/auth/bind-email', data);
  }

  /**
   * 第三方登录
   */
  static async thirdPartyLogin(data: {
    provider: 'wechat' | 'qq' | 'alipay';
    code: string;
    state?: string;
  }): Promise<ApiResponse<AuthResponse>> {
    return httpClient.post('/api/auth/third-party-login', data);
  }

  /**
   * 检查用户名是否可用
   */
  static async checkUsername(username: string): Promise<ApiResponse<{ available: boolean }>> {
    return httpClient.get('/api/auth/check-username', { username });
  }

  /**
   * 检查手机号是否已注册
   */
  static async checkPhone(phone: string): Promise<ApiResponse<{ registered: boolean }>> {
    return httpClient.get('/api/auth/check-phone', { phone });
  }

  /**
   * 检查邮箱是否已注册
   */
  static async checkEmail(email: string): Promise<ApiResponse<{ registered: boolean }>> {
    return httpClient.get('/api/auth/check-email', { email });
  }
}

export default AuthApiService;