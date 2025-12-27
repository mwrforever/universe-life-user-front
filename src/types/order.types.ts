/**
 * 订单相关类型定义
 * 避免复杂的导入依赖关系
 */

export enum OrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired'
}

export enum OrderCategory {
  ALL = 'all',
  GAMING = 'gaming',
  ENTERPRISE = 'enterprise',
  CAMPUS = 'campus',
  DESIGN = 'design'
}

export interface OrderTag {
  id: string;
  name: string;
  color: string;
}

export interface OrderStats {
  viewingCount: number;
  favoriteCount: number;
  shareCount: number;
}

export interface OrderPrice {
  symbol: string;
  integer: number;
  decimal: string;
  currency: string;
}

export interface VisualAnchor {
  type: 'icon' | 'abstract';
  url?: string;
  icon?: string;
  backgroundColor?: string;
}

export interface OrderItem {
  id: string;
  title: string;
  description?: string;
  category: OrderCategory;
  tags: OrderTag[];
  price: OrderPrice;
  stats: OrderStats;
  visualAnchor: VisualAnchor;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  deadline?: Date;
  location?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// FilterType 字符串字面量类型
export type FilterType = 'comprehensive' | 'price' | 'newest';

// 为了运行时使用，提供常量对象
export const FILTER_TYPES = {
  COMPREHENSIVE: 'comprehensive',
  PRICE: 'price',
  NEWEST: 'newest'
} as const;

// 验证类型
export type FilterTypeValues = typeof FILTER_TYPES[keyof typeof FILTER_TYPES];