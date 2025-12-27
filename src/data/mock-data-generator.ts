import type {
  OrderItem,
  OrderStatus,
  OrderTag,
  OrderStats,
  OrderPrice,
  VisualAnchor
} from '../types/order.types';

/**
 * Mock Data Generator - 智能无限滚动数据生成器
 * 支持100条订单数据的分批生成
 */
export class MockDataGenerator {
  private static readonly MAX_TOTAL_ITEMS = 100;
  private static readonly BATCH_SIZE = 12;

  // 缓存已生成的数据，避免重复计算
  private static cachedData: OrderItem[] | null = null;

  /**
   * 生成指定范围的订单数据
   * @param offset 起始偏移量
   * @param limit 需要生成的数量
   * @returns 订单数据数组
   */
  static generateOrders(offset: number = 0, limit: number = this.BATCH_SIZE): OrderItem[] {
    // 确保不超过最大数量限制
    const actualLimit = Math.min(limit, this.MAX_TOTAL_ITEMS - offset);
    if (actualLimit <= 0) {
      return [];
    }

    // 如果没有缓存，生成完整数据集
    if (!this.cachedData) {
      this.cachedData = this.generateCompleteDataset();
    }

    // 返回指定范围的数据
    return this.cachedData.slice(offset, offset + actualLimit);
  }

  /**
   * 生成完整的100条订单数据集
   * @returns 完整的订单数据数组
   */
  private static generateCompleteDataset(): OrderItem[] {
    const allOrders: OrderItem[] = [];
    const allCategories = [
      'gaming',
      'enterprise',
      'campus',
      'design'
    ] as const;

    const itemsPerCategory = Math.floor(this.MAX_TOTAL_ITEMS / allCategories.length);
    const remainingItems = this.MAX_TOTAL_ITEMS % allCategories.length;

    let currentOffset = 0;

    allCategories.forEach((category, categoryIndex) => {
      const itemsInThisCategory = itemsPerCategory + (categoryIndex < remainingItems ? 1 : 0);

      for (let i = 0; i < itemsInThisCategory; i++) {
        const order = this.generateOrderWithIndex(category, currentOffset + i);
        allOrders.push(order);
      }

      currentOffset += itemsInThisCategory;
    });

    // 按创建时间倒序排列（最新的在前）
    return allOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * 生成带索引的订单（确保数据多样性）
   * @param category 订单分类
   * @param index 索引值
   * @returns 订单对象
   */
  private static generateOrderWithIndex(category: 'gaming' | 'enterprise' | 'campus' | 'design', index: number): OrderItem {
    const id = `order_${category}_${String(index + 1).padStart(3, '0')}`;

    // 使用索引创建更多样化的数据
    const seed = index % 8; // 8种变化
    const statuses = [OrderStatus.PENDING, OrderStatus.IN_PROGRESS, OrderStatus.COMPLETED];
    const status = statuses[seed % statuses.length];

    // 根据索引生成不同的价格区间
    const priceRanges = [
      { min: 50, max: 200 },    // 低价格
      { min: 200, max: 500 },   // 中低价格
      { min: 500, max: 1000 },  // 中高价格
      { min: 1000, max: 2000 }  // 高价格
    ];
    const priceRange = priceRanges[seed % priceRanges.length];

    const order = this.createOrder(id, category, status, priceRange);

    // 为不同索引的订单添加一些变化
    if (index % 10 === 0) {
      // 每10个订单增加一个热门订单
      order.stats.viewingCount *= 3;
      order.stats.favoriteCount *= 2;
    }

    if (index % 15 === 0) {
      // 每15个订单设置较短的截止日期
      const shortDeadline = new Date();
      shortDeadline.setDate(shortDeadline.getDate() + Math.floor(Math.random() * 3) + 1);
      order.deadline = shortDeadline;
    }

    return order;
  }

  /**
   * 创建单个订单
   * @param id 订单ID
   * @param category 分类
   * @param status 状态
   * @param priceRange 价格范围
   * @returns 订单对象
   */
  private static createOrder(
    id: string,
    category: 'gaming' | 'enterprise' | 'campus' | 'design',
    status: OrderStatus,
    priceRange: { min: number; max: number }
  ): OrderItem {
    const titles = this.getTitlesByCategory(category);
    const title = titles[Math.floor(Math.random() * titles.length)];

    return {
      id,
      title,
      description: `专业${this.getCategoryDisplayName(category)}服务，质量保证，价格优惠，经验丰富`,
      category,
      tags: this.generateTags(category),
      price: this.generatePrice(priceRange.min, priceRange.max),
      stats: this.generateStats(),
      visualAnchor: this.generateVisualAnchor(category),
      status,
      createdAt: this.generateDate(30),
      updatedAt: this.generateDate(7),
      deadline: this.generateDate(14),
      location: ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安'][Math.floor(Math.random() * 8)],
      difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as 'easy' | 'medium' | 'hard'
    };
  }

  /**
   * 根据分类获取标题列表
   * @param category 分类
   * @returns 标题列表
   */
  private static getTitlesByCategory(category: 'gaming' | 'enterprise' | 'campus' | 'design'): string[] {
    const titleMap = {
      gaming: [
        '英雄联盟黄金段位代练',
        '王者荣耀星耀晋级陪玩',
        '原神每日委托代刷',
        '和平精英灵敏度训练',
        '梦幻西游藏宝阁购买',
        'DNF装备强化辅助',
        'CSGO竞技段位提升',
        '皇室战争皇冠竞技',
        '穿越火线段位提升',
        'QQ飞车手游代练',
        '明日方舟关卡助战',
        '崩坏3rd深渊突破'
      ],
      enterprise: [
        '公司注册全套服务',
        '企业财务记账外包',
        '商标注册申请代理',
        '工商年检代办服务',
        '企业官网开发建设',
        '营销推广方案策划',
        '法律合同起草审查',
        '公司税务筹划咨询',
        'ISO体系认证辅导',
        '股权架构设计咨询',
        '企业融资计划书',
        '商业计划书撰写'
      ],
      campus: [
        '高等数学期末辅导',
        '英语四六级冲刺培训',
        '学术论文润色修改',
        '毕业设计指导协助',
        '校园跑腿代取服务',
        '实习简历制作优化',
        '考研专业课辅导',
        '校园活动策划执行',
        '数据收集与分析',
        '问卷调查代填写',
        '课程设计代做',
        '实验报告撰写'
      ],
      design: [
        '公司Logo设计制作',
        '电商详情页设计',
        'PPT美化设计服务',
        '插画绘制定制',
        'UI界面设计外包',
        '海报传单设计',
        '产品包装设计',
        '网站界面设计',
        '短视频剪辑制作',
        '动漫角色设计',
        '室内装修效果图',
        '品牌VI设计全套'
      ]
    };

    return titleMap[category] || ['通用服务项目'];
  }

  /**
   * 获取分类显示名称
   * @param category 分类
   * @returns 显示名称
   */
  private static getCategoryDisplayName(category: 'gaming' | 'enterprise' | 'campus' | 'design'): string {
    const nameMap = {
      gaming: '游戏',
      enterprise: '企业服务',
      campus: '校园',
      design: '设计'
    };
    return nameMap[category] || '服务';
  }

  /**
   * 生成随机标签
   * @param category 分类
   * @returns 标签数组
   */
  private static generateTags(category: 'gaming' | 'enterprise' | 'campus' | 'design'): OrderTag[] {
    const allTags = {
      gaming: [
        { id: '1', name: 'LOL代练', color: '#FFE4E1' },
        { id: '2', name: '游戏陪玩', color: '#F0E6FF' },
        { id: '3', name: '账号交易', color: '#E6F7FF' },
        { id: '4', name: '游戏金币', color: '#FFF0F5' },
        { id: '17', name: '段位提升', color: '#F0FFF0' },
        { id: '18', name: '装备强化', color: '#FFF8DC' }
      ],
      enterprise: [
        { id: '5', name: '企业注册', color: '#F0FFF0' },
        { id: '6', name: '财务代理', color: '#FFF8DC' },
        { id: '7', name: '法律咨询', color: '#F5F5DC' },
        { id: '8', name: '营销推广', color: '#FAFAFA' },
        { id: '19', name: '工商代办', color: '#F0FFFF' },
        { id: '20', name: '税务筹划', color: '#FFF5EE' }
      ],
      campus: [
        { id: '9', name: '校园兼职', color: '#F0FFFF' },
        { id: '10', name: '课程辅导', color: '#FFF5EE' },
        { id: '11', name: '论文润色', color: '#F8F8FF' },
        { id: '12', name: '实习推荐', color: '#F5FFFA' },
        { id: '21', name: '考研辅导', color: '#FFF0F0' },
        { id: '22', name: '数据分析', color: '#F0FFF8' }
      ],
      design: [
        { id: '13', name: 'UI设计', color: '#FFF0F0' },
        { id: '14', name: 'Logo制作', color: '#F0FFF8' },
        { id: '15', name: 'PPT设计', color: '#F8F0FF' },
        { id: '16', name: '插画绘制', color: '#FFF8F0' },
        { id: '23', name: '品牌设计', color: '#F8F8FF' },
        { id: '24', name: '视频剪辑', color: '#F5FFFA' }
      ]
    };

    const categoryTags = allTags[category] || [];
    const numTags = Math.floor(Math.random() * 2) + 1; // 1-2个标签
    return categoryTags.slice(0, numTags);
  }

  /**
   * 生成价格
   * @param min 最小价格
   * @param max 最大价格
   * @returns 价格对象
   */
  private static generatePrice(min: number, max: number): OrderPrice {
    const integer = Math.floor(Math.random() * (max - min + 1)) + min;
    return {
      symbol: '¥',
      integer,
      decimal: '.00',
      currency: 'CNY'
    };
  }

  /**
   * 生成统计信息
   * @returns 统计信息对象
   */
  private static generateStats(): OrderStats {
    return {
      viewingCount: Math.floor(Math.random() * 50) + 1,
      favoriteCount: Math.floor(Math.random() * 20) + 1,
      shareCount: Math.floor(Math.random() * 10) + 1
    };
  }

  /**
   * 生成视觉锚点
   * @param category 分类
   * @returns 视觉锚点对象
   */
  private static generateVisualAnchor(category: 'gaming' | 'enterprise' | 'campus' | 'design'): VisualAnchor {
    const iconMap = {
      gaming: 'GameControllerOutlined',
      enterprise: 'BankOutlined',
      campus: 'ReadOutlined',
      design: 'PaletteOutlined'
    };

    const colorMap = {
      gaming: '#FF6B6B',
      enterprise: '#4ECDC4',
      campus: '#45B7D1',
      design: '#96CEB4'
    };

    return {
      type: 'icon',
      icon: iconMap[category] || 'FileOutlined',
      backgroundColor: colorMap[category] || '#718096'
    };
  }

  /**
   * 生成随机日期
   * @param daysAgo 多少天前
   * @returns 日期对象
   */
  private static generateDate(daysAgo: number = 30): Date {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
    return date;
  }

  /**
   * 获取批次大小
   * @returns 批次大小
   */
  static getBatchSize(): number {
    return this.BATCH_SIZE;
  }

  /**
   * 获取最大条目数
   * @returns 最大条目数
   */
  static getMaxItems(): number {
    return this.MAX_TOTAL_ITEMS;
  }

  /**
   * 检查是否还有更多数据
   * @param currentCount 当前已加载数量
   * @returns 是否还有更多数据
   */
  static hasMoreData(currentCount: number): boolean {
    return currentCount < this.MAX_TOTAL_ITEMS;
  }

  /**
   * 清除缓存的数据
   */
  static clearCache(): void {
    this.cachedData = null;
  }
}

export default MockDataGenerator;