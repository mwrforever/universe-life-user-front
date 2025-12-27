/**
 * Order Platform Types
 * 订单平台相关类型定义
 */

// 订单状态枚举
export enum OrderStatus {
  PENDING = 'pending',           // 待接单
  IN_PROGRESS = 'in_progress',   // 进行中
  COMPLETED = 'completed',       // 已完成
  CANCELLED = 'cancelled',       // 已取消
  EXPIRED = 'expired'           // 已过期
}

// 订单分类枚举
export enum OrderCategory {
  ALL = 'all',                   // 全部
  GAMING = 'gaming',             // 游戏
  ENTERPRISE = 'enterprise',     // 企业服务
  CAMPUS = 'campus',             // 校园
  DESIGN = 'design'             // 设计
}

// 订单标签接口
export interface OrderTag {
  id: string;
  name: string;
  color: string;                 // 药丸颜色 pastel colors
}

// 订单统计信息
export interface OrderStats {
  viewingCount: number;          // 正在查看人数
  favoriteCount: number;         // 收藏数
  shareCount: number;           // 分享数
}

// 订单价格信息
export interface OrderPrice {
  symbol: string;               // 货币符号 ¥
  integer: number;              // 整数部分 (500)
  decimal: string;              // 小数部分 (.00)
  currency: string;             // 货币类型 CNY
}

// 订单视觉锚点
export interface VisualAnchor {
  type: 'icon' | 'abstract';     // 图标或抽象艺术
  url?: string;                 // 图片URL
  icon?: string;                // 图标名称
  backgroundColor?: string;     // 背景色
}

// 订单项接口
export interface OrderItem {
  id: string;
  title: string;                // 标题（最多2行）
  description?: string;         // 描述
  category: OrderCategory;      // 分类
  tags: OrderTag[];            // 标签列表
  price: OrderPrice;           // 价格信息
  stats: OrderStats;           // 统计信息
  visualAnchor: VisualAnchor;  // 视觉锚点
  status: OrderStatus;         // 状态
  createdAt: Date;             // 创建时间
  updatedAt: Date;             // 更新时间
  deadline?: Date;             // 截止时间
  location?: string;           // 地区
  difficulty?: 'easy' | 'medium' | 'hard'; // 难度
}

// 过滤器类型
export type FilterType = 'comprehensive' | 'price' | 'newest';

// 过滤器配置
export interface FilterConfig {
  type: FilterType;
  label: string;
  sortKey: keyof OrderItem;
  order: 'asc' | 'desc';
}

// 订单卡片属性
export interface OrderCardProps {
  order: OrderItem;
  onGrabOrder?: (orderId: string) => void;
  loading?: boolean;
}

// 订单信息流属性
export interface OrderFeedProps {
  orders: OrderItem[];
  loading?: boolean;
  filterType: FilterType;
  onFilterChange: (type: FilterType) => void;
  onGrabOrder?: (orderId: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

// 骨架屏属性
export interface OrderCardSkeletonProps {
  count?: number;
}

// API响应类型
export interface OrderListResponse {
  data: OrderItem[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Mock数据生成器配置
export interface MockOrderConfig {
  count?: number;
  category?: OrderCategory;
  status?: OrderStatus;
  priceRange?: {
    min: number;
    max: number;
  };
}