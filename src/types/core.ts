// 通用响应类型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
  code: number;
}

// 分页参数
export interface PaginationParams {
  page: number;
  pageSize: number;
  total?: number;
}

// 分页响应
export interface PaginatedResponse<T> {
  list: T[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// 排序参数
export interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}

// 筛选参数
export interface FilterParams {
  [key: string]: string | number | boolean | string[] | undefined;
}

// 列表查询参数
export interface ListParams extends PaginationParams {
  sort?: SortParams;
  filter?: FilterParams;
  search?: string;
}

// 登录参数
export interface LoginParams {
  username: string;
  password: string;
  remember?: boolean;
}

// 注册参数
export interface RegisterParams {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  verificationCode: string;
  agreement: boolean;
}

// 用户类型
export interface User {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  nickname?: string;
  avatar?: string;
  role: string;
  status: 'active' | 'inactive' | 'banned';
  createdAt: string;
  updatedAt: string;
}

// 菜单项类型
export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  permission?: string[];
}

// 表格列类型
export interface TableColumn {
  title: string;
  dataIndex: string;
  key: string;
  width?: number;
  fixed?: 'left' | 'right';
  sorter?: boolean;
  filterable?: boolean;
  render?: (value: unknown, record: Record<string, unknown>, index: number) => React.ReactNode;
}

// 表单字段类型
export interface FormField {
  name: string;
  label: string;
  type: 'input' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'upload';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string | number }>;
  rules?: Array<{
    required?: boolean;
    message?: string;
    pattern?: RegExp;
    min?: number;
    max?: number;
  }>;
}
