import { useQuery } from '@tanstack/react-query';
import {
  getBanners,
  getGridItems,
  getSearchSuggestions,
  getHomeStatistics,
  getAntiFraudTips,
} from '../services';
import { Banner, GridItem, SearchSuggestion, HomeStatistics, AntiFraudTip } from '../types';

// 获取轮播图数据
export const useBanners = () => {
  return useQuery<Banner[], Error>({
    queryKey: ['banners'],
    queryFn: getBanners,
    staleTime: 5 * 60 * 1000, // 5分钟缓存
  });
};

// 获取快速宫格数据
export const useGridItems = () => {
  return useQuery<GridItem[], Error>({
    queryKey: ['gridItems'],
    queryFn: getGridItems,
    staleTime: 10 * 60 * 1000, // 10分钟缓存
  });
};

// 搜索建议Hook
export const useSearchSuggestions = (keyword: string, enabled = true) => {
  return useQuery<SearchSuggestion[], Error>({
    queryKey: ['searchSuggestions', keyword],
    queryFn: () => getSearchSuggestions(keyword),
    enabled: enabled && keyword.trim().length > 0,
    staleTime: 2 * 60 * 1000, // 2分钟缓存
  });
};

// 获取首页统计数据
export const useHomeStatistics = () => {
  return useQuery<HomeStatistics, Error>({
    queryKey: ['homeStatistics'],
    queryFn: getHomeStatistics,
    refetchInterval: 3 * 60 * 1000, // 3分钟刷新
    staleTime: 60 * 1000, // 1分钟缓存
  });
};

// 获取防骗提示
export const useAntiFraudTips = () => {
  return useQuery<AntiFraudTip[], Error>({
    queryKey: ['antiFraudTips'],
    queryFn: getAntiFraudTips,
    staleTime: 30 * 60 * 1000, // 30分钟缓存
  });
};

// 综合首页数据Hook
export const useHomeData = () => {
  const bannersQuery = useBanners();
  const gridItemsQuery = useGridItems();
  const statisticsQuery = useHomeStatistics();
  const antiFraudTipsQuery = useAntiFraudTips();

  const isLoading =
    bannersQuery.isLoading ||
    gridItemsQuery.isLoading ||
    statisticsQuery.isLoading ||
    antiFraudTipsQuery.isLoading;

  const error =
    bannersQuery.error || gridItemsQuery.error || statisticsQuery.error || antiFraudTipsQuery.error;

  const refetchAll = () => {
    Promise.all([
      bannersQuery.refetch(),
      gridItemsQuery.refetch(),
      statisticsQuery.refetch(),
      antiFraudTipsQuery.refetch(),
    ]);
  };

  return {
    banners: bannersQuery.data || [],
    gridItems: gridItemsQuery.data || [],
    statistics: statisticsQuery.data,
    antiFraudTips: antiFraudTipsQuery.data || [],
    isLoading,
    error,
    refetchAll,
  };
};
