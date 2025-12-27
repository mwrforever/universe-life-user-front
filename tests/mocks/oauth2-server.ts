/**
 * OAuth2 服务器模拟
 * 用于测试环境中的 OAuth2 流程模拟
 */

import { setupServer } from 'msw/node';
import { http } from 'msw';

/**
 * 生成测试用的 ID Token
 */
function generateTestIDToken(overrides: Record<string, unknown> = {}): string {
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: 'http://localhost:8099',
    sub: 'test-user-123',
    aud: 'test-client-id',
    exp: Math.floor(Date.now() / 1000) + 7200, // 2小时
    iat: Math.floor(Date.now() / 1000),
    name: 'Test User',
    email: 'test@example.com',
    email_verified: true,
    picture: 'https://example.com/avatar.jpg',
    ...overrides
  })).toString('base64url');
  const signature = 'test-signature';

  return `${header}.${payload}.${signature}`;
}

/**
 * OAuth2 模拟服务器
 */
export const oauth2MockServer = setupServer(
  // 授权端点模拟
  http.get('http://localhost:8099/oauth2/authorize', ({ request }) => {
    const url = new URL(request.url);
    const redirectUri = url.searchParams.get('redirect_uri');
    const state = url.searchParams.get('state');
    const responseType = url.searchParams.get('response_type');
    const clientId = url.searchParams.get('client_id');
    const codeChallenge = url.searchParams.get('code_challenge');
    const codeChallengeMethod = url.searchParams.get('code_challenge_method');

    // 验证必需参数
    if (!redirectUri || !state || !responseType || !clientId || !codeChallenge || !codeChallengeMethod) {
      return res(
        ctx.status(400),
        ctx.json({
          error: 'invalid_request',
          error_description: 'Missing required parameters'
        })
      );
    }

    // 验证响应类型
    if (responseType !== 'code') {
      return res(
        ctx.status(400),
        ctx.json({
          error: 'unsupported_response_type',
          error_description: 'Only authorization_code flow is supported'
        })
      );
    }

    // 验证 PKCE 参数
    if (codeChallengeMethod !== 'S256') {
      return res(
        ctx.status(400),
        ctx.json({
          error: 'invalid_request',
          error_description: 'Only S256 code challenge method is supported'
        })
      );
    }

    // 模拟成功授权
    const code = 'test-authorization-code-' + Math.random().toString(36).substr(2, 9);
    const redirectUrl = `${redirectUri}?code=${code}&state=${state}`;

    return res(
      ctx.status(302),
      ctx.set('Location', redirectUrl)
    );
  }),

  // Token 端点模拟
  http.post('http://localhost:8099/oauth2/token', async ({ request }) => {
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/x-www-form-urlencoded')) {
      return res(
        ctx.status(400),
        ctx.json({
          error: 'invalid_request',
          error_description: 'Content-Type must be application/x-www-form-urlencoded'
        })
      );
    }

    const body = await request.text();
    const params = new URLSearchParams(body);
    const grantType = params.get('grant_type');

    if (grantType === 'authorization_code') {
      // 授权码换 token
      const code = params.get('code');
      const redirectUri = params.get('redirect_uri');
      const clientId = params.get('client_id');
      const codeVerifier = params.get('code_verifier');

      // 验证必需参数
      if (!code || !redirectUri || !clientId || !codeVerifier) {
        return res(
          ctx.status(400),
          ctx.json({
            error: 'invalid_request',
            error_description: 'Missing required parameters for authorization_code grant'
          })
        );
      }

      // 验证授权码
      if (!code.startsWith('test-authorization-code')) {
        return res(
          ctx.status(400),
          ctx.json({
            error: 'invalid_grant',
            error_description: 'Invalid authorization code'
          })
        );
      }

      // 模拟成功 Token 交换
      return res(
        ctx.status(200),
        ctx.json({
          access_token: 'test-access-token-' + Math.random().toString(36).substr(2, 9),
          refresh_token: 'test-refresh-token-' + Math.random().toString(36).substr(2, 9),
          id_token: generateTestIDToken(),
          token_type: 'Bearer',
          expires_in: 7200, // 2小时
          scope: params.get('scope') || 'openid profile email'
        })
      );
    }

    if (grantType === 'refresh_token') {
      // 刷新 token
      const refreshToken = params.get('refresh_token');
      const clientId = params.get('client_id');
      const scope = params.get('scope');

      // 验证必需参数
      if (!refreshToken || !clientId) {
        return res(
          ctx.status(400),
          ctx.json({
            error: 'invalid_request',
            error_description: 'Missing required parameters for refresh_token grant'
          })
        );
      }

      // 模拟刷新令牌过期（20% 概率）
      if (Math.random() < 0.2) {
        return res(
          ctx.status(400),
          ctx.json({
            error: 'invalid_grant',
            error_description: 'Refresh token expired'
          })
        );
      }

      // 验证刷新令牌格式
      if (!refreshToken.startsWith('test-refresh-token')) {
        return res(
          ctx.status(400),
          ctx.json({
            error: 'invalid_grant',
            error_description: 'Invalid refresh token'
          })
        );
      }

      // 模拟成功 Token 刷新
      return res(
        ctx.status(200),
        ctx.json({
          access_token: 'new-test-access-token-' + Math.random().toString(36).substr(2, 9),
          refresh_token: 'new-test-refresh-token-' + Math.random().toString(36).substr(2, 9),
          id_token: generateTestIDToken({
            sub: 'test-user-123-updated', // 模拟用户信息更新
            iat: Math.floor(Date.now() / 1000) // 新的签发时间
          }),
          token_type: 'Bearer',
          expires_in: 7200, // 2小时
          scope: scope || 'openid profile email'
        })
      );
    }

    // 不支持的授权类型
    return res(
      ctx.status(400),
      ctx.json({
        error: 'unsupported_grant_type',
        error_description: `Grant type '${grantType}' is not supported`
      })
    );
  }),

  // 用户信息端点模拟
  rest.get('http://localhost:8099/oauth2/userinfo', (req, res, ctx) => {
    const authHeader = req.headers.get('authorization');

    if (!authHeader) {
      return res(
        ctx.status(401),
        ctx.json({
          error: 'invalid_token',
          error_description: 'Missing authorization header'
        })
      );
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res(
        ctx.status(401),
        ctx.json({
          error: 'invalid_token',
          error_description: 'Invalid authorization header format'
        })
      );
    }

    const token = authHeader.substring(7);

    // 验证 token 格式
    if (!token.startsWith('test-access-token') && !token.startsWith('new-test-access-token')) {
      return res(
        ctx.status(401),
        ctx.json({
          error: 'invalid_token',
          error_description: 'Invalid access token'
        })
      );
    }

    // 模拟过期的 token（10% 概率）
    if (Math.random() < 0.1) {
      return res(
        ctx.status(401),
        ctx.json({
          error: 'invalid_token',
          error_description: 'Access token expired'
        })
      );
    }

    // 返回用户信息
    return res(
      ctx.status(200),
      ctx.json({
        sub: 'test-user-123',
        name: 'Test User',
        given_name: 'Test',
        family_name: 'User',
        email: 'test@example.com',
        email_verified: true,
        picture: 'https://example.com/avatar.jpg',
        locale: 'zh-CN',
        updated_at: Math.floor(Date.now() / 1000)
      })
    );
  }),

  // Connect 登出端点模拟 - 删除会话的正确接口
  rest.post('http://localhost:8099/connect/logout', (req, res, ctx) => {
    console.log('Mock server: Connect logout endpoint called');

    // 注意：Connect 登出端点不应该携带 Authorization 请求头
    // 这会导致授权服务器误判，所以我们不验证 Authorization header

    // 尝试解析请求体
    let requestBody;
    try {
      requestBody = req.body ? JSON.parse(req.body as string) : {};
    } catch {
      requestBody = {};
    }

    const clientId = requestBody.client_id;

    // 验证客户端ID（可选）
    if (clientId && clientId !== 'universe-life-web') {
      return res(
        ctx.status(400),
        ctx.json({
          error: 'invalid_client',
          error_description: 'Invalid client_id'
        })
      );
    }

    // 模拟成功登出 - 可以选择重定向或返回成功状态
    const postLogoutRedirectUri = requestBody.post_logout_redirect_uri;
    if (postLogoutRedirectUri) {
      return res(
        ctx.status(302),
        ctx.set('Location', postLogoutRedirectUri)
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        message: 'Session cleared successfully'
      })
    );
  }),

  // 保留旧的 OAuth2 登出端点以确保兼容性，但标记为废弃
  rest.post('http://localhost:8099/oauth2/logout', (req, res, ctx) => {
    console.warn('Mock server: OAuth2 logout endpoint is deprecated, use /connect/logout instead');

    const idTokenHint = req.url.searchParams.get('id_token_hint');
    const postLogoutRedirectUri = req.url.searchParams.get('post_logout_redirect_uri');
    const state = req.url.searchParams.get('state');

    // 验证 ID Token hint（可选）
    if (idTokenHint && !idTokenHint.includes('.')) {
      return res(
        ctx.status(400),
        ctx.json({
          error: 'invalid_request',
          error_description: 'Invalid id_token_hint format'
        })
      );
    }

    // 模拟成功登出
    if (postLogoutRedirectUri) {
      const redirectUrl = state
        ? `${postLogoutRedirectUri}?state=${state}`
        : postLogoutRedirectUri;

      return res(
        ctx.status(302),
        ctx.set('Location', redirectUrl)
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        message: 'Logout successful',
        warning: 'This endpoint is deprecated, please use /connect/logout'
      })
    );
  }),

  // 错误情况模拟端点
  rest.get('http://localhost:8099/oauth2/authorize/error', (req, res, ctx) => {
    const redirectUri = req.url.searchParams.get('redirect_uri');
    const state = req.url.searchParams.get('state') || '';
    const error = req.url.searchParams.get('error_type') || 'access_denied';
    const errorDescription = req.url.searchParams.get('error_description') || 'User denied access';

    const redirectUrl = `${redirectUri}?error=${error}&state=${state}&error_description=${encodeURIComponent(errorDescription)}`;

    return res(
      ctx.status(302),
      ctx.set('Location', redirectUrl)
    );
  }),

  // 服务器错误模拟
  rest.get('http://localhost:8099/oauth2/authorize/server-error', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({
        error: 'server_error',
        error_description: 'Internal server error'
      })
    );
  })
);

/**
 * 创建过期的 ID Token
 */
export function createExpiredIDToken(): string {
  return generateTestIDToken({
    exp: Math.floor(Date.now() / 1000) - 3600 // 1小时前过期
  });
}

/**
 * 创建未来的 ID Token
 */
export function createFutureIDToken(): string {
  return generateTestIDToken({
    iat: Math.floor(Date.now() / 1000) + 3600 // 1小时后签发
  });
}

/**
 * 创建无效格式的 ID Token
 */
export function createInvalidIDToken(): string {
  return 'invalid.jwt.format';
}

/**
 * 创建缺少必需声明的 ID Token
 */
export function createIncompleteIDToken(): string {
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    // 缺少 sub 声明
    iss: 'http://localhost:8099',
    aud: 'test-client-id',
    exp: Math.floor(Date.now() / 1000) + 7200, // 2小时
    iat: Math.floor(Date.now() / 1000)
  })).toString('base64url');
  const signature = 'test-signature';

  return `${header}.${payload}.${signature}`;
}

export default oauth2MockServer;