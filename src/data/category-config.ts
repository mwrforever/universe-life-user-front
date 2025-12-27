// Universe Life 万象生活 - 分类配置数据
// 完全独立的类型定义，避免任何导入问题

// ==================== 主题配置导入 ====================

import { categoryThemes } from '@/theme/themeConfig';

// ==================== 类型定义 ====================

export interface CategoryFieldOption {
  label: string;
  value: string;
  description?: string;
}

export interface CategoryField {
  id: string;
  key: string;
  label: string;
  type: 'select' | 'input' | 'textarea' | 'number' | 'date' | 'multiselect';
  required: boolean;
  options?: CategoryFieldOption[];
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface OrderCategory {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    gradient: string;
    visualStyle: 'cyberpunk' | 'professional' | 'minimalist' | 'artistic';
  };
  fields: CategoryField[];
  isActive: boolean;
  orderCount: number;
}

// ==================== 游戏电竞分类 ====================

const gamingCategory: OrderCategory = {
  id: 'gaming-esports',
  name: '游戏电竞',
  nameEn: 'Gaming & Esports',
  description: '专业游戏服务，从代练到账号交易，涵盖所有热门游戏',
  icon: '🎮',
  theme: {
    primaryColor: categoryThemes.gaming.colors.primary,
    secondaryColor: categoryThemes.gaming.colors.secondary,
    gradient: categoryThemes.gaming.gradients.primary,
    visualStyle: 'cyberpunk',
  },
  fields: [
    {
      id: 'game-type',
      key: 'gameType',
      label: '游戏类型',
      type: 'select',
      required: true,
      options: [
        { label: '英雄联盟 (LOL)', value: 'lol', description: '召唤师峡谷服务' },
        { label: '原神', value: 'genshin', description: '提瓦特大陆冒险' },
        { label: '王者荣耀', value: 'honor-of-kings', description: '王者峡谷争霸' },
        { label: '绝地求生 (PUBG)', value: 'pubg', description: '生存射击游戏' },
        { label: 'CS:GO/CS2', value: 'cs', description: '反恐精英竞技' },
        { label: 'DOTA 2', value: 'dota2', description: '多人在线战术竞技' },
        { label: '守望先锋', value: 'overwatch', description: '团队射击游戏' },
        { label: '其他', value: 'other', description: '其他游戏' },
      ],
    },
    {
      id: 'service-type',
      key: 'serviceType',
      label: '服务类型',
      type: 'select',
      required: true,
      options: [
        { label: '游戏代练', value: 'power-leveling', description: '提升段位/等级' },
        { label: '账号交易', value: 'account-trading', description: '买卖游戏账号' },
        { label: '游戏陪玩', value: 'game-companion', description: '一起游戏娱乐' },
        { label: '游戏指导', value: 'coaching', description: '技术指导教学' },
        { label: '道具交易', value: 'item-trading', description: '游戏道具买卖' },
        { label: '战队招募', value: 'team-recruitment', description: '寻找队友加入' },
        { label: '赛事服务', value: 'tournament', description: '电竞赛事相关' },
      ],
    },
    {
      id: 'urgency',
      key: 'urgency',
      label: '紧急程度',
      type: 'select',
      required: true,
      options: [
        { label: '普通 (7-14天)', value: 'normal' },
        { label: '加急 (3-7天)', value: 'urgent' },
        { label: '特急 (1-3天)', value: 'super-urgent' },
        { label: '极速 (24小时内)', value: 'express' },
      ],
    },
  ],
  isActive: true,
  orderCount: 2540,
};

// ==================== 企业项目分类 ====================

const enterpriseCategory: OrderCategory = {
  id: 'enterprise-projects',
  name: '企业项目',
  nameEn: 'Enterprise Projects',
  description: '专业企业服务，系统开发、技术咨询、项目外包',
  icon: '💼',
  theme: {
    primaryColor: categoryThemes.enterprise.colors.primary,
    secondaryColor: categoryThemes.enterprise.colors.secondary,
    gradient: categoryThemes.enterprise.gradients.primary,
    visualStyle: 'professional',
  },
  fields: [
    {
      id: 'project-type',
      key: 'projectType',
      label: '项目类型',
      type: 'select',
      required: true,
      options: [
        { label: 'ERP系统', value: 'erp', description: '企业资源规划系统' },
        { label: 'CRM系统', value: 'crm', description: '客户关系管理系统' },
        { label: '网站开发', value: 'website', description: '企业官网、门户' },
        { label: '移动应用', value: 'mobile-app', description: 'iOS/Android应用' },
        { label: '数据分析', value: 'data-analysis', description: '大数据分析平台' },
        { label: '人工智能', value: 'ai', description: 'AI/机器学习项目' },
        { label: '其他', value: 'other', description: '其他企业项目' },
      ],
    },
    {
      id: 'tech-stack',
      key: 'techStack',
      label: '技术栈',
      type: 'multiselect',
      required: true,
      options: [
        { label: 'Java', value: 'java' },
        { label: 'Python', value: 'python' },
        { label: 'JavaScript/TypeScript', value: 'javascript' },
        { label: 'React/Vue/Angular', value: 'frontend' },
        { label: 'Node.js', value: 'nodejs' },
        { label: 'PHP', value: 'php' },
        { label: '.NET', value: 'dotnet' },
        { label: 'Go', value: 'go' },
      ],
    },
    {
      id: 'dev-cycle',
      key: 'devCycle',
      label: '开发周期',
      type: 'select',
      required: true,
      options: [
        { label: '1个月内', value: '1-month' },
        { label: '3个月内', value: '3-months' },
        { label: '6个月内', value: '6-months' },
        { label: '1年内', value: '1-year' },
        { label: '1年以上', value: 'more-than-1-year' },
        { label: '长期合作', value: 'long-term' },
      ],
    },
  ],
  isActive: true,
  orderCount: 1890,
};

// ==================== 校园咨询分类 ====================

const academicCategory: OrderCategory = {
  id: 'academic-campus',
  name: '校园咨询',
  nameEn: 'Academic/Campus',
  description: '专业学术服务，论文辅导、课程咨询、考试指导',
  icon: '📚',
  theme: {
    primaryColor: categoryThemes.academic.colors.primary,
    secondaryColor: categoryThemes.academic.colors.secondary,
    gradient: categoryThemes.academic.gradients.primary,
    visualStyle: 'minimalist',
  },
  fields: [
    {
      id: 'subject',
      key: 'subject',
      label: '学科领域',
      type: 'select',
      required: true,
      options: [
        { label: '数学', value: 'mathematics' },
        { label: '物理', value: 'physics' },
        { label: '化学', value: 'chemistry' },
        { label: '生物', value: 'biology' },
        { label: '计算机科学', value: 'computer-science' },
        { label: '经济学', value: 'economics' },
        { label: '管理学', value: 'management' },
        { label: '文学', value: 'literature' },
        { label: '其他', value: 'other' },
      ],
    },
    {
      id: 'consultation-type',
      key: 'consultationType',
      label: '咨询类型',
      type: 'select',
      required: true,
      options: [
        { label: '论文写作指导', value: 'thesis-writing', description: '毕业论文、学术写作' },
        { label: '作业辅导', value: 'homework-tutoring', description: '课后作业、难题解答' },
        { label: '考试复习', value: 'exam-prep', description: '期末考试、资格考试' },
        { label: '课程补习', value: 'course-tutoring', description: '日常课程辅导' },
        { label: '留学申请', value: 'study-abroad', description: '文书、面试指导' },
        { label: '职业规划', value: 'career-planning', description: '就业指导、简历优化' },
      ],
    },
    {
      id: 'education-level',
      key: 'educationLevel',
      label: '教育阶段',
      type: 'select',
      required: true,
      options: [
        { label: '小学', value: 'elementary' },
        { label: '初中', value: 'middle-school' },
        { label: '高中', value: 'high-school' },
        { label: '本科', value: 'undergraduate' },
        { label: '硕士', value: 'master' },
        { label: '博士', value: 'phd' },
        { label: '职业教育', value: 'vocational' },
      ],
    },
  ],
  isActive: true,
  orderCount: 3120,
};

// ==================== 设计多媒体分类 ====================

const designCategory: OrderCategory = {
  id: 'design-multimedia',
  name: '设计多媒体',
  nameEn: 'Design & Multimedia',
  description: '创意设计服务，品牌设计、UI/UX、多媒体制作',
  icon: '🎨',
  theme: {
    primaryColor: categoryThemes.design.colors.primary,
    secondaryColor: categoryThemes.design.colors.secondary,
    gradient: categoryThemes.design.gradients.primary,
    visualStyle: 'artistic',
  },
  fields: [
    {
      id: 'design-type',
      key: 'designType',
      label: '设计类型',
      type: 'select',
      required: true,
      options: [
        { label: '品牌设计', value: 'branding', description: 'Logo、VI系统' },
        { label: 'UI/UX设计', value: 'ui-ux', description: '界面设计、用户体验' },
        { label: '平面设计', value: 'graphic', description: '海报、宣传册、名片' },
        { label: '网页设计', value: 'web-design', description: '网站页面设计' },
        { label: '插画设计', value: 'illustration', description: '手绘、数字插画' },
        { label: '动效设计', value: 'motion', description: '动画、特效制作' },
        { label: '3D建模', value: '3d-modeling', description: '三维建模渲染' },
        { label: '视频剪辑', value: 'video-editing', description: '视频制作、剪辑' },
        { label: '其他', value: 'other', description: '其他设计服务' },
      ],
    },
    {
      id: 'style-preference',
      key: 'stylePreference',
      label: '风格偏好',
      type: 'select',
      required: true,
      options: [
        { label: '简约现代', value: 'minimalist' },
        { label: '复古经典', value: 'vintage' },
        { label: '科技未来', value: 'tech-future' },
        { label: '自然有机', value: 'organic' },
        { label: '商务专业', value: 'corporate' },
        { label: '创意个性', value: 'creative' },
        { label: '奢华高端', value: 'luxury' },
        { label: '可爱卡哇伊', value: 'cute' },
      ],
    },
    {
      id: 'deliverable-format',
      key: 'deliverableFormat',
      label: '交付格式',
      type: 'multiselect',
      required: true,
      options: [
        { label: 'JPG/PNG图片', value: 'images' },
        { label: 'PDF文档', value: 'pdf' },
        { label: 'AI/PSD源文件', value: 'source-files' },
        { label: 'SVG矢量图', value: 'svg' },
        { label: 'MP4视频', value: 'video' },
        { label: 'GIF动图', value: 'gif' },
        { label: 'Figma/Sketch', value: 'design-software' },
      ],
    },
  ],
  isActive: true,
  orderCount: 2780,
};

// ==================== 导出配置 ====================

export const ORDER_CATEGORIES = {
  'gaming-esports': gamingCategory,
  'enterprise-projects': enterpriseCategory,
  'academic-campus': academicCategory,
  'design-multimedia': designCategory,
} as const;

export const ORDER_CATEGORIES_ARRAY: OrderCategory[] = Object.values(ORDER_CATEGORIES);

// ==================== 便捷函数 ====================

/**
 * 获取分类配置
 */
export function getCategoryConfig(categoryId: string): OrderCategory | undefined {
  return ORDER_CATEGORIES[categoryId as keyof typeof ORDER_CATEGORIES];
}

/**
 * 获取分类配置选项
 */
export function getCategoryOptions() {
  return ORDER_CATEGORIES_ARRAY.map(category => ({
    value: category.id,
    label: category.name,
    description: category.description,
    icon: category.icon,
    orderCount: category.orderCount,
    theme: category.theme,
  }));
}

/**
 * 根据ID获取分类字段
 */
export function getCategoryFields(categoryId: string): OrderCategory['fields'] {
  const category = getCategoryConfig(categoryId);
  return category?.fields || [];
}

/**
 * 获取分类主题
 */
export function getCategoryThemeConfig(categoryId: string) {
  const category = getCategoryConfig(categoryId);
  return category?.theme;
}

/**
 * 模拟分类统计数据
 */
export function getCategoryStatistics() {
  return ORDER_CATEGORIES_ARRAY.map(category => ({
    id: category.id,
    name: category.name,
    orderCount: category.orderCount,
    activeProjects: Math.floor(category.orderCount * 0.7),
    completedProjects: Math.floor(category.orderCount * 0.25),
    totalValue: Math.floor(category.orderCount * Math.random() * 5000) + 10000,
    averageBudget: Math.floor(Math.random() * 2000) + 500,
    trending: Math.random() > 0.5,
  }));
}
