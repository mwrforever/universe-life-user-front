/**
 * API服务统一入口
 * 导出所有API服务和工具
 */

// 导出HTTP客户端和Token管理器
export { httpClient, TokenManager } from './http/client';
export type { AxiosRequestConfig, AxiosResponse } from 'axios';

// 导出API类型定义
export * from './types/api';

// 导出各个API服务
export { default as ServicesApiService } from './api/services';
export { default as TasksApiService } from './api/tasks';
export { default as UploadApiService } from './api/upload';

// 导出环境变量工具
export const getApiBaseUrl = (): string => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8099';
};

export const isDevelopment = (): boolean => {
  return import.meta.env.DEV;
};

export const isProduction = (): boolean => {
  return import.meta.env.PROD;
};

// 默认导出HTTP客户端
export { default } from './http/client';
