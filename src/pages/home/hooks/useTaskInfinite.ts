import React from 'react';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { getTaskList, grabTask } from '../services';
import { Task, TaskListParams, TaskSortBy } from '../types';

// 默认任务列表参数
const defaultParams: TaskListParams = {
  page: 1,
  pageSize: 20,
  sortBy: 'latest',
};

// 无限滚动任务列表Hook
export const useTaskInfinite = (initialFilter?: Partial<TaskListParams>) => {
  const params = { ...defaultParams, ...initialFilter };

  const query = useInfiniteQuery({
    queryKey: ['tasks', params],
    queryFn: ({ pageParam = 1 }) => {
      return getTaskList({
        ...params,
        page: pageParam,
      });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.hasMore) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 60 * 1000, // 1分钟缓存
    initialPageParam: 1,
  });

  // 抢单Mutation
  const grabMutation = useMutation({
    mutationFn: grabTask,
    onSuccess: () => {
      // 抢单成功后刷新列表
      query.refetch();
    },
  });

  // 提取所有任务数据
  const tasks = query.data?.pages.flatMap(page => page.list) || [];
  const totalCount = query.data?.pages[0]?.total || 0;

  return {
    tasks,
    totalCount,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
    error: query.error,
    grabTask: grabMutation.mutate,
    isGrabbing: grabMutation.isPending,
  };
};

// 任务筛选Hook
export const useTaskFilter = () => {
  const [filter, setFilter] = React.useState<Partial<TaskListParams>>({
    sortBy: 'latest',
  });

  const updateFilter = (newFilter: Partial<TaskListParams>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  };

  const updateSortBy = (sortBy: TaskSortBy) => {
    setFilter(prev => ({ ...prev, sortBy }));
  };

  const resetFilter = () => {
    setFilter({ sortBy: 'latest' });
  };

  return {
    filter,
    updateFilter,
    updateSortBy,
    resetFilter,
  };
};