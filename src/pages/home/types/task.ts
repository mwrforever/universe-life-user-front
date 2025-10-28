import { BaseEntity } from './common';

// 任务状态枚举
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'expired';

// 任务优先级
export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';

// 任务类型
export type TaskCategory = 'delivery' | 'service' | 'digital' | 'consulting' | 'other';

// 任务位置信息
export interface TaskLocation {
  address: string;
  latitude: number;
  longitude: number;
  distance?: number; // 距离用户的位置（米）
}

// 任务信息
export interface Task extends BaseEntity {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  status: TaskStatus;
  priority: TaskPriority;
  budget: number;
  deadline: string;
  location: TaskLocation;
  publisher: {
    id: string;
    nickname: string;
    avatar: string;
    rating: number;
    completedTasks: number;
  };
  requirements: string[];
  tags: string[];
  images: string[];
  applicantCount: number;
  maxApplicants: number;
  viewCount: number;
  isUrgent: boolean;
  isRemote: boolean;
  estimatedDuration: number; // 预估时长（分钟）
}

// 任务筛选条件
export interface TaskFilter {
  category?: TaskCategory;
  status?: TaskStatus;
  priority?: TaskPriority;
  minBudget?: number;
  maxBudget?: number;
  maxDistance?: number;
  isUrgent?: boolean;
  isRemote?: boolean;
  keywords?: string;
}

// 任务排序选项
export type TaskSortBy = 'latest' | 'budget_high' | 'budget_low' | 'deadline' | 'distance';

// 任务列表参数
export interface TaskListParams {
  page: number;
  pageSize: number;
  filter?: TaskFilter;
  sortBy?: TaskSortBy;
  latitude?: number;
  longitude?: number;
}
