# 万象生活项目 - 用户认证接口文档

## 概述

本文档描述了万象生活项目中用户认证相关的RESTful API接口规范，包括用户注册、登录、密码重置等功能。

## 基础信息

- **Base URL**: `https://api.universe-life.com/api/v1`
- **认证方式**: JWT Bearer Token
- **数据格式**: JSON
- **字符编码**: UTF-8

## 通用响应格式

### 成功响应
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {},
  "timestamp": "2025-01-01T00:00:00Z"
}
```

### 错误响应
```json
{
  "code": 400,
  "message": "错误描述",
  "error": "具体错误信息",
  "timestamp": "2025-01-01T00:00:00Z"
}
```

## 认证接口

### 1. 用户注册

#### 发送手机验证码

**接口路径**: `POST /auth/register/send-phone-code`

**接口描述**: 向用户手机号发送注册验证码

**请求参数**:
```json
{
  "phone": "13800138000"
}
```

**请求参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| phone | string | 是 | 手机号码，11位数字 |

**验证规则**:
- phone: 必须符合中国大陆手机号格式（1开头，第二位3-9）
- 该手机号不能是已注册用户
- 频率限制：每分钟最多发送1次，每小时最多发送3次

**响应示例**:
```json
{
  "code": 200,
  "message": "验证码发送成功",
  "data": {
    "codeId": "register_phone_code_abc123",
    "expireTime": 300,
    "remainingAttempts": 2
  },
  "timestamp": "2025-01-01T00:00:00Z"
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| codeId | string | 验证码ID，用于后续验证 |
| expireTime | number | 验证码有效期（秒） |
| remainingAttempts | number | 本小时剩余发送次数 |

---

#### 发送邮箱验证码

**接口路径**: `POST /auth/register/send-email-code`

**接口描述**: 向用户邮箱发送注册验证码

**请求参数**:
```json
{
  "email": "user@example.com"
}
```

**请求参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| email | string | 是 | 邮箱地址，需符合标准邮箱格式 |

**验证规则**:
- email: 符合标准邮箱格式
- 该邮箱不能是已注册用户
- 频率限制：每分钟最多发送1次，每小时最多发送3次

**响应示例**:
```json
{
  "code": 200,
  "message": "验证码发送成功",
  "data": {
    "codeId": "register_email_code_def456",
    "expireTime": 300,
    "remainingAttempts": 2
  },
  "timestamp": "2025-01-01T00:00:00Z"
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| codeId | string | 验证码ID，用于后续验证 |
| expireTime | number | 验证码有效期（秒） |
| remainingAttempts | number | 本小时剩余发送次数 |

---

#### 用户注册

**接口路径**: `POST /auth/register`

**接口描述**: 用户通过手机号验证码完成注册

**请求参数**:
```json
{
  "username": "张三",
  "phone": "13800138000",
  "email": "zhangsan@example.com",
  "verificationCode": "123456",
  "verificationType": "phone",
  "password": "password123",
  "confirmPassword": "password123",
  "agreement": true
}
```

**请求参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 用户名，3-20个字符 |
| phone | string | 是 | 手机号码，11位数字 |
| email | string | 是 | 邮箱地址，需符合标准邮箱格式 |
| verificationCode | string | 是 | 验证码，6位数字 |
| verificationType | string | 是 | 验证方式：phone-手机验证，email-邮箱验证 |
| password | string | 是 | 密码，6-20个字符，必须包含字母和数字 |
| confirmPassword | string | 是 | 确认密码，必须与password一致 |
| agreement | boolean | 是 | 是否同意用户协议和隐私政策，必须为true |

**验证规则**:
- username: 3-20个字符，支持中文、字母、数字、下划线，不能包含特殊字符
- phone: 必须符合中国大陆手机号格式，且未被注册
- email: 符合标准邮箱格式，且未被注册
- verificationCode: 6位数字，有效期5分钟
- password: 6-20个字符，至少包含1个字母和1个数字
- confirmPassword: 必须与password完全一致
- agreement: 必须为true，表示用户已阅读并同意相关协议

**唯一性检查**:
- 用户名在系统中必须唯一
- 手机号在系统中必须唯一
- 邮箱在系统中必须唯一

**响应示例**:
```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "userId": 1001,
    "username": "张三",
    "phone": "13800138000",
    "email": "zhangsan@example.com",
    "userType": "customer",
    "status": "active",
    "createdAt": "2025-01-01T00:00:00Z"
  },
  "timestamp": "2025-01-01T00:00:00Z"
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| userId | number | 用户ID |
| username | string | 用户名 |
| phone | string | 手机号 |
| email | string | 邮箱 |
| userType | string | 用户类型：customer-客户，provider-服务者，admin-管理员 |
| status | string | 账户状态：active-激活，inactive-未激活，banned-封禁 |
| createdAt | string | 创建时间 |

---

### 2. 用户登录

#### 账号密码登录

**接口路径**: `POST /auth/login/password`

**接口描述**: 用户通过用户名/手机号/邮箱和密码登录

**请求参数**:
```json
{
  "username": "13800138000",
  "password": "password123",
  "remember": true
}
```

**请求参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 用户名、手机号或邮箱地址 |
| password | string | 是 | 密码，6-20个字符 |
| remember | boolean | 否 | 是否记住登录状态，默认为false |

**验证规则**:
- username: 3-20个字符，支持中文、字母、数字、下划线
- password: 6-20个字符，必须包含字母和数字

**响应示例**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 7200,
    "user": {
      "userId": 1001,
      "username": "张三",
      "phone": "13800138000",
      "email": "zhangsan@example.com",
      "avatar": "https://example.com/avatar.jpg",
      "userType": "customer",
      "permissions": ["read", "write"]
    }
  },
  "timestamp": "2025-01-01T00:00:00Z"
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| accessToken | string | 访问令牌 |
| refreshToken | string | 刷新令牌 |
| tokenType | string | 令牌类型 |
| expiresIn | number | 令牌有效期（秒） |
| user | object | 用户信息 |
| user.userId | number | 用户ID |
| user.username | string | 用户名 |
| user.phone | string | 手机号 |
| user.email | string | 邮箱 |
| user.avatar | string | 头像URL |
| user.userType | string | 用户类型 |
| user.permissions | array | 用户权限列表 |

---

#### 手机验证码登录

**接口路径**: `POST /auth/login/phone`

**接口描述**: 用户通过手机号和验证码登录

**请求参数**:
```json
{
  "phone": "13800138000",
  "verificationCode": "123456"
}
```

**请求参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| phone | string | 是 | 手机号码，11位数字 |
| verificationCode | string | 是 | 手机验证码，6位数字 |

**验证规则**:
- phone: 必须符合中国大陆手机号格式（1开头，第二位3-9）
- verificationCode: 6位数字，有效期5分钟

**响应示例**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 7200,
    "user": {
      "userId": 1001,
      "username": "张三",
      "phone": "13800138000",
      "email": "zhangsan@example.com",
      "avatar": "https://example.com/avatar.jpg",
      "userType": "customer",
      "permissions": ["read", "write"]
    }
  },
  "timestamp": "2025-01-01T00:00:00Z"
}
```

---

#### 邮箱验证码登录

**接口路径**: `POST /auth/login/email`

**接口描述**: 用户通过邮箱地址和验证码登录

**请求参数**:
```json
{
  "email": "user@example.com",
  "emailVerificationCode": "123456"
}
```

**请求参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| email | string | 是 | 邮箱地址，需符合标准邮箱格式 |
| emailVerificationCode | string | 是 | 邮箱验证码，6位数字 |

**验证规则**:
- email: 符合标准邮箱格式
- emailVerificationCode: 6位数字，有效期5分钟

**响应示例**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 7200,
    "user": {
      "userId": 1001,
      "username": "张三",
      "phone": "13800138000",
      "email": "user@example.com",
      "avatar": "https://example.com/avatar.jpg",
      "userType": "customer",
      "permissions": ["read", "write"]
    }
  },
  "timestamp": "2025-01-01T00:00:00Z"
}
```

---

#### 发送登录验证码（手机）

**接口路径**: `POST /auth/login/send-phone-code`

**接口描述**: 向用户手机号发送登录验证码

**请求参数**:
```json
{
  "phone": "13800138000"
}
```

**请求参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| phone | string | 是 | 手机号码，11位数字 |

**验证规则**:
- phone: 必须符合中国大陆手机号格式
- 该手机号必须是已注册用户
- 频率限制：每分钟最多发送1次，每天最多发送5次

**响应示例**:
```json
{
  "code": 200,
  "message": "验证码发送成功",
  "data": {
    "codeId": "login_phone_code_abc123",
    "expireTime": 300,
    "remainingAttempts": 4
  },
  "timestamp": "2025-01-01T00:00:00Z"
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| codeId | string | 验证码ID，用于防重放攻击 |
| expireTime | number | 验证码有效期（秒） |
| remainingAttempts | number | 今日剩余发送次数 |

---

#### 发送登录验证码（邮箱）

**接口路径**: `POST /auth/login/send-email-code`

**接口描述**: 向用户邮箱发送登录验证码

**请求参数**:
```json
{
  "email": "user@example.com"
}
```

**请求参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| email | string | 是 | 邮箱地址，需符合标准邮箱格式 |

**验证规则**:
- email: 符合标准邮箱格式
- 该邮箱必须是已注册用户
- 频率限制：每分钟最多发送1次，每天最多发送5次

**响应示例**:
```json
{
  "code": 200,
  "message": "验证码发送成功",
  "data": {
    "codeId": "login_email_code_def456",
    "expireTime": 300,
    "remainingAttempts": 4
  },
  "timestamp": "2025-01-01T00:00:00Z"
}
```

---

#### 第三方登录

**接口路径**: `POST /auth/oauth/{platform}`

**接口描述**: 通过第三方平台登录

**路径参数**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| platform | string | 第三方平台：wechat、qq、alipay、weibo |

**请求参数**:
```json
{
  "code": "auth_code_from_platform",
  "state": "random_state_string"
}
```

**请求参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| code | string | 是 | 第三方平台授权码 |
| state | string | 是 | 状态参数，防止CSRF攻击 |

**响应示例**:
```json
{
  "code": 200,
  "message": "第三方登录成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 7200,
    "user": {
      "userId": 1001,
      "username": "张三",
      "phone": "13800138000",
      "email": "zhangsan@example.com",
      "avatar": "https://example.com/avatar.jpg",
      "userType": "customer",
      "oauthProvider": "wechat",
      "oauthId": "oauth_user_id_123"
    }
  },
  "timestamp": "2025-01-01T00:00:00Z"
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| oauthProvider | string | 第三方平台名称 |
| oauthId | string | 第三方平台用户ID |

---

### 3. 密码重置

#### 发送重置验证码

**接口路径**: `POST /auth/reset-password/send-code`

**接口描述**: 向用户手机号发送密码重置验证码

**请求参数**:
```json
{
  "phone": "13800138000"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "重置验证码发送成功",
  "data": {
    "codeId": "reset_code_abc123",
    "expireTime": 300
  },
  "timestamp": "2025-01-01T00:00:00Z"
}
```

---

#### 重置密码

**接口路径**: `POST /auth/reset-password`

**接口描述**: 通过验证码重置用户密码

**请求参数**:
```json
{
  "phone": "13800138000",
  "verificationCode": "123456",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**请求参数说明**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| phone | string | 是 | 手机号码 |
| verificationCode | string | 是 | 验证码 |
| newPassword | string | 是 | 新密码 |
| confirmPassword | string | 是 | 确认新密码 |

**响应示例**:
```json
{
  "code": 200,
  "message": "密码重置成功",
  "data": null,
  "timestamp": "2025-01-01T00:00:00Z"
}
```

---

### 4. 令牌管理

#### 刷新访问令牌

**接口路径**: `POST /auth/refresh`

**接口描述**: 使用刷新令牌获取新的访问令牌

**请求头**:
```
Authorization: Bearer <refresh_token>
```

**响应示例**:
```json
{
  "code": 200,
  "message": "令牌刷新成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 7200
  },
  "timestamp": "2025-01-01T00:00:00Z"
}
```

---

#### 退出登录

**接口路径**: `POST /auth/logout`

**接口描述**: 用户退出登录，使当前令牌失效

**请求头**:
```
Authorization: Bearer <access_token>
```

**响应示例**:
```json
{
  "code": 200,
  "message": "退出登录成功",
  "data": null,
  "timestamp": "2025-01-01T00:00:00Z"
}
```

---

### 5. 用户信息

#### 获取当前用户信息

**接口路径**: `GET /auth/me`

**接口描述**: 获取当前登录用户的详细信息

**请求头**:
```
Authorization: Bearer <access_token>
```

**响应示例**:
```json
{
  "code": 200,
  "message": "获取用户信息成功",
  "data": {
    "userId": 1001,
    "username": "张三",
    "phone": "13800138000",
    "email": "zhangsan@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "userType": "customer",
    "status": "active",
    "permissions": ["read", "write"],
    "profile": {
      "nickname": "小明",
      "gender": "male",
      "birthday": "1990-01-01",
      "address": "北京市朝阳区"
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  },
  "timestamp": "2025-01-01T00:00:00Z"
}
```

**响应参数说明**:
| 参数名 | 类型 | 说明 |
|--------|------|------|
| profile | object | 用户详细资料 |
| profile.nickname | string | 昵称 |
| profile.gender | string | 性别：male-男，female-女，other-其他 |
| profile.birthday | string | 生日 |
| profile.address | string | 地址 |

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权/令牌无效 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 409 | 资源冲突（如用户已存在） |
| 422 | 数据验证失败 |
| 429 | 请求频率限制 |
| 500 | 服务器内部错误 |

## 常见错误示例

### 用户名已存在
```json
{
  "code": 409,
  "message": "用户名已存在",
  "error": "USERNAME_EXISTS",
  "timestamp": "2025-01-01T00:00:00Z"
}
```

### 验证码错误
```json
{
  "code": 422,
  "message": "验证码错误",
  "error": "INVALID_VERIFICATION_CODE",
  "timestamp": "2025-01-01T00:00:00Z"
}
```

### 密码错误
```json
{
  "code": 422,
  "message": "用户名或密码错误",
  "error": "INVALID_CREDENTIALS",
  "timestamp": "2025-01-01T00:00:00Z"
}
```

### 手机号未注册
```json
{
  "code": 404,
  "message": "该手机号未注册",
  "error": "PHONE_NOT_REGISTERED",
  "timestamp": "2025-01-01T00:00:00Z"
}
```

### 邮箱未注册
```json
{
  "code": 404,
  "message": "该邮箱未注册",
  "error": "EMAIL_NOT_REGISTERED",
  "timestamp": "2025-01-01T00:00:00Z"
}
```

### 验证码发送频率过高
```json
{
  "code": 429,
  "message": "验证码发送过于频繁，请稍后再试",
  "error": "RATE_LIMIT_EXCEEDED",
  "data": {
    "retryAfter": 60,
    "message": "请在60秒后再次尝试"
  },
  "timestamp": "2025-01-01T00:00:00Z"
}
```

### 用户协议未同意
```json
{
  "code": 422,
  "message": "请阅读并同意用户协议和隐私政策",
  "error": "AGREEMENT_NOT_ACCEPTED",
  "timestamp": "2025-01-01T00:00:00Z"
}
```

## 安全说明

1. **HTTPS**: 所有接口必须使用HTTPS协议
2. **密码加密**: 密码在传输过程中必须加密，后端使用bcrypt进行哈希处理
3. **令牌管理**:
   - 访问令牌（Access Token）有效期建议为2小时
   - 刷新令牌（Refresh Token）有效期建议为7天
   - 令牌使用RS256算法签名
4. **验证码安全**:
   - 验证码长度为6位数字
   - 有效期为5分钟（300秒）
   - 每分钟最多发送1次，防止轰炸攻击
   - 验证码在服务端以哈希形式存储
5. **频率限制**:
   - 登录接口：每IP每分钟最多5次尝试
   - 注册验证码：每IP每小时最多发送3次
   - 登录验证码：每IP每天最多发送5次
   - 密码重置：每IP每天最多3次
6. **数据验证**:
   - 所有输入参数必须进行严格的格式验证
   - 防止SQL注入和XSS攻击
   - 使用参数化查询
7. **跨域处理**: 严格配置CORS策略，仅允许指定域名访问

## 接口测试建议

### 测试用例
1. **注册功能测试**:
   - 正常注册流程测试
   - 用户名/手机号/邮箱重复测试
   - 验证码错误/过期测试
   - 密码格式不符合要求测试
   - 用户协议未同意测试

2. **登录功能测试**:
   - 密码登录测试（用户名/手机号/邮箱）
   - 手机验证码登录测试
   - 邮箱验证码登录测试
   - 密码错误测试
   - 账户未注册测试
   - 验证码错误/过期测试

3. **安全测试**:
   - 频率限制测试
   - 恶意参数输入测试
   - SQL注入测试
   - XSS攻击测试

## 更新日志

| 版本 | 日期 | 更新内容 | 更新人 |
|------|------|----------|--------|
| 1.0.0 | 2025-01-01 | 初始版本，包含基础认证功能 | 开发团队 |
| 1.1.0 | 2025-10-30 | 新增手机验证码登录和邮箱验证码登录接口 | 开发团队 |
| 1.1.0 | 2025-10-30 | 完善注册接口验证规则和错误处理 | 开发团队 |
| 1.1.0 | 2025-10-30 | 增加发送验证码接口的频率限制和安全措施 | 开发团队 |
| 1.1.0 | 2025-10-30 | 优化接口路径设计，符合RESTful规范 | 开发团队 |