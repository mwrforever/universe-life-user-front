/**
 * 任务相关API
 * 提供任务发布、查询、接单等功能
 */

import { httpClient } from '../http/client';
import {
  TaskInfo,
  CreateTaskRequest,
  AcceptTaskRequest,
  TaskOrder,
  TaskStatus,
  TaskPriority,
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
} from '../types/api';

/**
 * 任务API服务类
 */
export class TasksApiService {
  /**
   * 获取任务列表
   */
  static async getTasksList(
    params?: {
      status?: TaskStatus;
      priority?: TaskPriority;
      categoryId?: number;
      publisherId?: number;
      assigneeId?: number;
      keyword?: string;
      location?: {
        longitude: number;
        latitude: number;
        radius?: number;
      };
      budgetRange?: {
        min?: number;
        max?: number;
      };
      dateRange?: {
        startDate?: string;
        endDate?: string;
      };
    } & PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<TaskInfo>>> {
    return httpClient.get('/api/tasks', params);
  }

  /**
   * 创建任务
   */
  static async createTask(taskData: CreateTaskRequest): Promise<ApiResponse<TaskInfo>> {
    return httpClient.post('/api/tasks', taskData);
  }

  /**
   * 获取任务详情
   */
  static async getTaskDetail(id: number): Promise<ApiResponse<TaskInfo>> {
    return httpClient.get(`/api/tasks/${id}`);
  }

  /**
   * 更新任务
   */
  static async updateTask(
    id: number,
    taskData: Partial<CreateTaskRequest>
  ): Promise<ApiResponse<TaskInfo>> {
    return httpClient.put(`/api/tasks/${id}`, taskData);
  }

  /**
   * 删除任务
   */
  static async deleteTask(id: number): Promise<ApiResponse<null>> {
    return httpClient.delete(`/api/tasks/${id}`);
  }

  /**
   * 接单
   */
  static async acceptTask(
    id: number,
    acceptData: AcceptTaskRequest
  ): Promise<ApiResponse<TaskOrder>> {
    return httpClient.post(`/api/tasks/${id}/accept`, acceptData);
  }

  /**
   * 完成任务
   */
  static async completeTask(
    id: number,
    data?: {
      rating?: number;
      comment?: string;
      images?: string[];
    }
  ): Promise<ApiResponse<TaskInfo>> {
    return httpClient.post(`/api/tasks/${id}/complete`, data);
  }

  /**
   * 取消任务
   */
  static async cancelTask(id: number, reason?: string): Promise<ApiResponse<TaskInfo>> {
    return httpClient.post(`/api/tasks/${id}/cancel`, { reason });
  }

  /**
   * 获取我的任务列表（作为发布者）
   */
  static async getMyPublishedTasks(
    params?: {
      status?: TaskStatus;
      keyword?: string;
    } & PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<TaskInfo>>> {
    return httpClient.get('/api/user/published-tasks', params);
  }

  /**
   * 获取我的接单列表（作为接单者）
   */
  static async getMyAcceptedTasks(
    params?: {
      status?: TaskStatus;
      keyword?: string;
    } & PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<TaskInfo>>> {
    return httpClient.get('/api/user/accepted-tasks', params);
  }

  /**
   * 搜索任务
   */
  static async searchTasks(
    params: {
      keyword: string;
      categoryId?: number;
      location?: {
        longitude: number;
        latitude: number;
        radius?: number;
      };
      filters?: {
        status?: TaskStatus[];
        priority?: TaskPriority[];
        budgetRange?: {
          min?: number;
          max?: number;
        };
        dateRange?: {
          startDate?: string;
          endDate?: string;
        };
      };
      sortBy?: 'relevance' | 'price' | 'createdAt' | 'appointmentTime';
      sortOrder?: 'asc' | 'desc';
    } & PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<TaskInfo>>> {
    return httpClient.post('/api/tasks/search', params);
  }

  /**
   * 获取推荐任务
   */
  static async getRecommendedTasks(params?: {
    limit?: number;
    categoryId?: number;
    location?: {
      longitude: number;
      latitude: number;
    };
    userSkills?: number[];
  }): Promise<ApiResponse<TaskInfo[]>> {
    return httpClient.get('/api/tasks/recommended', params);
  }

  /**
   * 获取紧急任务
   */
  static async getUrgentTasks(params?: {
    limit?: number;
    categoryId?: number;
    location?: {
      longitude: number;
      latitude: number;
      radius?: number;
    };
  }): Promise<ApiResponse<TaskInfo[]>> {
    return httpClient.get('/api/tasks/urgent', params);
  }

  /**
   * 获取附近任务
   */
  static async getNearbyTasks(params: {
    longitude: number;
    latitude: number;
    radius?: number;
    categoryId?: number;
    limit?: number;
  }): Promise<ApiResponse<TaskInfo[]>> {
    return httpClient.get('/api/tasks/nearby', params);
  }

  /**
   * 获取任务申请列表
   */
  static async getTaskApplications(
    taskId: number,
    params?: PaginationParams
  ): Promise<
    ApiResponse<
      PaginatedResponse<{
        id: number;
        taskId: number;
        providerId: number;
        provider: {
          id: number;
          username: string;
          nickname: string;
          avatar?: string;
          rating: number;
          completedOrders: number;
        };
        quotedPrice: number;
        estimatedDuration: number;
        message?: string;
        status: 'pending' | 'accepted' | 'rejected';
        createdAt: string;
      }>
    >
  > {
    return httpClient.get(`/api/tasks/${taskId}/applications`, params);
  }

  /**
   * 接受任务申请
   */
  static async acceptApplication(applicationId: number): Promise<ApiResponse<TaskOrder>> {
    return httpClient.post(`/api/task-applications/${applicationId}/accept`);
  }

  /**
   * 拒绝任务申请
   */
  static async rejectApplication(
    applicationId: number,
    reason?: string
  ): Promise<ApiResponse<null>> {
    return httpClient.post(`/api/task-applications/${applicationId}/reject`, { reason });
  }

  /**
   * 获取任务统计数据
   */
  static async getTaskStats(): Promise<
    ApiResponse<{
      totalTasks: number;
      publishedTasks: number;
      acceptedTasks: number;
      completedTasks: number;
      cancelledTasks: number;
      totalEarnings: number;
      pendingEarnings: number;
      averageRating: number;
      completionRate: number;
    }>
  > {
    return httpClient.get('/api/user/task-stats');
  }

  /**
   * 举报任务
   */
  static async reportTask(data: {
    taskId: number;
    reason: string;
    description?: string;
    evidence?: string[];
  }): Promise<ApiResponse<null>> {
    return httpClient.post('/api/tasks/report', data);
  }

  /**
   * 获取任务消息
   */
  static async getTaskMessages(
    taskId: number,
    params?: PaginationParams
  ): Promise<
    ApiResponse<
      PaginatedResponse<{
        id: number;
        taskId: number;
        senderId: number;
        sender: {
          id: number;
          username: string;
          nickname: string;
          avatar?: string;
        };
        content: string;
        type: 'text' | 'image' | 'file';
        fileUrl?: string;
        createdAt: string;
      }>
    >
  > {
    return httpClient.get(`/api/tasks/${taskId}/messages`, params);
  }

  /**
   * 发送任务消息
   */
  static async sendTaskMessage(
    taskId: number,
    data: {
      content: string;
      type?: 'text' | 'image' | 'file';
      fileUrl?: string;
    }
  ): Promise<ApiResponse<null>> {
    return httpClient.post(`/api/tasks/${taskId}/messages`, data);
  }

  /**
   * 获取任务时间线
   */
  static async getTaskTimeline(taskId: number): Promise<
    ApiResponse<
      Array<{
        id: number;
        taskId: number;
        action: 'created' | 'accepted' | 'started' | 'completed' | 'cancelled' | 'disputed';
        description: string;
        userId: number;
        user: {
          id: number;
          username: string;
          nickname: string;
          avatar?: string;
        };
        createdAt: string;
        metadata?: Record<string, any>;
      }>
    >
  > {
    return httpClient.get(`/api/tasks/${taskId}/timeline`);
  }
}

export default TasksApiService;
