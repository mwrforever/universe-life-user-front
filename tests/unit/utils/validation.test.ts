import { describe, it, expect } from 'vitest';
import {
  validatePhone,
  validateEmail,
  validatePassword,
  validateTaskTitle,
  validateAmount,
  validateForm,
  registerValidationRules,
  loginValidationRules,
} from '@/utils/validation';

describe('验证工具函数', () => {
  describe('validatePhone', () => {
    it('应该验证有效的手机号', () => {
      expect(validatePhone('13800138000')).toBe(true);
      expect(validatePhone('15912345678')).toBe(true);
      expect(validatePhone('18698765432')).toBe(true);
    });

    it('应该拒绝无效的手机号', () => {
      expect(validatePhone('12800138000')).toBe(false); // 1开头
      expect(validatePhone('1380013800')).toBe(false); // 10位
      expect(validatePhone('138001380000')).toBe(false); // 12位
      expect(validatePhone('1380013800a')).toBe(false); // 包含字母
      expect(validatePhone('')).toBe(false); // 空字符串
    });
  });

  describe('validateEmail', () => {
    it('应该验证有效的邮箱地址', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.org')).toBe(true);
    });

    it('应该拒绝无效的邮箱地址', () => {
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('test@example')).toBe(false);
      expect(validateEmail('test.example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('应该验证有效的密码', () => {
      const result = validatePassword('Abc12345');
      expect(result.isValid).toBe(true);
      expect(result.message).toBeUndefined();
    });

    it('应该拒绝无效的密码', () => {
      let result = validatePassword('123456'); // 没有字母
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('密码必须为8-20位，包含字母和数字');

      result = validatePassword('abcdefgh'); // 没有数字
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('密码必须为8-20位，包含字母和数字');

      result = validatePassword('Ab123'); // 太短
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('密码必须为8-20位，包含字母和数字');

      result = validatePassword('Abcdefghijklmnopqrstuvwxyz123456'); // 太长
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('密码必须为8-20位，包含字母和数字');
    });
  });

  describe('validateTaskTitle', () => {
    it('应该验证有效的任务标题', () => {
      const result = validateTaskTitle('这是一个有效的任务标题');
      expect(result.isValid).toBe(true);
    });

    it('应该拒绝太短的任务标题', () => {
      const result = validateTaskTitle('短标题');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('任务标题至少5个字符');
    });

    it('应该拒绝太长的任务标题', () => {
      const longTitle = 'A'.repeat(101);
      const result = validateTaskTitle(longTitle);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('任务标题不能超过100个字符');
    });
  });

  describe('validateAmount', () => {
    it('应该验证有效的金额', () => {
      expect(validateAmount(100)).toBe(true);
      expect(validateAmount(0.01)).toBe(true);
      expect(validateAmount(1000000)).toBe(true);
    });

    it('应该拒绝无效的金额', () => {
      expect(validateAmount(0)).toBe(false);
      expect(validateAmount(-1)).toBe(false);
      expect(validateAmount(1000001)).toBe(false);
      expect(validateAmount(NaN)).toBe(false);
    });
  });
});

describe('表单验证', () => {
  describe('validateForm', () => {
    it('应该验证登录表单', () => {
      const validData = {
        phone: '13800138000',
        password: 'Abc12345',
      };

      const invalidData = {
        phone: '123',
        password: '123',
      };

      expect(validateForm(validData, loginValidationRules)).toEqual({});
      expect(validateForm(invalidData, loginValidationRules)).toHaveProperty('phone');
      expect(validateForm(invalidData, loginValidationRules)).toHaveProperty('password');
    });

    it('应该验证注册表单', () => {
      const validData = {
        phone: '13800138000',
        password: 'Abc12345',
        confirmPassword: 'Abc12345',
        captcha: '123456',
        agreement: true,
      };

      const invalidData = {
        phone: '123',
        password: '123',
        confirmPassword: '456',
        captcha: '123',
        agreement: false,
      };

      expect(validateForm(validData, registerValidationRules)).toEqual({});
      expect(validateForm(invalidData, registerValidationRules)).toHaveProperty('phone');
      expect(validateForm(invalidData, registerValidationRules)).toHaveProperty('password');
      expect(validateForm(invalidData, registerValidationRules)).toHaveProperty('confirmPassword');
      expect(validateForm(invalidData, registerValidationRules)).toHaveProperty('captcha');
      expect(validateForm(invalidData, registerValidationRules)).toHaveProperty('agreement');
    });
  });
});