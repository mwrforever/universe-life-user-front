/**
 * 用户相关API服务
 * 提供用户信息、位置更新、消息等功能
 */

import { httpClient } from '../http/client';
import type { ApiResponse } from '../types/api';

// 用户相关类型定义
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  phone?: string;
  location?: {
    latitude: number;
    longitude: number;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UnreadCount {
  messages: number;
  notifications: number;
  total: number;
}

/**
 * 用户API服务类
 */
export class UsersApiService {
  /**
   * 获取当前用户信息
   */
  static async getCurrentUser(): Promise<ApiResponse<User>> {
    return httpClient.get('/api/users/current');
  }

  /**
   * 获取未读消息数量
   */
  static async getUnreadCount(): Promise<ApiResponse<UnreadCount>> {
    return httpClient.get('/api/users/unread-count');
  }

  /**
   * 更新用户位置
   */
  static async updateLocation(latitude: number, longitude: number): Promise<ApiResponse<null>> {
    return httpClient.post('/api/users/location', {
      latitude,
      longitude,
      timestamp: Date.now(),
    });
  }

  /**
   * 标记消息已读
   */
  static async markMessagesAsRead(type: string, ids?: string[]): Promise<ApiResponse<null>> {
    return httpClient.post('/api/users/mark-read', {
      type,
      ids,
    });
  }

  /**
   * 更新用户信息
   */
  static async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return httpClient.put('/api/users/profile', data);
  }

  /**
   * 上传用户头像
   */
  static async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);

    return httpClient.post('/api/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export default UsersApiService;