// 重新导出标准服务API服务
import ServicesApiService from '../../../services/api/services';
import {
  mockGetBanners,
  mockGetGridItems,
  mockGetSearchSuggestions,
  mockGetHomeStatistics,
  mockGetAntiFraudTips,
} from './mockApi';
import type { Banner, GridItem, SearchSuggestion, HomeStatistics, AntiFraudTip } from '../types';

// 判断是否使用模拟数据
const USE_MOCK_DATA =
  import.meta.env.NODE_ENV === 'development' || !import.meta.env.VITE_API_BASE_URL;

// 重新导出以保持向后兼容
export const getBanners = (): Promise<Banner[]> => {
  if (USE_MOCK_DATA) {
    return mockGetBanners();
  }
  return ServicesApiService.getServicesList({
    featured: true,
    limit: 10,
  }).then(res => res.data.map((service: any) => ({
    id: service.id,
    title: service.title,
    image: service.imageUrl,
    link: `/services/${service.id}`,
  })));
};

export const getGridItems = (): Promise<GridItem[]> => {
  if (USE_MOCK_DATA) {
    return mockGetGridItems();
  }
  return ServicesApiService.getServicesList({
    limit: 12,
    sortBy: 'rating',
    sortOrder: 'desc',
  }).then(res => res.data.map((service: any) => ({
    id: service.id,
    title: service.title,
    icon: service.icon,
    description: service.description,
    link: `/services/${service.id}`,
  })));
};

export const getSearchSuggestions = (keyword: string): Promise<SearchSuggestion[]> => {
  if (USE_MOCK_DATA) {
    return mockGetSearchSuggestions(keyword);
  }
  return ServicesApiService.searchServices({
    keyword,
    limit: 5,
  }).then(res => res.data.map((service: any) => ({
    id: service.id,
    title: service.title,
    category: service.categoryName,
    type: 'service',
  })));
};

export const getHomeStatistics = (): Promise<HomeStatistics> => {
  if (USE_MOCK_DATA) {
    return mockGetHomeStatistics();
  }
  // 使用多个API调用来获取统计数据
  return Promise.all([
    ServicesApiService.getServicesList({ limit: 1 }),
    ServicesApiService.getServicesList({ activeOnly: true, limit: 1 }),
  ]).then(([servicesRes, activeRes]) => ({
    totalServices: servicesRes.data.total,
    activeServices: activeRes.data.total,
    totalUsers: 12580, // 模拟数据，实际应该从用户API获取
    todayOrders: 342, // 模拟数据，实际应该从订单API获取
  }));
};

export const getAntiFraudTips = (): Promise<AntiFraudTip[]> => {
  if (USE_MOCK_DATA) {
    return mockGetAntiFraudTips();
  }
  // 这个可能需要专门的API，暂时返回空数组
  return Promise.resolve([]);
};

export const trackUserAction = (action: string, data?: Record<string, unknown>): Promise<void> => {
  // 用户行为追踪，这个可能需要专门的分析API
  console.log('Track user action:', action, data);
  return Promise.resolve();
};