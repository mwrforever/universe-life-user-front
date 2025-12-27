/**
 * OAuth2 认证服务
 * 支持PKCE流程，处理用户认证、Token管理和用户信息提取
 * 使用 pkce-challenge 库生成PKCE挑战（RFC 7636标准实现）
 */

import CryptoJS from 'crypto-js';
import pkceChallenge from 'pkce-challenge';
import { TokenManager } from '../http/client';
import type { User } from '@/pages/home/types/user';
import { authLogger } from '@/utils/logger';

// OAuth2 Token 响应类型
interface OAuth2TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
  id_token?: string;
}

// OpenID Connect 配置类型
interface OpenIDConfiguration {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  jwks_uri: string;
  registration_endpoint?: string;
  scopes_supported?: string[];
  response_types_supported?: string[];
  grant_types_supported?: string[];
  subject_types_supported?: string[];
  id_token_signing_alg_values_supported?: string[];
  token_endpoint_auth_methods_supported?: string[];
}

// OAuth2 配置
export const OAUTH2_CONFIG = {
  /** 授权服务器地址 */
  AUTH_SERVER: import.meta.env.VITE_AUTH_SERVER || import.meta.env.VITE_OAUTH_BASE_URL || 'http://localhost:8099',
  /** 客户端ID */
  CLIENT_ID: import.meta.env.VITE_CLIENT_ID || 'universe-life-web',
  /** 重定向URI */
  REDIRECT_URI: import.meta.env.VITE_REDIRECT_URI || 'http://localhost:3000/auth/callback',
  /** 登出重定向URI - 服务端登出后重定向到指定页面并携带status参数 */
  POST_LOGOUT_REDIRECT_URI: import.meta.env.VITE_POST_LOGOUT_REDIRECT_URI || 'http://localhost:3000',
  /** 授权范围 */
  SCOPE: 'openid profile email phone',
  /** Token有效期（秒） */
  ACCESS_TOKEN_EXPIRES_IN: 7200, // 2小时
  REFRESH_TOKEN_EXPIRES_IN: 604800, // 7天
  /** 刷新阈值（秒）- 在Token过期前多少秒开始刷新 */
  REFRESH_THRESHOLD: 600, // 10分钟
  /** 是否使用代理（开发环境解决跨域） */
  USE_PROXY: import.meta.env.DEV,
} as const;

// 授权端点 - Spring Security Authorization Server 1.2.7 标准端点
export const OAUTH2_ENDPOINTS = {
  /** 授权端点 - OAuth2 标准端点 */
  AUTHORIZATION: OAUTH2_CONFIG.USE_PROXY
    ? '/oauth2/authorize'
    : `${OAUTH2_CONFIG.AUTH_SERVER}/oauth2/authorize`,
  /** Token端点 - OAuth2 标准端点 */
  TOKEN: OAUTH2_CONFIG.USE_PROXY
    ? '/oauth2/token'
    : `${OAUTH2_CONFIG.AUTH_SERVER}/oauth2/token`,
  /** 用户信息端点 */
  USER_INFO: OAUTH2_CONFIG.USE_PROXY
    ? '/oauth2/api/user/me'
    : `${OAUTH2_CONFIG.AUTH_SERVER}/api/user/me`,
  /** 撤销Token端点 - OAuth2 标准端点 (RFC 7009) */
  REVOKE: OAUTH2_CONFIG.USE_PROXY
    ? '/oauth2/revoke'
    : `${OAUTH2_CONFIG.AUTH_SERVER}/oauth2/revoke`,
  /**
   * OIDC 登出端点 - RP-Initiated Logout (OpenID Connect Session Management 1.0)
   * 用于清理服务器端会话，支持 id_token_hint、client_id、post_logout_redirect_uri 参数
   *
   * 注意：开发环境使用代理解决跨域问题，生产环境直接访问完整地址
   */
  LOGOUT: OAUTH2_CONFIG.USE_PROXY
    ? '/connect/logout'
    : `${OAUTH2_CONFIG.AUTH_SERVER}/connect/logout`,
  /**
   * OpenID Connect 发现端点 - 获取所有可用的端点配置
   */
  OPENID_CONFIGURATION: OAUTH2_CONFIG.USE_PROXY
    ? '/.well-known/openid-configuration'
    : `${OAUTH2_CONFIG.AUTH_SERVER}/.well-known/openid-configuration`,
  /**
   * JSON Web Key Set (JWKS) 端点 - 用于验证ID Token签名
   */
  JWKS_URI: OAUTH2_CONFIG.USE_PROXY
    ? '/.well-known/jwks.json'
    : `${OAUTH2_CONFIG.AUTH_SERVER}/.well-known/jwks.json`,
} as const;

// PKCE挑战存储键
const PKCE_KEYS = {
  CHALLENGE: 'oauth2_pkce_challenge',
  VERIFIER: 'oauth2_pkce_verifier',
  STATE: 'oauth2_state',
  AUTH_REDIRECT: 'oauth2_redirect_url',
} as const;

/**
 * ID Token 用户信息接口
 * 根据OAuth2服务端规范，ID Token中只包含用户名和头像信息
 */
export interface IDTokenUser {
  sub: string; // 用户ID (JWT标准字段)
  username: string; // 用户名 - 服务端提供
  avatar?: string; // 头像URL - 服务端提供(可选)
  exp: number; // 过期时间 (JWT标准字段)
  iat: number; // 签发时间 (JWT标准字段)
  iss: string; // 签发者 (JWT标准字段)
  aud: string; // 受众 (JWT标准字段)
}

/**
 * OAuth2 认证服务类
 */
export class OAuth2Service {
  /**
   * 检测是否为安全上下文 (HTTPS 或 localhost)
   */
  static isSecureContext(): boolean {
    if (typeof window === 'undefined') return false;
    // 检查 isSecureContext 属性，或者检查是否为 localhost
    return window.isSecureContext ||
           window.location.hostname === 'localhost' ||
           window.location.hostname === '127.0.0.1';
  }

  /**
   * 生成PKCE挑战 - 使用 pkce-challenge 库
   * - 生产环境(HTTPS): 使用 pkce-challenge (crypto.subtle API)
   * - 开发环境(HTTP): 使用 crypto-js 作为 fallback
   */
  static async generatePKCEChallenge() {
    let challenge: { code_challenge: string; code_verifier: string };

    if (this.isSecureContext()) {
      // 生产环境: 使用 pkce-challenge (crypto.subtle)
      authLogger.info('🔐 使用 pkce-challenge (安全上下文)');
      challenge = await pkceChallenge(128);
    } else {
      // 开发环境: 使用 crypto-js fallback
      authLogger.info('🔐 使用 crypto-js fallback (非安全上下文)');
      challenge = this.generatePKCEChallengeFallback();
    }

    localStorage.setItem(PKCE_KEYS.CHALLENGE, challenge.code_challenge);
    localStorage.setItem(PKCE_KEYS.VERIFIER, challenge.code_verifier);

    return challenge;
  }

  /**
   * PKCE挑战生成 - Fallback实现 (使用crypto-js，兼容非安全上下文)
   */
  static generatePKCEChallengeFallback(): { code_challenge: string; code_verifier: string } {
    // 生成随机 code_verifier (43-128字符)
    const verifier = this.generateRandomString(128);

    // 使用 SHA256 生成 code_challenge
    const hash = CryptoJS.SHA256(verifier);
    const challenge = hash
      .toString(CryptoJS.enc.Base64)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    return { code_challenge: challenge, code_verifier: verifier };
  }

  /**
   * 生成随机字符串
   */
  static generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let result = '';
    const randomValues = new Uint8Array(length);

    // 尝试使用 crypto.getRandomValues，如果不可用则使用 Math.random
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(randomValues);
      for (let i = 0; i < length; i++) {
        result += chars[randomValues[i] % chars.length];
      }
    } else {
      for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }

    return result;
  }

  /**
   * 生成随机状态值
   */
  static generateState(): string {
    const state = Math.random().toString(36).substring(2, 15) +
                 Math.random().toString(36).substring(2, 15);
    localStorage.setItem(PKCE_KEYS.STATE, state);
    return state;
  }

  /**
   * 构建授权URL
   */
  static async buildAuthorizationUrl(redirectUrl?: string): Promise<string> {
    const challenge = await this.generatePKCEChallenge();
    const state = this.generateState();

    // 保存重定向URL
    if (redirectUrl) {
      localStorage.setItem(PKCE_KEYS.AUTH_REDIRECT, redirectUrl);
    }

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: OAUTH2_CONFIG.CLIENT_ID,
      scope: OAUTH2_CONFIG.SCOPE,
      redirect_uri: OAUTH2_CONFIG.REDIRECT_URI,
      code_challenge: challenge.code_challenge,
      code_challenge_method: 'S256',
      state: state,
    });

    // 授权URL必须使用完整的服务器地址，因为需要用户在浏览器中访问
    const authUrl = OAUTH2_CONFIG.USE_PROXY
      ? `${OAUTH2_CONFIG.AUTH_SERVER}/oauth2/authorize`
      : OAUTH2_ENDPOINTS.AUTHORIZATION;

    return `${authUrl}?${params.toString()}`;
  }

  /**
   * 启动授权流程
   */
  static async initiateAuthorization(redirectUrl?: string): Promise<void> {
    const authUrl = await this.buildAuthorizationUrl(redirectUrl);
    window.location.href = authUrl;
  }

  /**
   * 交换授权码获取Token（带重试机制）
   */
  static async exchangeCodeForToken(
    code: string,
    verifier: string,
    attempt: number = 1
  ): Promise<OAuth2TokenResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2 * 60 * 1000); // 2分钟超时

    try {
      authLogger.info(`🔄 第${attempt}次尝试获取Token...`);

      const response = await fetch(OAUTH2_ENDPOINTS.TOKEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Request-Attempt': attempt.toString(),
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          client_id: OAUTH2_CONFIG.CLIENT_ID,
          redirect_uri: OAUTH2_CONFIG.REDIRECT_URI,
          code_verifier: verifier,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Token交换失败: ${response.status} ${response.statusText}`);
      }

      const tokenData = await response.json();
      authLogger.info('✅ Token获取成功');
      return tokenData;

    } catch (err) {
      clearTimeout(timeoutId);

      // 如果是第一次失败且不是超时，等待5秒后重试
      if (attempt === 1 && err instanceof Error && err.name !== 'AbortError') {
        authLogger.info('⏳ 第一次请求失败，5秒后重试...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        return this.exchangeCodeForToken(code, verifier, 2);
      }

      // 第二次失败或超时，抛出错误
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('Token请求超时（2分钟）');
      }
      throw err instanceof Error ? err : new Error('Token交换失败');
    }
  }

  /**
   * 处理授权回调
   */
  static async handleAuthorizationCallback(
    code: string,
    state: string,
    error?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      authLogger.info('🔍 开始处理OAuth2回调...');

      // 验证状态
      const savedState = localStorage.getItem(PKCE_KEYS.STATE);
      if (!savedState || savedState !== state) {
        authLogger.error('❌ 状态验证失败');
        return { success: false, error: '状态验证失败' };
      }

      // 检查错误
      if (error) {
        authLogger.error('❌ 授权服务器返回错误:', error);
        return { success: false, error };
      }

      // 获取PKCE验证器
      const verifier = localStorage.getItem(PKCE_KEYS.VERIFIER);
      if (!verifier) {
        authLogger.error('❌ PKCE验证器丢失');
        return { success: false, error: 'PKCE验证器丢失' };
      }

      authLogger.info('✅ 基础验证通过，开始Token交换...');

      // 交换授权码获取Token（带重试机制）
      const tokenData = await this.exchangeCodeForToken(code, verifier);
      authLogger.info('📋 Token响应:', {
        access_token: tokenData.access_token ? '***已获取***' : '未获取',
        refresh_token: tokenData.refresh_token ? '***已获取***' : '未获取',
        id_token: tokenData.id_token ? '***已获取***' : '未获取',
        expires_in: tokenData.expires_in
      });

      // 提取并验证ID Token
      const idToken = tokenData.id_token;
      if (!idToken) {
        throw new Error('缺少ID Token');
      }

      const user = this.parseIDToken(idToken);
      if (!user) {
        throw new Error('ID Token解析失败');
      }

      authLogger.info('👤 用户信息:', {
        id: user.sub,
        username: user.username,
        avatar: user.avatar
      });

      // 存储Token和用户信息
      TokenManager.setAccessToken(tokenData.access_token, tokenData.expires_in || OAUTH2_CONFIG.ACCESS_TOKEN_EXPIRES_IN);
      if (tokenData.refresh_token) {
        TokenManager.setRefreshToken(tokenData.refresh_token);
      }
      // 保存ID Token - OpenID Connect 标准令牌，用于登出时的身份验证
      if (idToken) {
        TokenManager.setIDToken(idToken);
      }

      // 根据新的OAuth2规范，ID Token中只包含username和avatar信息
      TokenManager.setUserInfo({
        id: parseInt(user.sub, 10) || 0,
        username: user.username,
        nickname: user.username, // 由于ID Token中没有nickname字段，使用username作为显示名
        avatar: user.avatar || '/default-avatar.png', // 提供默认头像
        phone: '', // ID Token中不包含phone字段，设为空字符串
        email: '', // ID Token中不包含email字段，设为空字符串
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      authLogger.info('💾 Token、ID Token和用户信息已保存');

      // 清理PKCE数据
      this.clearPKCEData();

      authLogger.info('✅ OAuth2回调处理完成');
      return { success: true };
    } catch (err) {
      authLogger.error('❌ OAuth2回调处理失败:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : '未知错误'
      };
    }
  }

  /**
   * 解析ID Token（简化版，生产环境应使用专业的JWT库）
   */
  static parseIDToken(idToken: string): IDTokenUser | null {
    try {
      authLogger.info('🔍 开始解析ID Token...', idToken.substring(0, 50) + '...');

      // 检查Token格式
      if (!idToken || typeof idToken !== 'string') {
        authLogger.error('❌ ID Token格式无效');
        return null;
      }

      const parts = idToken.split('.');
      if (parts.length !== 3) {
        authLogger.error('❌ ID Token格式错误，应该包含3个部分，实际包含', parts.length);
        return null;
      }

      // 解码payload部分
      const payload = parts[1];

      // 处理Base64URL编码（可能需要补齐）
      let base64Payload = payload.replace(/-/g, '+').replace(/_/g, '/');
      while (base64Payload.length % 4) {
        base64Payload += '=';
      }

      let decoded;
      try {
        decoded = JSON.parse(atob(base64Payload));
      } catch (decodeError) {
        authLogger.error('❌ Base64解码失败:', decodeError);
        return null;
      }

      authLogger.info('✅ ID Token解码成功:', decoded);

      // 验证必要字段 - 根据服务端规范验证
      if (!decoded.sub) {
        throw new Error('ID Token缺少用户标识字段(sub)');
      }

      if (!decoded.username) {
        throw new Error('ID Token缺少用户名字段(username)');
      }

      // 检查Token是否过期
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        throw new Error('ID Token已过期');
      }

      // 构建用户信息 - 严格按照服务端规范提取username和avatar
      const user: IDTokenUser = {
        sub: decoded.sub,
        username: decoded.username,
        avatar: decoded.avatar, // 直接使用服务端提供的avatar字段，不做兼容性处理
        exp: decoded.exp,
        iat: decoded.iat,
        iss: decoded.iss,
        aud: decoded.aud,
      };

      authLogger.info('✅ 用户信息构建成功:', user);
      return user;
    } catch (err) {
      authLogger.error('❌ ID Token解析失败:', err);
      authLogger.error('📋 原始Token:', idToken);
      return null;
    }
  }

  /**
   * 检查当前用户是否已登录
   */
  static isLoggedIn(): boolean {
    const token = TokenManager.getAccessToken();
    const userInfo = TokenManager.getUserInfo();
    return !!(token && userInfo);
  }

  /**
   * 获取当前用户信息
   */
  static getCurrentUser(): User | null {
    const userInfo = TokenManager.getUserInfo();
    if (!userInfo) return null;

    return {
      id: userInfo.id.toString(),
      username: userInfo.username,
      nickname: userInfo.nickname,
      avatar: userInfo.avatar || '',
      phone: userInfo.phone || '',
      email: userInfo.email || '',
      status: 'active',
      verified: true,
      balance: 0,
      totalEarned: 0,
      level: 1,
      experience: 0,
      createdAt: userInfo.createdAt,
      updatedAt: userInfo.updatedAt,
    };
  }

  /**
   * 撤销单个Token - OAuth2标准流程（公共客户端，严格身份分离）
   * @param token 要撤销的token
   * @param tokenType token类型 (access_token 或 refresh_token)
   *
   * 调用规范：
   * - ❌ 禁止携带Authorization: Bearer请求头
   * - ❌ 禁止携带Cookie（credentials: 'omit'）
   * - ✅ 必须在请求体中包含client_id
   * - ✅ 使用application/x-www-form-urlencoded格式
   */
  static async revokeToken(token: string, tokenType: 'access_token' | 'refresh_token' = 'access_token'): Promise<boolean> {
    try {
      authLogger.info(`🔄 正在撤销${tokenType}...`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

      const response = await fetch(OAUTH2_ENDPOINTS.REVOKE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          // 公共客户端不能使用 Authorization 请求头
        },
        body: new URLSearchParams({
          token: token,
          token_type_hint: tokenType,
          client_id: OAUTH2_CONFIG.CLIENT_ID, // 公共客户端必须在请求体中包含client_id
        }),
        credentials: 'omit', // 禁止携带Cookie - 代表客户端行为，不能包含用户的Session信息
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // OAuth2 撤销端点成功时返回 200 OK
      if (response.ok) {
        authLogger.info(`✅ ${tokenType}撤销成功`);
        return true;
      } else {
        authLogger.error(`❌ ${tokenType}撤销失败: ${response.status} ${response.statusText}`);
        return false;
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        authLogger.error(`❌ ${tokenType}撤销请求超时`);
      } else {
        authLogger.error(`❌ ${tokenType}撤销失败:`, err);
      }
      return false;
    }
  }

  /**
   * 撤销Token并清理本地数据 - 仅执行Token撤销和本地清理,不调用OIDC登出端点
   *
   * 调用规范：
   * 1. Token撤销 (/oauth2/revoke)：
   *    - ❌ 禁止携带Authorization: Bearer请求头
   *    - ❌ 禁止携带Cookie（credentials: 'omit'）
   *    - ✅ client_id必须在请求体中
   *    - ✅ 代表客户端行为，不能包含用户身份信息
   *
   * 2. 清理所有本地认证数据和PKCE数据
   */
  static async revokeTokens(): Promise<{ success: boolean; message: string }> {
    try {
      authLogger.info('🔄 开始撤销Token并清理本地数据...');

      // 获取当前所有token
      const accessToken = TokenManager.getAccessToken();
      const refreshToken = TokenManager.getRefreshToken();

      const revokeResults: Array<{ token: string; type: string; success: boolean }> = [];

      // 撤销 Access Token
      if (accessToken) {
        const success = await this.revokeToken(accessToken, 'access_token');
        revokeResults.push({ token: accessToken.substring(0, 10) + '...', type: 'access_token', success });
      }

      // 撤销 Refresh Token
      if (refreshToken) {
        const success = await this.revokeToken(refreshToken, 'refresh_token');
        revokeResults.push({ token: refreshToken.substring(0, 10) + '...', type: 'refresh_token', success });
      }

      // 统计撤销结果
      const revokeSuccessCount = revokeResults.filter(r => r.success).length;
      const revokeTotalCount = revokeResults.length;

      authLogger.info(`📊 Token撤销结果: ${revokeSuccessCount}/${revokeTotalCount} 成功`);

      // 清理本地数据
      authLogger.info('🧹 清理本地认证数据...');
      TokenManager.clearTokens();
      this.clearPKCEData();
      this.clearAllAuthData();

      authLogger.info('✅ Token撤销和本地清理完成');

      // 构建返回消息
      if (revokeTotalCount === 0) {
        return {
          success: true,
          message: '已成功撤销token（无需撤销）'
        };
      } else if (revokeSuccessCount === revokeTotalCount) {
        return {
          success: true,
          message: `已成功撤销所有token (${revokeSuccessCount}/${revokeTotalCount})`
        };
      } else {
        return {
          success: true, // 本地清理成功
          message: `部分token撤销成功 (${revokeSuccessCount}/${revokeTotalCount})`
        };
      }
    } catch (err) {
      authLogger.error('❌ Token撤销过程中发生错误:', err);

      // 即使出错也要清理本地数据
      TokenManager.clearTokens();
      this.clearPKCEData();
      this.clearAllAuthData();

      return {
        success: true, // 本地清理成功
        message: '已强制清理本地数据，但服务器通信失败'
      };
    }
  }

  /**
   * 完整的登出流程 - OpenID Connect RP-Initiated Logout (Session Management 1.0)
   *
   * 登出流程（基于 AJAX 请求）：
   * 1. 发送 GET 请求到 OIDC 登出端点 (/connect/logout) 清除服务端Session
   * 2. 请求成功后撤销 token 和清理本地数据
   * 3. 返回成功结果，由调用方处理后续跳转
   *
   * 调用规范：
   * - ❌ 禁止携带Authorization: Bearer请求头
   * - ✅ 必须携带Cookie（credentials: 'include'）用于清除服务端Session
   * - ✅ 必须使用id_token_hint、client_id、post_logout_redirect_uri参数
   * - ✅ 使用 fetch API GET 请求（父子域携带Cookie）
   */
  static async logout(): Promise<{ success: boolean; message: string }> {
    try {
      authLogger.info('🚪 开始执行 OIDC 登出流程...');

      // 获取ID Token用于id_token_hint参数
      const idToken = TokenManager.getIDToken();

      // 使用配置的登出重定向URI
      const postLogoutRedirectUri = OAUTH2_CONFIG.POST_LOGOUT_REDIRECT_URI;

      // 构建查询参数 - 必须包含 id_token_hint, client_id, post_logout_redirect_uri
      const params = new URLSearchParams({
        post_logout_redirect_uri: postLogoutRedirectUri,
        client_id: OAUTH2_CONFIG.CLIENT_ID, // 必须包含 client_id 参数
      });

      // 如果有ID Token，添加id_token_hint参数（对用户身份识别至关重要）
      if (idToken) {
        params.append('id_token_hint', idToken);
      }

      // 构建登出 URL
      const logoutUrl = `${OAUTH2_ENDPOINTS.LOGOUT}?${params.toString()}`;

      authLogger.info('🔚 发送登出请求到 OIDC 端点:', logoutUrl);

      // 发送 GET 请求到登出端点（允许携带Cookie，父子域逻辑）
      const response = await fetch(logoutUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          // 注意：不能携带 Authorization 请求头
        },
        credentials: 'include', // 允许携带Cookie来清除服务端Session（父子域）
        signal: AbortSignal.timeout(10000), // 10秒超时
      });

      if (response.ok || response.status === 302) {
        authLogger.info(`✅ OIDC 登出端点调用成功: ${response.status} ${response.statusText}`);
      } else {
        authLogger.warn(`⚠️ OIDC 登出端点返回异常状态: ${response.status} ${response.statusText}`);
      }

      // 登出端点调用后（无论成功或失败），都撤销 token 并清理本地数据
      authLogger.info('🔄 开始撤销token...');

      // 撤销 Access Token 和 Refresh Token
      const accessToken = TokenManager.getAccessToken();
      const refreshToken = TokenManager.getRefreshToken();

      const revokeResults: Array<{ token: string; type: string; success: boolean }> = [];

      if (accessToken) {
        const success = await this.revokeToken(accessToken, 'access_token');
        revokeResults.push({ token: accessToken.substring(0, 10) + '...', type: 'access_token', success });
      }

      if (refreshToken) {
        const success = await this.revokeToken(refreshToken, 'refresh_token');
        revokeResults.push({ token: refreshToken.substring(0, 10) + '...', type: 'refresh_token', success });
      }

      // 统计撤销结果
      const revokeSuccessCount = revokeResults.filter(r => r.success).length;
      const revokeTotalCount = revokeResults.length;

      authLogger.info(`📊 Token撤销结果: ${revokeSuccessCount}/${revokeTotalCount} 成功`);

      // 清理本地数据
      authLogger.info('🧹 清理本地认证数据...');
      TokenManager.clearTokens();
      this.clearPKCEData();
      this.clearAllAuthData();

      authLogger.info('✅ 登出流程完成');

      // 构建返回消息
      if (revokeTotalCount === 0) {
        return {
          success: true,
          message: '已成功登出'
        };
      } else if (revokeSuccessCount === revokeTotalCount) {
        return {
          success: true,
          message: '已成功登出并撤销所有token'
        };
      } else {
        return {
          success: true, // 本地清理成功，仍然视为登出成功
          message: `已登出，部分token撤销成功 (${revokeSuccessCount}/${revokeTotalCount})`
        };
      }
    } catch (err) {
      authLogger.error('❌ 登出流程发生错误:', err);

      // 即使出错也要清理本地数据
      TokenManager.clearTokens();
      this.clearPKCEData();
      this.clearAllAuthData();

      return {
        success: true, // 本地清理成功
        message: '已强制登出，但服务器通信失败'
      };
    }
  }

  /**
   * 清理所有认证相关的本地数据
   */
  static clearAllAuthData(): void {
    // 清理所有可能的认证相关localStorage项
    const authKeys = [
      'oauth2_pkce_challenge',
      'oauth2_pkce_verifier',
      'oauth2_state',
      'oauth2_redirect_url',
      'oauth_callback_processing',
      // 可以根据实际情况添加更多需要清理的键
    ];

    authKeys.forEach(key => {
      localStorage.removeItem(key);
    });

    // 清理sessionStorage中的认证数据
    sessionStorage.clear();

    authLogger.info('🧹 所有认证相关数据已清理');
  }

  /**
   * 清理PKCE相关数据
   */
  static clearPKCEData(): void {
    Object.values(PKCE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  /**
   * 获取保存的重定向URL
   */
  static getRedirectUrl(): string | null {
    const redirectUrl = localStorage.getItem(PKCE_KEYS.AUTH_REDIRECT);
    localStorage.removeItem(PKCE_KEYS.AUTH_REDIRECT);
    return redirectUrl;
  }

  /**
   * 刷新访问Token
   * 严格遵循OAuth2标准：使用refresh_token向授权服务器换取新的access_token、refresh_token和id_token
   */
  static async refreshAccessToken(): Promise<boolean> {
    try {
      const refreshToken = TokenManager.getRefreshToken();
      if (!refreshToken) {
        authLogger.warn('⚠️ 没有可用的刷新Token');
        return false;
      }

      authLogger.info('🔄 开始刷新访问Token...');

      const response = await fetch(OAUTH2_ENDPOINTS.TOKEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: OAUTH2_CONFIG.CLIENT_ID,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        authLogger.error(`❌ Token刷新请求失败: ${response.status} ${response.statusText}`, errorText);

        // 刷新失败，清理所有token
        TokenManager.clearTokens();
        return false;
      }

      const tokenData = await response.json();
      authLogger.info('✅ Token刷新成功:', {
        hasAccessToken: !!tokenData.access_token,
        hasRefreshToken: !!tokenData.refresh_token,
        hasIdToken: !!tokenData.id_token,
        expiresIn: tokenData.expires_in,
      });

      // 验证必要字段
      if (!tokenData.access_token) {
        authLogger.error('❌ 刷新响应中缺少access_token');
        TokenManager.clearTokens();
        return false;
      }

      // 更新访问Token
      TokenManager.setAccessToken(
        tokenData.access_token,
        tokenData.expires_in || OAUTH2_CONFIG.ACCESS_TOKEN_EXPIRES_IN
      );

      // 更新刷新Token（如果提供了新的）
      if (tokenData.refresh_token) {
        TokenManager.setRefreshToken(tokenData.refresh_token);
        authLogger.info('✅ 刷新Token已更新');
      }

      // 更新ID Token（如果提供了新的）
      if (tokenData.id_token) {
        TokenManager.setIDToken(tokenData.id_token);

        // 解析新的ID Token并更新用户信息
        const user = this.parseIDToken(tokenData.id_token);
        if (user) {
          TokenManager.setUserInfo({
            id: parseInt(user.sub, 10) || 0,
            username: user.username,
            nickname: user.username,
            avatar: user.avatar || '/default-avatar.png',
            phone: '',
            email: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          authLogger.info('✅ 用户信息已从新ID Token更新');
        }
      }

      return true;
    } catch (err) {
      authLogger.error('❌ Token刷新过程中发生异常:', err);
      // 异常时清理所有token
      TokenManager.clearTokens();
      return false;
    }
  }

  /**
   * 检查Token是否需要刷新
   */
  static shouldRefreshToken(): boolean {
    return TokenManager.isTokenExpiringSoon();
  }

  /**
   * 自动刷新Token（如果需要）
   */
  static async autoRefreshToken(): Promise<boolean> {
    if (this.shouldRefreshToken()) {
      return await this.refreshAccessToken();
    }
    return true;
  }

  /**
   * 获取OpenID Connect配置信息
   * 从发现端点动态获取所有可用的端点配置
   */
  static async getOpenIDConfiguration(): Promise<OpenIDConfiguration | null> {
    try {
      authLogger.info('🔍 获取OpenID Connect配置...');

      const response = await fetch(OAUTH2_ENDPOINTS.OPENID_CONFIGURATION, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        throw new Error(`获取配置失败: ${response.status} ${response.statusText}`);
      }

      const config = await response.json();
      authLogger.info('✅ OpenID Connect配置获取成功');
      return config;
    } catch (err) {
      authLogger.warn('⚠️ 获取OpenID Connect配置失败:', err);
      return null;
    }
  }

  /**
   * 验证服务器端点可用性
   */
  static async validateEndpoints(): Promise<{ endpoint: string; available: boolean; status?: string }[]> {
    const endpoints = [
      { name: 'AUTHORIZATION', url: OAUTH2_ENDPOINTS.AUTHORIZATION },
      { name: 'TOKEN', url: OAUTH2_ENDPOINTS.TOKEN },
      { name: 'REVOKE', url: OAUTH2_ENDPOINTS.REVOKE },
      { name: 'LOGOUT', url: OAUTH2_ENDPOINTS.LOGOUT },
      { name: 'USER_INFO', url: OAUTH2_ENDPOINTS.USER_INFO },
      { name: 'OPENID_CONFIGURATION', url: OAUTH2_ENDPOINTS.OPENID_CONFIGURATION },
      { name: 'JWKS_URI', url: OAUTH2_ENDPOINTS.JWKS_URI },
    ];

    const results = await Promise.allSettled(
      endpoints.map(async (endpoint) => {
        try {
          const response = await fetch(endpoint.url, {
            method: 'HEAD',
            signal: AbortSignal.timeout(5000),
          });
          return {
            endpoint: endpoint.name,
            available: response.status < 500, // 5xx错误表示服务器问题
            status: response.status.toString(),
          };
        } catch (err) {
          return {
            endpoint: endpoint.name,
            available: false,
            status: err instanceof Error ? err.message : '未知错误',
          };
        }
      })
    );

    return results.map(result =>
      result.status === 'fulfilled' ? result.value : {
        endpoint: 'unknown',
        available: false,
        status: result.reason,
      }
    );
  }
}

export default OAuth2Service;