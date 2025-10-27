import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { testStore } from '../mocks/store';

// 全局测试渲染器
interface AllTheProvidersProps {
  children: ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  return (
    <Provider store={testStore}>
      <BrowserRouter>
        <ConfigProvider locale={zhCN}>
          {children}
        </ConfigProvider>
      </BrowserRouter>
    </Provider>
  );
};

// 自定义渲染函数
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// 重新导出所有testing-library的工具
export * from '@testing-library/react';
export * from '@testing-library/user-event';
export { customRender as render };

// Mock数据生成器
export const createMockUser = (overrides = {}) => ({
  id: '1',
  username: 'testuser',
  phone: '13800138000',
  email: 'test@example.com',
  nickname: '测试用户',
  gender: 'male' as const,
  age: 25,
  address: {
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    street: '某某街道',
    detail: '某某地址',
    postalCode: '100000'
  },
  isVerified: true,
  verificationLevel: 'basic' as const,
  idCardVerified: true,
  stats: {
    totalTasksCompleted: 10,
    perfectTasksCompleted: 8,
    normalTasksCompleted: 2,
    timeoutTasksCompleted: 0,
    unfinishedTasksCount: 2,
    totalTasksAccepted: 12,
    averageRating: 4.8,
    ratingCount: 10,
    fiveStarCount: 8,
    fourStarCount: 2,
    threeStarCount: 0,
    totalEarnings: 10000,
    monthlyEarnings: 2000,
    pendingEarnings: 500,
    completionRate: 0.95,
    onTimeRate: 0.9,
    responseRate: 0.98
  },
  status: 'active' as const,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  lastLoginAt: new Date(),
  ...overrides
});

export const createMockTask = (overrides = {}) => ({
  id: '1',
  title: '测试任务',
  description: '这是一个测试任务描述',
  category: {
    id: '1',
    name: '家政服务',
    icon: 'home',
    level: 1
  },
  tags: ['测试', '任务'],
  publisherId: '1',
  publisher: createMockUser(),
  budget: 100,
  deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
  duration: 2,
  status: 'published' as const,
  priority: 'medium' as const,
  attachments: [],
  images: [],
  maxAcceptors: 1,
  currentAcceptors: [],
  requiredSkills: ['技能1', '技能2'],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  publishedAt: new Date('2024-01-01'),
  ...overrides
});

export const createMockMessage = (overrides = {}) => ({
  id: '1',
  conversationId: '1',
  senderId: '1',
  receiverId: '2',
  type: 'text' as const,
  content: '测试消息',
  status: 'sent' as const,
  timestamp: new Date(),
  isSystemMessage: false,
  ...overrides
});

// 等待异步操作完成的工具
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

// 模拟API响应的工具
export const createMockApiResponse = <T,>(data: T, status = 200) => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config: {}
});

// 模拟错误的工具
export const createMockError = (message: string, status = 500) => {
  const error = new Error(message) as any;
  error.response = {
    status,
    statusText: 'Internal Server Error',
    data: { message }
  };
  return error;
};