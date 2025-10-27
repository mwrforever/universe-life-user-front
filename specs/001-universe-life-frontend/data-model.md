# 万象生活用户端数据模型

**创建日期**: 2025-10-18
**版本**: 1.0
**基于**: [Feature Specification](spec.md)

## 数据模型概览

本文档定义了万象生活用户端前端应用的核心数据模型，包括用户、任务、交易、聊天、通知、支付和售后等主要业务实体。

## 核心实体定义

### 1. 用户实体 (User)

用户是平台的核心实体，包含完整的个人档案、认证信息、统计数据和支付配置。

```typescript
interface User {
  // 基础信息
  id: string;                    // 用户唯一标识
  username: string;              // 用户名
  phone: string;                 // 手机号
  email: string;                 // 邮箱

  // 个人信息
  avatar?: string;               // 头像URL
  nickname: string;              // 昵称
  gender: 'male' | 'female' | 'other'; // 性别
  age?: number;                  // 年龄
  address: Address;              // 地址信息
  bio?: string;                  // 个人简介

  // 认证信息
  isVerified: boolean;           // 是否实名认证
  verificationLevel: 'basic' | 'premium' | 'enterprise'; // 认证等级
  idCardVerified: boolean;       // 身份证认证状态

  // 平台统计数据
  stats: UserStats;              // 用户统计数据

  // 账户信息
  status: 'active' | 'suspended' | 'banned'; // 账户状态
  createdAt: Date;               // 注册时间
  updatedAt: Date;               // 最后更新时间
  lastLoginAt?: Date;            // 最后登录时间
}

interface Address {
  province: string;              // 省份
  city: string;                  // 城市
  district: string;              // 区县
  street?: string;               // 街道
  detail?: string;               // 详细地址
  postalCode?: string;           // 邮政编码
}

interface UserStats {
  // 任务统计
  totalTasksCompleted: number;   // 总完成任务数
  perfectTasksCompleted: number; // 完美完成任务数
  normalTasksCompleted: number;  // 正常完成任务数
  timeoutTasksCompleted: number; // 超时完成任务数
  unfinishedTasksCount: number;  // 未完成任务数
  totalTasksAccepted: number;    // 接单总数

  // 评价统计
  averageRating: number;         // 平均评分
  ratingCount: number;           // 评价数量
  fiveStarCount: number;         // 五星评价数
  fourStarCount: number;         // 四星评价数
  threeStarCount: number;        // 三星评价数

  // 收益统计
  totalEarnings: number;         // 总收益
  monthlyEarnings: number;       // 月收益
  pendingEarnings: number;       // 待结算收益

  // 平台指标
  completionRate: number;        // 完成率
  onTimeRate: number;            // 准时率
  responseRate: number;          // 响应率
}
```

### 2. 任务实体 (Task)

任务实体代表商家发布的工作需求，包含完整的任务信息、状态管理和附件。

```typescript
interface Task {
  // 基础信息
  id: string;                    // 任务唯一标识
  title: string;                 // 任务标题
  description: string;           // 任务描述
  category: TaskCategory;        // 任务分类
  tags: string[];                // 任务标签

  // 商家信息
  publisherId: string;           // 发布者ID
  publisher: User;               // 发布者信息

  // 任务设置
  budget: number;                // 任务预算/佣金
  deadline: Date;                // 截止时间
  duration?: number;             // 预计完成时长(小时)
  location?: Location;           // 任务地点

  // 任务状态
  status: TaskStatus;            // 任务状态
  priority: 'low' | 'medium' | 'high' | 'urgent'; // 优先级

  // 附件和媒体
  attachments: Attachment[];     // 任务附件
  images: string[];              // 任务图片

  // 接单信息
  maxAcceptors?: number;         // 最大接单人数
  currentAcceptors: UserTask[];  // 当前接单用户
  requiredSkills: string[];      // 所需技能

  // 时间信息
  createdAt: Date;               // 创建时间
  updatedAt: Date;               // 更新时间
  publishedAt?: Date;            // 发布时间
  completedAt?: Date;            // 完成时间
}

enum TaskStatus {
  DRAFT = 'draft',               // 草稿
  PUBLISHED = 'published',       // 已发布
  ACCEPTED = 'accepted',         // 已接单
  IN_PROGRESS = 'in_progress',   // 进行中
  SUBMITTED = 'submitted',       // 已提交
  REVIEWING = 'reviewing',       // 审核中
  COMPLETED = 'completed',       // 已完成
  CANCELLED = 'cancelled',       // 已取消
  EXPIRED = 'expired'            // 已过期
}

interface TaskCategory {
  id: string;
  name: string;
  icon: string;
  parentId?: string;
  level: number;
}

interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

interface UserTask {
  id: string;
  taskId: string;
  userId: string;
  status: UserTaskStatus;
  acceptedAt: Date;
  completedAt?: Date;
  submission?: TaskSubmission;
  rating?: TaskRating;
  notes?: string;
}

enum UserTaskStatus {
  PENDING = 'pending',           // 待处理
  ACCEPTED = 'accepted',         // 已接受
  WORKING = 'working',           // 进行中
  SUBMITTED = 'submitted',       // 已提交
  APPROVED = 'approved',         // 已通过
  REJECTED = 'rejected',         // 已拒绝
  CANCELLED = 'cancelled'        // 已取消
}

interface TaskSubmission {
  id: string;
  userTaskId: string;
  content: string;
  attachments: Attachment[];
  submittedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
  reviewedAt?: Date;
}

interface TaskRating {
  id: string;
  userTaskId: string;
  rating: number;                // 1-5星评分
  comment: string;
  ratedBy: string;               // 评价人ID
  ratedAt: Date;
}
```

### 3. 聊天消息实体 (Message)

聊天消息实体支持实时通信，包含多种消息类型和状态管理。

```typescript
interface Message {
  // 基础信息
  id: string;                    // 消息唯一标识
  conversationId: string;        // 会话ID
  senderId: string;              // 发送者ID
  receiverId: string;            // 接收者ID

  // 消息内容
  type: MessageType;             // 消息类型
  content: string;               // 文本内容
  mediaUrl?: string;             // 媒体文件URL
  fileName?: string;             // 文件名
  fileSize?: number;             // 文件大小

  // 消息状态
  status: MessageStatus;         // 消息状态
  readAt?: Date;                 // 已读时间

  // 时间信息
  timestamp: Date;               // 发送时间
  editedAt?: Date;               // 编辑时间
  deletedAt?: Date;              // 删除时间

  // 回复和引用
  replyToId?: string;            // 回复的消息ID
  replyTo?: Message;             // 回复的消息内容

  // 系统消息
  isSystemMessage: boolean;      // 是否系统消息
  systemType?: SystemMessageType; // 系统消息类型
}

enum MessageType {
  TEXT = 'text',                 // 文本消息
  IMAGE = 'image',               // 图片消息
  FILE = 'file',                 // 文件消息
  VOICE = 'voice',               // 语音消息
  VIDEO = 'video',               // 视频消息
  LOCATION = 'location',         // 位置消息
  CONTACT = 'contact',           // 联系人卡片
  SYSTEM = 'system'              // 系统消息
}

enum MessageStatus {
  SENDING = 'sending',           // 发送中
  SENT = 'sent',                 // 已发送
  DELIVERED = 'delivered',       // 已送达
  READ = 'read',                 // 已读
  FAILED = 'failed',             // 发送失败
  DELETED = 'deleted'            // 已删除
}

enum SystemMessageType {
  USER_JOINED = 'user_joined',   // 用户加入
  USER_LEFT = 'user_left',       // 用户离开
  TASK_CREATED = 'task_created', // 任务创建
  TASK_ACCEPTED = 'task_accepted', // 任务接单
  TASK_COMPLETED = 'task_completed', // 任务完成
  PAYMENT_SENT = 'payment_sent', // 付款发送
  PAYMENT_RECEIVED = 'payment_received' // 付款接收
}

interface Conversation {
  id: string;
  participants: string[];        // 参与者ID列表
  type: 'private' | 'group';     // 会话类型
  name?: string;                 // 会话名称(群聊)
  avatar?: string;               // 会话头像
  lastMessage?: Message;         // 最后一条消息
  unreadCount: number;           // 未读消息数
  pinned: boolean;               // 是否置顶
  muted: boolean;                // 是否静音
  archived: boolean;             // 是否归档
  createdAt: Date;
  updatedAt: Date;
}
```

### 4. 支付实体 (Payment)

支付实体处理平台的所有资金流转，包括任务佣金、平台费用等。

```typescript
interface Payment {
  // 基础信息
  id: string;                    // 支付唯一标识
  orderId: string;               // 关联订单ID
  type: PaymentType;             // 支付类型
  amount: number;                // 支付金额
  currency: string;              // 货币类型

  // 参与方信息
  payerId: string;               // 付款方ID
  payeeId: string;               // 收款方ID
  platformFee: number;           // 平台手续费

  // 支付方式
  method: PaymentMethod;         // 支付方式
  paymentAccount: PaymentAccount; // 支付账户

  // 状态信息
  status: PaymentStatus;         // 支付状态
  transactionId?: string;        // 第三方交易ID

  // 时间信息
  createdAt: Date;               // 创建时间
  paidAt?: Date;                 // 支付时间
  confirmedAt?: Date;            // 确认时间
  refundedAt?: Date;             // 退款时间

  // 备注和原因
  description?: string;          // 支付描述
  refundReason?: string;         // 退款原因
  metadata?: Record<string, any>; // 扩展数据
}

enum PaymentType {
  TASK_BOUNTY = 'task_bounty',   // 任务佣金
  PLATFORM_FEE = 'platform_fee', // 平台费用
  REFUND = 'refund',             // 退款
  DEPOSIT = 'deposit',           // 押金
  BONUS = 'bonus',               // 奖励
  PENALTY = 'penalty'            // 罚款
}

enum PaymentMethod {
  WECHAT_PAY = 'wechat_pay',     // 微信支付
  ALIPAY = 'alipay',             // 支付宝
  BANK_CARD = 'bank_card',       // 银行卡
  BALANCE = 'balance',           // 余额支付
  POINTS = 'points'              // 积分支付
}

enum PaymentStatus {
  PENDING = 'pending',           // 待支付
  PROCESSING = 'processing',     // 处理中
  COMPLETED = 'completed',       // 已完成
  FAILED = 'failed',             // 失败
  CANCELLED = 'cancelled',       // 已取消
  REFUNDED = 'refunded',         // 已退款
  PARTIAL_REFUND = 'partial_refund' // 部分退款
}

interface PaymentAccount {
  id: string;
  userId: string;
  type: PaymentMethod;
  accountInfo: AccountInfo;
  isDefault: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AccountInfo {
  // 微信支付
  openId?: string;
  // 支付宝
  alipayUserId?: string;
  // 银行卡
  bankName?: string;
  cardNumber?: string;
  cardHolder?: string;
  // 通用信息
  phone?: string;
  email?: string;
}
```

### 5. 通知实体 (Notification)

通知实体处理系统通知和用户自定义通知。

```typescript
interface Notification {
  // 基础信息
  id: string;                    // 通知唯一标识
  userId: string;                // 接收者ID
  type: NotificationType;        // 通知类型
  title: string;                 // 通知标题
  content: string;               // 通知内容

  // 关联信息
  relatedId?: string;            // 关联实体ID
  relatedType?: string;          // 关联实体类型

  // 状态信息
  read: boolean;                 // 是否已读
  readAt?: Date;                 // 已读时间

  // 通知设置
  priority: NotificationPriority; // 优先级
  channels: NotificationChannel[]; // 通知渠道

  // 时间信息
  scheduledAt?: Date;            // 计划发送时间
  sentAt?: Date;                 // 发送时间
  expiresAt?: Date;              // 过期时间
  createdAt: Date;               // 创建时间

  // 操作按钮
  actions?: NotificationAction[]; // 操作按钮
}

enum NotificationType {
  // 系统通知
  SYSTEM_ANNOUNCEMENT = 'system_announcement', // 系统公告
  MAINTENANCE_NOTICE = 'maintenance_notice',   // 维护通知
  POLICY_UPDATE = 'policy_update',             // 政策更新

  // 任务通知
  TASK_PUBLISHED = 'task_published',           // 任务发布
  TASK_ACCEPTED = 'task_accepted',             // 任务被接单
  TASK_COMPLETED = 'task_completed',           // 任务完成
  TASK_EXPIRED = 'task_expired',               // 任务过期
  DEADLINE_REMINDER = 'deadline_reminder',     // 截止提醒

  // 聊天通知
  NEW_MESSAGE = 'new_message',                 // 新消息
  MESSAGE_MENTION = 'message_mention',         // 被提及

  // 支付通知
  PAYMENT_RECEIVED = 'payment_received',       // 收到付款
  PAYMENT_SENT = 'payment_sent',               // 付款成功
  REFUND_PROCESSED = 'refund_processed',       // 退款处理

  // 账户通知
  LOGIN_ALERT = 'login_alert',                 // 登录提醒
  PROFILE_VERIFIED = 'profile_verified',       // 认证通过
  RATING_RECEIVED = 'rating_received',         // 收到评价
}

enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

enum NotificationChannel {
  IN_APP = 'in_app',             // 应用内通知
  EMAIL = 'email',               // 邮件通知
  SMS = 'sms',                   // 短信通知
  PUSH = 'push'                  // 推送通知
}

interface NotificationAction {
  id: string;
  label: string;
  url?: string;
  action?: string;
  style?: 'primary' | 'secondary' | 'danger';
}

interface NotificationSettings {
  userId: string;
  type: NotificationType;
  enabled: boolean;
  channels: NotificationChannel[];
  quietHours: {
    enabled: boolean;
    startTime: string;           // HH:mm
    endTime: string;             // HH:mm
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### 6. 售后申请实体 (AfterSaleRequest)

售后申请实体处理用户纠纷和售后保障。

```typescript
interface AfterSaleRequest {
  // 基础信息
  id: string;                    // 申请唯一标识
  type: AfterSaleType;           // 售后类型
  title: string;                 // 申请标题
  description: string;           // 问题描述

  // 关联信息
  taskId?: string;               // 关联任务ID
  paymentId?: string;            // 关联支付ID
  reporterId: string;            // 申请人ID
  respondentId?: string;         // 被申请人ID

  // 申请内容
  evidence: Evidence[];          // 证据材料
  expectedResolution: string;    // 期望解决方案
  amount?: number;               // 涉及金额

  // 处理信息
  status: AfterSaleStatus;       // 处理状态
  priority: 'low' | 'medium' | 'high' | 'urgent'; // 优先级
  assignedTo?: string;           // 处理人ID

  // 处理结果
  resolution?: string;           // 处理结果
  outcome?: AfterSaleOutcome;    // 处理结果类型
  compensation?: number;         // 赔偿金额

  // 时间信息
  createdAt: Date;               // 创建时间
  updatedAt: Date;               // 更新时间
  resolvedAt?: Date;             // 解决时间
  closedAt?: Date;               // 关闭时间

  // 沟通记录
  communications: Communication[]; // 沟通记录
}

enum AfterSaleType {
  TASK_DISPUTE = 'task_dispute',         // 任务纠纷
  PAYMENT_ISSUE = 'payment_issue',       // 支付问题
  SERVICE_COMPLAINT = 'service_complaint', // 服务投诉
  ACCOUNT_ISSUE = 'account_issue',       // 账户问题
  PLATFORM_ERROR = 'platform_error',     // 平台错误
  OTHER = 'other'                         // 其他问题
}

enum AfterSaleStatus {
  SUBMITTED = 'submitted',               // 已提交
  UNDER_REVIEW = 'under_review',         // 审核中
  INVESTIGATING = 'investigating',       // 调查中
  NEGOTIATING = 'negotiating',           // 协商中
  PENDING_RESPONSE = 'pending_response', // 等待回应
  RESOLVED = 'resolved',                 // 已解决
  REJECTED = 'rejected',                 // 已拒绝
  CLOSED = 'closed'                      // 已关闭
}

enum AfterSaleOutcome {
  REFUND_FULL = 'refund_full',           // 全额退款
  REFUND_PARTIAL = 'refund_partial',     // 部分退款
  COMPENSATION = 'compensation',         // 补偿
  APOLOGY = 'apology',                   // 道歉
  CORRECTION = 'correction',             // 纠正
  NO_ACTION = 'no_action'                // 无需处理
}

interface Evidence {
  id: string;
  type: 'image' | 'file' | 'video' | 'audio';
  url: string;
  filename: string;
  description?: string;
  uploadedAt: Date;
}

interface Communication {
  id: string;
  requestId: string;
  senderId: string;
  content: string;
  attachments: Evidence[];
  isInternal: boolean;          // 是否内部沟通
  createdAt: Date;
}
```

## 数据关系图

```
User (1) <---> (N) Task
User (1) <---> (N) UserTask
User (1) <---> (N) PaymentAccount
User (1) <---> (N) Notification

Task (1) <---> (N) UserTask
Task (1) <---> (1) Payment (佣金)
Task (1) <---> (N) Attachment

User (1) <---> (N) Conversation
Conversation (1) <---> (N) Message
Message (1) <---> (0..1) Message (回复)

AfterSaleRequest (1) <---> (N) Evidence
AfterSaleRequest (1) <---> (N) Communication

Payment (1) <---> (1) PaymentAccount
Payment (1) <---> (0..1) AfterSaleRequest
```

## 验证规则

### 用户验证
- 手机号：11位数字，格式验证
- 邮箱：标准邮箱格式验证
- 年龄：18-65岁范围
- 昵称：2-20个字符，禁止特殊字符

### 任务验证
- 标题：5-100字符
- 预算：最小1元，最大100万元
- 截止时间：至少1小时后
- 附件大小：单个文件最大50MB

### 支付验证
- 金额：大于0，小于100万元
- 银行卡：标准卡号格式验证
- 支付密码：6-20位字符

## 状态转换规则

### 任务状态转换
```
DRAFT → PUBLISHED → ACCEPTED → IN_PROGRESS → SUBMITTED → REVIEWING → COMPLETED
                     ↘ CANCELLED
                     ↘ EXPIRED
```

### 支付状态转换
```
PENDING → PROCESSING → COMPLETED
    ↘ FAILED
    ↘ CANCELLED
COMPLETED → REFUNDED / PARTIAL_REFUND
```

### 售后状态转换
```
SUBMITTED → UNDER_REVIEW → INVESTIGATING → NEGOTIATING → RESOLVED
    ↘ REJECTED
RESOLVED → CLOSED
```

## 性能考虑

### 索引策略
- 用户ID：所有查询的主要索引
- 任务状态+创建时间：任务列表查询优化
- 消息时间戳：聊天记录查询优化
- 支付状态+时间：财务报表查询优化

### 缓存策略
- 用户基本信息：TTL 1小时
- 任务列表：TTL 5分钟
- 聊天消息：实时更新，无缓存
- 通知列表：TTL 30分钟

### 数据分页
- 消息列表：每页20条，滚动加载
- 任务列表：每页10条，支持无限滚动
- 通知列表：每页50条，支持筛选和排序