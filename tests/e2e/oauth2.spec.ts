/**
 * OAuth2 E2E 测试 - Playwright
 */

import { test, expect, Page } from '@playwright/test';

test.describe('OAuth2 认证流程 E2E 测试', () => {
  test.beforeEach(async ({ page }) => {
    // 清理存储
    await page.context().clearCookies();
    await page.evaluate(() => {
      sessionStorage.clear();
      localStorage.clear();
    });

    await page.goto('/');
  });

  test('完整的 OAuth2 认证流程', async ({ page }) => {
    // 1. 验证初始页面
    await expect(page.locator('[data-testid="auth-status"]')).toContainText('未认证');
    await expect(page.locator('[data-testid="login-button"]')).toBeVisible();

    // 2. 启动登录
    await page.click('[data-testid="login-button"]');

    // 3. 验证重定向到授权服务器
    await expect(page).toHaveURL(/oauth2\/authorize/);
    await expect(page.locator('h1')).toContainText('授权登录');

    // 4. 验证授权页面元素
    await expect(page.locator('[data-testid="username"]')).toBeVisible();
    await expect(page.locator('[data-testid="password"]')).toBeVisible();
    await expect(page.locator('[data-testid="authorize-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="deny-button"]')).toBeVisible();

    // 5. 模拟用户授权
    await page.fill('[data-testid="username"]', 'testuser');
    await page.fill('[data-testid="password"]', 'testpass');
    await page.click('[data-testid="authorize-button"]');

    // 6. 验证回调处理和登录成功
    await expect(page).toHaveURL(/\/auth\/callback/);
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();

    // 7. 等待重定向回主页
    await page.waitForTimeout(1000);
    await page.goto('/');

    // 8. 验证用户信息显示
    await expect(page.locator('[data-testid="auth-status"]')).toContainText('已认证');
    await expect(page.locator('[data-testid="user-name"]')).toContainText('Test User');
    await expect(page.locator('[data-testid="user-email"]')).toContainText('test@example.com');
    await expect(page.locator('[data-testid="user-sub"]')).toContainText('test-user-123');

    // 9. 验证 Token 状态
    await expect(page.locator('[data-testid="token-type"]')).toContainText('Bearer');
    await expect(page.locator('[data-testid="token-scope"]')).toContainText('openid profile email');
    await expect(page.locator('[data-testid="token-info"]')).toBeVisible();
    await expect(page.locator('[data-testid="token-status"]')).toContainText('有效');

    // 10. 测试 API 请求
    await page.click('[data-testid="api-test-button"]');
    await expect(page.locator('[data-testid="api-success"]')).toBeVisible();

    // 11. 测试 Token 刷新
    await page.click('[data-testid="refresh-button"]');
    await expect(page.locator('[data-testid="refresh-success"]')).toBeVisible();

    // 12. 验证刷新后的 Token 信息
    await expect(page.locator('[data-testid="token-status"]')).toContainText('有效');
    await expect(page.locator('[data-testid="last-refresh"]')).toBeVisible();

    // 13. 测试登出
    await page.click('[data-testid="logout-button"]');
    await expect(page.locator('[data-testid="auth-status"]')).toContainText('未认证');

    // 14. 验证登出后状态
    await expect(page.locator('[data-testid="user-name"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="token-info"]')).not.toBeVisible();
  });

  test('用户拒绝授权', async ({ page }) => {
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL(/oauth2\/authorize/);

    // 点击拒绝授权
    await page.click('[data-testid="deny-button"]');

    // 验证错误处理
    await expect(page).toHaveURL(/\/auth\/callback/);
    await expect(page.locator('[data-testid="error-message"]')).toContainText('授权被拒绝');
    await expect(page.locator('[data-testid="auth-status"]')).toContainText('未认证');
  });

  test('Token 自动刷新', async ({ page }) => {
    // 先完成登录
    await completeLogin(page);

    // 等待一段时间模拟 Token 接近过期
    await page.waitForTimeout(2000);

    // 发起 API 请求，应该触发自动刷新
    await page.click('[data-testid="api-test-button"]');

    // 验证刷新成功
    await expect(page.locator('[data-testid="api-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="token-status"]')).toContainText('有效');

    // 验证有刷新记录
    await expect(page.locator('[data-testid="refresh-count"]')).toContainText('1');
  });

  test('并发请求的 Token 刷新', async ({ page }) => {
    // 先完成登录
    await completeLogin(page);

    // 模拟 Token 过期场景
    await page.evaluate(() => {
      const storage = sessionStorage.getItem('oauth2_secure_tokens');
      if (storage) {
        const data = JSON.parse(storage);
        data.expiresAt = Date.now() - 1000; // 设置为已过期
        sessionStorage.setItem('oauth2_secure_tokens', JSON.stringify(data));
      }
    });

    // 同时发起多个 API 请求
    await Promise.all([
      page.click('[data-testid="api-test-button-1"]'),
      page.click('[data-testid="api-test-button-2"]'),
      page.click('[data-testid="api-test-button-3"]')
    ]);

    // 验证所有请求都成功（避免重复刷新）
    await expect(page.locator('[data-testid="all-api-success"]')).toBeVisible();

    // 验证只进行了一次 Token 刷新
    const refreshCount = await page.evaluate(() => {
      return parseInt(sessionStorage.getItem('oauth2_refresh_count') || '0');
    });
    expect(refreshCount).toBe(1);
  });

  test('页面刷新后保持认证状态', async ({ page }) => {
    // 完成登录
    await completeLogin(page);

    // 刷新页面
    await page.reload();

    // 验证认证状态保持
    await expect(page.locator('[data-testid="auth-status"]')).toContainText('已认证');
    await expect(page.locator('[data-testid="user-name"]')).toContainText('Test User');
  });

  test('多个标签页的认证同步', async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();

    // 在第一个标签页完成登录
    await page1.goto('/');
    await completeLogin(page1);

    // 在第二个标签页打开应用
    await page2.goto('/');

    // 验证第二个标签页也显示已认证状态
    await expect(page2.locator('[data-testid="auth-status"]')).toContainText('已认证');
    await expect(page2.locator('[data-testid="user-name"]')).toContainText('Test User');

    // 在第一个标签页登出
    await page1.click('[data-testid="logout-button"]');

    // 验证第二个标签页也更新状态
    await expect(page2.locator('[data-testid="auth-status"]')).toContainText('未认证');

    await page1.close();
    await page2.close();
  });

  test('网络错误恢复', async ({ page }) => {
    // 模拟网络错误
    await page.route('**/oauth2/token', route => route.abort());

    await page.click('[data-testid="login-button"]');

    // 填写授权信息
    await page.fill('[data-testid="username"]', 'testuser');
    await page.fill('[data-testid="password"]', 'testpass');
    await page.click('[data-testid="authorize-button"]');

    // 验证网络错误处理
    await expect(page.locator('[data-testid="network-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();

    // 恢复网络并重试
    await page.unroute('**/oauth2/token');
    await page.click('[data-testid="retry-button"]');

    // 验证重试成功
    await expect(page.locator('[data-testid="auth-status"]')).toContainText('已认证');
  });

  test('长时间无活动后的认证状态', async ({ page }) => {
    // 完成登录
    await completeLogin(page);

    // 模拟长时间无活动（30分钟）
    await page.evaluate(() => {
      const storage = sessionStorage.getItem('oauth2_secure_tokens');
      if (storage) {
        const data = JSON.parse(storage);
        data.lastAccessed = Date.now() - (31 * 60 * 1000); // 31分钟前
        sessionStorage.setItem('oauth2_secure_tokens', JSON.stringify(data));
      }
    });

    // 发起请求应该触发 Token 刷新
    await page.click('[data-testid="api-test-button"]');

    // 验证刷新成功
    await expect(page.locator('[data-testid="api-success"]')).toBeVisible();
  });

  test('不同的权限范围', async ({ page }) => {
    // 修改权限范围
    await page.route('**/oauth2/authorize', route => {
      const url = new URL(route.request().url());
      url.searchParams.set('scope', 'read write');
      return route.fulfill({
        status: 302,
        headers: {
          'Location': url.toString()
        }
      });
    });

    await completeLogin(page);

    // 验证权限范围显示
    await expect(page.locator('[data-testid="token-scope"]')).toContainText('read write');
  });

  test('设备ID验证', async ({ page }) => {
    // 完成登录
    await completeLogin(page);

    // 验证设备ID生成
    const deviceId = await page.evaluate(() => {
      const storage = sessionStorage.getItem('oauth2_secure_tokens');
      if (storage) {
        const data = JSON.parse(storage);
        return data.deviceId;
      }
      return null;
    });

    expect(deviceId).toBeTruthy();
    expect(deviceId).toMatch(/^web_\d+_[a-f0-9]+$/);

    // 验证API请求包含设备ID
    let apiRequestHeaders: Record<string, string> = {};
    await page.route('**/api/**', route => {
      apiRequestHeaders = route.request().headers();
      return route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true })
      });
    });

    await page.click('[data-testid="api-test-button"]');

    expect(apiRequestHeaders['x-device-id']).toBe(deviceId);
  });
});

/**
 * 辅助函数：完成登录流程
 */
async function completeLogin(page: Page) {
  await page.click('[data-testid="login-button"]');

  // 等待跳转到授权页面
  await page.waitForURL(/oauth2\/authorize/);

  // 填写授权信息
  await page.fill('[data-testid="username"]', 'testuser');
  await page.fill('[data-testid="password"]', 'testpass');
  await page.click('[data-testid="authorize-button"]');

  // 等待回调处理完成
  await page.waitForURL(/\/auth\/callback/);

  // 等待自动跳转回主页或手动跳转
  try {
    await page.waitForURL('/', { timeout: 3000 });
  } catch {
    // 如果没有自动跳转，手动跳转
    await page.goto('/');
  }

  // 等待认证状态更新
  await expect(page.locator('[data-testid="auth-status"]')).toContainText('已认证', { timeout: 5000 });
}