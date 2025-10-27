import { request } from './api';
import { User, UnreadCount } from '../types';

// 获取当前用户信息
export const getCurrentUser = (): Promise<User> => {
  return request.get('/user/current').then(res => res.data);
};

// 获取未读消息数量
export const getUnreadCount = (): Promise<UnreadCount> => {
  return request.get('/user/unread-count').then(res => res.data);
};

// 更新用户位置
export const updateUserLocation = (latitude: number, longitude: number): Promise<void> => {
  return request.post('/user/location', {
    latitude,
    longitude,
    timestamp: Date.now()
  }).then(res => res.data);
};

// 标记消息已读
export const markMessagesAsRead = (type: string, ids?: string[]): Promise<void> => {
  return request.post('/user/mark-read', {
    type,
    ids,
    timestamp: Date.now()
  }).then(res => res.data);
};