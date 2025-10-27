// 轮播图类型
export interface Banner {
  id: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
  type: 'external' | 'internal' | 'task';
  order: number;
  isActive: boolean;
  startTime?: string;
  endTime?: string;
  // 新增CTA按钮支持
  ctaText?: string;
  ctaLink?: string;
}

// 快速宫格项
export interface GridItem {
  id: string;
  title: string;
  icon: string;
  link: string;
  color: string;
  category?: string;
  badge?: number;
}

// 搜索建议
export interface SearchSuggestion {
  text: string;
  type: 'keyword' | 'category' | 'location';
  count?: number;
}

// 统计数据
export interface HomeStatistics {
  totalTasks: number;
  totalUsers: number;
  totalBounty: number;
  completedTasks: number;
  activeUsers: number;
  todayTasks: number;
}

// 防骗提示
export interface AntiFraudTip {
  id: string;
  title: string;
  content: string;
  type: 'warning' | 'info' | 'danger';
  icon: string;
}

// 客服FAQ项目
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

// 热力图数据点
export interface HeatMapPoint {
  latitude: number;
  longitude: number;
  weight: number; // 任务密度权重
}