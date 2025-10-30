# 认证系统 API 接口文档

## 概述

本文档描述了万象生活用户认证系统的RESTful API接口。认证系统提供用户注册、登录、密码管理、账户安全等核心功能。

**基础信息：**
- 基础URL: `http://localhost:8080/api`
- API版本: v1.0
- 数据格式: JSON
- 字符编码: UTF-8
- 认证方式: JWT Bearer Token

## 通用响应格式

所有API接口都遵循统一的响应格式：

```json
{
  "code": 0,                    // 业务状态码，0表示成功
  "message": "操作成功",         // 响应消息
  "data": {},                   // 响应数据
  "timestamp": 1699123456789,   // 时间戳
  "requestId": "req_123456"     // 请求ID（用于问题追踪）
}
```

### 状态码说明

| 状态码 | 说明 |
|--------|------|
| 0 | 成功 |
| 1001 | 参数错误 |
| 1002 | 用户不存在 |
| 1003 | 密码错误 |
| 1004 | 账户已被禁用 |
| 1005 | 验证码错误 |
| 1006 | 验证码已过期 |
| 1007 | 用户名已存在 |
| 1008 | 手机号已注册 |
| 1009 | 邮箱已注册 |
| 1010 | Token无效 |
| 1011 | Token已过期 |

---

## 1. 用户注册

### 1.1 发送注册验证码

**接口描述：** 向用户手机号或邮箱发送注册验证码

**请求信息：**
- **请求方式：** `POST`
- **请求地址：** `/api/auth/send-verification-code`
- **是否需要认证：** 否

**请求参数：**
```json
{
  "type": "register",           // 验证码类型，固定值：register
  "target": "13800138000"       // 手机号或邮箱地址
}
```

**参数说明：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| type | string | 是 | 验证码类型，register-注册，login-登录，reset_password-重置密码 |
| target | string | 是 | 手机号（11位）或邮箱地址 |

**响应示例：**
```json
{
  "code": 0,
  "message": "验证码发送成功",
  "data": null,
  "timestamp": 1699123456789,
  "requestId": "req_123456"
}
```

### 1.2 用户注册

**接口描述：** 创建新用户账户

**请求信息：**
- **请求方式：** `POST`
- **请求地址：** `/api/auth/register`
- **是否需要认证：** 否

**请求参数：**
```json
{
  "username": "testuser",           // 用户名
  "phone": "13800138000",           // 手机号
  "email": "test@example.com",      // 邮箱
  "password": "password123",        // 密码
  "confirmPassword": "password123", // 确认密码
  "verificationCode": "123456",     // 验证码
  "agreement": true                 // 用户协议
}
```

**参数说明：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 用户名，3-20位字母数字下划线 |
| phone | string | 是 | 手机号，11位数字 |
| email | string | 是 | 邮箱地址，需有效格式 |
| password | string | 是 | 密码，8-20位字母数字特殊字符 |
| confirmPassword | string | 是 | 确认密码，需与密码一致 |
| verificationCode | string | 是 | 手机或邮箱验证码，6位数字 |
| agreement | boolean | 是 | 是否同意用户协议 |

**响应示例：**
```json
{
  "code": 0,
  "message": "注册成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 12345,
      "username": "testuser",
      "phone": "13800138000",
      "email": "test@example.com",
      "nickname": "testuser",
      "avatar": null,
      "status": "active",
      "userType": "individual",
      "createdAt": "2023-11-04T12:00:00Z",
      "updatedAt": "2023-11-04T12:00:00Z"
    },
    "expiresIn": 3600,
    "tokenType": "Bearer"
  },
  "timestamp": 1699123456789,
  "requestId": "req_123456"
}
```

---

## 2. 用户登录

### 2.1 发送登录验证码

**接口描述：** 向用户手机号或邮箱发送登录验证码

**请求信息：**
- **请求方式：** `POST`
- **请求地址：** `/api/auth/send-verification-code`
- **是否需要认证：** 否

**请求参数：**
```json
{
  "type": "login",                 // 验证码类型，固定值：login
  "target": "13800138000"          // 手机号或邮箱地址
}
```

### 2.2 用户登录

**接口描述：** 用户使用用户名/手机号/邮箱和密码登录

**请求信息：**
- **请求方式：** `POST`
- **请求地址：** `/api/auth/login`
- **是否需要认证：** 否

**请求参数：**
```json
{
  "username": "testuser",          // 用户名/手机号/邮箱
  "password": "password123",       // 密码
  "captcha": "abc123",             // 图形验证码（可选）
  "remember": true                 // 记住登录状态（可选）
}
```

**参数说明：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 用户名、手机号或邮箱 |
| password | string | 是 | 用户密码 |
| captcha | string | 否 | 图形验证码，安全验证时需要 |
| remember | boolean | 否 | 是否记住登录状态，默认false |

**响应示例：**
```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 12345,
      "username": "testuser",
      "phone": "13800138000",
      "email": "test@example.com",
      "nickname": "测试用户",
      "avatar": "https://example.com/avatar.jpg",
      "status": "active",
      "userType": "individual",
      "createdAt": "2023-11-04T12:00:00Z",
      "updatedAt": "2023-11-04T12:00:00Z"
    },
    "expiresIn": 3600,
    "tokenType": "Bearer"
  },
  "timestamp": 1699123456789,
  "requestId": "req_123456"
}
```

### 2.3 刷新令牌

**接口描述：** 使用刷新令牌获取新的访问令牌

**请求信息：**
- **请求方式：** `POST`
- **请求地址：** `/api/auth/refresh`
- **是否需要认证：** 否

**请求参数：**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**参数说明：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| refreshToken | string | 是 | 刷新令牌 |

**响应示例：**
```json
{
  "code": 0,
  "message": "令牌刷新成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 12345,
      "username": "testuser",
      "phone": "13800138000",
      "email": "test@example.com",
      "nickname": "测试用户",
      "avatar": "https://example.com/avatar.jpg",
      "status": "active",
      "userType": "individual",
      "createdAt": "2023-11-04T12:00:00Z",
      "updatedAt": "2023-11-04T12:00:00Z"
    },
    "expiresIn": 3600,
    "tokenType": "Bearer"
  },
  "timestamp": 1699123456789,
  "requestId": "req_123456"
}
```

### 2.4 用户登出

**接口描述：** 用户退出登录，使当前令牌失效

**请求信息：**
- **请求方式：** `POST`
- **请求地址：** `/api/auth/logout`
- **是否需要认证：** 是

**请求头：**
```
Authorization: Bearer <access_token>
```

**请求参数：** 无

**响应示例：**
```json
{
  "code": 0,
  "message": "登出成功",
  "data": null,
  "timestamp": 1699123456789,
  "requestId": "req_123456"
}
```

---

## 3. 密码管理

### 3.1 忘记密码

**接口描述：** 用户忘记密码时，通过手机号或邮箱重置密码

**请求信息：**
- **请求方式：** `POST`
- **请求地址：** `/api/auth/forgot-password`
- **是否需要认证：** 否

**请求参数：**
```json
{
  "email": "test@example.com"     // 邮箱地址
}
```

**参数说明：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| email | string | 是 | 注册时使用的邮箱地址 |

**响应示例：**
```json
{
  "code": 0,
  "message": "密码重置邮件已发送",
  "data": null,
  "timestamp": 1699123456789,
  "requestId": "req_123456"
}
```

### 3.2 发送重置密码验证码

**接口描述：** 发送重置密码验证码到手机号或邮箱

**请求信息：**
- **请求方式：** `POST`
- **请求地址：** `/api/auth/send-verification-code`
- **是否需要认证：** 否

**请求参数：**
```json
{
  "type": "reset_password",       // 验证码类型
  "target": "13800138000"         // 手机号或邮箱
}
```

### 3.3 重置密码

**接口描述：** 使用验证码重置用户密码

**请求信息：**
- **请求方式：** `POST`
- **请求地址：** `/api/auth/reset-password`
- **是否需要认证：** 否

**请求参数：**
```json
{
  "token": "reset_token_12345",           // 重置令牌（邮件链接中的token）
  "newPassword": "newpassword123",        // 新密码
  "confirmPassword": "newpassword123"     // 确认新密码
}
```

**参数说明：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| token | string | 是 | 重置令牌，从邮件或短信中获取 |
| newPassword | string | 是 | 新密码，8-20位字母数字特殊字符 |
| confirmPassword | string | 是 | 确认新密码，需与新密码一致 |

**响应示例：**
```json
{
  "code": 0,
  "message": "密码重置成功",
  "data": null,
  "timestamp": 1699123456789,
  "requestId": "req_123456"
}
```

### 3.4 修改密码

**接口描述：** 已登录用户修改密码

**请求信息：**
- **请求方式：** `POST`
- **请求地址：** `/api/auth/change-password`
- **是否需要认证：** 是

**请求头：**
```
Authorization: Bearer <access_token>
```

**请求参数：**
```json
{
  "oldPassword": "oldpassword123",      // 旧密码
  "newPassword": "newpassword123",      // 新密码
  "confirmPassword": "newpassword123"   // 确认新密码
}
```

**参数说明：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| oldPassword | string | 是 | 当前密码 |
| newPassword | string | 是 | 新密码，8-20位字母数字特殊字符 |
| confirmPassword | string | 是 | 确认新密码，需与新密码一致 |

**响应示例：**
```json
{
  "code": 0,
  "message": "密码修改成功",
  "data": null,
  "timestamp": 1699123456789,
  "requestId": "req_123456"
}
```

---

## 4. 用户信息管理

### 4.1 获取用户信息

**接口描述：** 获取当前登录用户的详细信息

**请求信息：**
- **请求方式：** `GET`
- **请求地址：** `/api/auth/profile`
- **是否需要认证：** 是

**请求头：**
```
Authorization: Bearer <access_token>
```

**请求参数：** 无

**响应示例：**
```json
{
  "code": 0,
  "message": "获取用户信息成功",
  "data": {
    "id": 12345,
    "username": "testuser",
    "phone": "13800138000",
    "email": "test@example.com",
    "nickname": "测试用户",
    "avatar": "https://example.com/avatar.jpg",
    "status": "active",
    "userType": "individual",
    "createdAt": "2023-11-04T12:00:00Z",
    "updatedAt": "2023-11-04T12:00:00Z"
  },
  "timestamp": 1699123456789,
  "requestId": "req_123456"
}
```

### 4.2 更新用户信息

**接口描述：** 更新当前登录用户的基本信息

**请求信息：**
- **请求方式：** `PUT`
- **请求地址：** `/api/auth/profile`
- **是否需要认证：** 是

**请求头：**
```
Authorization: Bearer <access_token>
```

**请求参数：**
```json
{
  "nickname": "新昵称",              // 昵称（可选）
  "avatar": "https://example.com/new_avatar.jpg"  // 头像URL（可选）
}
```

**参数说明：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| nickname | string | 否 | 用户昵称，2-20个字符 |
| avatar | string | 否 | 头像URL，需为有效图片地址 |

**响应示例：**
```json
{
  "code": 0,
  "message": "用户信息更新成功",
  "data": {
    "id": 12345,
    "username": "testuser",
    "phone": "13800138000",
    "email": "test@example.com",
    "nickname": "新昵称",
    "avatar": "https://example.com/new_avatar.jpg",
    "status": "active",
    "userType": "individual",
    "createdAt": "2023-11-04T12:00:00Z",
    "updatedAt": "2023-11-04T12:30:00Z"
  },
  "timestamp": 1699123456789,
  "requestId": "req_123456"
}
```

---

## 5. 账户绑定

### 5.1 绑定手机号

**接口描述：** 为当前账户绑定手机号

**请求信息：**
- **请求方式：** `POST`
- **请求地址：** `/api/auth/bind-phone`
- **是否需要认证：** 是

**请求头：**
```
Authorization: Bearer <access_token>
```

**请求参数：**
```json
{
  "phone": "13900139000",                // 新手机号
  "verificationCode": "123456"           // 验证码
}
```

**参数说明：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| phone | string | 是 | 手机号，11位数字 |
| verificationCode | string | 是 | 手机验证码，6位数字 |

**响应示例：**
```json
{
  "code": 0,
  "message": "手机号绑定成功",
  "data": null,
  "timestamp": 1699123456789,
  "requestId": "req_123456"
}
```

### 5.2 绑定邮箱

**接口描述：** 为当前账户绑定邮箱地址

**请求信息：**
- **请求方式：** `POST`
- **请求地址：** `/api/auth/bind-email`
- **是否需要认证：** 是

**请求头：**
```
Authorization: Bearer <access_token>
```

**请求参数：**
```json
{
  "email": "new@example.com",           // 新邮箱地址
  "verificationCode": "123456"          // 邮箱验证码
}
```

**参数说明：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| email | string | 是 | 邮箱地址，需有效格式 |
| verificationCode | string | 是 | 邮箱验证码，6位数字 |

**响应示例：**
```json
{
  "code": 0,
  "message": "邮箱绑定成功",
  "data": null,
  "timestamp": 1699123456789,
  "requestId": "req_123456"
}
```

---

## 6. 第三方登录

### 6.1 第三方授权登录

**接口描述：** 使用第三方账号（微信、QQ、支付宝）登录

**请求信息：**
- **请求方式：** `POST`
- **请求地址：** `/api/auth/third-party-login`
- **是否需要认证：** 否

**请求参数：**
```json
{
  "provider": "wechat",              // 第三方平台
  "code": "auth_code_123456",        // 授权码
  "state": "optional_state"          // 状态参数（可选）
}
```

**参数说明：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| provider | string | 是 | 第三方平台：wechat、qq、alipay |
| code | string | 是 | 第三方授权码 |
| state | string | 否 | 状态参数，用于防止CSRF攻击 |

**响应示例：**
```json
{
  "code": 0,
  "message": "第三方登录成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 12345,
      "username": "wechat_user_123",
      "phone": "13800138000",
      "email": "test@example.com",
      "nickname": "微信用户",
      "avatar": "https://third-party-avatar.com",
      "status": "active",
      "userType": "individual",
      "createdAt": "2023-11-04T12:00:00Z",
      "updatedAt": "2023-11-04T12:00:00Z"
    },
    "expiresIn": 3600,
    "tokenType": "Bearer"
  },
  "timestamp": 1699123456789,
  "requestId": "req_123456"
}
```

---

## 7. 账户验证

### 7.1 检查用户名可用性

**接口描述：** 检查用户名是否已被注册

**请求信息：**
- **请求方式：** `GET`
- **请求地址：** `/api/auth/check-username`
- **是否需要认证：** 否

**请求参数：**
```
username=testuser
```

**参数说明：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 要检查的用户名 |

**响应示例：**
```json
{
  "code": 0,
  "message": "检查完成",
  "data": {
    "available": true              // true-可用，false-已被占用
  },
  "timestamp": 1699123456789,
  "requestId": "req_123456"
}
```

### 7.2 检查手机号注册状态

**接口描述：** 检查手机号是否已被注册

**请求信息：**
- **请求方式：** `GET`
- **请求地址：** `/api/auth/check-phone`
- **是否需要认证：** 否

**请求参数：**
```
phone=13800138000
```

**参数说明：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| phone | string | 是 | 要检查的手机号 |

**响应示例：**
```json
{
  "code": 0,
  "message": "检查完成",
  "data": {
    "registered": false            // true-已注册，false-未注册
  },
  "timestamp": 1699123456789,
  "requestId": "req_123456"
}
```

### 7.3 检查邮箱注册状态

**接口描述：** 检查邮箱是否已被注册

**请求信息：**
- **请求方式：** `GET`
- **请求地址：** `/api/auth/check-email`
- **是否需要认证：** 否

**请求参数：**
```
email=test@example.com
```

**参数说明：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| email | string | 是 | 要检查的邮箱地址 |

**响应示例：**
```json
{
  "code": 0,
  "message": "检查完成",
  "data": {
    "registered": true             // true-已注册，false-未注册
  },
  "timestamp": 1699123456789,
  "requestId": "req_123456"
}
```

### 7.4 验证验证码

**接口描述：** 验证手机或邮箱验证码是否正确

**请求信息：**
- **请求方式：** `POST`
- **请求地址：** `/api/auth/verify-code`
- **是否需要认证：** 否

**请求参数：**
```json
{
  "type": "register",               // 验证码类型
  "target": "13800138000",          // 手机号或邮箱
  "code": "123456"                  // 验证码
}
```

**参数说明：**
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| type | string | 是 | 验证码类型：register、login、reset_password |
| target | string | 是 | 手机号或邮箱地址 |
| code | string | 是 | 验证码，6位数字 |

**响应示例：**
```json
{
  "code": 0,
  "message": "验证码正确",
  "data": {
    "valid": true                  // true-验证正确，false-验证错误
  },
  "timestamp": 1699123456789,
  "requestId": "req_123456"
}
```

---

## 8. 错误处理

### 8.1 常见错误响应

**参数错误 (1001)：**
```json
{
  "code": 1001,
  "message": "参数错误：用户名格式不正确",
  "data": null,
  "timestamp": 1699123456789,
  "requestId": "req_123456"
}
```

**用户不存在 (1002)：**
```json
{
  "code": 1002,
  "message": "用户不存在或密码错误",
  "data": null,
  "timestamp": 1699123456789,
  "requestId": "req_123456"
}
```

**验证码错误 (1005)：**
```json
{
  "code": 1005,
  "message": "验证码错误，请重新输入",
  "data": null,
  "timestamp": 1699123456789,
  "requestId": "req_123456"
}
```

**Token已过期 (1011)：**
```json
{
  "code": 1011,
  "message": "登录已过期，请重新登录",
  "data": null,
  "timestamp": 1699123456789,
  "requestId": "req_123456"
}
```

### 8.2 HTTP状态码对应关系

| HTTP状态码 | 说明 | 业务状态码 |
|------------|------|------------|
| 200 | 请求成功 | 0 |
| 400 | 请求参数错误 | 1001 |
| 401 | 未授权/Token无效 | 1010 |
| 403 | 账户被禁用 | 1004 |
| 404 | 资源不存在 | 1002 |
| 429 | 请求过于频繁 | 1012 |
| 500 | 服务器内部错误 | -1 |

---

## 9. 安全说明

### 9.1 密码安全
- 密码长度：8-20位
- 必须包含字母和数字
- 建议包含特殊字符
- 密码传输使用HTTPS加密

### 9.2 Token安全
- Access Token有效期：1小时
- Refresh Token有效期：30天
- Token使用JWT格式
- 建议在Token过期前主动刷新

### 9.3 验证码安全
- 验证码长度：6位数字
- 有效期：5分钟
- 同一手机号/邮箱1分钟内只能发送1次
- 每日最多发送10次验证码

### 9.4 接口限流
- 登录接口：同一IP每分钟最多5次
- 注册接口：同一IP每小时最多3次
- 验证码发送：同一手机号每分钟最多1次

---

## 10. 测试用例

### 10.1 注册流程测试

1. **发送验证码**
   ```bash
   curl -X POST http://localhost:8080/api/auth/send-verification-code \
     -H "Content-Type: application/json" \
     -d '{"type":"register","target":"13800138000"}'
   ```

2. **检查用户名可用性**
   ```bash
   curl "http://localhost:8080/api/auth/check-username?username=newuser"
   ```

3. **执行注册**
   ```bash
   curl -X POST http://localhost:8080/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "username": "newuser",
       "phone": "13800138000",
       "email": "new@example.com",
       "password": "password123",
       "confirmPassword": "password123",
       "verificationCode": "123456",
       "agreement": true
     }'
   ```

### 10.2 登录流程测试

1. **用户登录**
   ```bash
   curl -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"newuser","password":"password123"}'
   ```

2. **获取用户信息**
   ```bash
   curl -X GET http://localhost:8080/api/auth/profile \
     -H "Authorization: Bearer <access_token>"
   ```

3. **用户登出**
   ```bash
   curl -X POST http://localhost:8080/api/auth/logout \
     -H "Authorization: Bearer <access_token>"
   ```

---

## 更新日志

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| v1.0.0 | 2023-11-04 | 初始版本，包含基础认证功能 |
| | | |

**文档维护：** 开发团队
**最后更新：** 2023-11-04
**版本：** v1.0.0