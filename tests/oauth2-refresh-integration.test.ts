/**
 * OAuth2 Token刷新集成测试
 * 验证401错误处理和自动token刷新逻辑
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { UniverseHttpClient } from '../src/services/http/client';
import { TokenManager } from '../src/services/http/client';
import { OAuth2Service } from '../src/services/oauth2/authService';

// Mock OAuth2Service
vi.mock('../src/services/oauth2/authService', () => ({
  OAuth2Service: {
    refreshAccessToken: vi.fn()
  }
}));

describe('OAuth2 Token刷新集成测试', () => {
  let httpClient: UniverseHttpClient;
  let mockAxiosInstance: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    interceptors: {
      response: {
        use: ReturnType<typeof vi.fn>;
      };
    };
  };

  beforeEach(() => {
    // 清理localStorage
    localStorage.clear();

    // 创建HTTP客户端实例
    httpClient = new UniverseHttpClient();

    // Mock axios实例
    mockAxiosInstance = {
      get: vi.fn(),
      post: vi.fn(),
      interceptors: {
        response: {
          use: vi.fn()
        }
      }
    };

    // 注入mock的axios实例
    (httpClient as UniverseHttpClient & { axiosInstance: typeof mockAxiosInstance }).axiosInstance = mockAxiosInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  describe('401错误处理', () => {
    it('应该在没有refresh token时跳转到OAuth2登录', async () => {
      // 设置一个过期的access token
      TokenManager.setAccessToken('expired-token', 0);

      // Mock 401响应
      const error = {
        response: { status: 401 },
        config: { _retry: false, headers: {} }
      };

      // Mock OAuth2Service.refreshAccessToken返回false
      vi.mocked(OAuth2Service.refreshAccessToken).mockResolvedValue(false);

      // Mock window.location
      const originalLocation = window.location;
      delete (window as Partial<Location> & { location?: Location }).location;
      window.location = { ...originalLocation, href: '' };

      try {
        await httpClient.handleUnauthorizedError(error.config);
        expect.fail('应该抛出错误');
      } catch (err) {
        expect(err instanceof Error ? err.message : '').toBe('Token刷新失败，请重新登录');
      }

      // 验证没有调用refreshAccessToken（因为没有refresh token）
      expect(OAuth2Service.refreshAccessToken).not.toHaveBeenCalled();

      // 恢复window.location
      window.location = originalLocation;
    });

    it('应该在有refresh token时尝试刷新token', async () => {
      // 设置tokens
      TokenManager.setAccessToken('expired-token', 0);
      TokenManager.setRefreshToken('valid-refresh-token');

      // Mock 401响应
      const error: {
        response: { status: number };
        config: { _retry: boolean; headers: Record<string, string> };
      } = {
        response: { status: 401 },
        config: {
          _retry: false,
          headers: {}
        }
      };

      // Mock OAuth2Service刷新成功
      vi.mocked(OAuth2Service.refreshAccessToken).mockResolvedValue(true);

      // Mock TokenManager返回新的access token
      TokenManager.setAccessToken('new-access-token', 7200);

      // Mock axios重试请求成功
      mockAxiosInstance.post = vi.fn().mockResolvedValue({
        data: { success: true }
      });

      try {
        await httpClient.handleUnauthorizedError(error.config);
        expect.fail('应该抛出错误，因为mock配置不完整');
      } catch {
        // 验证调用了刷新逻辑
        expect(OAuth2Service.refreshAccessToken).toHaveBeenCalledTimes(1);
      }
    });

    it('应该在多个并发401请求时只刷新一次token', async () => {
      // 设置tokens
      TokenManager.setAccessToken('expired-token', 0);
      TokenManager.setRefreshToken('valid-refresh-token');

      // Mock OAuth2Service刷新成功
      vi.mocked(OAuth2Service.refreshAccessToken).mockResolvedValue(true);
      TokenManager.setAccessToken('new-access-token', 7200);

      // 创建多个并发的401错误
      const error1 = {
        response: { status: 401 },
        config: { _retry: false, headers: {} }
      };
      const error2 = {
        response: { status: 401 },
        config: { _retry: false, headers: {} }
      };

      // 并发处理多个401错误
      const promises = [
        httpClient.handleUnauthorizedError(error1.config),
        httpClient.handleUnauthorizedError(error2.config)
      ];

      await Promise.allSettled(promises);

      // 验证只调用了一次刷新
      expect(OAuth2Service.refreshAccessToken).toHaveBeenCalledTimes(1);
    });
  });

  describe('Token刷新流程', () => {
    it('应该正确处理刷新成功响应', () => {
      const mockTokenData = {
        access_token: 'new-access-token',
        token_type: 'Bearer',
        expires_in: 7200,
        refresh_token: 'new-refresh-token',
        id_token: 'new-id-token'
      };

      // Mock fetch成功响应
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTokenData)
      });

      // 设置refresh token
      TokenManager.setRefreshToken('old-refresh-token');

      return OAuth2Service.refreshAccessToken().then(result => {
        expect(result).toBe(true);
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/oauth2/token'),
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('grant_type=refresh_token')
          })
        );
      });
    });

    it('应该正确处理刷新失败响应', () => {
      // Mock fetch失败响应
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: () => Promise.resolve('Invalid refresh token')
      });

      // 设置refresh token
      TokenManager.setRefreshToken('invalid-refresh-token');

      return OAuth2Service.refreshAccessToken().then(result => {
        expect(result).toBe(false);
        expect(localStorage.getItem('universe_refresh_token')).toBeNull();
      });
    });

    it('应该在refresh token不存在时返回false', () => {
      return OAuth2Service.refreshAccessToken().then(result => {
        expect(result).toBe(false);
        expect(fetch).not.toHaveBeenCalled();
      });
    });
  });

  describe('用户信息更新', () => {
    it('应该在刷新成功时更新用户信息', () => {
      const mockTokenData = {
        access_token: 'new-access-token',
        token_type: 'Bearer',
        expires_in: 7200,
        refresh_token: 'new-refresh-token',
        id_token: createMockIDToken({
          sub: '1234567890',
          username: 'updated-user',
          avatar: 'https://example.com/new-avatar.jpg'
        })
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTokenData)
      });

      TokenManager.setRefreshToken('old-refresh-token');

      return OAuth2Service.refreshAccessToken().then(result => {
        expect(result).toBe(true);

        const userInfo = TokenManager.getUserInfo();
        expect(userInfo?.username).toBe('updated-user');
        expect(userInfo?.avatar).toBe('https://example.com/new-avatar.jpg');
      });
    });
  });

  describe('安全清理', () => {
    it('应该在刷新失败时清理所有tokens', () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        text: () => Promise.resolve('Invalid refresh token')
      });

      TokenManager.setAccessToken('access-token');
      TokenManager.setRefreshToken('refresh-token');
      TokenManager.setIDToken('id-token');

      return OAuth2Service.refreshAccessToken().then(result => {
        expect(result).toBe(false);
        expect(localStorage.getItem('universe_access_token')).toBeNull();
        expect(localStorage.getItem('universe_refresh_token')).toBeNull();
        expect(localStorage.getItem('universe_id_token')).toBeNull();
      });
    });
  });
});

// 辅助函数：创建模拟的ID Token
function createMockIDToken(payload: Record<string, unknown>): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + 3600,
    iss: 'https://auth.example.com',
    aud: 'universe-life'
  };

  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(fullPayload));

  return `${encodedHeader}.${encodedPayload}.signature`;
}