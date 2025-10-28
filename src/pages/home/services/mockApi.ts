// 模拟API服务 - 用于开发和测试
import { mockBanners, mockGridItems, mockStatistics, mockTasks } from './mockData';
import {
  Banner,
  GridItem,
  HomeStatistics,
  Task,
  TaskListParams,
  PaginatedResponse,
  SearchSuggestion,
} from '../types';

// 模拟网络延迟
const delay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟轮播图API
export const mockGetBanners = async (): Promise<Banner[]> => {
  await delay();
  return mockBanners.filter(banner => banner.isActive);
};

// 模拟宫格API
export const mockGetGridItems = async (): Promise<GridItem[]> => {
  await delay();
  return mockGridItems;
};

// 模拟统计API
export const mockGetHomeStatistics = async (): Promise<HomeStatistics> => {
  await delay();
  return { ...mockStatistics };
};

// 模拟搜索建议API
export const mockGetSearchSuggestions = async (keyword: string): Promise<SearchSuggestion[]> => {
  await delay(300);

  if (!keyword.trim()) return [];

  const suggestions: SearchSuggestion[] = [
    { text: keyword, type: 'keyword', count: Math.floor(Math.random() * 100) },
    { text: `${keyword}服务`, type: 'category', count: Math.floor(Math.random() * 50) },
    { text: `${keyword}附近`, type: 'location', count: Math.floor(Math.random() * 30) },
  ];

  return suggestions.slice(0, 3);
};

// 模拟任务列表API
export const mockGetTaskList = async (params: TaskListParams): Promise<PaginatedResponse<Task>> => {
  await delay();

  // 模拟筛选逻辑
  let filteredTasks = [...mockTasks];

  // 按分类筛选
  if (params.filter?.category) {
    filteredTasks = filteredTasks.filter(task => task.category === params.filter?.category);
  }

  // 按紧急程度筛选
  if (params.filter?.isUrgent) {
    filteredTasks = filteredTasks.filter(task => task.isUrgent);
  }

  // 按预算范围筛选
  if (params.filter?.minBudget) {
    filteredTasks = filteredTasks.filter(task => task.budget >= params.filter!.minBudget!);
  }
  if (params.filter?.maxBudget) {
    filteredTasks = filteredTasks.filter(task => task.budget <= params.filter!.maxBudget!);
  }

  // 排序
  switch (params.sortBy) {
    case 'budget_high':
      filteredTasks.sort((a, b) => b.budget - a.budget);
      break;
    case 'budget_low':
      filteredTasks.sort((a, b) => a.budget - b.budget);
      break;
    case 'latest':
    default:
      // 默认按创建时间排序
      break;
  }

  // 分页
  const startIndex = (params.page - 1) * params.pageSize;
  const endIndex = startIndex + params.pageSize;
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

  return {
    list: paginatedTasks,
    total: filteredTasks.length,
    page: params.page,
    pageSize: params.pageSize,
    hasMore: endIndex < filteredTasks.length,
  };
};

// 模拟防骗提示API
export const mockGetAntiFraudTips = async () => {
  await delay();
  return [
    {
      id: '1',
      title: '平台担保交易',
      content: '所有资金通过平台担保，切勿私下转账',
      type: 'warning' as const,
      icon: 'warning',
    },
    {
      id: '2',
      title: '确认再付款',
      content: '收到货物或服务确认完成后，再确认收货付款',
      type: 'info' as const,
      icon: 'info',
    },
  ];
};
