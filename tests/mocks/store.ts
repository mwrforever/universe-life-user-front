import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// 创建一个简单的测试用store
export const testStore = configureStore({
  reducer: {
    // 空的reducer用于测试
    test: (state = {}, action) => state
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: true,
});

export type TestRootState = ReturnType<typeof testStore.getState>;
export type TestAppDispatch = typeof testStore.dispatch;

export const useTestAppDispatch = () => useDispatch<TestAppDispatch>();
export const useTestAppSelector: TypedUseSelectorHook<TestRootState> = useSelector;