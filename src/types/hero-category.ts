// Hero Section 类型定义

import React from 'react';

export interface Tag {
  id: string;
  name: string;
  link?: string;
  count?: number; // 该标签下的服务数量
  hot?: boolean; // 是否为热门标签
}

export interface Subcategory {
  id: string;
  name: string;
  icon?: React.ReactNode;
  link?: string;
  description?: string;
  tags?: Tag[];
  featured?: boolean; // 是否为精选子分类
}

export interface FeaturedItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  badge?: string;
  discount?: string; // 优惠信息
  rating?: number; // 评分
  price?: string; // 价格
}

// 主分类接口 - 支持递归结构
export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string; // 主题色
  description?: string;
  subcategories?: Subcategory[];
  featuredItems?: FeaturedItem[];

  // 新增字段支持更丰富的展示
  accentColor?: string; // 强调色（用于hover效果）
  gradient?: string; // 渐变色背景
  megaMenuImage?: string; // MegaMenu大图
  sortOrder?: number; // 排序权重
  active?: boolean; // 是否激活
}

// 轮播图项接口
export interface CarouselItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
  type?: 'internal' | 'external';
  backgroundColor?: string;
  textColor?: string;

  // 新增字段
  overlay?: boolean; // 是否有遮罩
  overlayOpacity?: number; // 遮罩透明度
  position?: 'left' | 'center' | 'right'; // 文字位置
  badge?: string; // 徽章
}