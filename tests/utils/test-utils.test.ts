import { describe, it, expect } from 'vitest';
import { createMockUser, createMockTask, createMockMessage } from './test-utils';

describe('Test Utils', () => {
  describe('createMockUser', () => {
    it('应该创建一个有效的用户mock数据', () => {
      const user = createMockUser();

      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('phone');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('nickname');
      expect(user).toHaveProperty('stats');
      expect(user.id).toBe('1');
      expect(user.username).toBe('testuser');
      expect(user.status).toBe('active');
    });

    it('应该支持覆盖默认值', () => {
      const user = createMockUser({
        username: 'customuser',
        age: 30
      });

      expect(user.username).toBe('customuser');
      expect(user.age).toBe(30);
    });
  });

  describe('createMockTask', () => {
    it('应该创建一个有效的任务mock数据', () => {
      const task = createMockTask();

      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('description');
      expect(task).toHaveProperty('publisher');
      expect(task).toHaveProperty('category');
      expect(task.status).toBe('published');
      expect(task.budget).toBe(100);
    });

    it('应该支持覆盖默认值', () => {
      const task = createMockTask({
        title: '自定义任务',
        budget: 200
      });

      expect(task.title).toBe('自定义任务');
      expect(task.budget).toBe(200);
    });
  });

  describe('createMockMessage', () => {
    it('应该创建一个有效的消息mock数据', () => {
      const message = createMockMessage();

      expect(message).toHaveProperty('id');
      expect(message).toHaveProperty('conversationId');
      expect(message).toHaveProperty('senderId');
      expect(message).toHaveProperty('receiverId');
      expect(message).toHaveProperty('content');
      expect(message.type).toBe('text');
      expect(message.status).toBe('sent');
    });

    it('应该支持覆盖默认值', () => {
      const message = createMockMessage({
        content: '自定义消息',
        type: 'image'
      });

      expect(message.content).toBe('自定义消息');
      expect(message.type).toBe('image');
    });
  });
});