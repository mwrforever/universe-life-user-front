// 重新导出标准用户API服务
import UsersApiService, { type User, type UnreadCount } from '../../../services/api/users';

// 重新导出以保持向后兼容
export const getCurrentUser = () => UsersApiService.getCurrentUser().then(res => res.data);
export const getUnreadCount = () => UsersApiService.getUnreadCount().then(res => res.data);
export const updateUserLocation = (latitude: number, longitude: number) =>
  UsersApiService.updateLocation(latitude, longitude).then(res => res.data);
export const markMessagesAsRead = (type: string, ids?: string[]) =>
  UsersApiService.markMessagesAsRead(type, ids).then(res => res.data);

// 导出类型
export type { User, UnreadCount };