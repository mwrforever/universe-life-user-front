import { request } from './api';
import { Banner, GridItem, SearchSuggestion, HomeStatistics, AntiFraudTip } from '../types';
import {
  mockGetBanners,
  mockGetGridItems,
  mockGetSearchSuggestions,
  mockGetHomeStatistics,
  mockGetAntiFraudTips,
} from './mockApi';

// 判断是否使用模拟数据
const USE_MOCK_DATA =
  import.meta.env.NODE_ENV === 'development' || !import.meta.env.VITE_API_BASE_URL;

// 获取轮播图数据
export const getBanners = (): Promise<Banner[]> => {
  if (USE_MOCK_DATA) {
    return mockGetBanners();
  }
  return request.get('/home/banners').then(res => res.data);
};

// 获取快速宫格数据
export const getGridItems = (): Promise<GridItem[]> => {
  if (USE_MOCK_DATA) {
    return mockGetGridItems();
  }
  return request.get('/home/grid-items').then(res => res.data);
};

// 获取搜索建议
export const getSearchSuggestions = (keyword: string): Promise<SearchSuggestion[]> => {
  if (USE_MOCK_DATA) {
    return mockGetSearchSuggestions(keyword);
  }
  return request
    .get('/home/search-suggestions', {
      params: { keyword },
    })
    .then(res => res.data);
};

// 获取首页统计数据
export const getHomeStatistics = (): Promise<HomeStatistics> => {
  if (USE_MOCK_DATA) {
    return mockGetHomeStatistics();
  }
  return request.get('/home/statistics').then(res => res.data);
};

// 获取防骗提示
export const getAntiFraudTips = (): Promise<AntiFraudTip[]> => {
  if (USE_MOCK_DATA) {
    return mockGetAntiFraudTips();
  }
  return request.get('/home/anti-fraud-tips').then(res => res.data);
};

// 记录用户行为（用于数据分析）
export const trackUserAction = (action: string, data?: Record<string, unknown>): Promise<void> => {
  return request.post('/home/track', { action, data, timestamp: Date.now() }).then(res => res.data);
};
