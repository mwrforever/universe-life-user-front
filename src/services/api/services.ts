/**
 * 服务相关API
 * 提供服务列表、详情、分类等功能
 */

import { httpClient } from '../http/client';
import {
  ServiceInfo,
  ServiceCategory,
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
} from '../types/api';

/**
 * 服务API服务类
 */
export class ServicesApiService {
  /**
   * 获取服务列表
   */
  static async getServicesList(
    params?: {
      categoryId?: number;
      keyword?: string;
      sortBy?: 'price' | 'rating' | 'distance' | 'createdAt';
      sortOrder?: 'asc' | 'desc';
      minPrice?: number;
      maxPrice?: number;
      location?: {
        longitude: number;
        latitude: number;
        radius?: number; // 搜索半径（公里）
      };
    } & PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<ServiceInfo>>> {
    return httpClient.get('/api/services', params);
  }

  /**
   * 获取服务详情
   */
  static async getServiceDetail(id: number): Promise<ApiResponse<ServiceInfo>> {
    return httpClient.get(`/api/services/${id}`);
  }

  /**
   * 获取服务分类列表
   */
  static async getCategories(): Promise<ApiResponse<ServiceCategory[]>> {
    return httpClient.get('/api/service-categories');
  }

  /**
   * 搜索服务
   */
  static async searchServices(
    params: {
      keyword: string;
      categoryId?: number;
      location?: {
        longitude: number;
        latitude: number;
        radius?: number;
      };
      filters?: {
        minPrice?: number;
        maxPrice?: number;
        rating?: number;
        features?: string[];
      };
      sortBy?: 'relevance' | 'price' | 'rating' | 'distance';
      sortOrder?: 'asc' | 'desc';
    } & PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<ServiceInfo>>> {
    return httpClient.post('/api/services/search', params);
  }

  /**
   * 获取推荐服务
   */
  static async getRecommendedServices(params?: {
    limit?: number;
    categoryId?: number;
    location?: {
      longitude: number;
      latitude: number;
    };
  }): Promise<ApiResponse<ServiceInfo[]>> {
    return httpClient.get('/api/services/recommended', params);
  }

  /**
   * 获取热门服务
   */
  static async getPopularServices(params?: {
    limit?: number;
    categoryId?: number;
    period?: 'day' | 'week' | 'month';
  }): Promise<ApiResponse<ServiceInfo[]>> {
    return httpClient.get('/api/services/popular', params);
  }

  /**
   * 获取附近的服务
   */
  static async getNearbyServices(params: {
    longitude: number;
    latitude: number;
    radius?: number;
    categoryId?: number;
    limit?: number;
  }): Promise<ApiResponse<ServiceInfo[]>> {
    return httpClient.get('/api/services/nearby', params);
  }

  /**
   * 收藏服务
   */
  static async favoriteService(serviceId: number): Promise<ApiResponse<null>> {
    return httpClient.post(`/api/services/${serviceId}/favorite`);
  }

  /**
   * 取消收藏服务
   */
  static async unfavoriteService(serviceId: number): Promise<ApiResponse<null>> {
    return httpClient.delete(`/api/services/${serviceId}/favorite`);
  }

  /**
   * 获取收藏的服务列表
   */
  static async getFavoriteServices(
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<ServiceInfo>>> {
    return httpClient.get('/api/user/favorites', params);
  }

  /**
   * 举报服务
   */
  static async reportService(data: {
    serviceId: number;
    reason: string;
    description?: string;
    evidence?: string[]; // 证据图片URLs
  }): Promise<ApiResponse<null>> {
    return httpClient.post('/api/services/report', data);
  }

  /**
   * 获取服务统计数据
   */
  static async getServiceStats(serviceId: number): Promise<
    ApiResponse<{
      viewCount: number;
      favoriteCount: number;
      orderCount: number;
      averageRating: number;
      ratingCount: number;
    }>
  > {
    return httpClient.get(`/api/services/${serviceId}/stats`);
  }

  /**
   * 获取服务评价列表
   */
  static async getServiceReviews(
    serviceId: number,
    params?: PaginationParams
  ): Promise<
    ApiResponse<
      PaginatedResponse<{
        id: number;
        userId: number;
        username: string;
        avatar?: string;
        rating: number;
        comment: string;
        images?: string[];
        createdAt: string;
        orderId?: number;
      }>
    >
  > {
    return httpClient.get(`/api/services/${serviceId}/reviews`, params);
  }

  /**
   * 提交服务评价
   */
  static async submitServiceReview(data: {
    serviceId: number;
    orderId: number;
    rating: number;
    comment: string;
    images?: string[];
  }): Promise<ApiResponse<null>> {
    return httpClient.post('/api/services/reviews', data);
  }

  /**
   * 回复服务评价
   */
  static async replyToReview(data: {
    reviewId: number;
    reply: string;
  }): Promise<ApiResponse<null>> {
    return httpClient.post(`/api/services/reviews/${data.reviewId}/reply`, { reply: data.reply });
  }

  /**
   * 获取服务提供者信息
   */
  static async getServiceProviderInfo(providerId: number): Promise<
    ApiResponse<{
      id: number;
      username: string;
      nickname: string;
      avatar?: string;
      phone?: string;
      email?: string;
      description?: string;
      services: ServiceInfo[];
      stats: {
        totalOrders: number;
        completedOrders: number;
        averageRating: number;
        responseRate: number;
        averageResponseTime: number; // 分钟
      };
      certifications: Array<{
        id: number;
        name: string;
        issuer: string;
        issuedAt: string;
        expiresAt?: string;
        imageUrl?: string;
      }>;
    }>
  > {
    return httpClient.get(`/api/providers/${providerId}`);
  }
}

export default ServicesApiService;
