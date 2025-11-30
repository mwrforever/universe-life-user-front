# 授权服务 (Auth Service) API 文档

## 概述

授权服务提供用户认证、授权、JWT令牌管理等核心功能。服务基于 Spring Boot 3.2.12 构建，包含完整的安全防护机制。

**基础信息:**
- 服务名称: universe-life-auth
- 版本: 1.0.0
- 基础路径: `/api/auth`
- 认证方式: JWT Bearer Token

---

## 通用响应格式

所有API接口都使用统一的响应格式：

```json
{
  "code": 0,
  "message": "success",
  "data": {},
  "timestamp": 1731887654321
}
```

**响应状态码说明:**
- `0`: 成功
- `1`: 业务错误
- `其他`: 具体业务错误码

---

## 用户权限管理接口 (/auth/user)

### 1. 用户注册

**接口地址:** `POST /api/auth/user/register`

**接口描述:** 新用户注册，包含验证码校验和速率限制保护

**请求参数:**
```json
{
  "username": "string",
  "password": "string",
  "identification": "string",
  "identificationType": 6,
  "issuer": "string"
}
```

**参数说明:**

| 参数名 | 类型 | 必填 | 描述 | 约束 |
|--------|------|------|------|------|
| username | String | 否 | 用户名 | 4-16位字母数字下划线中划线 |
| password | String | 否 | 密码 | 6-20位字符 |
| identification | String | 是 | 用户标识 | 邮箱或手机号 |
| identificationType | Integer | 是 | 认证方式 | 6(邮箱) 或 5(手机号)，详见枚举值说明 |
| issuer | String | 是 | 验证码请求唯一标识 | 验证码发送时返回的标识 |

**响应示例:**
```json
{
  "code": 0,
  "message": "success",
  "data": null,
  "timestamp": 1731887654321
}
```

**可能的状态码:**
- `200`: 注册成功
- `400`: 请求参数错误
- `429`: 请求过于频繁
- `500`: 服务器内部错误

---

### 2. 用户登录

**接口地址:** `POST /api/auth/user/login`

**接口描述:** 用户登录认证，包含速率限制和暴力破解防护

**请求参数:**
```json
{
  "identification": "string",
  "authType": 6,
  "password": "string"
}
```

**参数说明:**

| 参数名 | 类型 | 必填 | 描述 | 约束 |
|--------|------|------|------|------|
| identification | String | 是 | 用户标识 | 用户名/邮箱/手机号 |
| authType | Integer | 是 | 认证方式 | 6(邮箱) 或 5(手机号)，详见枚举值说明 |
| password | String | 是 | 密码 | 明文密码 |

**响应示例:**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "userId": "string",
    "username": "string",
    "accessToken": "string",
    "refreshToken": "string",
    "expiresIn": 7200 // 2小时
  },
  "timestamp": 1731887654321
}
```

**可能的状态码:**
- `200`: 登录成功
- `400`: 请求参数错误
- `401`: 认证失败
- `423`: 账户已被锁定
- `429`: 请求过于频繁
- `500`: 服务器内部错误

---

## 认证通用接口 (/auth/common)

### 3. 发送验证码

**接口地址:** `POST /api/auth/common/captcha/send`

**接口描述:** 为指定标识（邮箱/手机号）发送验证码，包含速率限制保护

**请求参数:**
```json
{
  "identification": "string",
  "identificationType": 6,
  "captchaUsageType": 2
}
```

**参数说明:**

| 参数名 | 类型 | 必填 | 描述 | 约束 |
|--------|------|------|------|------|
| identification | String | 是 | 验证实体 | 邮箱或手机号 |
| identificationType | Integer | 是 | 验证方式 | 6(邮箱) 或 5(手机号)，详见枚举值说明 |
| captchaUsageType | Integer | 是 | 验证用途 | 1-6的数字，详见枚举值说明 |

**响应示例:**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "issuer": "string",
    "expireTime": 300,
    "sendTime": 1731887654321
  },
  "timestamp": 1731887654321
}
```

**可能的状态码:**
- `200`: 验证码发送成功
- `400`: 请求参数错误
- `429`: 验证码发送过于频繁
- `500`: 服务器内部错误

---

## OAuth2 JWK 接口 (/oauth2-jwk)

### 4. 强制更新JWK密钥对

**接口地址:** `POST /api/oauth2-jwk/update`

**接口描述:** 管理员强制更新JWK密钥对，用于JWT令牌签名和验证

**请求参数:**
```json
"string"
```

**参数说明:**

| 参数名 | 类型 | 必填 | 描述 | 约束 |
|--------|------|------|------|------|
| (request body) | String | 是 | 管理员密码 | 系统管理员验证密码 |

**响应示例:**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "message": "JWK密钥对更新成功"
  },
  "timestamp": 1731887654321
}
```

---

## 枚举值说明

### UserAuthType (用户认证类型)
| 数值 | 枚举名 | 描述 |
|------|--------|------|
| 0 | WECHAT | 微信认证 |
| 1 | QQ | QQ认证 |
| 2 | ALIPAY | 支付宝认证 |
| 3 | WEIBO | 微博认证 |
| 4 | USERNAME | 用户名认证 |
| 5 | PHONE | 手机号认证 |
| 6 | EMAIL | 邮箱认证 |

### CaptchaUsageType (验证码用途类型)
| 数值 | 枚举名 | 显示名称 | 描述 |
|------|--------|----------|------|
| 1 | LOGIN | 登录 | 用于安全登录验证 |
| 2 | REGISTER | 注册 | 用于新用户注册验证 |
| 3 | RESET_PASSWORD | 修改密码 | 用于密码重置验证 |
| 4 | BIND_EMAIL | 绑定邮箱 | 用于邮箱绑定验证 |
| 5 | UNBIND_EMAIL | 解绑邮箱 | 用于邮箱解绑验证 |
| 6 | MODIFY_PAYMENT_PASSWORD | 修改支付密码 | 用于支付密码修改验证 |

---

## 安全机制

### 1. 速率限制
- 所有接口都实施了请求频率限制
- 防止暴力破解和恶意攻击

### 2. 账户锁定
- 多次登录失败将锁定账户
- 锁定状态返回423状态码

### 3. 验证码保护
- 验证码具有时效性
- 防止验证码泄露和重复使用

### 4. 输入验证
- 所有参数都进行严格验证
- 防止SQL注入和XSS攻击

---

## 错误码说明

| 错误码 | 描述 | 解决方案 |
|--------|------|----------|
| 400 | 请求参数错误 | 检查请求参数格式和必填项 |
| 401 | 认证失败 | 检查用户名密码是否正确 |
| 423 | 账户锁定 | 联系管理员解锁或等待解锁 |
| 429 | 请求过于频繁 | 降低请求频率，稍后重试 |
| 500 | 服务器内部错误 | 检查服务状态，联系技术支持 |

---

## 接口测试示例

### 使用curl测试

```bash
# 发送验证码
curl -X POST http://localhost:8102/api/auth/common/captcha/send \
  -H "Content-Type: application/json" \
  -d '{
    "identification": "user@example.com",
    "identificationType": 6,
    "captchaUsageType": 2
  }'

# 用户注册
curl -X POST http://localhost:8102/api/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "123456",
    "identification": "user@example.com",
    "identificationType": 6,
    "issuer": "issuer_from_captcha_response"
  }'

# 用户登录
curl -X POST http://localhost:8102/api/auth/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "identification": "user@example.com",
    "authType": 6,
    "password": "123456"
  }'
```

---

**文档版本:** v1.0.0
**最后更新:** 2025-11-17
**维护人员:** 开发团队