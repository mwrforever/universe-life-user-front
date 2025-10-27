import { describe, it, expect, beforeEach } from 'vitest';
import authSlice, {
  loginAsync,
  registerAsync,
  logoutAsync,
  clearError,
  setUser,
  updateUser,
  restoreAuth,
  resetLoginAttempts,
  incrementLoginAttempts,
} from '@/store/slices/authSlice';
import type { AuthState } from '@/store/slices/authSlice';

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  loginAttempts: 0,
  lastLoginTime: null,
};

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('authSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('initial state', () => {
    it('应该返回初始状态', () => {
      const state = authSlice.reducer(undefined, { type: 'unknown' });
      expect(state).toEqual(initialState);
    });
  });

  describe('actions', () => {
    it('clearError 应该清除错误信息', () => {
      const previousState = { ...initialState, error: 'Some error' };
      const state = authSlice.reducer(previousState, clearError());
      expect(state.error).toBeNull();
    });

    it('setUser 应该设置用户信息', () => {
      const mockUser = { id: '1', username: 'test' } as any;
      const state = authSlice.reducer(initialState, setUser(mockUser));
      expect(state.user).toEqual(mockUser);
    });

    it('updateUser 应该更新用户信息', () => {
      const mockUser = { id: '1', username: 'test', email: 'old@example.com' } as any;
      const previousState = { ...initialState, user: mockUser };
      const state = authSlice.reducer(previousState, updateUser({ email: 'new@example.com' }));
      expect(state.user?.email).toBe('new@example.com');
    });

    it('incrementLoginAttempts 应该增加登录尝试次数', () => {
      const state = authSlice.reducer(initialState, incrementLoginAttempts());
      expect(state.loginAttempts).toBe(1);
    });

    it('resetLoginAttempts 应该重置登录尝试次数', () => {
      const previousState = { ...initialState, loginAttempts: 5 };
      const state = authSlice.reducer(previousState, resetLoginAttempts());
      expect(state.loginAttempts).toBe(0);
    });
  });

  describe('async thunks', () => {
    describe('loginAsync', () => {
      it('pending 应该设置loading状态', () => {
        const state = authSlice.reducer(initialState, {
          type: loginAsync.pending.type,
        });
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('fulfilled 应该设置认证信息', () => {
        const mockResponse = {
          user: { id: '1', username: 'test' },
          token: 'mock-token',
          refreshToken: 'mock-refresh-token',
        };

        const state = authSlice.reducer(initialState, {
          type: loginAsync.fulfilled.type,
          payload: mockResponse,
        });

        expect(state.loading).toBe(false);
        expect(state.isAuthenticated).toBe(true);
        expect(state.user).toEqual(mockResponse.user);
        expect(state.token).toBe(mockResponse.token);
        expect(state.refreshToken).toBe(mockResponse.refreshToken);
        expect(state.loginAttempts).toBe(0);
        expect(state.lastLoginTime).toBeGreaterThan(0);
        expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_token', mockResponse.token);
        expect(localStorageMock.setItem).toHaveBeenCalledWith('refresh_token', mockResponse.refreshToken);
        expect(localStorageMock.setItem).toHaveBeenCalledWith('user_info', JSON.stringify(mockResponse.user));
      });

      it('rejected 应该设置错误信息', () => {
        const errorMessage = '登录失败';
        const state = authSlice.reducer(initialState, {
          type: loginAsync.rejected.type,
          payload: errorMessage,
        });

        expect(state.loading).toBe(false);
        expect(state.error).toBe(errorMessage);
        expect(state.loginAttempts).toBe(1);
      });
    });

    describe('registerAsync', () => {
      it('fulfilled 应该设置认证信息', () => {
        const mockResponse = {
          user: { id: '1', username: 'test' },
          token: 'mock-token',
          refreshToken: 'mock-refresh-token',
        };

        const state = authSlice.reducer(initialState, {
          type: registerAsync.fulfilled.type,
          payload: mockResponse,
        });

        expect(state.isAuthenticated).toBe(true);
        expect(state.user).toEqual(mockResponse.user);
        expect(state.token).toBe(mockResponse.token);
        expect(state.refreshToken).toBe(mockResponse.refreshToken);
      });
    });

    describe('logoutAsync', () => {
      it('fulfilled 应该清除认证信息', () => {
        const previousState = {
          ...initialState,
          isAuthenticated: true,
          user: { id: '1', username: 'test' } as any,
          token: 'mock-token',
          refreshToken: 'mock-refresh-token',
        };

        const state = authSlice.reducer(previousState, {
          type: logoutAsync.fulfilled.type,
        });

        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
        expect(state.refreshToken).toBeNull();
        expect(state.lastLoginTime).toBeNull();
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token');
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('refresh_token');
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('user_info');
      });

      it('rejected 也应该清除认证信息', () => {
        const previousState = {
          ...initialState,
          isAuthenticated: true,
          user: { id: '1', username: 'test' } as any,
          token: 'mock-token',
          refreshToken: 'mock-refresh-token',
        };

        const state = authSlice.reducer(previousState, {
          type: logoutAsync.rejected.type,
          payload: '退出失败',
        });

        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
        expect(state.refreshToken).toBeNull();
      });
    });
  });

  describe('restoreAuth', () => {
    it('应该从localStorage恢复认证信息', () => {
      const mockUser = { id: '1', username: 'test' };
      const mockToken = 'mock-token';
      const mockRefreshToken = 'mock-refresh-token';

      localStorageMock.getItem
        .mockImplementationOnce(() => mockToken)
        .mockImplementationOnce(() => mockRefreshToken)
        .mockImplementationOnce(() => JSON.stringify(mockUser));

      const state = authSlice.reducer(initialState, restoreAuth());

      expect(state.token).toBe(mockToken);
      expect(state.refreshToken).toBe(mockRefreshToken);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('应该处理无效的localStorage数据', () => {
      localStorageMock.getItem
        .mockImplementationOnce(() => 'token')
        .mockImplementationOnce(() => 'refresh')
        .mockImplementationOnce(() => 'invalid-json');

      const state = authSlice.reducer(initialState, restoreAuth());

      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.refreshToken).toBeNull();
    });
  });
});