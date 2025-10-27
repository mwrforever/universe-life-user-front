import { BaseEntity } from './common';

// 用户信息类型
export interface User extends BaseEntity {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'banned';
  verified: boolean;
  balance: number;
  totalEarned: number;
  level: number;
  experience: number;
}

// 用户登录信息
export interface UserAuth {
  token: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

// 未读消息统计
export interface UnreadCount {
  total: number;
  system: number;
  tasks: number;
  messages: number;
}