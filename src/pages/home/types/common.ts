// 通用响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

// 分页响应类型
export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// 基础实体类型
export interface BaseEntity {
  id: string | number;
  createdAt: string;
  updatedAt: string;
}
