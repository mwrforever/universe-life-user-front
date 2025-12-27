// Universe Life 接单平台核心类型定义

// ==================== 基础类型 ====================

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== 订单相关类型 ====================

// 平台订单分类接口（与 category-config.ts 中的接口类似但用途不同）
export interface PlatformOrderCategory {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    gradient: string;
    visualStyle: 'cyberpunk' | 'professional' | 'minimalist' | 'artistic';
  };
  fields: PlatformCategoryField[];
  isActive: boolean;
  orderCount: number;
}

export interface PlatformCategoryField {
  id: string;
  key: string;
  label: string;
  type: 'select' | 'input' | 'textarea' | 'number' | 'date' | 'multiselect';
  required: boolean;
  options?: PlatformCategoryFieldOption[];
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface PlatformCategoryFieldOption {
  label: string;
  value: string;
  description?: string;
}

export interface Order extends BaseEntity {
  // 基本信息
  title: string;
  description: string;
  category: PlatformOrderCategory;

  // 预算和时间
  budget: {
    min: number;
    max: number;
    type: 'fixed' | 'hourly' | 'negotiable';
    currency: string;
  };
  timeline: {
    startDate?: string;
    deadline?: string;
    urgency: 'low' | 'medium' | 'high' | 'urgent';
  };

  // 分类特定字段
  categoryData: Record<string, unknown>;

  // 位置信息
  location?: {
    type: 'remote' | 'onsite' | 'hybrid';
    address?: string;
    city?: string;
    country?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };

  // 技能要求
  skills: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'expert' | 'any';

  // 发布者信息
  publisher: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    reviewsCount: number;
    isVerified: boolean;
    company?: string;
  };

  // 状态信息
  status: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  visibility: 'public' | 'private' | 'invited';

  // 申请统计
  applicationsCount: number;
  viewedCount: number;
  savedCount: number;

  // 附件
  attachments: OrderAttachment[];

  // 标签
  tags: string[];
}

export interface OrderAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export interface OrderApplication extends BaseEntity {
  orderId: string;
  applicant: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    reviewsCount: number;
    isVerified: boolean;
    skills: string[];
    portfolioCount: number;
    completedJobs: number;
  };

  // 申请内容
  proposal: string;
  suggestedBudget?: number;
  timeline: {
    estimatedDays: number;
    startDate?: string;
  };

  // 附加文件
  attachments: OrderAttachment[];

  // 状态
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected' | 'withdrawn';

  // 面试安排
  interviewScheduled?: boolean;
  interviewDate?: string;
}

// ==================== 用户相关类型 ====================

export interface UserProfile extends BaseEntity {
  // 基本信息
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;

  // 位置信息
  location?: {
    city: string;
    country: string;
    timezone: string;
  };

  // 认证信息
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isIdentityVerified: boolean;
  verificationLevel: 'basic' | 'enhanced' | 'premium';

  // 专业信息
  title?: string;
  company?: string;
  website?: string;
  skills: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'expert';

  // 统计信息
  rating: number;
  reviewsCount: number;
  completedJobs: number;
  cancelledJobs: number;
  totalEarned: number;

  // 偏好设置
  preferences: {
    categories: string[];
    workTypes: ('remote' | 'onsite' | 'hybrid')[];
    notificationSettings: NotificationSettings;
  };

  // 作品集
  portfolioItems: PortfolioItem[];
}

export interface PortfolioItem extends BaseEntity {
  title: string;
  description: string;
  images: string[];
  tags: string[];
  category: string;
  projectUrl?: string;
  featured: boolean;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  newOrders: boolean;
  applicationUpdates: boolean;
  messages: boolean;
  marketing: boolean;
}

// ==================== 市场筛选类型 ====================

export interface MarketFilters {
  // 基础筛选
  categories?: string[];
  budget?: {
    min?: number;
    max?: number;
  };
  timeline?: {
    urgency?: ('low' | 'medium' | 'high' | 'urgent')[];
    maxDays?: number;
  };

  // 位置筛选
  location?: {
    type?: ('remote' | 'onsite' | 'hybrid')[];
    cities?: string[];
    countries?: string[];
  };

  // 技能筛选
  skills?: string[];
  experienceLevel?: ('beginner' | 'intermediate' | 'expert' | 'any')[];

  // 排序
  sortBy?: 'relevance' | 'newest' | 'budget_high' | 'budget_low' | 'deadline';
  sortOrder?: 'asc' | 'desc';
}

// ==================== UI组件类型 ====================

export interface HeroSectionData {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  ctaButton: {
    text: string;
    action: () => void;
  };
  statistics: {
    totalOrders: number;
    activeUsers: number;
    completedProjects: number;
    totalValue: number;
  };
}

export interface CategoryCard {
  category: PlatformOrderCategory;
  orderCount: number;
  avgBudget: number;
  trending: boolean;
  onClick: () => void;
}

// ==================== API响应类型 ====================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ==================== 主题配置类型 ====================

export interface CategoryTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  gradients: {
    primary: string;
    card: string;
    button: string;
  };
  visualEffects: {
    glowColor?: string;
    shadowColor?: string;
    animationType?: 'pulse' | 'glow' | 'slide' | 'bounce';
  };
  typography: {
    fontFamily: string;
    headingFont?: string;
  };
}

// ==================== 表单类型 ====================

export interface CreateOrderFormData {
  title: string;
  description: string;
  categoryId: string;
  budget: {
    min: number;
    max: number;
    type: 'fixed' | 'hourly' | 'negotiable';
  };
  timeline: {
    urgency: 'low' | 'medium' | 'high' | 'urgent';
    deadline?: string;
  };
  location: {
    type: 'remote' | 'onsite' | 'hybrid';
    address?: string;
  };
  skills: string[];
  categoryData: Record<string, unknown>;
  attachments: File[];
  tags: string[];
}

export interface CreateOrderFormConfig {
  categories: PlatformOrderCategory[];
  theme: CategoryTheme;
  validation: Record<string, ValidationRule>;
  stepTitles: string[];
  showPriceSuggestion: boolean;
  enableAutoSave: boolean;
}

// 表单验证规则类型
interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
}

// ==================== 实时类型 ====================

export interface RealtimeUpdate {
  type: 'order_created' | 'order_updated' | 'application_received' | 'message_received';
  data: RealtimeUpdateData;
  timestamp: string;
  userId?: string;
}

// 实时更新数据类型
interface RealtimeUpdateData {
  orderId?: string;
  applicationId?: string;
  status?: string;
  message?: string;
  [key: string]: unknown;
}

export interface OrderStatusUpdate {
  orderId: string;
  oldStatus: string;
  newStatus: string;
  updatedBy: string;
  timestamp: string;
  message?: string;
}

// ==================== 搜索类型 ====================

export interface SearchQuery {
  keyword?: string;
  filters: MarketFilters;
  suggestions?: string[];
  history?: string[];
}

export interface SearchResult {
  orders: Order[];
  total: number;
  suggestions?: string[];
  didYouMean?: string;
  facets: {
    categories: Array<{ value: string; count: number }>;
    skills: Array<{ value: string; count: number }>;
    budgets: Array<{ range: string; count: number }>;
  };
}
