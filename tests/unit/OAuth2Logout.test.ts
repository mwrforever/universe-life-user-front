import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { OAuth2Service } from '@/services/oauth2/authService';
import { oauth2MockServer } from '../mocks/oauth2-server';
import { TokenManager } from '@/services/http/client';

describe('OAuth2 Logout Flow - Authorization Header Fix', () => {
  beforeEach(() => {
    // 启动Mock服务器
    oauth2MockServer.listen();

    // 设置测试Token
    TokenManager.setAccessToken('test-access-token-valid', 7200);
    TokenManager.setRefreshToken('test-refresh-token-valid');
    TokenManager.setUserInfo({
      id: 'test-user-id',
      username: 'testuser',
      nickname: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    });
  });

  afterEach(() => {
    // 清理Mock服务器
    oauth2MockServer.close();

    // 清理Token
    TokenManager.clearTokens();
  });

  it('should logout successfully without Authorization header in Connect Logout', async () => {
    // 执行登出
    const result = await OAuth2Service.logout();

    // 验证登出成功
    expect(result.success).toBe(true);
    expect(result.message).toContain('已成功登出');

    // 验证本地Token已清理
    expect(TokenManager.getAccessToken()).toBeNull();
    expect(TokenManager.getRefreshToken()).toBeNull();
    expect(TokenManager.getUserInfo()).toBeNull();
  });

  it('should handle logout when no tokens exist', async () => {
    // 清理所有Token
    TokenManager.clearTokens();

    // 执行登出
    const result = await OAuth2Service.logout();

    // 验证登出成功
    expect(result.success).toBe(true);
    expect(result.message).toContain('已成功登出（无需撤销token）');
  });

  it('should still logout locally if server calls fail', async () => {
    // 关闭Mock服务器以模拟服务器故障
    oauth2MockServer.close();

    // 执行登出
    const result = await OAuth2Service.logout();

    // 验证本地登出仍然成功
    expect(result.success).toBe(true);
    expect(result.message).toContain('已强制登出，但服务器通信失败');

    // 验证本地Token已清理
    expect(TokenManager.getAccessToken()).toBeNull();
    expect(TokenManager.getRefreshToken()).toBeNull();
  });
});