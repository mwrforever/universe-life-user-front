/**
 * 消息模块类型定义
 */

// 消息类型
export type MessageType = 'text' | 'image' | 'file' | 'system' | 'task';

// 会话分类类型
export type ConversationCategory = 'all' | 'public' | 'friend' | 'group';

// 会话类型
export type ConversationType = 'public' | 'friend' | 'group' | 'system';

// 用户状态
export type UserStatus = 'online' | 'offline' | 'busy';

// 消息状态
export type MessageStatus = 'sending' | 'sent' | 'read' | 'failed';

// 消息接口
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: MessageType;
  timestamp: string;
  status: MessageStatus;
  isMe?: boolean;
}

// 会话接口
export interface Conversation {
  id: string;
  type: ConversationType;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isPinned?: boolean;
  isMuted?: boolean;
  isStarred?: boolean;
  // 私聊相关（公共/好友）
  userId?: string;
  userStatus?: UserStatus;
  // 群聊相关
  memberCount?: number;
  groupCode?: string; // 群聊唯一编码
  // 任务相关（公共会话）
  taskId?: string;
  taskTitle?: string;
  // 创建时间
  createdAt?: string;
}

// 用户/联系人接口
export interface Contact {
  id: string;
  name: string;
  avatar?: string;
  status?: UserStatus;
  type: 'public' | 'friend';
  taskId?: string;
  taskTitle?: string;
  addedAt?: string;
}

// 群聊接口
export interface Group {
  id: string;
  name: string;
  avatar?: string;
  code: string; // 唯一编码
  memberCount: number;
  ownerId: string;
  ownerName: string;
  description?: string;
  createdAt: string;
}

// 添加好友请求
export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar?: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

// 加入群聊请求
export interface GroupJoinRequest {
  id: string;
  groupId: string;
  groupName: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}
