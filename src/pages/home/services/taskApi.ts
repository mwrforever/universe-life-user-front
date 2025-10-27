import { request } from './api';
import { Task, TaskListParams, PaginatedResponse } from '../types';
import { mockGetTaskList } from './mockApi';

// 判断是否使用模拟数据
const USE_MOCK_DATA = import.meta.env.NODE_ENV === 'development' ||
                      !import.meta.env.VITE_API_BASE_URL;

// 获取任务列表
export const getTaskList = (params: TaskListParams): Promise<PaginatedResponse<Task>> => {
  if (USE_MOCK_DATA) {
    return mockGetTaskList(params);
  }
  return request.get('/tasks', { params }).then(res => res.data);
};

// 获取任务详情
export const getTaskDetail = (id: string): Promise<Task> => {
  return request.get(`/tasks/${id}`).then(res => res.data);
};

// 抢单
export const grabTask = (id: string): Promise<void> => {
  return request.post(`/tasks/${id}/grab`).then(res => res.data);
};

// 收藏任务
export const favoriteTask = (id: string): Promise<void> => {
  return request.post(`/tasks/${id}/favorite`).then(res => res.data);
};

// 取消收藏
export const unfavoriteTask = (id: string): Promise<void> => {
  return request.delete(`/tasks/${id}/favorite`).then(res => res.data);
};

// 举报任务
export const reportTask = (id: string, reason: string, description: string): Promise<void> => {
  return request.post(`/tasks/${id}/report`, {
    reason,
    description,
    timestamp: Date.now()
  }).then(res => res.data);
};

// 获取任务热力图数据
export const getTaskHeatMap = (bounds: {
  north: number;
  south: number;
  east: number;
  west: number;
}): Promise<Array<{ latitude: number; longitude: number; weight: number }>> => {
  return request.get('/tasks/heatmap', { params: bounds }).then(res => res.data);
};