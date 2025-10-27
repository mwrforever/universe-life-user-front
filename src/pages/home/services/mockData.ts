// 模拟数据 - 用于开发和测试
import { Banner, GridItem, HomeStatistics, AntiFraudTip, Task, TaskCategory, TaskStatus, TaskPriority } from '../types';

// 模拟轮播图数据
export const mockBanners: Banner[] = [
  {
    id: '1',
    title: '新用户专享福利',
    description: '注册即送50元优惠券',
    image: 'https://via.placeholder.com/800x360/1890ff/ffffff?text=新用户福利',
    link: '/register',
    type: 'internal',
    order: 1,
    isActive: true,
  },
  {
    id: '2',
    title: '春季服务大促',
    description: '家政服务低至8折',
    image: 'https://via.placeholder.com/800x360/52c41a/ffffff?text=春季大促',
    link: '/promotion/spring',
    type: 'internal',
    order: 2,
    isActive: true,
  },
  {
    id: '3',
    title: '成为服务达人',
    description: '接单赚钱，时间自由',
    image: 'https://via.placeholder.com/800x360/fa8c16/ffffff?text=服务达人',
    link: '/become-provider',
    type: 'internal',
    order: 3,
    isActive: true,
  },
];

// 模拟宫格数据
export const mockGridItems: GridItem[] = [
  {
    id: '1',
    title: '家政保洁',
    icon: '🧹',
    link: '/category/cleaning',
    color: '#1890ff',
    category: 'service',
    badge: 23,
  },
  {
    id: '2',
    title: '维修安装',
    icon: '🔧',
    link: '/category/repair',
    color: '#52c41a',
    category: 'service',
    badge: 15,
  },
  {
    id: '3',
    title: '代办跑腿',
    icon: '🏃',
    link: '/category/errand',
    color: '#fa8c16',
    category: 'delivery',
    badge: 8,
  },
  {
    id: '4',
    title: '技能服务',
    icon: '💼',
    link: '/category/skill',
    color: '#722ed1',
    category: 'consulting',
  },
  {
    id: '5',
    title: '搬家拉货',
    icon: '🚚',
    link: '/category/moving',
    color: '#eb2f96',
    category: 'delivery',
  },
  {
    id: '6',
    title: '教育培训',
    icon: '📚',
    link: '/category/education',
    color: '#13c2c2',
    category: 'consulting',
  },
];

// 模拟统计数据
export const mockStatistics: HomeStatistics = {
  totalTasks: 15420,
  totalUsers: 8930,
  totalBounty: 2847650,
  completedTasks: 12680,
  activeUsers: 2340,
  todayTasks: 186,
};

// 模拟防骗提示
export const mockAntiFraudTips: AntiFraudTip[] = [
  {
    id: '1',
    title: '平台担保交易',
    content: '所有资金通过平台担保，切勿私下转账',
    type: 'warning',
    icon: 'warning',
  },
  {
    id: '2',
    title: '确认再付款',
    content: '收到货物或服务确认完成后，再确认收货付款',
    type: 'info',
    icon: 'info',
  },
];

// 模拟任务数据
export const mockTasks: Task[] = [
  {
    id: '1',
    title: '需要有人帮忙打扫客厅',
    description: '客厅面积约30平米，需要深度清洁，包括地板、家具、窗户等',
    category: 'service' as TaskCategory,
    status: 'pending' as TaskStatus,
    priority: 'normal' as TaskPriority,
    budget: 150,
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3天后
    location: {
      address: '朝阳区建国门外大街1号',
      latitude: 39.9042,
      longitude: 116.4074,
      distance: 1200,
    },
    publisher: {
      id: 'user1',
      nickname: '张女士',
      avatar: 'https://via.placeholder.com/40x40/1890ff/ffffff?text=张',
      rating: 4.8,
      completedTasks: 23,
    },
    requirements: ['有经验', '自备工具', '女性优先'],
    tags: ['家政', '保洁', '客厅'],
    images: ['https://via.placeholder.com/300x200/f0f0f0/666666?text=客厅照片'],
    applicantCount: 3,
    maxApplicants: 5,
    viewCount: 156,
    isUrgent: false,
    isRemote: false,
    estimatedDuration: 120,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: '急！需要人帮忙取快递',
    description: '有两个大件快递需要帮忙从代收点取回家，在5楼没有电梯',
    category: 'delivery' as TaskCategory,
    status: 'pending' as TaskStatus,
    priority: 'urgent' as TaskPriority,
    budget: 50,
    deadline: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5小时后
    location: {
      address: '海淀区中关村大街27号',
      latitude: 39.9889,
      longitude: 116.3058,
      distance: 800,
    },
    publisher: {
      id: 'user2',
      nickname: '李先生',
      avatar: 'https://via.placeholder.com/40x40/52c41a/ffffff?text=李',
      rating: 4.5,
      completedTasks: 12,
    },
    requirements: ['体力好', '有时间'],
    tags: ['快递', '急单', '搬运'],
    images: [],
    applicantCount: 1,
    maxApplicants: 1,
    viewCount: 45,
    isUrgent: true,
    isRemote: false,
    estimatedDuration: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: '需要帮忙安装空调',
    description: '新买的空调需要安装，有安装经验者优先',
    category: 'service' as TaskCategory,
    status: 'pending' as TaskStatus,
    priority: 'high' as TaskPriority,
    budget: 200,
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2天后
    location: {
      address: '东城区王府井大街138号',
      latitude: 39.9139,
      longitude: 116.4074,
      distance: 2000,
    },
    publisher: {
      id: 'user3',
      nickname: '王先生',
      avatar: 'https://via.placeholder.com/40x40/fa8c16/ffffff?text=王',
      rating: 4.9,
      completedTasks: 67,
    },
    requirements: ['有安装经验', '自备工具', '需要高空作业'],
    tags: ['空调', '安装', '维修'],
    images: ['https://via.placeholder.com/300x200/f0f0f0/666666?text=空调照片'],
    applicantCount: 8,
    maxApplicants: 3,
    viewCount: 289,
    isUrgent: false,
    isRemote: false,
    estimatedDuration: 90,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];