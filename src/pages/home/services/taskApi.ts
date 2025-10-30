// 重新导出标准任务API服务
import TasksApiService from '../../../services/api/tasks';
import { mockGetTaskList } from './mockApi';
import type { Task, TaskListParams, PaginatedResponse } from '../types';

// 判断是否使用模拟数据
const USE_MOCK_DATA =
  import.meta.env.NODE_ENV === 'development' || !import.meta.env.VITE_API_BASE_URL;

// 重新导出以保持向后兼容
export const getTaskList = (params: TaskListParams): Promise<PaginatedResponse<Task>> => {
  if (USE_MOCK_DATA) {
    return mockGetTaskList(params);
  }
  return TasksApiService.getTasksList({
    page: params.page,
    pageSize: params.pageSize,
    status: params.status,
    priority: params.priority,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  }).then(res => res.data);
};

export const getTaskDetail = (id: string): Promise<Task> => {
  return TasksApiService.getTaskDetail(id).then(res => res.data);
};

export const grabTask = (id: string): Promise<void> => {
  return TasksApiService.acceptTask({ taskId: id }).then(res => res.data);
};

export const favoriteTask = (id: string): Promise<void> => {
  return TasksApiService.favoriteTask(id).then(res => res.data);
};

export const unfavoriteTask = (id: string): Promise<void> => {
  return TasksApiService.unfavoriteTask(id).then(res => res.data);
};

export const reportTask = (id: string, reason: string, description: string): Promise<void> => {
  return TasksApiService.reportTask(id, { reason, description }).then(res => res.data);
};

export const getTaskHeatMap = (bounds: {
  north: number;
  south: number;
  east: number;
  west: number;
}): Promise<Array<{ latitude: number; longitude: number; weight: number }>> => {
  return TasksApiService.getTaskHeatMap(bounds).then(res => res.data);
};