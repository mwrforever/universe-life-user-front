# 认证接口调用示例

本文档提供了认证系统各接口的curl调用示例，方便开发者快速测试和集成。

## 环境配置

```bash
# 基础URL
export API_BASE_URL="http://localhost:8080"

# 请求头
export JSON_HEADER="Content-Type: application/json"
export AUTH_HEADER="Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 1. 用户注册流程

### 1.1 检查用户名可用性

```bash
curl -X GET "$API_BASE_URL/api/auth/check-username?username=newuser123" \
  -H "$JSON_HEADER"
```

**响应示例：**
```json
{
  "code": 0,
  "message": "检查完成",
  "data": {
    "available": true
  },
  "timestamp": 1699123456789,
  "requestId": "req_123456"
}
```

### 1.2 发送注册验证码

```bash
curl -X POST "$API_BASE_URL/api/auth/send-verification-code" \
  -H "$JSON_HEADER" \
  -d '{
    "type": "register",
    "target": "13800138000"
  }'
```

### 1.3 执行用户注册

```bash
curl -X POST "$API_BASE_URL/api/auth/register" \
  -H "$JSON_HEADER" \
  -d '{
    "username": "newuser123",
    "phone": "13800138000",
    "email": "newuser@example.com",
    "password": "Password123!",
    "confirmPassword": "Password123!",
    "verificationCode": "123456",
    "agreement": true
  }'
```

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
      "username": "newuser123",
      "phone": "13800138000",
      "email": "newuser@example.com",
      "nickname": "newuser123",
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

## 2. 用户登录流程

### 2.1 发送登录验证码

```bash
curl -X POST "$API_BASE_URL/api/auth/send-verification-code" \
  -H "$JSON_HEADER" \
  -d '{
    "type": "login",
    "target": "13800138000"
  }'
```

### 2.2 用户名密码登录

```bash
curl -X POST "$API_BASE_URL/api/auth/login" \
  -H "$JSON_HEADER" \
  -d '{
    "username": "newuser123",
    "password": "Password123!",
    "remember": true
  }'
```

### 2.3 保存Token到环境变量

```bash
# 假设登录成功后，从响应中提取token
export ACCESS_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
export REFRESH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 更新认证头
export AUTH_HEADER="Authorization: Bearer $ACCESS_TOKEN"
```

## 3. 用户信息管理

### 3.1 获取当前用户信息

```bash
curl -X GET "$API_BASE_URL/api/auth/profile" \
  -H "$JSON_HEADER" \
  -H "$AUTH_HEADER"
```

### 3.2 更新用户信息

```bash
curl -X PUT "$API_BASE_URL/api/auth/profile" \
  -H "$JSON_HEADER" \
  -H "$AUTH_HEADER" \
  -d '{
    "nickname": "新昵称",
    "avatar": "https://example.com/avatar.jpg"
  }'
```

## 4. 密码管理

### 4.1 忘记密码

```bash
curl -X POST "$API_BASE_URL/api/auth/forgot-password" \
  -H "$JSON_HEADER" \
  -d '{
    "email": "newuser@example.com"
  }'
```

### 4.2 发送重置密码验证码

```bash
curl -X POST "$API_BASE_URL/api/auth/send-verification-code" \
  -H "$JSON_HEADER" \
  -d '{
    "type": "reset_password",
    "target": "13800138000"
  }'
```

### 4.3 重置密码

```bash
curl -X POST "$API_BASE_URL/api/auth/reset-password" \
  -H "$JSON_HEADER" \
  -d '{
    "token": "reset_token_from_email",
    "newPassword": "NewPassword123!",
    "confirmPassword": "NewPassword123!"
  }'
```

### 4.4 修改密码（已登录用户）

```bash
curl -X POST "$API_BASE_URL/api/auth/change-password" \
  -H "$JSON_HEADER" \
  -H "$AUTH_HEADER" \
  -d '{
    "oldPassword": "Password123!",
    "newPassword": "NewPassword123!",
    "confirmPassword": "NewPassword123!"
  }'
```

## 5. Token管理

### 5.1 刷新Token

```bash
curl -X POST "$API_BASE_URL/api/auth/refresh" \
  -H "$JSON_HEADER" \
  -d "{
    \"refreshToken\": \"$REFRESH_TOKEN\"
  }"
```

### 5.2 用户登出

```bash
curl -X POST "$API_BASE_URL/api/auth/logout" \
  -H "$JSON_HEADER" \
  -H "$AUTH_HEADER"
```

## 6. 账户绑定

### 6.1 绑定新手机号

```bash
# 先发送验证码
curl -X POST "$API_BASE_URL/api/auth/send-verification-code" \
  -H "$JSON_HEADER" \
  -d '{
    "type": "register",
    "target": "13900139000"
  }'

# 然后绑定手机号
curl -X POST "$API_BASE_URL/api/auth/bind-phone" \
  -H "$JSON_HEADER" \
  -H "$AUTH_HEADER" \
  -d '{
    "phone": "13900139000",
    "verificationCode": "123456"
  }'
```

### 6.2 绑定新邮箱

```bash
# 先发送验证码
curl -X POST "$API_BASE_URL/api/auth/send-verification-code" \
  -H "$JSON_HEADER" \
  -d '{
    "type": "register",
    "target": "newemail@example.com"
  }'

# 然后绑定邮箱
curl -X POST "$API_BASE_URL/api/auth/bind-email" \
  -H "$JSON_HEADER" \
  -H "$AUTH_HEADER" \
  -d '{
    "email": "newemail@example.com",
    "verificationCode": "123456"
  }'
```

## 7. 第三方登录

### 7.1 微信登录

```bash
curl -X POST "$API_BASE_URL/api/auth/third-party-login" \
  -H "$JSON_HEADER" \
  -d '{
    "provider": "wechat",
    "code": "wx_auth_code_123456",
    "state": "optional_state_value"
  }'
```

### 7.2 QQ登录

```bash
curl -X POST "$API_BASE_URL/api/auth/third-party-login" \
  -H "$JSON_HEADER" \
  -d '{
    "provider": "qq",
    "code": "qq_auth_code_123456",
    "state": "optional_state_value"
  }'
```

## 8. 账户验证

### 8.1 批量检查可用性

```bash
# 检查用户名
curl -X GET "$API_BASE_URL/api/auth/check-username?username=testuser" \
  -H "$JSON_HEADER"

# 检查手机号
curl -X GET "$API_BASE_URL/api/auth/check-phone?phone=13800138000" \
  -H "$JSON_HEADER"

# 检查邮箱
curl -X GET "$API_BASE_URL/api/auth/check-email?email=test@example.com" \
  -H "$JSON_HEADER"
```

### 8.2 验证验证码

```bash
curl -X POST "$API_BASE_URL/api/auth/verify-code" \
  -H "$JSON_HEADER" \
  -d '{
    "type": "register",
    "target": "13800138000",
    "code": "123456"
  }'
```

## 9. 错误处理示例

### 9.1 参数错误

```bash
curl -X POST "$API_BASE_URL/api/auth/login" \
  -H "$JSON_HEADER" \
  -d '{
    "username": "",
    "password": "123"
  }'
```

**错误响应：**
```json
{
  "code": 1001,
  "message": "参数错误：用户名不能为空",
  "data": null,
  "timestamp": 1699123456789,
  "requestId": "req_123456"
}
```

### 9.2 Token过期

```bash
# 使用过期的token
export EXPIRED_TOKEN="expired_token_here"
curl -X GET "$API_BASE_URL/api/auth/profile" \
  -H "$JSON_HEADER" \
  -H "Authorization: Bearer $EXPIRED_TOKEN"
```

**错误响应：**
```json
{
  "code": 1011,
  "message": "登录已过期，请重新登录",
  "data": null,
  "timestamp": 1699123456789,
  "requestId": "req_123456"
}
```

## 10. 完整注册登录脚本示例

```bash
#!/bin/bash

# 配置
API_BASE_URL="http://localhost:8080"
JSON_HEADER="Content-Type: application/json"

# 用户信息
USERNAME="testuser$(date +%s)"
PHONE="13800138000"
EMAIL="test$(date +%s)@example.com"
PASSWORD="TestPassword123!"

echo "=== 万象生活用户注册登录测试 ==="
echo "用户名: $USERNAME"
echo "手机号: $PHONE"
echo "邮箱: $EMAIL"
echo ""

# 1. 检查用户名可用性
echo "1. 检查用户名可用性..."
response=$(curl -s -X GET "$API_BASE_URL/api/auth/check-username?username=$USERNAME" \
  -H "$JSON_HEADER")
echo "响应: $response"
echo ""

# 2. 发送注册验证码
echo "2. 发送注册验证码..."
response=$(curl -s -X POST "$API_BASE_URL/api/auth/send-verification-code" \
  -H "$JSON_HEADER" \
  -d "{\"type\":\"register\",\"target\":\"$PHONE\"}")
echo "响应: $response"
echo ""

# 3. 执行注册（假设验证码为123456）
echo "3. 执行用户注册..."
response=$(curl -s -X POST "$API_BASE_URL/api/auth/register" \
  -H "$JSON_HEADER" \
  -d "{
    \"username\": \"$USERNAME\",
    \"phone\": \"$PHONE\",
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"confirmPassword\": \"$PASSWORD\",
    \"verificationCode\": \"123456\",
    \"agreement\": true
  }")
echo "响应: $response"
echo ""

# 4. 提取token
ACCESS_TOKEN=$(echo $response | jq -r '.data.accessToken')
REFRESH_TOKEN=$(echo $response | jq -r '.data.refreshToken')

if [ "$ACCESS_TOKEN" != "null" ]; then
    echo "4. 注册成功！获取到Token"
    echo "Access Token: ${ACCESS_TOKEN:0:50}..."
    echo ""

    # 5. 获取用户信息
    echo "5. 获取用户信息..."
    response=$(curl -s -X GET "$API_BASE_URL/api/auth/profile" \
      -H "$JSON_HEADER" \
      -H "Authorization: Bearer $ACCESS_TOKEN")
    echo "响应: $response"
    echo ""

    # 6. 登出
    echo "6. 用户登出..."
    response=$(curl -s -X POST "$API_BASE_URL/api/auth/logout" \
      -H "$JSON_HEADER" \
      -H "Authorization: Bearer $ACCESS_TOKEN")
    echo "响应: $response"
    echo ""

    echo "=== 测试完成 ==="
else
    echo "4. 注册失败！"
    echo "响应: $response"
fi
```

**使用说明：**
1. 将上述脚本保存为 `test-auth.sh`
2. 添加执行权限：`chmod +x test-auth.sh`
3. 运行测试：`./test-auth.sh`

## 注意事项

1. **HTTPS环境：** 生产环境请使用HTTPS URL
2. **Token管理：** 妥善保存Access Token和Refresh Token
3. **验证码：** 测试环境中验证码可能固定为`123456`
4. **频率限制：** 注意接口调用频率限制
5. **错误处理：** 在实际应用中请添加适当的错误处理逻辑

---

**更新时间：** 2023-11-04
**维护人员：** 万象生活开发团队