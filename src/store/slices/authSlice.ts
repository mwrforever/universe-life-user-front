import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import AuthApiService from '../../services/api/auth';
import { TokenManager } from '../../services/http/client';
import { UserInfo, LoginRequest, RegisterRequest, ApiResponse } from '../../services/types/api';

// 用户类型定义（与API保持一致）
export interface User extends UserInfo {
  // 可以添加额外的客户端字段
  permissions?: string[];
  lastLoginAt?: string;
}

// 登录参数
export interface LoginParams extends LoginRequest {}

// 注册参数
export interface RegisterParams extends RegisterRequest {}

// 认证状态
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

// 初始状态
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
};

// 检查认证状态
export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = TokenManager.getAccessToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await AuthApiService.getProfile();
      return response.data;
    } catch (error: any) {
      // 清除无效token
      TokenManager.clearTokens();
      return rejectWithValue(error.message || '认证状态检查失败');
    }
  }
);

// 异步登录
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (params: LoginParams, { rejectWithValue }) => {
    try {
      const response = await AuthApiService.login(params);
      const { user, accessToken, refreshToken, expiresIn } = response.data;

      // 存储token到TokenManager
      TokenManager.setAccessToken(accessToken, expiresIn);
      TokenManager.setRefreshToken(refreshToken);
      TokenManager.setUserInfo(user);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || '登录失败');
    }
  }
);

// 异步注册
export const registerAsync = createAsyncThunk(
  'auth/register',
  async (params: RegisterParams, { rejectWithValue }) => {
    try {
      const response = await AuthApiService.register(params);
      const { user, accessToken, refreshToken, expiresIn } = response.data;

      // 存储token到TokenManager
      TokenManager.setAccessToken(accessToken, expiresIn);
      TokenManager.setRefreshToken(refreshToken);
      TokenManager.setUserInfo(user);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || '注册失败');
    }
  }
);

// 异步登出
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // 调用登出API
      await AuthApiService.logout();

      // TokenManager.clearTokens() 会在API客户端中自动调用
      return;
    } catch (error: any) {
      // 即使API调用失败，也要清除本地token
      TokenManager.clearTokens();
      return rejectWithValue(error.message || '登出失败');
    }
  }
);

// 更新用户信息
export const updateProfileAsync = createAsyncThunk(
  'auth/updateProfile',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await AuthApiService.updateProfile(userData);

      // 更新本地存储的用户信息
      TokenManager.setUserInfo(response.data);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || '更新用户信息失败');
    }
  }
);

// 修改密码
export const changePasswordAsync = createAsyncThunk(
  'auth/changePassword',
  async (passwordData: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }, { rejectWithValue }) => {
    try {
      await AuthApiService.changePassword(passwordData);
      return;
    } catch (error: any) {
      return rejectWithValue(error.message || '修改密码失败');
    }
  }
);

// 创建slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 清除错误
    clearError: (state) => {
      state.error = null;
    },
    // 设置用户信息
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    // 设置初始化状态
    setInitialized: (state) => {
      state.isInitialized = true;
    },
    // 强制登出（用于token过期等情况）
    forceLogout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.error = '登录已过期，请重新登录';
      TokenManager.clearTokens();
    },
    // 更新token
    updateToken: (state, action: PayloadAction<{ token: string; refreshToken: string }>) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
  },
  extraReducers: (builder) => {
    // 检查认证状态
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.token = TokenManager.getAccessToken();
        state.refreshToken = TokenManager.getRefreshToken();
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.error = null;
      });

    // 登录
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.error = action.payload as string;
      });

    // 注册
    builder
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.error = action.payload as string;
      });

    // 登出
    builder
      .addCase(logoutAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.error = null;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // 更新用户信息
    builder
      .addCase(updateProfileAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // 修改密码
    builder
      .addCase(changePasswordAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePasswordAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changePasswordAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// 导出actions
export const {
  clearError,
  setUser,
  setInitialized,
  forceLogout,
  updateToken,
} = authSlice.actions;


// 导出selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectAuthState = selectAuth;
export const selectAuthUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsInitialized = (state: { auth: AuthState }) => state.auth.isInitialized;
export const selectUserPermissions = (state: { auth: AuthState }) => state.auth.user?.permissions || [];
export const selectUserType = (state: { auth: AuthState }) => state.auth.user?.userType;

// 导出reducer
export default authSlice.reducer;