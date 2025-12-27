// 本地定义类型，避免导入问题
export enum OrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired'
}

export enum OrderCategory {
  ALL = 'all',
  GAMING = 'gaming',
  ENTERPRISE = 'enterprise',
  CAMPUS = 'campus',
  DESIGN = 'design'
}

export interface OrderTag {
  id: string;
  name: string;
  color: string;
}

export interface OrderStats {
  viewingCount: number;
  favoriteCount: number;
  shareCount: number;
}

export interface OrderPrice {
  symbol: string;
  integer: number;
  decimal: string;
  currency: string;
}

export interface VisualAnchor {
  type: 'icon' | 'abstract';
  url?: string;
  icon?: string;
  backgroundColor?: string;
}

export interface OrderItem {
  id: string;
  title: string;
  description?: string;
  category: OrderCategory;
  tags: OrderTag[];
  price: OrderPrice;
  stats: OrderStats;
  visualAnchor: VisualAnchor;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  deadline?: Date;
  location?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// 生成随机ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// 生成随机日期
const generateDate = (daysAgo: number = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date;
};

// 生成随机价格
const generatePrice = (min: number = 50, max: number = 2000): OrderPrice => {
  const integer = Math.floor(Math.random() * (max - min + 1)) + min;
  return {
    symbol: '¥',
    integer,
    decimal: '.00',
    currency: 'CNY'
  };
};

// 生成标签
const generateTags = (category: OrderCategory): OrderTag[] => {
  const allTags = {
    [OrderCategory.GAMING]: [
      { id: '1', name: 'LOL代练', color: '#FFE4E1' },
      { id: '2', name: '游戏陪玩', color: '#F0E6FF' },
      { id: '3', name: '账号交易', color: '#E6F7FF' },
      { id: '4', name: '游戏金币', color: '#FFF0F5' }
    ],
    [OrderCategory.ENTERPRISE]: [
      { id: '5', name: '企业注册', color: '#F0FFF0' },
      { id: '6', name: '财务代理', color: '#FFF8DC' },
      { id: '7', name: '法律咨询', color: '#F5F5DC' },
      { id: '8', name: '营销推广', color: '#FAFAFA' }
    ],
    [OrderCategory.CAMPUS]: [
      { id: '9', name: '校园兼职', color: '#F0FFFF' },
      { id: '10', name: '课程辅导', color: '#FFF5EE' },
      { id: '11', name: '论文润色', color: '#F8F8FF' },
      { id: '12', name: '实习推荐', color: '#F5FFFA' }
    ],
    [OrderCategory.DESIGN]: [
      { id: '13', name: 'UI设计', color: '#FFF0F0' },
      { id: '14', name: 'Logo制作', color: '#F0FFF8' },
      { id: '15', name: 'PPT设计', color: '#F8F0FF' },
      { id: '16', name: '插画绘制', color: '#FFF8F0' }
    ]
  };

  const categoryTags = allTags[category] || [];
  const numTags = Math.floor(Math.random() * 2) + 1; // 1-2个标签
  return categoryTags.slice(0, numTags);
};

// 生成视觉锚点
const generateVisualAnchor = (category: OrderCategory): VisualAnchor => {
  const iconMap = {
    [OrderCategory.GAMING]: 'GameControllerOutlined',
    [OrderCategory.ENTERPRISE]: 'BankOutlined',
    [OrderCategory.CAMPUS]: 'ReadOutlined',
    [OrderCategory.DESIGN]: 'PaletteOutlined'
  };

  const colorMap = {
    [OrderCategory.GAMING]: '#FF6B6B',
    [OrderCategory.ENTERPRISE]: '#4ECDC4',
    [OrderCategory.CAMPUS]: '#45B7D1',
    [OrderCategory.DESIGN]: '#96CEB4'
  };

  return {
    type: 'icon',
    icon: iconMap[category] || 'FileOutlined',
    backgroundColor: colorMap[category] || '#718096'
  };
};

// 生成统计信息
const generateStats = (): OrderStats => ({
  viewingCount: Math.floor(Math.random() * 50) + 1,
  favoriteCount: Math.floor(Math.random() * 20) + 1,
  shareCount: Math.floor(Math.random() * 10) + 1
});

// 订单标题模板
const orderTitles = {
  [OrderCategory.GAMING]: [
    '英雄联盟黄金段位代练',
    '王者荣耀星耀晋级陪玩',
    '原神每日委托代刷',
    '和平精英 sensitivity训练',
    '梦幻西游藏宝阁购买',
    'DNF装备强化辅助',
    'CSGO竞技段位提升',
    '皇室战争皇冠竞技'
  ],
  [OrderCategory.ENTERPRISE]: [
    '公司注册全套服务',
    '企业财务记账外包',
    '商标注册申请代理',
    '工商年检代办服务',
    '企业官网开发建设',
    '营销推广方案策划',
    '法律合同起草审查',
    '公司税务筹划咨询'
  ],
  [OrderCategory.CAMPUS]: [
    '高等数学期末辅导',
    '英语四六级冲刺培训',
    '学术论文润色修改',
    '毕业设计指导协助',
    '校园跑腿代取服务',
    '实习简历制作优化',
    '考研专业课辅导',
    '校园活动策划执行'
  ],
  [OrderCategory.DESIGN]: [
    '公司Logo设计制作',
    '电商详情页设计',
    'PPT美化设计服务',
    '插画绘制定制',
    'UI界面设计外包',
    '海报传单设计',
    '产品包装设计',
    '网站界面设计'
  ]
};

// 生成单个订单
const generateOrder = (category: OrderCategory, status: OrderStatus = OrderStatus.PENDING): OrderItem => {
  const titles = orderTitles[category];
  const title = titles[Math.floor(Math.random() * titles.length)];

  return {
    id: generateId(),
    title,
    description: `专业${category}服务，质量保证，价格优惠`,
    category,
    tags: generateTags(category),
    price: generatePrice(),
    stats: generateStats(),
    visualAnchor: generateVisualAnchor(category),
    status,
    createdAt: generateDate(),
    updatedAt: generateDate(7),
    deadline: generateDate(14),
    location: ['北京', '上海', '广州', '深圳', '杭州'][Math.floor(Math.random() * 5)],
    difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as 'easy' | 'medium' | 'hard'
  };
};

// 生成12个真实感的模拟订单数据
export const mockOrders: OrderItem[] = [
  // 游戏类订单 (3个)
  generateOrder(OrderCategory.GAMING, OrderStatus.PENDING),
  generateOrder(OrderCategory.GAMING, OrderStatus.IN_PROGRESS),
  generateOrder(OrderCategory.GAMING, OrderStatus.PENDING),

  // 企业服务类订单 (3个)
  generateOrder(OrderCategory.ENTERPRISE, OrderStatus.PENDING),
  generateOrder(OrderCategory.ENTERPRISE, OrderStatus.COMPLETED),
  generateOrder(OrderCategory.ENTERPRISE, OrderStatus.PENDING),

  // 校园类订单 (3个)
  generateOrder(OrderCategory.CAMPUS, OrderStatus.PENDING),
  generateOrder(OrderCategory.CAMPUS, OrderStatus.IN_PROGRESS),
  generateOrder(OrderCategory.CAMPUS, OrderStatus.PENDING),

  // 设计类订单 (3个)
  generateOrder(OrderCategory.DESIGN, OrderStatus.PENDING),
  generateOrder(OrderCategory.DESIGN, OrderStatus.COMPLETED),
  generateOrder(OrderCategory.DESIGN, OrderStatus.PENDING)
];

// 过滤器配置
export const filterConfigs = [
  { type: 'comprehensive' as const, label: '综合', sortKey: 'createdAt' as const, order: 'desc' as const },
  { type: 'price' as const, label: '价格', sortKey: 'price' as const, order: 'asc' as const },
  { type: 'newest' as const, label: '最新', sortKey: 'createdAt' as const, order: 'desc' as const }
];

// 工具函数：按价格排序
export const sortByPrice = (orders: OrderItem[], ascending: boolean = true) => {
  return [...orders].sort((a, b) => {
    const aPrice = a.price.integer;
    const bPrice = b.price.integer;
    return ascending ? aPrice - bPrice : bPrice - aPrice;
  });
};

// 工具函数：按时间排序
export const sortByDate = (orders: OrderItem[], newest: boolean = true) => {
  return [...orders].sort((a, b) => {
    const aTime = a.createdAt.getTime();
    const bTime = b.createdAt.getTime();
    return newest ? bTime - aTime : aTime - bTime;
  });
};

// 工具函数：按分类筛选
export const filterByCategory = (orders: OrderItem[], category: OrderCategory) => {
  if (category === OrderCategory.ALL) return orders;
  return orders.filter(order => order.category === category);
};

// 重新导出所有类型，确保导入正确
export type {
  OrderItem,
  OrderTag,
  OrderStats,
  OrderPrice,
  VisualAnchor
};

export {
  OrderStatus,
  OrderCategory
};