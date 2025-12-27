import React from 'react';

/**
 * Hero Section 相关的类型定义
 */

// 分类数据接口
export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description?: string;
  subcategories?: Subcategory[];
  featuredItems?: FeaturedItem[];
}

// 子分类接口
export interface Subcategory {
  id: string;
  name: string;
  icon?: React.ReactNode;
  link?: string;
}

// 精选项目接口
export interface FeaturedItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  badge?: string;
}

// 轮播图数据接口
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
}

// Hero Section 组件 Props
export interface HeroSectionProps {
  categories: Category[];
  carouselItems: CarouselItem[];
  onCategoryClick?: (category: Category) => void;
  onCarouselItemClick?: (item: CarouselItem) => void;
  autoplayInterval?: number;
  showMegaMenu?: boolean;
}

// Category Sidebar 组件 Props
export interface CategorySidebarProps {
  categories: Category[];
  activeCategory?: string;
  onCategoryClick?: (category: Category) => void;
  onCategoryHover?: (category: Category | null) => void;
  showMegaMenu?: boolean;
}

// Custom Carousel 组件 Props
export interface CustomCarouselProps {
  items: CarouselItem[];
  autoplay?: boolean;
  autoplayInterval?: number;
  showDots?: boolean;
  dotPosition?: 'bottom' | 'top' | 'left' | 'right';
  onItemChange?: (current: number, next: number) => void;
  onItemClick?: (item: CarouselItem) => void;
}

// Mega Menu 组件 Props
export interface MegaMenuProps {
  category: Category;
  visible: boolean;
  onClose: () => void;
  position: { x: number; y: number; width: number; height: number };
}