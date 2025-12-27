/**
 * SecureTokenStorage 单元测试
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SecureTokenStorage, SecureStorageError } from '../../../src/services/oauth2/SecureTokenStorage';
import { StandardTokenResponse } from '../../../src/services/oauth2/OAuth2StandardService';

describe('SecureTokenStorage', () => {
  let storage: SecureTokenStorage;
  let mockSessionStorage: Record<string, string>;

  beforeEach(() => {
    // Mock sessionStorage
    mockSessionStorage = {};
    const sessionStorageMock = {
      getItem: vi.fn((key: string) => mockSessionStorage[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        mockSessionStorage[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockSessionStorage[key];
      }),
      clear: vi.fn(() => {
        mockSessionStorage = {};
      }),
      length: 0,
      key: vi.fn((index: number) => Object.keys(mockSessionStorage)[index] || null)
    };

    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock,
      writable: true
    });

    storage = new SecureTokenStorage({
      enableIntegrityCheck: true,
      maxStorageTime: 24 * 60 * 60 * 1000, // 1天用于测试
      refreshThreshold: 10 * 60 * 1000 // 10分钟
    });
  });

  afterEach(() => {
    storage.clearTokens();
    vi.clearAllMocks();
  });

  describe('Token 存储', () => {
    it('应该正确存储访问令牌', async () => {
      const tokenResponse: StandardTokenResponse = {
        access_token: 'test-access-token',
        token_type: 'Bearer',
        expires_in: 7200, // 2小时
        refresh_token: 'test-refresh-token'
      };

      await storage.storeTokenResponse(tokenResponse);

      const accessToken = storage.getAccessToken();
      expect(accessToken).toBe('test-access-token');
    });

    it('应该正确存储 ID Token', async () => {
      const tokenResponse: StandardTokenResponse = {
        access_token: 'test-access-token',
        token_type: 'Bearer',
        expires_in: 7200, // 2小时
        id_token: 'test-id-token'
      };

      await storage.storeTokenResponse(tokenResponse);

      const idToken = storage.getIDToken();
      expect(idToken).toBe('test-id-token');
    });

    it('应该拒绝无效的 Token 响应', async () => {
      const invalidTokenResponse = {
        access_token: 'test-token'
        // 缺少必需字段
      } as StandardTokenResponse;

      await expect(
        storage.storeTokenResponse(invalidTokenResponse)
      ).rejects.toThrow(SecureStorageError);
    });

    it('应该正确设置过期时间', async () => {
      const tokenResponse: StandardTokenResponse = {
        access_token: 'test-access-token',
        token_type: 'Bearer',
        expires_in: 3600
      };

      const startTime = Date.now();
      await storage.storeTokenResponse(tokenResponse);

      const metadata = storage.getTokenMetadata();
      expect(metadata.expiresAt).toBeGreaterThanOrEqual(startTime + 3599000);
      expect(metadata.expiresAt).toBeLessThanOrEqual(startTime + 3601000);
    });
  });

  describe('Token 获取', () => {
    it('应该返回有效的访问令牌', async () => {
      const tokenResponse: StandardTokenResponse = {
        access_token: 'test-access-token',
        token_type: 'Bearer',
        expires_in: 3600
      };

      await storage.storeTokenResponse(tokenResponse);

      const accessToken = storage.getAccessToken();
      expect(accessToken).toBe('test-access-token');
    });

    it('过期令牌应该返回 null', async () => {
      const tokenResponse: StandardTokenResponse = {
        access_token: 'test-access-token',
        token_type: 'Bearer',
        expires_in: -1 // 已过期
      };

      await storage.storeTokenResponse(tokenResponse);

      const accessToken = storage.getAccessToken();
      expect(accessToken).toBeNull();
    });

    it('应该验证 ID Token 格式', async () => {
      const tokenResponse: StandardTokenResponse = {
        access_token: 'test-access-token',
        token_type: 'Bearer',
        expires_in: 7200, // 2小时
        id_token: 'invalid-format-token'
      };

      await storage.storeTokenResponse(tokenResponse);

      const idToken = storage.getIDToken();
      expect(idToken).toBeNull(); // 无效格式应该返回 null
    });

    it('应该正确验证 ID Token 格式', async () => {
      const validIDToken = 'header.payload.signature';
      const invalidIDToken = 'invalid-format';

      // 模拟存储有效 ID Token
      await storage.storeTokenResponse({
        access_token: 'test-token',
        token_type: 'Bearer',
        expires_in: 7200, // 2小时
        id_token: validIDToken
      });

      expect(storage.getIDToken()).toBe(validIDToken);

      // 模拟存储无效 ID Token
      await storage.storeTokenResponse({
        access_token: 'test-token-2',
        token_type: 'Bearer',
        expires_in: 7200, // 2小时
        id_token: invalidIDToken
      });

      expect(storage.getIDToken()).toBeNull();
    });
  });

  describe('Token 更新', () => {
    it('应该正确更新访问令牌', async () => {
      // 存储初始 Token
      const initialTokenResponse: StandardTokenResponse = {
        access_token: 'initial-token',
        token_type: 'Bearer',
        expires_in: 7200, // 2小时
        refresh_token: 'initial-refresh-token'
      };

      await storage.storeTokenResponse(initialTokenResponse);

      // 更新 Token
      const updatedTokenResponse: StandardTokenResponse = {
        access_token: 'updated-token',
        token_type: 'Bearer',
        expires_in: 3600
      };

      await storage.updateTokens(updatedTokenResponse);

      const accessToken = storage.getAccessToken();
      const refreshToken = storage.getRefreshToken();

      expect(accessToken).toBe('updated-token');
      expect(refreshToken).toBe('initial-refresh-token'); // 应该保留原有的刷新令牌
    });

    it('应该更新刷新令牌（如果提供）', async () => {
      const initialTokenResponse: StandardTokenResponse = {
        access_token: 'initial-token',
        token_type: 'Bearer',
        expires_in: 7200, // 2小时
        refresh_token: 'initial-refresh-token'
      };

      await storage.storeTokenResponse(initialTokenResponse);

      const updatedTokenResponse: StandardTokenResponse = {
        access_token: 'updated-token',
        token_type: 'Bearer',
        expires_in: 7200, // 2小时
        refresh_token: 'new-refresh-token'
      };

      await storage.updateTokens(updatedTokenResponse);

      const refreshToken = storage.getRefreshToken();
      expect(refreshToken).toBe('new-refresh-token');
    });

    it('应该更新 ID Token（如果提供）', async () => {
      const initialTokenResponse: StandardTokenResponse = {
        access_token: 'initial-token',
        token_type: 'Bearer',
        expires_in: 7200, // 2小时
        id_token: 'initial-id-token'
      };

      await storage.storeTokenResponse(initialTokenResponse);

      const updatedTokenResponse: StandardTokenResponse = {
        access_token: 'updated-token',
        token_type: 'Bearer',
        expires_in: 7200, // 2小时
        id_token: 'new-id-token'
      };

      await storage.updateTokens(updatedTokenResponse);

      const idToken = storage.getIDToken();
      expect(idToken).toBe('new-id-token');
    });

    it('没有现有 Token 时应该拒绝更新', async () => {
      const newTokenResponse: StandardTokenResponse = {
        access_token: 'new-token',
        token_type: 'Bearer',
        expires_in: 3600
      };

      await expect(storage.updateTokens(newTokenResponse)).rejects.toThrow(SecureStorageError);
    });
  });

  describe('认证状态', () => {
    it('未存储 Token 时应该返回 false', () => {
      expect(storage.isAuthenticated()).toBe(false);
    });

    it('存储有效 Token 时应该返回 true', async () => {
      const tokenResponse: StandardTokenResponse = {
        access_token: 'test-access-token',
        token_type: 'Bearer',
        expires_in: 3600
      };

      await storage.storeTokenResponse(tokenResponse);

      expect(storage.isAuthenticated()).toBe(true);
    });

    it('Token 过期时应该返回 false', async () => {
      const tokenResponse: StandardTokenResponse = {
        access_token: 'test-access-token',
        token_type: 'Bearer',
        expires_in: -1
      };

      await storage.storeTokenResponse(tokenResponse);

      expect(storage.isAuthenticated()).toBe(false);
    });

    it('没有访问令牌时应该返回 false', async () => {
      // 只存储刷新令牌
      await storage.storeTokenResponse({
        refresh_token: 'test-refresh-token',
        access_token: '',
        token_type: 'Bearer',
        expires_in: 0
      } as StandardTokenResponse);

      expect(storage.isAuthenticated()).toBe(false);
    });
  });

  describe('Token 元数据', () => {
    it('应该返回正确的 Token 元数据', async () => {
      const tokenResponse: StandardTokenResponse = {
        access_token: 'test-access-token',
        token_type: 'Bearer',
        expires_in: 7200, // 2小时
        scope: 'openid profile email',
        refresh_token: 'test-refresh-token'
      };

      await storage.storeTokenResponse(tokenResponse, 'test-device-id');

      const metadata = storage.getTokenMetadata();

      expect(metadata.tokenType).toBe('Bearer');
      expect(metadata.scope).toBe('openid profile email');
      expect(metadata.deviceId).toBe('test-device-id');
      expect(metadata.expiresAt).toBeGreaterThan(Date.now());
      expect(metadata.isExpired).toBe(false);
      expect(metadata.shouldRefresh).toBe(false);
    });

    it('应该正确检测 Token 过期状态', async () => {
      const tokenResponse: StandardTokenResponse = {
        access_token: 'test-access-token',
        token_type: 'Bearer',
        expires_in: 1 // 1秒后过期
      };

      await storage.storeTokenResponse(tokenResponse);

      // 等待过期
      await new Promise(resolve => setTimeout(resolve, 10));

      const metadata = storage.getTokenMetadata();
      expect(metadata.isExpired).toBe(true);
    });

    it('应该正确检测是否需要刷新', async () => {
      const tokenResponse: StandardTokenResponse = {
        access_token: 'test-access-token',
        token_type: 'Bearer',
        expires_in: 200 // 200秒后过期，小于刷新阈值（600秒）
      };

      await storage.storeTokenResponse(tokenResponse);

      const metadata = storage.getTokenMetadata();
      expect(metadata.shouldRefresh).toBe(true);
    });
  });

  describe('存储统计', () => {
    it('应该返回正确的存储统计信息', async () => {
      const stats = storage.getStorageStats();
      expect(stats.hasTokens).toBe(false);
      expect(stats.tokensCount).toBe(0);

      const tokenResponse: StandardTokenResponse = {
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        id_token: 'test-id-token',
        token_type: 'Bearer',
        expires_in: 3600
      };

      await storage.storeTokenResponse(tokenResponse);

      const updatedStats = storage.getStorageStats();
      expect(updatedStats.hasTokens).toBe(true);
      expect(updatedStats.tokensCount).toBe(3);
      expect(updatedStats.storageAge).toBeGreaterThan(0);
      expect(updatedStats.lastAccessed).toBeGreaterThan(0);
    });
  });

  describe('数据清理', () => {
    it('应该清理所有 Token', async () => {
      const tokenResponse: StandardTokenResponse = {
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        id_token: 'test-id-token',
        token_type: 'Bearer',
        expires_in: 3600
      };

      await storage.storeTokenResponse(tokenResponse);

      expect(storage.getAccessToken()).toBe('test-access-token');
      expect(storage.getRefreshToken()).toBe('test-refresh-token');
      expect(storage.getIDToken()).toBe('test-id-token');

      storage.clearTokens();

      expect(storage.getAccessToken()).toBeNull();
      expect(storage.getRefreshToken()).toBeNull();
      expect(storage.getIDToken()).toBeNull();
    });

    it('应该清理过期的存储数据', async () => {
      // 创建一个有过期时间的存储
      const storageWithShortMaxTime = new SecureTokenStorage({
        maxStorageTime: 1 // 1毫秒过期
      });

      await storageWithShortMaxTime.storeTokenResponse({
        access_token: 'test-token',
        token_type: 'Bearer',
        expires_in: 3600
      });

      // 等待超过最大存储时间
      await new Promise(resolve => setTimeout(resolve, 10));

      // 尝试存储新数据应该清理旧数据
      await storageWithShortMaxTime.storeTokenResponse({
        access_token: 'new-test-token',
        token_type: 'Bearer',
        expires_in: 3600
      });

      expect(storageWithShortMaxTime.getAccessToken()).toBe('new-test-token');
    });
  });

  describe('错误处理', () => {
    it('应该处理 sessionStorage 读取错误', () => {
      // Mock sessionStorage 抛出错误
      vi.mocked(sessionStorage.getItem).mockImplementation(() => {
        throw new Error('Storage read error');
      });

      expect(storage.getAccessToken()).toBeNull();
      expect(storage.getRefreshToken()).toBeNull();
      expect(storage.getIDToken()).toBeNull();
    });

    it('应该处理 sessionStorage 写入错误', async () => {
      // Mock sessionStorage 抛出错误
      vi.mocked(sessionStorage.setItem).mockImplementation(() => {
        throw new Error('Storage write error');
      });

      const tokenResponse: StandardTokenResponse = {
        access_token: 'test-access-token',
        token_type: 'Bearer',
        expires_in: 3600
      };

      await expect(storage.storeTokenResponse(tokenResponse)).rejects.toThrow(SecureStorageError);
    });

    it('应该处理无效的 JSON 数据', () => {
      // Mock 无效的 JSON 数据
      vi.mocked(sessionStorage.getItem).mockReturnValue('invalid-json');

      expect(storage.getAccessToken()).toBeNull();
      expect(storage.getRefreshToken()).toBeNull();
      expect(storage.getIDToken()).toBeNull();
    });
  });

  describe('完整性校验', () => {
    it('应该存储完整性校验和', async () => {
      const tokenResponse: StandardTokenResponse = {
        access_token: 'test-access-token',
        token_type: 'Bearer',
        expires_in: 3600
      };

      await storage.storeTokenResponse(tokenResponse);

      // 验证存储的数据包含完整性校验和
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        'oauth2_secure_tokens',
        expect.stringContaining('integrityHash')
      );
    });

    it('应该验证数据完整性', async () => {
      const tokenResponse: StandardTokenResponse = {
        access_token: 'test-access-token',
        token_type: 'Bearer',
        expires_in: 3600
      };

      await storage.storeTokenResponse(tokenResponse);

      // 获取存储的数据
      const storedData = vi.mocked(sessionStorage.setItem).mock.calls
        .find(call => call[0] === 'oauth2_secure_tokens')?.[1];

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        expect(parsedData.integrityHash).toBeDefined();
      }
    });
  });
});