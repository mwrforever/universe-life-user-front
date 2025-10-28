/**
 * 模拟API接口
 * 在实际项目中替换为真实的API调用
 */

// 用户接口定义
interface MockUser {
  id: number;
  username: string;
  nickname: string;
  phone: string;
  password: string;
  createdAt: Date;
}

// 模拟网络延迟
const delay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟验证码存储
const verificationCodes = new Map<
  string,
  { code: string; timestamp: number; expireTime: number }
>();

// 模拟用户数据
const mockUsers = [
  {
    id: 1,
    username: 'demo_user',
    nickname: '演示用户',
    phone: '13800138000',
    password: 'demo123', // 实际应用中应该存储加密后的密码
    createdAt: new Date('2024-01-01'),
  },
];

// 模拟验证码生成
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 发送验证码
export const sendVerificationCode = async (
  phone: string
): Promise<{ success: boolean; message: string }> => {
  await delay(800); // 模拟网络请求延迟

  try {
    // 检查是否频繁发送
    const existingCode = verificationCodes.get(phone);
    const now = Date.now();

    if (existingCode && now - existingCode.timestamp < 60000) {
      return {
        success: false,
        message: '验证码发送过于频繁，请稍后再试',
      };
    }

    // 生成新的验证码
    const code = generateVerificationCode();
    const expireTime = 5 * 60 * 1000; // 5分钟有效期

    verificationCodes.set(phone, {
      code,
      timestamp: now,
      expireTime,
    });

    console.log(`模拟发送验证码到 ${phone}: ${code}`); // 开发环境调试用

    // 开发环境：将验证码存储到全局变量，方便测试
    if (typeof window !== 'undefined') {
      (window as any).__mockVerificationCode = code;
      console.log(`开发提示：验证码已存储，请使用验证码: ${code}`);
    }

    return {
      success: true,
      message: '验证码发送成功',
    };
  } catch (error) {
    return {
      success: false,
      message: '发送失败，请稍后重试',
    };
  }
};

// 验证验证码
export const verifyCode = async (
  phone: string,
  code: string
): Promise<{ success: boolean; message: string }> => {
  await delay(300);

  try {
    const storedData = verificationCodes.get(phone);
    const now = Date.now();

    if (!storedData) {
      return {
        success: false,
        message: '验证码不存在或已过期',
      };
    }

    if (now - storedData.timestamp > storedData.expireTime) {
      verificationCodes.delete(phone);
      return {
        success: false,
        message: '验证码已过期',
      };
    }

    if (storedData.code !== code) {
      return {
        success: false,
        message: '验证码错误',
      };
    }

    // 验证成功后删除验证码
    verificationCodes.delete(phone);

    return {
      success: true,
      message: '验证成功',
    };
  } catch (error) {
    return {
      success: false,
      message: '验证失败，请重试',
    };
  }
};

// 用户登录
export const loginUser = async (
  username: string,
  password: string
): Promise<{
  success: boolean;
  message: string;
  user?: Omit<MockUser, 'password'>;
  token?: string;
}> => {
  await delay(1000);

  try {
    const user = mockUsers.find(
      u => (u.username === username || u.phone === username) && u.password === password
    );

    if (!user) {
      return {
        success: false,
        message: '用户名或密码错误',
      };
    }

    // 模拟生成JWT token
    const token = btoa(
      JSON.stringify({
        userId: user.id,
        username: user.username,
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24小时过期
      })
    );

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user;

    return {
      success: true,
      message: '登录成功',
      user: userWithoutPassword,
      token,
    };
  } catch (error) {
    return {
      success: false,
      message: '登录失败，请稍后重试',
    };
  }
};

// 用户注册
export const registerUser = async (userData: {
  username: string;
  nickname: string;
  phone: string;
  password: string;
  verificationCode: string;
}): Promise<{ success: boolean; message: string; user?: Omit<MockUser, 'password'> }> => {
  await delay(1200);

  try {
    // 首先验证验证码
    const codeVerification = await verifyCode(userData.phone, userData.verificationCode);
    if (!codeVerification.success) {
      return {
        success: false,
        message: codeVerification.message,
      };
    }

    // 检查用户名是否已存在
    const existingUser = mockUsers.find(
      u => u.username === userData.username || u.phone === userData.phone
    );

    if (existingUser) {
      return {
        success: false,
        message: existingUser.username === userData.username ? '用户名已存在' : '手机号已注册',
      };
    }

    // 创建新用户
    const newUser = {
      id: mockUsers.length + 1,
      username: userData.username,
      nickname: userData.nickname,
      phone: userData.phone,
      password: userData.password, // 实际应用中应该加密
      createdAt: new Date(),
    };

    mockUsers.push(newUser);

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = newUser;

    return {
      success: true,
      message: '注册成功',
      user: userWithoutPassword,
    };
  } catch (error) {
    return {
      success: false,
      message: '注册失败，请稍后重试',
    };
  }
};

// 重置密码 - 通过手机验证码
export const resetPasswordByPhone = async (resetData: {
  phone: string;
  verificationCode: string;
  newPassword: string;
}): Promise<{ success: boolean; message: string }> => {
  await delay(1000);

  try {
    // 验证验证码
    const codeVerification = await verifyCode(resetData.phone, resetData.verificationCode);
    if (!codeVerification.success) {
      return {
        success: false,
        message: codeVerification.message,
      };
    }

    // 查找用户
    const userIndex = mockUsers.findIndex(u => u.phone === resetData.phone);
    if (userIndex === -1) {
      return {
        success: false,
        message: '手机号未注册',
      };
    }

    // 更新密码
    mockUsers[userIndex].password = resetData.newPassword;

    return {
      success: true,
      message: '密码重置成功',
    };
  } catch (error) {
    return {
      success: false,
      message: '重置失败，请稍后重试',
    };
  }
};

// 重置密码 - 通过原密码
export const resetPasswordByCurrentPassword = async (resetData: {
  username: string;
  currentPassword: string;
  newPassword: string;
}): Promise<{ success: boolean; message: string }> => {
  await delay(1000);

  try {
    // 查找用户并验证原密码
    const user = mockUsers.find(
      u =>
        (u.username === resetData.username || u.phone === resetData.username) &&
        u.password === resetData.currentPassword
    );

    if (!user) {
      return {
        success: false,
        message: '用户名或当前密码错误',
      };
    }

    // 更新密码
    user.password = resetData.newPassword;

    return {
      success: true,
      message: '密码修改成功',
    };
  } catch (error) {
    return {
      success: false,
      message: '密码修改失败，请稍后重试',
    };
  }
};

// 检查用户名是否可用
export const checkUsernameAvailability = async (
  username: string
): Promise<{
  available: boolean;
  message: string;
}> => {
  await delay(300);

  try {
    const existingUser = mockUsers.find(u => u.username === username);

    if (existingUser) {
      return {
        available: false,
        message: '用户名已被使用',
      };
    }

    return {
      available: true,
      message: '用户名可用',
    };
  } catch (error) {
    return {
      available: false,
      message: '检查失败，请稍后重试',
    };
  }
};

// 检查手机号是否已注册
export const checkPhoneRegistration = async (
  phone: string
): Promise<{
  registered: boolean;
  message: string;
}> => {
  await delay(300);

  try {
    const existingUser = mockUsers.find(u => u.phone === phone);

    if (existingUser) {
      return {
        registered: true,
        message: '手机号已注册',
      };
    }

    return {
      registered: false,
      message: '手机号未注册',
    };
  } catch (error) {
    return {
      registered: false,
      message: '检查失败，请稍后重试',
    };
  }
};
