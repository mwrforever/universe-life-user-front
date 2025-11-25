# OAuth2 前端实现参考代码

## 📋 概述

本文档提供了完整的JavaScript实现代码，用于与Universe Life授权服务进行OAuth2集成。包含PKCE支持、设备绑定、Token管理等完整功能。

## 🚀 完整OAuth2客户端实现

### OAuth2Client 核心类

```javascript
/**
 * OAuth2 客户端类
 * 提供完整的OAuth2授权码模式实现
 */
class OAuth2Client {
    constructor(config) {
        // 验证必需配置
        this._validateConfig(config);

        this.authBaseUrl = config.authBaseUrl;
        this.clientId = config.clientId;
        this.redirectUri = config.redirectUri;
        this.scopes = config.scopes || 'openid profile email';

        // 存储键名
        this.storageKeys = {
            accessToken: 'oauth_access_token',
            refreshToken: 'oauth_refresh_token',
            deviceId: 'oauth_device_id',
            expiresAt: 'oauth_expires_at',
            state: 'oauth_state',
            codeVerifier: 'oauth_code_verifier'
        };

        // 自动刷新配置
        this.autoRefresh = config.autoRefresh !== false;
        this.refreshThreshold = config.refreshThreshold || 5 * 60 * 1000; // 5分钟

        // 事件监听器
        this.eventListeners = new Map();
    }

    /**
     * 验证配置参数
     * @param {Object} config 配置对象
     */
    _validateConfig(config) {
        const required = ['authBaseUrl', 'clientId', 'redirectUri'];
        const missing = required.filter(key => !config[key]);

        if (missing.length > 0) {
            throw new Error(`缺少必需配置: ${missing.join(', ')}`);
        }
    }

    /**
     * 开始授权流程
     * 生成PKCE参数并重定向到授权服务器
     */
    async startAuthFlow() {
        try {
            // 生成PKCE参数
            const { codeChallenge, codeVerifier } = await this._generatePKCE();

            // 生成安全的state参数（防止CSRF攻击）
            const state = this._generateSecureState();

            // 存储PKCE和state
            sessionStorage.setItem(this.storageKeys.codeVerifier, codeVerifier);
            sessionStorage.setItem(this.storageKeys.state, state);

            // 构造授权URL
            const authUrl = this._buildAuthUrl(codeChallenge, state);

            console.log('🔐 开始OAuth2授权流程', { authUrl, state });

            // 重定向到授权服务器
            window.location.href = authUrl;

        } catch (error) {
            console.error('❌ 启动授权流程失败', error);
            this._emit('error', { type: 'AUTH_FLOW_START_FAILED', error });
            throw error;
        }
    }

    /**
     * 处理授权回调
     * 从URL中提取授权码并交换Token
     * @returns {Promise<Object>} Token数据
     */
    async handleAuthCallback() {
        try {
            const urlParams = new URLSearchParams(window.location.search);

            // 检查错误
            const error = urlParams.get('error');
            if (error) {
                const errorDescription = urlParams.get('error_description');
                throw new OAuth2Error(error, errorDescription);
            }

            // 获取授权码和state
            const code = urlParams.get('code');
            const state = urlParams.get('state');
            const storedState = sessionStorage.getItem(this.storageKeys.state);

            if (!code) {
                throw new Error('未找到授权码');
            }

            // 验证state参数（防止CSRF攻击）
            if (!state || !this._validateState(state, storedState)) {
                throw new Error('State验证失败 - 可能存在CSRF攻击或State已过期');
            }

            console.log('🔍 授权回调验证成功', { code, state });

            // 清理state
            sessionStorage.removeItem(this.storageKeys.state);

            // 交换Token
            const tokenData = await this.exchangeCodeForToken(code);

            console.log('✅ Token交换成功');
            this._emit('authenticated', tokenData);

            return tokenData;

        } catch (error) {
            console.error('❌ 处理授权回调失败', error);
            this._emit('error', { type: 'AUTH_CALLBACK_FAILED', error });
            throw error;
        }
    }

    /**
     * 使用授权码交换Token
     * @param {string} code 授权码
     * @returns {Promise<Object>} Token数据
     */
    async exchangeCodeForToken(code) {
        try {
            const codeVerifier = sessionStorage.getItem(this.storageKeys.codeVerifier);
            const deviceId = this._getOrCreateDeviceId();

            if (!codeVerifier) {
                throw new Error('PKCE验证码丢失');
            }

            const requestBody = new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: this.redirectUri,
                client_id: this.clientId,
                code_verifier: codeVerifier,
                device_id: deviceId
            });

            const response = await fetch(`${this.authBaseUrl}/oauth2/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                body: requestBody
            });

            if (!response.ok) {
                const errorData = await this._parseErrorResponse(response);
                throw new OAuth2Error(errorData.error, errorData.error_description);
            }

            const tokenData = await response.json();

            // 存储Token数据
            this._storeTokenData(tokenData);

            // 清理PKCE验证码
            sessionStorage.removeItem(this.storageKeys.codeVerifier);

            return tokenData;

        } catch (error) {
            console.error('❌ Token交换失败', error);
            this._emit('error', { type: 'TOKEN_EXCHANGE_FAILED', error });
            throw error;
        }
    }

    /**
     * 刷新Access Token
     * @returns {Promise<Object>} 新的Token数据
     */
    async refreshToken() {
        try {
            const refreshToken = localStorage.getItem(this.storageKeys.refreshToken);
            const deviceId = localStorage.getItem(this.storageKeys.deviceId);

            if (!refreshToken) {
                throw new Error('未找到Refresh Token');
            }

            const requestBody = new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: this.clientId,
                device_id: deviceId
            });

            const response = await fetch(`${this.authBaseUrl}/oauth2/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                body: requestBody
            });

            if (!response.ok) {
                const errorData = await this._parseErrorResponse(response);
                throw new OAuth2Error(errorData.error, errorData.error_description);
            }

            const tokenData = await response.json();

            // 更新Token数据
            this._storeTokenData(tokenData);

            console.log('✅ Token刷新成功');
            this._emit('tokenRefreshed', tokenData);

            return tokenData;

        } catch (error) {
            console.error('❌ Token刷新失败', error);

            // 刷新失败，清理Token并触发登出
            this.logout();
            this._emit('error', { type: 'TOKEN_REFRESH_FAILED', error });

            throw error;
        }
    }

    /**
     * 检查Token是否需要刷新
     * @returns {boolean} 是否需要刷新
     */
    shouldRefreshToken() {
        const expiresAt = parseInt(localStorage.getItem(this.storageKeys.expiresAt) || '0');
        return Date.now() >= (expiresAt - this.refreshThreshold);
    }

    /**
     * 获取有效的Access Token
     * 自动处理Token过期和刷新
     * @returns {Promise<string>} Access Token
     */
    async getValidAccessToken() {
        const accessToken = localStorage.getItem(this.storageKeys.accessToken);

        if (!accessToken) {
            throw new Error('未找到Access Token，请先登录');
        }

        // 检查是否需要刷新
        if (this.autoRefresh && this.shouldRefreshToken()) {
            console.log('🔄 Token即将过期，自动刷新...');
            await this.refreshToken();
            return localStorage.getItem(this.storageKeys.accessToken);
        }

        return accessToken;
    }

    /**
     * 发起API请求
     * 自动处理Token认证和刷新
     * @param {string} url API地址
     * @param {Object} options 请求选项
     * @returns {Promise<Response>} 响应对象
     */
    async fetchWithAuth(url, options = {}) {
        try {
            const token = await this.getValidAccessToken();
            const deviceId = localStorage.getItem(this.storageKeys.deviceId);

            const authOptions = {
                ...options,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Device-ID': deviceId,
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            };

            let response = await fetch(url, authOptions);

            // 检查Token是否过期
            if (response.status === 401 && this.autoRefresh) {
                console.log('🔄 Token可能过期，尝试刷新后重试...');
                await this.refreshToken();

                // 使用新Token重试请求
                const newToken = localStorage.getItem(this.storageKeys.accessToken);
                authOptions.headers.Authorization = `Bearer ${newToken}`;
                response = await fetch(url, authOptions);
            }

            return response;

        } catch (error) {
            console.error('❌ API请求失败', error);
            this._emit('error', { type: 'API_REQUEST_FAILED', error, url });
            throw error;
        }
    }

    /**
     * 登出
     * 清理所有存储的Token和状态
     */
    logout() {
        console.log('🚪 用户登出');

        // 清理localStorage
        Object.values(this.storageKeys).forEach(key => {
            localStorage.removeItem(key);
        });

        // 清理sessionStorage
        sessionStorage.removeItem(this.storageKeys.state);
        sessionStorage.removeItem(this.storageKeys.codeVerifier);

        this._emit('logout');
    }

    /**
     * 检查用户是否已登录
     * @returns {boolean} 登录状态
     */
    isAuthenticated() {
        const accessToken = localStorage.getItem(this.storageKeys.accessToken);
        const expiresAt = parseInt(localStorage.getItem(this.storageKeys.expiresAt) || '0');

        return !!accessToken && Date.now() < expiresAt;
    }

    /**
     * 获取当前用户信息（如果有ID Token）
     * @returns {Object|null} 用户信息
     */
    getCurrentUser() {
        const accessToken = localStorage.getItem(this.storageKeys.accessToken);
        if (!accessToken) return null;

        try {
            // 解析JWT Token（仅解析payload，不验证签名）
            const payload = this._parseJWT(accessToken);
            return payload;
        } catch (error) {
            console.error('解析Token失败', error);
            return null;
        }
    }

    /**
     * 事件监听
     * @param {string} event 事件名称
     * @param {Function} callback 回调函数
     */
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    /**
     * 移除事件监听
     * @param {string} event 事件名称
     * @param {Function} callback 回调函数
     */
    off(event, callback) {
        if (this.eventListeners.has(event)) {
            const listeners = this.eventListeners.get(event);
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    // ========== 私有方法 ==========

    /**
     * 生成PKCE参数
     * @returns {Object} PKCE参数
     */
    async _generatePKCE() {
        try {
            // 推荐使用 @panva/oauth4-webapi 库
            if (typeof generateCodeVerifier !== 'undefined') {
                const codeVerifier = generateCodeVerifier(); // 43-128字符
                const codeChallenge = await generateCodeChallenge(codeVerifier);
                return { codeChallenge, codeVerifier };
            }

            // 备用实现（使用Web Crypto API）
            const codeVerifier = this._generateRandomString(128);
            const codeChallenge = await this._generateCodeChallenge(codeVerifier);
            return { codeChallenge, codeVerifier };

        } catch (error) {
            console.error('PKCE生成失败', error);
            throw new Error('PKCE参数生成失败');
        }
    }

    /**
     * 生成安全的state参数
     * @returns {string} 加密的state参数
     */
    _generateSecureState() {
        const timestamp = Date.now();
        const random = crypto.getRandomValues(new Uint8Array(16));
        const stateData = { timestamp, random: Array.from(random) };
        return btoa(JSON.stringify(stateData));
    }

    /**
     * 验证state参数
     * @param {string} receivedState 接收到的state
     * @param {string} storedState 存储的state
     * @returns {boolean} 验证结果
     */
    _validateState(receivedState, storedState) {
        try {
            if (receivedState !== storedState) {
                return false;
            }

            const stateData = JSON.parse(atob(receivedState));
            const now = Date.now();

            // 验证时间戳（5分钟内有效）
            if (now - stateData.timestamp > 5 * 60 * 1000) {
                return false;
            }

            return true;
        } catch (error) {
            console.error('State验证失败', error);
            return false;
        }
    }

    /**
     * 构造授权URL
     * @param {string} codeChallenge PKCE Challenge
     * @param {string} state State参数
     * @returns {string} 授权URL
     */
    _buildAuthUrl(codeChallenge, state) {
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            scope: this.scopes,
            code_challenge: codeChallenge,
            code_challenge_method: 'S256',
            state: state
        });

        return `${this.authBaseUrl}/oauth2/authorize?${params}`;
    }

    /**
     * 获取或创建设备ID
     * @returns {string} 设备ID
     */
    _getOrCreateDeviceId() {
        let deviceId = localStorage.getItem(this.storageKeys.deviceId);

        if (!deviceId) {
            deviceId = `web_${Date.now()}_${this._generateRandomString(8)}`;
            localStorage.setItem(this.storageKeys.deviceId, deviceId);
        }

        return deviceId;
    }

    /**
     * 存储Token数据
     * @param {Object} tokenData Token数据
     */
    _storeTokenData(tokenData) {
        localStorage.setItem(this.storageKeys.accessToken, tokenData.access_token);

        if (tokenData.refresh_token) {
            localStorage.setItem(this.storageKeys.refreshToken, tokenData.refresh_token);
        }

        if (tokenData.device_id) {
            localStorage.setItem(this.storageKeys.deviceId, tokenData.device_id);
        }

        // 设置过期时间
        const expiresAt = Date.now() + (tokenData.expires_in * 1000);
        localStorage.setItem(this.storageKeys.expiresAt, expiresAt.toString());
    }

    /**
     * 生成随机字符串
     * @param {number} length 长度
     * @returns {string} 随机字符串
     */
    _generateRandomString(length) {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
        let result = '';

        for (let i = 0; i < length; i++) {
            result += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        return result;
    }

    /**
     * Base64URL编码
     * @param {string} str 原始字符串
     * @returns {string} Base64URL编码字符串
     */
    _base64URLencode(str) {
        return btoa(str)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }

    /**
     * 解析JWT Token
     * @param {string} token JWT Token
     * @returns {Object} Token payload
     */
    _parseJWT(token) {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('无效的JWT格式');
        }

        const payload = parts[1];
        // 补齐Base64字符串
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);

        return JSON.parse(atob(padded));
    }

    /**
     * 解析错误响应
     * @param {Response} response HTTP响应
     * @returns {Promise<Object>} 错误数据
     */
    async _parseErrorResponse(response) {
        try {
            return await response.json();
        } catch (error) {
            return {
                error: 'unknown_error',
                error_description: `HTTP ${response.status}: ${response.statusText}`
            };
        }
    }

    /**
     * 触发事件
     * @param {string} event 事件名称
     * @param {*} data 事件数据
     */
    _emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`事件回调执行失败 [${event}]`, error);
                }
            });
        }
    }
}

/**
 * OAuth2错误类
 */
class OAuth2Error extends Error {
    constructor(error, description) {
        super(description || error);
        this.name = 'OAuth2Error';
        this.error = error;
        this.description = description;
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { OAuth2Client, OAuth2Error };
} else if (typeof window !== 'undefined') {
    window.OAuth2Client = OAuth2Client;
    window.OAuth2Error = OAuth2Error;
}

// ========== 依赖库说明 ==========

/**
 * 推荐安装的依赖包
 *
 * 1. @panva/oauth4-webapi (PKCE生成)
 *    npm install @panva/oauth4-webapi
 *
 * 2. jose (JWT处理)
 *    npm install jose
 *
 * 3. crypto-js (备选加密库)
 *    npm install crypto-js
 *
 * 使用示例:
 *
 * import { generateCodeVerifier, generateCodeChallenge } from '@panva/oauth4-webapi';
 * import { jwtVerify } from 'jose';
 */
```

## 🔧 使用示例

### 基本使用

```javascript
// 初始化OAuth2客户端
const authClient = new OAuth2Client({
    authBaseUrl: 'http://localhost:8099', // 直接访问授权服务器
    clientId: 'fCSYj5XOia6J4O9shfka',
    redirectUri: 'http://localhost:3000/auth/callback', // 前端直连回调
    scopes: 'profile email read write', // 移除了openid
    autoRefresh: true,
    refreshThreshold: 5 * 60 * 1000 // 5分钟前刷新
});

// 事件监听
authClient.on('authenticated', (tokenData) => {
    console.log('用户认证成功', tokenData);
    // 跳转到主页面
    window.location.href = '/dashboard';
});

authClient.on('tokenRefreshed', (tokenData) => {
    console.log('Token刷新成功', tokenData);
});

authClient.on('logout', () => {
    console.log('用户已登出');
    // 跳转到登录页面
    window.location.href = '/login';
});

authClient.on('error', (errorInfo) => {
    console.error('认证错误', errorInfo);
    handleAuthError(errorInfo);
});

// 启动认证流程
function login() {
    authClient.startAuthFlow();
}

// 处理认证回调
async function handleAuthCallback() {
    try {
        const tokenData = await authClient.handleAuthCallback();
        console.log('认证成功', tokenData);
    } catch (error) {
        console.error('认证失败', error);
        showErrorMessage('认证失败，请重试');
    }
}

// 登出
function logout() {
    authClient.logout();
}

// 发起API请求
async function fetchUserData() {
    try {
        const response = await authClient.fetchWithAuth('/api/user/profile');
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error('获取用户数据失败', error);
        throw error;
    }
}

// 检查登录状态
function checkAuthStatus() {
    if (authClient.isAuthenticated()) {
        const currentUser = authClient.getCurrentUser();
        console.log('当前用户', currentUser);
        return true;
    } else {
        console.log('用户未登录');
        return false;
    }
}
```

### 页面集成示例

#### 登录页面 (login.html)

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>用户登录 - Universe Life</title>
    <link rel="stylesheet" href="/css/auth.css">
</head>
<body>
    <div class="auth-container">
        <div class="auth-card">
            <div class="auth-header">
                <h1>Universe Life</h1>
                <p>欢迎回来</p>
            </div>

            <div class="auth-tabs">
                <button class="tab-btn active" data-tab="password">密码登录</button>
                <button class="tab-btn" data-tab="sms">短信登录</button>
            </div>

            <!-- 密码登录表单 -->
            <form id="passwordForm" class="auth-form active">
                <div class="form-group">
                    <input type="email" id="username" name="username" placeholder="邮箱地址" required>
                </div>
                <div class="form-group">
                    <input type="password" id="password" name="password" placeholder="密码" required>
                </div>
                <button type="submit" class="auth-btn">登录</button>
            </form>

            <!-- 短信登录表单 -->
            <form id="smsForm" class="auth-form">
                <div class="form-group">
                    <input type="email" id="smsEmail" name="email" placeholder="邮箱地址" required>
                </div>
                <div class="form-group-inline">
                    <input type="text" id="captcha" name="captcha" placeholder="验证码" required>
                    <button type="button" id="sendCaptcha" class="captcha-btn">发送验证码</button>
                </div>
                <button type="submit" class="auth-btn">登录</button>
            </form>

            <div class="auth-footer">
                <a href="/register">还没有账号？立即注册</a>
                <a href="/forgot-password">忘记密码？</a>
            </div>
        </div>
    </div>

    <!-- 加载指示器 -->
    <div id="loading" class="loading-overlay hidden">
        <div class="loading-spinner"></div>
        <p>正在处理中...</p>
    </div>

    <!-- 消息提示 -->
    <div id="message" class="message-toast hidden"></div>

    <script src="/js/oauth2-client.js"></script>
    <script src="/js/login.js"></script>
</body>
</html>
```

#### 登录页面JavaScript (login.js)

```javascript
// 初始化OAuth2客户端
const authClient = new OAuth2Client({
    authBaseUrl: 'http://localhost:8099',
    clientId: 'fCSYj5XOia6J4O9shfka',
    redirectUri: 'http://localhost:3000/auth/callback', // 前端直连回调
    scopes: 'profile email read write' // 移除了openid
});

// DOM元素
const elements = {
    passwordForm: document.getElementById('passwordForm'),
    smsForm: document.getElementById('smsForm'),
    tabBtns: document.querySelectorAll('.tab-btn'),
    sendCaptchaBtn: document.getElementById('sendCaptcha'),
    loading: document.getElementById('loading'),
    message: document.getElementById('message')
};

// 当前登录方式
let currentMethod = 'password';

// 设备ID
const deviceId = generateDeviceId();

// 初始化
function init() {
    setupEventListeners();
    checkAuthCallback();
}

// 设置事件监听器
function setupEventListeners() {
    // Tab切换
    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // 表单提交
    elements.passwordForm.addEventListener('submit', handlePasswordLogin);
    elements.smsForm.addEventListener('submit', handleSmsLogin);

    // 发送验证码
    elements.sendCaptchaBtn.addEventListener('click', sendCaptcha);
}

// 切换登录方式
function switchTab(method) {
    currentMethod = method;

    // 更新Tab按钮状态
    elements.tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === method);
    });

    // 切换表单
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });

    if (method === 'password') {
        elements.passwordForm.classList.add('active');
    } else {
        elements.smsForm.classList.add('active');
    }
}

// 处理密码登录
async function handlePasswordLogin(event) {
    event.preventDefault();

    const formData = new FormData(elements.passwordForm);
    const loginData = {
        username: formData.get('username'),
        password: formData.get('password'),
        device_id: deviceId
    };

    await performLogin(loginData, '/login');
}

// 处理短信登录
async function handleSmsLogin(event) {
    event.preventDefault();

    const formData = new FormData(elements.smsForm);
    const loginData = {
        email: formData.get('email'),
        captcha: formData.get('captcha'),
        device_id: deviceId,
        usage_type: 'LOGIN'
    };

    await performLogin(loginData, '/login/sms');
}

// 执行登录
async function performLogin(loginData, endpoint) {
    showLoading(true);

    try {
        const response = await fetch(`http://localhost:8099${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(loginData)
        });

        if (response.ok) {
            // 登录成功，检查是否有重定向
            const location = response.headers.get('Location');
            if (location) {
                window.location.href = location;
            } else {
                // 如果没有重定向，启动OAuth2流程
                authClient.startAuthFlow();
            }
        } else {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || '登录失败');
        }

    } catch (error) {
        console.error('登录失败', error);
        showMessage(error.message || '登录失败，请重试', 'error');
    } finally {
        showLoading(false);
    }
}

// 发送验证码
async function sendCaptcha() {
    const email = document.getElementById('smsEmail').value;

    if (!email) {
        showMessage('请输入邮箱地址', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage('请输入有效的邮箱地址', 'error');
        return;
    }

    showLoading(true);

    try {
        const response = await fetch('http://localhost:8099/common/captcha/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                identification: email,
                usageType: 'LOGIN'
            })
        });

        if (response.ok) {
            showMessage('验证码已发送，请查收邮件', 'success');
            startCaptchaCountdown();
        } else {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || '发送验证码失败');
        }

    } catch (error) {
        console.error('发送验证码失败', error);
        showMessage(error.message || '发送验证码失败，请重试', 'error');
    } finally {
        showLoading(false);
    }
}

// 验证码倒计时
function startCaptchaCountdown() {
    let countdown = 60;
    elements.sendCaptchaBtn.disabled = true;

    const timer = setInterval(() => {
        countdown--;
        elements.sendCaptchaBtn.textContent = `${countdown}秒后重试`;

        if (countdown <= 0) {
            clearInterval(timer);
            elements.sendCaptchaBtn.disabled = false;
            elements.sendCaptchaBtn.textContent = '发送验证码';
        }
    }, 1000);
}

// 检查是否为认证回调
function checkAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (code || error) {
        // 这是认证回调，处理授权码
        handleAuthCallback();
    }
}

// 处理认证回调
async function handleAuthCallback() {
    try {
        showLoading(true);
        const tokenData = await authClient.handleAuthCallback();
        showMessage('登录成功，正在跳转...', 'success');

        // 延迟跳转到主页面
        setTimeout(() => {
            window.location.href = '/dashboard';
        }, 1000);

    } catch (error) {
        console.error('认证失败', error);
        showMessage(error.description || error.message || '认证失败，请重试', 'error');

        // 清理URL参数
        window.history.replaceState({}, document.title, window.location.pathname);
    } finally {
        showLoading(false);
    }
}

// 工具函数
function generateDeviceId() {
    let deviceId = localStorage.getItem('oauth_device_id');
    if (!deviceId) {
        deviceId = `web_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
        localStorage.setItem('oauth_device_id', deviceId);
    }
    return deviceId;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showLoading(show) {
    elements.loading.classList.toggle('hidden', !show);
}

function showMessage(text, type = 'info') {
    const messageEl = elements.message;
    messageEl.textContent = text;
    messageEl.className = `message-toast ${type}`;
    messageEl.classList.remove('hidden');

    setTimeout(() => {
        messageEl.classList.add('hidden');
    }, 5000);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
```

#### 回调页面 (auth-callback.html)

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>认证回调 - Universe Life</title>
    <style>
        body {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .callback-container {
            text-align: center;
            padding: 2rem;
        }
        .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .message {
            font-size: 1.1rem;
            margin-bottom: 1rem;
        }
        .error {
            background: rgba(220, 53, 69, 0.2);
            padding: 1rem;
            border-radius: 8px;
            border: 1px solid rgba(220, 53, 69, 0.5);
        }
    </style>
</head>
<body>
    <div class="callback-container">
        <div class="spinner"></div>
        <div id="message" class="message">正在处理认证信息...</div>
        <div id="error" class="error hidden"></div>
    </div>

    <script src="/js/oauth2-client.js"></script>
    <script>
        // 初始化OAuth2客户端
        const authClient = new OAuth2Client({
            authBaseUrl: 'http://localhost:8099',
            clientId: 'fCSYj5XOia6J4O9shfka',
            redirectUri: 'http://localhost:3000/auth/callback', // 前端直连回调
            scopes: 'profile email read write' // 移除了openid
        });

        const messageEl = document.getElementById('message');
        const errorEl = document.getElementById('error');

        // 处理认证回调
        async function handleCallback() {
            try {
                const tokenData = await authClient.handleAuthCallback();
                messageEl.textContent = '认证成功，正在跳转到主页...';

                // 延迟跳转
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1500);

            } catch (error) {
                console.error('认证失败', error);

                messageEl.classList.add('hidden');
                errorEl.classList.remove('hidden');
                errorEl.textContent = error.description || error.message || '认证失败，请重试';

                // 3秒后跳转到登录页面
                setTimeout(() => {
                    window.location.href = '/login';
                }, 3000);
            }
        }

        // 页面加载完成后处理回调
        document.addEventListener('DOMContentLoaded', handleCallback);
    </script>
</body>
</html>
```

#### 主页面集成示例 (dashboard.js)

```javascript
// 初始化OAuth2客户端
const authClient = new OAuth2Client({
    authBaseUrl: 'http://localhost:8099',
    clientId: 'fCSYj5XOia6J4O9shfka',
    redirectUri: 'http://localhost:3000/auth/callback', // 前端直连回调
    scopes: 'profile email read write' // 移除了openid,
    autoRefresh: true
});

// 全局变量
let currentUser = null;
let isRefreshing = false;

// 初始化
async function init() {
    try {
        await checkAuthStatus();
        setupEventListeners();
        loadUserData();
        startTokenRefreshTimer();
    } catch (error) {
        console.error('初始化失败', error);
        redirectToLogin();
    }
}

// 检查认证状态
async function checkAuthStatus() {
    if (!authClient.isAuthenticated()) {
        console.log('用户未认证，跳转到登录页');
        redirectToLogin();
        return false;
    }

    currentUser = authClient.getCurrentUser();
    console.log('当前用户', currentUser);
    return true;
}

// 设置事件监听器
function setupEventListeners() {
    // 监听认证事件
    authClient.on('tokenRefreshed', (tokenData) => {
        console.log('Token自动刷新成功');
        showNotification('会话已更新', 'success');
    });

    authClient.on('logout', () => {
        console.log('用户已登出');
        redirectToLogin();
    });

    authClient.on('error', (errorInfo) => {
        console.error('认证错误', errorInfo);
        handleAuthError(errorInfo);
    });

    // 登出按钮
    document.getElementById('logoutBtn')?.addEventListener('click', logout);
}

// 加载用户数据
async function loadUserData() {
    try {
        const response = await authClient.fetchWithAuth('/api/user/profile');
        const userData = await response.json();

        // 更新UI
        updateUserUI(userData);

    } catch (error) {
        console.error('加载用户数据失败', error);
        showNotification('加载用户信息失败', 'error');
    }
}

// 更新用户UI
function updateUserUI(userData) {
    // 更新用户名
    const userNameEl = document.getElementById('userName');
    if (userNameEl) {
        userNameEl.textContent = userData.nickname || userData.email || '未知用户';
    }

    // 更新用户头像
    const avatarEl = document.getElementById('userAvatar');
    if (avatarEl && userData.avatar) {
        avatarEl.src = userData.avatar;
    }

    // 更新其他用户信息...
}

// API请求封装
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await authClient.fetchWithAuth(endpoint, options);

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error('API请求失败', error);
        throw error;
    }
}

// 示例API调用
async function loadDashboardData() {
    try {
        const [userStats, recentActivities, notifications] = await Promise.all([
            apiRequest('/api/user/stats'),
            apiRequest('/api/user/activities'),
            apiRequest('/api/notifications')
        ]);

        updateDashboardUI(userStats, recentActivities, notifications);

    } catch (error) {
        console.error('加载仪表板数据失败', error);
        showNotification('加载数据失败', 'error');
    }
}

// Token刷新定时器
function startTokenRefreshTimer() {
    // 每30秒检查一次Token是否需要刷新
    setInterval(async () => {
        if (authClient.shouldRefreshToken() && !isRefreshing) {
            isRefreshing = true;
            try {
                await authClient.refreshToken();
            } catch (error) {
                console.error('Token刷新失败', error);
            } finally {
                isRefreshing = false;
            }
        }
    }, 30000);
}

// 登出
function logout() {
    if (confirm('确定要退出登录吗？')) {
        authClient.logout();
    }
}

// 跳转到登录页
function redirectToLogin() {
    window.location.href = '/login';
}

// 处理认证错误
function handleAuthError(errorInfo) {
    switch (errorInfo.type) {
        case 'TOKEN_REFRESH_FAILED':
            showNotification('会话已过期，请重新登录', 'warning');
            setTimeout(() => {
                redirectToLogin();
            }, 2000);
            break;

        case 'API_REQUEST_FAILED':
            if (errorInfo.error?.message?.includes('401')) {
                showNotification('认证失败，请重新登录', 'warning');
                setTimeout(() => {
                    redirectToLogin();
                }, 2000);
            }
            break;

        default:
            showNotification('认证错误，请重新登录', 'error');
            setTimeout(() => {
                redirectToLogin();
            }, 2000);
    }
}

// 显示通知
function showNotification(message, type = 'info') {
    // 实现通知显示逻辑
    console.log(`[${type.toUpperCase()}] ${message}`);

    // 简单的alert实现，实际项目中应该使用更优雅的通知组件
    const icon = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    }[type] || 'ℹ️';

    alert(`${icon} ${message}`);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    // 清理定时器等资源
});
```

## 🧪 测试用例

### 单元测试示例

```javascript
// OAuth2Client.test.js
describe('OAuth2Client', () => {
    let authClient;

    beforeEach(() => {
        authClient = new OAuth2Client({
            authBaseUrl: 'http://localhost:8099',
            clientId: 'test-client',
            redirectUri: 'https://test.example.com/callback',
            scopes: 'openid profile'
        });

        // 清理存储
        localStorage.clear();
        sessionStorage.clear();
    });

    describe('PKCE生成', () => {
        it('应该生成有效的PKCE参数', async () => {
            const { codeChallenge, codeVerifier } = await authClient._generatePKCE();

            expect(codeVerifier).toMatch(/^[A-Za-z0-9\-._~]{43,128}$/);
            expect(codeChallenge).toMatch(/^[A-Za-z0-9\-._~]{43,128}$/);
            expect(codeVerifier).not.toBe(codeChallenge);
        });
    });

    describe('Token存储', () => {
        it('应该正确存储Token数据', () => {
            const tokenData = {
                access_token: 'test-access-token',
                refresh_token: 'test-refresh-token',
                expires_in: 3600,
                device_id: 'test-device-id'
            };

            authClient._storeTokenData(tokenData);

            expect(localStorage.getItem('oauth_access_token')).toBe('test-access-token');
            expect(localStorage.getItem('oauth_refresh_token')).toBe('test-refresh-token');
            expect(localStorage.getItem('oauth_device_id')).toBe('test-device-id');
        });
    });

    describe('认证状态检查', () => {
        it('应该正确判断认证状态', () => {
            expect(authClient.isAuthenticated()).toBe(false);

            // 设置Token
            localStorage.setItem('oauth_access_token', 'test-token');
            localStorage.setItem('oauth_expires_at', (Date.now() + 3600000).toString());

            expect(authClient.isAuthenticated()).toBe(true);

            // 设置过期时间
            localStorage.setItem('oauth_expires_at', (Date.now() - 1000).toString());

            expect(authClient.isAuthenticated()).toBe(false);
        });
    });

    describe('设备ID管理', () => {
        it('应该生成并复用设备ID', () => {
            const deviceId1 = authClient._getOrCreateDeviceId();
            const deviceId2 = authClient._getOrCreateDeviceId();

            expect(deviceId1).toBe(deviceId2);
            expect(deviceId1).toMatch(/^web_\d+_[a-z0-9]{8}$/);
        });
    });
});
```

### 集成测试示例

```javascript
// auth-integration.test.js
describe('OAuth2集成测试', () => {
    let authClient;

    beforeEach(() => {
        authClient = new OAuth2Client({
            authBaseUrl: 'http://localhost:8080',
            clientId: 'test-client',
            redirectUri: 'http://localhost:3000/auth/callback'
        });
    });

    it('应该完成完整的认证流程', async () => {
        // 1. 启动授权流程
        const startAuthSpy = jest.spyOn(window.location, 'href');
        authClient.startAuthFlow();

        expect(startAuthSpy).toHaveBeenCalledWith(
            expect.stringContaining('oauth2/authorize')
        );

        // 2. 模拟回调
        Object.defineProperty(window, 'location', {
            value: {
                search: '?code=test-auth-code&state=test-state',
                origin: 'http://localhost:3000'
            }
        });

        // 设置必要的存储数据
        sessionStorage.setItem('oauth_code_verifier', 'test-verifier');
        sessionStorage.setItem('oauth_state', 'test-state');

        // Mock fetch
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({
                access_token: 'test-access-token',
                refresh_token: 'test-refresh-token',
                expires_in: 3600
            })
        });

        // 3. 处理回调
        const tokenData = await authClient.handleAuthCallback();

        expect(tokenData.access_token).toBe('test-access-token');
        expect(authClient.isAuthenticated()).toBe(true);
    });
});
```

## 📱 React Hook 封装

```javascript
// useOAuth2.js
import { useState, useEffect, useCallback } from 'react';
import { OAuth2Client } from './OAuth2Client';

export function useOAuth2(config) {
    const [authClient] = useState(() => new OAuth2Client(config));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuthStatus = useCallback(async () => {
        try {
            setLoading(true);
            const authenticated = authClient.isAuthenticated();
            setIsAuthenticated(authenticated);

            if (authenticated) {
                setUser(authClient.getCurrentUser());
            }
        } catch (error) {
            console.error('检查认证状态失败', error);
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [authClient]);

    useEffect(() => {
        checkAuthStatus();

        // 监听认证事件
        const handleAuthenticated = () => {
            setIsAuthenticated(true);
            setUser(authClient.getCurrentUser());
        };

        const handleLogout = () => {
            setIsAuthenticated(false);
            setUser(null);
        };

        authClient.on('authenticated', handleAuthenticated);
        authClient.on('logout', handleLogout);

        return () => {
            authClient.off('authenticated', handleAuthenticated);
            authClient.off('logout', handleLogout);
        };
    }, [authClient, checkAuthStatus]);

    const login = useCallback(() => {
        authClient.startAuthFlow();
    }, [authClient]);

    const logout = useCallback(() => {
        authClient.logout();
    }, [authClient]);

    const apiRequest = useCallback(async (url, options) => {
        return await authClient.fetchWithAuth(url, options);
    }, [authClient]);

    return {
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        apiRequest,
        authClient
    };
}

// 使用示例
function App() {
    const { isAuthenticated, user, loading, login, logout } = useOAuth2({
        authBaseUrl: 'http://localhost:8099',
        clientId: 'fCSYj5XOia6J4O9shfka',
        redirectUri: `${window.location.origin}/auth/callback`
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <LoginPage onLogin={login} />;
    }

    return (
        <div>
            <header>
                <h1>Welcome, {user?.name || user?.email}!</h1>
                <button onClick={logout}>Logout</button>
            </header>
            <main>
                <Dashboard />
            </main>
        </div>
    );
}
```

## 🔧 配置管理

### 环境配置

```javascript
// config/auth.js
const config = {
    development: {
        authBaseUrl: 'http://localhost:8080',
        clientId: 'dev-client',
        redirectUri: 'http://localhost:3000/auth/callback',
        scopes: 'profile email read write' // 移除了openid
    },
    staging: {
        authBaseUrl: 'https://staging-auth.example.com',
        clientId: 'staging-client',
        redirectUri: 'https://staging.example.com/auth/callback',
        scopes: 'profile email read write' // 移除了openid
    },
    production: {
        authBaseUrl: 'http://localhost:8099',
        clientId: 'prod-client',
        redirectUri: 'https://app.example.com/auth/callback',
        scopes: 'profile email read write' // 移除了openid
    }
};

export function getAuthConfig() {
    const env = process.env.NODE_ENV || 'development';
    return config[env];
}
```

## 📊 性能监控

### 性能指标收集

```javascript
// performance.js
class AuthPerformanceMonitor {
    constructor(authClient) {
        this.authClient = authClient;
        this.metrics = {
            loginAttempts: 0,
            loginSuccesses: 0,
            loginFailures: 0,
            tokenRefreshes: 0,
            tokenRefreshFailures: 0,
            apiRequests: 0,
            apiFailures: 0,
            averageResponseTime: 0
        };

        this.setupMonitoring();
    }

    setupMonitoring() {
        this.authClient.on('authenticated', () => {
            this.metrics.loginSuccesses++;
            this.reportMetric('login_success');
        });

        this.authClient.on('tokenRefreshed', () => {
            this.metrics.tokenRefreshes++;
            this.reportMetric('token_refresh');
        });

        this.authClient.on('error', (error) => {
            if (error.type === 'LOGIN_FAILED') {
                this.metrics.loginFailures++;
                this.reportMetric('login_failure');
            } else if (error.type === 'TOKEN_REFRESH_FAILED') {
                this.metrics.tokenRefreshFailures++;
                this.reportMetric('token_refresh_failure');
            }
        });
    }

    async measureApiRequest(url, requestFn) {
        const startTime = performance.now();
        this.metrics.apiRequests++;

        try {
            const result = await requestFn();
            const duration = performance.now() - startTime;
            this.updateAverageResponseTime(duration);
            this.reportMetric('api_success', { url, duration });
            return result;
        } catch (error) {
            this.metrics.apiFailures++;
            this.reportMetric('api_failure', { url, error: error.message });
            throw error;
        }
    }

    updateAverageResponseTime(duration) {
        const total = this.metrics.averageResponseTime * (this.metrics.apiRequests - 1) + duration;
        this.metrics.averageResponseTime = total / this.metrics.apiRequests;
    }

    reportMetric(type, data = {}) {
        // 发送指标到监控系统
        if (navigator.sendBeacon) {
            navigator.sendBeacon('/api/metrics', JSON.stringify({
                type,
                timestamp: Date.now(),
                ...data
            }));
        }
    }

    getMetrics() {
        return { ...this.metrics };
    }
}
```

## 🚀 部署建议

### 生产环境配置

1. **CSP配置**
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:8099">
```

2. **安全响应头**
```javascript
// 设置安全响应头
document.addEventListener('DOMContentLoaded', () => {
    // 这些通常由服务器配置，但前端也可以做一些检查
    if (location.protocol !== 'https:') {
        console.warn('建议在生产环境使用HTTPS');
    }
});
```

3. **错误监控**
```javascript
// 集成错误监控服务
window.addEventListener('error', (event) => {
    // 发送错误到监控服务
    if (window.errorReporter) {
        window.errorReporter.report(event.error);
    }
});

// 集成Sentry或类似服务
import * as Sentry from "@sentry/browser";

Sentry.init({
    dsn: "your-dsn-here",
    environment: process.env.NODE_ENV
});
```

---

**最后更新**: 2025年11月24日
**版本**: v1.0.0
**维护团队**: Universe Life 前端开发团队