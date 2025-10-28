// 邮箱验证
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 手机号验证：中国大陆手机号格式
export const validatePhone = (phone: string): { valid: boolean; message?: string } => {
  if (!phone) {
    return { valid: false, message: '请输入手机号' };
  }
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return { valid: false, message: '请输入正确的手机号格式' };
  }
  return { valid: true };
};

// 保持向后兼容的简单版本
export const validatePhoneSimple = (phone: string): boolean => {
  return /^1[3-9]\d{9}$/.test(phone);
};

// 密码验证：6-20字符，只能包含数字、字母、下划线，不能有空格
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (!password) {
    return { valid: false, message: '请输入密码' };
  }
  if (password.length < 6 || password.length > 20) {
    return { valid: false, message: '密码长度为6-20个字符' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(password)) {
    return { valid: false, message: '密码只能包含数字、字母、下划线' };
  }
  if (/\s/.test(password)) {
    return { valid: false, message: '密码不能包含空格' };
  }
  return { valid: true };
};

// 详细的密码验证（保留原功能用于其他地方）
export const validatePasswordDetailed = (
  password: string
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push('密码长度至少6位');
  }

  if (password.length > 20) {
    errors.push('密码长度不能超过20位');
  }

  if (!/[a-zA-Z]/.test(password)) {
    errors.push('密码必须包含字母');
  }

  if (!/\d/.test(password)) {
    errors.push('密码必须包含数字');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// 用户名验证：3-20字符，只能包含数字、字母、下划线，不能有空格
export const validateUsername = (username: string): { valid: boolean; message?: string } => {
  if (!username) {
    return { valid: false, message: '请输入用户名' };
  }
  if (username.length < 3 || username.length > 20) {
    return { valid: false, message: '用户名长度为3-20个字符' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, message: '用户名只能包含数字、字母、下划线' };
  }
  if (/\s/.test(username)) {
    return { valid: false, message: '用户名不能包含空格' };
  }
  return { valid: true };
};

// 保持向后兼容的简单版本
export const validateUsernameSimple = (username: string): boolean => {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
};

// URL验证
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// 身份证号验证
export const validateIdCard = (idCard: string): boolean => {
  const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return idCardRegex.test(idCard);
};

// 昵称验证：3-20字符
export const validateNickname = (nickname: string): { valid: boolean; message?: string } => {
  if (!nickname) {
    return { valid: false, message: '请输入昵称' };
  }
  if (nickname.length < 3 || nickname.length > 20) {
    return { valid: false, message: '昵称长度为3-20个字符' };
  }
  return { valid: true };
};

// 确认密码验证
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): { valid: boolean; message?: string } => {
  if (!confirmPassword) {
    return { valid: false, message: '请确认密码' };
  }
  if (password !== confirmPassword) {
    return { valid: false, message: '两次输入的密码不一致' };
  }
  return { valid: true };
};

// 验证码验证
export const validateVerificationCode = (code: string): { valid: boolean; message?: string } => {
  if (!code) {
    return { valid: false, message: '请输入验证码' };
  }
  if (!/^\d{6}$/.test(code)) {
    return { valid: false, message: '验证码为6位数字' };
  }
  return { valid: true };
};

// 原密码验证（用于重置密码）
export const validateCurrentPassword = (password: string): { valid: boolean; message?: string } => {
  if (!password) {
    return { valid: false, message: '请输入当前密码' };
  }
  return { valid: true };
};

// 中文姓名验证
export const validateChineseName = (name: string): boolean => {
  const nameRegex = /^[\u4e00-\u9fa5]{2,10}$/;
  return nameRegex.test(name);
};

// 表单验证规则
export const validationRules = {
  required: (message?: string) => ({
    required: true,
    message: message || '此字段为必填项',
  }),

  email: {
    type: 'email' as const,
    message: '请输入有效的邮箱地址',
  },

  phone: {
    pattern: /^1[3-9]\d{9}$/,
    message: '请输入有效的手机号码',
  },

  username: [
    {
      required: true,
      message: '请输入用户名',
    },
    {
      min: 3,
      message: '用户名至少3个字符',
    },
    {
      max: 20,
      message: '用户名最多20个字符',
    },
    {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: '用户名只能包含字母、数字、下划线',
    },
  ],

  password: [
    {
      required: true,
      message: '请输入密码',
    },
    {
      min: 6,
      message: '密码至少6个字符',
    },
    {
      max: 20,
      message: '密码最多20个字符',
    },
  ],

  confirmPassword: (getFieldValue: (field: string) => string) => ({
    validator: (_: unknown, value: string) => {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('两次输入的密码不一致'));
    },
  }),

  url: {
    type: 'url' as const,
    message: '请输入有效的URL地址',
  },
};

// 防抖函数
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// 节流函数
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), wait);
    }
  };
};
