/**
 * 万象生活API接口规范定义
 * 严格按照RESTful API设计规范，便于后端对接
 */

// ========== 基础类型定义 ==========

/**
 * API响应标准格式
 * 所有API接口都必须遵循此格式
 */
export interface ApiResponse<T = any> {
  /** 业务状态码 */
  code: number;
  /** 响应消息 */
  message: string;
  /** 响应数据 */
  data: T;
  /** 时间戳 */
  timestamp: number;
  /** 请求ID（用于问题追踪） */
  requestId?: string;
}

/**
 * 分页请求参数
 */
export interface PaginationParams {
  /** 页码，从1开始 */
  page: number;
  /** 每页数量，默认10，最大100 */
  size: number;
  /** 排序字段 */
  sort?: string;
  /** 排序方向：asc|desc */
  order?: 'asc' | 'desc';
}

/**
 * 分页响应数据
 */
export interface PaginatedResponse<T> {
  /** 数据列表 */
  items: T[];
  /** 分页信息 */
  pagination: {
    /** 当前页码 */
    current: number;
    /** 每页数量 */
    size: number;
    /** 总记录数 */
    total: number;
    /** 总页数 */
    pages: number;
    /** 是否有下一页 */
    hasNext: boolean;
    /** 是否有上一页 */
    hasPrev: boolean;
  };
}

// ========== 用户认证相关类型 ==========

/**
 * 登录请求参数
 */
export interface LoginRequest {
  /** 用户名（手机号或邮箱） */
  username: string;
  /** 密码 */
  password: string;
  /** 验证码 */
  captcha?: string;
  /** 记住我 */
  remember?: boolean;
}

/**
 * 注册请求参数
 */
export interface RegisterRequest {
  /** 用户名 */
  username: string;
  /** 手机号 */
  phone: string;
  /** 邮箱 */
  email: string;
  /** 密码 */
  password: string;
  /** 确认密码 */
  confirmPassword: string;
  /** 验证码 */
  verificationCode: string;
  /** 用户协议 */
  agreement: boolean;
}

/**
 * 认证响应数据
 */
export interface AuthResponse {
  /** JWT访问令牌 */
  accessToken: string;
  /** 刷新令牌 */
  refreshToken: string;
  /** 用户信息 */
  user: UserInfo;
  /** 令牌过期时间（秒） */
  expiresIn: number;
  /** 令牌类型 */
  tokenType: 'Bearer';
}

/**
 * 用户信息
 */
export interface UserInfo {
  /** 用户ID */
  id: number;
  /** 用户名 */
  username: string;
  /** 手机号 */
  phone: string;
  /** 邮箱 */
  email: string;
  /** 昵称 */
  nickname: string;
  /** 头像URL */
  avatar?: string;
  /** 用户状态 */
  status: 'active' | 'inactive' | 'banned';
  /** 用户类型 */
  userType: 'customer' | 'provider' | 'admin';
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

// ========== 服务相关类型 ==========

/**
 * 服务分类
 */
export interface ServiceCategory {
  /** 分类ID */
  id: number;
  /** 分类名称 */
  name: string;
  /** 分类图标 */
  icon: string;
  /** 分类描述 */
  description: string;
  /** 排序权重 */
  sort: number;
  /** 是否启用 */
  enabled: boolean;
}

/**
 * 服务信息
 */
export interface ServiceInfo {
  /** 服务ID */
  id: number;
  /** 服务标题 */
  title: string;
  /** 服务描述 */
  description: string;
  /** 服务分类ID */
  categoryId: number;
  /** 服务分类 */
  category: ServiceCategory;
  /** 服务价格 */
  price: {
    /** 起步价 */
    basePrice: number;
    /** 计价单位 */
    unit: string;
    /** 价格说明 */
    description: string;
  };
  /** 服务图片 */
  images: string[];
  /** 服务提供者ID */
  providerId: number;
  /** 服务提供者 */
  provider: {
    id: number;
    username: string;
    nickname: string;
    avatar?: string;
    rating: number;
    orderCount: number;
  };
  /** 服务标签 */
  tags: string[];
  /** 服务状态 */
  status: 'active' | 'inactive' | 'deleted';
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

// ========== 任务相关类型 ==========

/**
 * 任务状态
 */
export type TaskStatus =
  | 'pending' // 待接单
  | 'accepted' // 已接单
  | 'processing' // 进行中
  | 'completed' // 已完成
  | 'cancelled' // 已取消
  | 'disputed'; // 争议中

/**
 * 任务优先级
 */
export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';

/**
 * 发布任务请求
 */
export interface CreateTaskRequest {
  /** 任务标题 */
  title: string;
  /** 任务描述 */
  description: string;
  /** 服务分类ID */
  categoryId: number;
  /** 预算金额 */
  budget: number;
  /** 任务地址 */
  address: {
    /** 详细地址 */
    detail: string;
    /** 经度 */
    longitude?: number;
    /** 纬度 */
    latitude?: number;
    /** 城市 */
    city: string;
    /** 区域 */
    district: string;
  };
  /** 预约时间 */
  appointmentTime?: string;
  /** 任务优先级 */
  priority: TaskPriority;
  /** 任务图片 */
  images?: string[];
  /** 联系方式 */
  contactInfo: {
    /** 联系人 */
    name: string;
    /** 联系电话 */
    phone: string;
    /** 备注电话 */
    backupPhone?: string;
  };
  /** 特殊要求 */
  requirements?: string;
}

/**
 * 任务信息
 */
export interface TaskInfo {
  /** 任务ID */
  id: number;
  /** 任务标题 */
  title: string;
  /** 任务描述 */
  description: string;
  /** 服务分类 */
  category: ServiceCategory;
  /** 预算金额 */
  budget: number;
  /** 任务状态 */
  status: TaskStatus;
  /** 任务优先级 */
  priority: TaskPriority;
  /** 任务地址 */
  address: {
    detail: string;
    longitude?: number;
    latitude?: number;
    city: string;
    district: string;
  };
  /** 预约时间 */
  appointmentTime?: string;
  /** 任务图片 */
  images: string[];
  /** 发布者信息 */
  publisher: {
    id: number;
    username: string;
    nickname: string;
    avatar?: string;
  };
  /** 接单者信息 */
  assignee?: {
    id: number;
    username: string;
    nickname: string;
    avatar?: string;
    rating: number;
  };
  /** 接单时间 */
  acceptedAt?: string;
  /** 完成时间 */
  completedAt?: string;
  /** 特殊要求 */
  requirements?: string;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

// ========== 接单相关类型 ==========

/**
 * 接单请求
 */
export interface AcceptTaskRequest {
  /** 任务ID */
  taskId: number;
  /** 报价金额 */
  quotedPrice: number;
  /** 预计完成时间 */
  estimatedDuration: number;
  /** 接单说明 */
  message?: string;
}

/**
 * 接单信息
 */
export interface TaskOrder {
  /** 订单ID */
  id: number;
  /** 任务ID */
  taskId: number;
  /** 任务信息 */
  task: TaskInfo;
  /** 接单者ID */
  providerId: number;
  /** 接单者信息 */
  provider: UserInfo;
  /** 报价金额 */
  quotedPrice: number;
  /** 预计完成时间 */
  estimatedDuration: number;
  /** 接单说明 */
  message?: string;
  /** 订单状态 */
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

// ========== 文件上传类型 ==========

/**
 * 文件上传响应
 */
export interface UploadResponse {
  /** 文件ID */
  fileId: string;
  /** 文件名 */
  filename: string;
  /** 文件URL */
  url: string;
  /** 文件大小 */
  size: number;
  /** 文件类型 */
  mimeType: string;
  /** 上传时间 */
  uploadedAt: string;
}

// ========== 错误码定义 ==========

/**
 * 业务错误码枚举
 */
export enum ApiErrorCode {
  // 通用错误
  SUCCESS = 0,
  UNKNOWN_ERROR = -1,
  INVALID_PARAMS = 1001,
  PERMISSION_DENIED = 1002,
  RESOURCE_NOT_FOUND = 1003,
  RATE_LIMIT_EXCEEDED = 1004,

  // 认证相关错误
  TOKEN_EXPIRED = 2001,
  TOKEN_INVALID = 2002,
  LOGIN_FAILED = 2003,
  USER_NOT_FOUND = 2004,
  PASSWORD_INCORRECT = 2005,
  ACCOUNT_DISABLED = 2006,

  // 业务相关错误
  TASK_NOT_FOUND = 3001,
  TASK_ALREADY_ACCEPTED = 3002,
  INSUFFICIENT_BALANCE = 3003,
  OPERATION_NOT_ALLOWED = 3004,
}

// ========== API端点定义 ==========

/**
 * API端点常量
 */
export const ApiEndpoints = {
  // 认证相关
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    PROFILE: '/api/auth/profile',
    CHANGE_PASSWORD: '/api/auth/change-password',
  },

  // 用户相关
  USER: {
    PROFILE: '/api/user/profile',
    ORDERS: '/api/user/orders',
    TASKS: '/api/user/tasks',
    FAVORITES: '/api/user/favorites',
  },

  // 服务相关
  SERVICE: {
    LIST: '/api/services',
    DETAIL: '/api/services/:id',
    CATEGORIES: '/api/service-categories',
  },

  // 任务相关
  TASK: {
    LIST: '/api/tasks',
    CREATE: '/api/tasks',
    DETAIL: '/api/tasks/:id',
    UPDATE: '/api/tasks/:id',
    DELETE: '/api/tasks/:id',
    ACCEPT: '/api/tasks/:id/accept',
    COMPLETE: '/api/tasks/:id/complete',
    CANCEL: '/api/tasks/:id/cancel',
  },

  // 接单相关
  ORDER: {
    LIST: '/api/orders',
    CREATE: '/api/orders',
    DETAIL: '/api/orders/:id',
    UPDATE: '/api/orders/:id',
  },

  // 文件上传
  UPLOAD: {
    IMAGE: '/api/upload/image',
    FILE: '/api/upload/file',
  },
};
