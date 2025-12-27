// Hero Section 淘宝风格分类数据结构
// 递归分类树：Category -> SubCategory -> Tags

// 类型定义已移至 src/types/hero-category.ts
import type { Category, CarouselItem } from '../types/hero-category';
import {
  CategoryColorThemes,
  GamingIcon,
  TrophyIcon,
  GiftIcon,
  PlayCircleIcon,
  BankIcon,
  FileProtectIcon,
  DollarIcon,
  BookIcon,
  ReadIcon,
  UserIcon,
  BgColorsIcon,
  VideoCameraIcon
} from './hero-category-constants';

// ==================== 游戏分类详细数据 ====================

export const gamingCategory: Category = {
  id: 'gaming',
  name: '游戏竞技',
  icon: GamingIcon,
  color: CategoryColorThemes.gaming.primary,
  accentColor: CategoryColorThemes.gaming.accent,
  gradient: CategoryColorThemes.gaming.gradient,
  description: '游戏代练、电竞陪练、游戏账号交易',
  megaMenuImage: '/images/gaming-mega-banner.jpg',
  sortOrder: 1,
  active: true,
  subcategories: [
    {
      id: 'lol-coaching',
      name: 'LOL代练',
      icon: TrophyIcon,
      description: '英雄联盟段位提升',
      featured: true,
      tags: [
        { id: 'rank-boost', name: '段位提升', hot: true, count: 2341 },
        { id: 'placement-matches', name: '定位赛', count: 1823 },
        { id: 'win-boost', name: '胜场代练', count: 1567 },
        { id: 'leveling', name: '等级代练', count: 982 }
      ]
    },
    {
      id: 'game-items',
      name: '游戏道具',
      icon: GiftIcon,
      description: '游戏装备、皮肤、道具交易',
      tags: [
        { id: 'skins', name: '皮肤', hot: true, count: 3421 },
        { id: 'weapons', name: '武器', count: 2156 },
        { id: 'currency', name: '游戏币', count: 1876 },
        { id: 'accounts', name: '账号', count: 1234 }
      ]
    },
    {
      id: 'esports-coaching',
      name: '电竞陪练',
      icon: PlayCircleIcon,
      description: '职业选手1对1指导',
      featured: true,
      tags: [
        { id: 'pro-coaching', name: '职业指导', hot: true, count: 876 },
        { id: 'strategy-analysis', name: '战术分析', count: 654 },
        { id: 'mechanics-training', name: '操作训练', count: 543 },
        { id: 'vods-review', name: '录像分析', count: 432 }
      ]
    }
  ],
  featuredItems: [
    {
      id: 'featured-1',
      title: '专业LOL段位提升',
      description: '国服顶尖选手团队，快速提升段位，胜率95%+',
      image: '/images/gaming-banner-1.jpg',
      link: '/gaming/lol-boosting',
      badge: '热门',
      discount: '限时8折',
      rating: 4.9,
      price: '¥50起'
    }
  ]
};

// ==================== 企业服务分类详细数据 ====================

export const enterpriseCategory: Category = {
  id: 'enterprise',
  name: '企业服务',
  icon: BankIcon,
  color: CategoryColorThemes.enterprise.primary,
  accentColor: CategoryColorThemes.enterprise.accent,
  gradient: CategoryColorThemes.enterprise.gradient,
  description: '企业注册、财务代账、法律咨询',
  megaMenuImage: '/images/enterprise-mega-banner.jpg',
  sortOrder: 2,
  active: true,
  subcategories: [
    {
      id: 'company-registration',
      name: '公司注册',
      icon: FileProtectIcon,
      description: '快速公司注册服务',
      featured: true,
      tags: [
        { id: 'limited-company', name: '有限公司', hot: true, count: 3421 },
        { id: 'individual-business', name: '个体户', count: 2156 },
        { id: 'partnership', name: '合伙企业', count: 987 },
        { id: 'foreign-invested', name: '外资企业', count: 654 }
      ]
    },
    {
      id: 'accounting',
      name: '财务代账',
      icon: DollarIcon,
      description: '专业财务代账服务',
      featured: true,
      tags: [
        { id: 'bookkeeping', name: '记账报税', hot: true, count: 2876 },
        { id: 'audit-service', name: '审计服务', count: 1543 },
        { id: 'financial-planning', name: '财务规划', count: 987 },
        { id: 'tax-planning', name: '税务筹划', count: 876 }
      ]
    }
  ],
  featuredItems: [
    {
      id: 'featured-3',
      title: '快速公司注册',
      description: '3天拿证，专业团队全程代办，一站式服务',
      image: '/images/enterprise-banner-1.jpg',
      link: '/enterprise/quick-registration',
      badge: '特惠',
      discount: '新客户立减200元',
      rating: 4.9,
      price: '¥599起'
    }
  ]
};

// ==================== 校园服务分类详细数据 ====================

export const campusCategory: Category = {
  id: 'campus',
  name: '校园服务',
  icon: BookIcon,
  color: CategoryColorThemes.campus.primary,
  accentColor: CategoryColorThemes.campus.accent,
  gradient: CategoryColorThemes.campus.gradient,
  description: '论文指导、技能培训、实习推荐',
  megaMenuImage: '/images/campus-mega-banner.jpg',
  sortOrder: 3,
  active: true,
  subcategories: [
    {
      id: 'tutoring',
      name: '论文辅导',
      icon: ReadIcon,
      description: '学术论文指导服务',
      featured: true,
      tags: [
        { id: 'thesis-writing', name: '毕业论文', hot: true, count: 3210 },
        { id: 'coursework', name: '课程作业', count: 2876 },
        { id: 'research-proposal', name: '研究计划', count: 1543 },
        { id: 'data-analysis', name: '数据分析', count: 987 }
      ]
    },
    {
      id: 'skill-training',
      name: '技能培训',
      icon: UserIcon,
      description: '职业技能提升培训',
      tags: [
        { id: 'programming', name: '编程培训', hot: true, count: 1987 },
        { id: 'language-training', name: '语言培训', count: 1654 },
        { id: 'design-skills', name: '设计技能', count: 1234 },
        { id: 'office-skills', name: '办公技能', count: 987 }
      ]
    }
  ],
  featuredItems: [
    {
      id: 'featured-4',
      title: '毕业论文指导',
      description: '名校博士团队，全程指导修改，保证通过',
      image: '/images/campus-banner-1.jpg',
      link: '/campus/thesis-guidance',
      badge: '专业',
      rating: 4.8,
      price: '¥200起'
    }
  ]
};

// ==================== 设计创作分类详细数据 ====================

export const designCategory: Category = {
  id: 'design',
  name: '设计创作',
  icon: BgColorsIcon,
  color: CategoryColorThemes.design.primary,
  accentColor: CategoryColorThemes.design.accent,
  gradient: CategoryColorThemes.design.gradient,
  description: 'UI设计、平面设计、视频剪辑',
  megaMenuImage: '/images/design-mega-banner.jpg',
  sortOrder: 4,
  active: true,
  subcategories: [
    {
      id: 'ui-design',
      name: 'UI设计',
      icon: BgColorsIcon,
      description: '用户界面设计服务',
      featured: true,
      tags: [
        { id: 'app-ui', name: 'APP界面', hot: true, count: 2432 },
        { id: 'web-ui', name: '网页界面', count: 1876 },
        { id: 'icon-design', name: '图标设计', count: 1543 },
        { id: 'prototype', name: '原型设计', count: 1234 }
      ]
    },
    {
      id: 'video-editing',
      name: '视频剪辑',
      icon: VideoCameraIcon,
      description: '专业视频剪辑服务',
      featured: true,
      tags: [
        { id: 'short-video', name: '短视频', hot: true, count: 1987 },
        { id: 'promotion-video', name: '宣传片', count: 1432 },
        { id: 'vlog-editing', name: 'Vlog剪辑', count: 1098 },
        { id: 'animation', name: '动画制作', count: 876 }
      ]
    }
  ],
  featuredItems: [
    {
      id: 'featured-5',
      title: '专业UI设计',
      description: '资深设计师团队，打造精品界面体验',
      image: '/images/design-banner-1.jpg',
      link: '/design/ui-service',
      badge: '精品',
      rating: 4.9,
      price: '¥500起'
    }
  ]
};

// ==================== 导出数据 ====================

// 导出所有分类数据
export const categoryData: Category[] = [
  gamingCategory,
  enterpriseCategory,
  campusCategory,
  designCategory
];

// 轮播图数据 - 使用高质量渐变和3D效果
export const carouselData: CarouselItem[] = [
  {
    id: 'carousel-1',
    title: '专业游戏代练',
    subtitle: '国服顶尖选手，快速提升段位',
    image: 'none', // 不使用图片，使用纯CSS渐变
    ctaText: '立即体验',
    ctaLink: '/gaming',
    type: 'internal',
    backgroundColor: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 50%, #006699 100%)',
    textColor: '#ffffff',
    overlay: true,
    overlayOpacity: 0.1,
    position: 'left',
    badge: '热门'
  },
  {
    id: 'carousel-2',
    title: '企业服务专家',
    subtitle: '一站式企业服务解决方案',
    image: 'none',
    ctaText: '咨询详情',
    ctaLink: '/enterprise',
    type: 'internal',
    backgroundColor: 'linear-gradient(135deg, #1890FF 0%, #40A9FF 50%, #69c0ff 100%)',
    textColor: '#ffffff',
    overlay: true,
    overlayOpacity: 0.1,
    position: 'center'
  },
  {
    id: 'carousel-3',
    title: '校园生活助手',
    subtitle: '论文、实习、技能提升一站式服务',
    image: 'none',
    ctaText: '探索更多',
    ctaLink: '/campus',
    type: 'internal',
    backgroundColor: 'linear-gradient(135deg, #52C41A 0%, #73D13D 50%, #95de64 100%)',
    textColor: '#ffffff',
    overlay: true,
    overlayOpacity: 0.1,
    position: 'right'
  },
  {
    id: 'carousel-4',
    title: '创意设计服务',
    subtitle: '专业设计团队，打造视觉精品',
    image: 'none',
    ctaText: '查看作品',
    ctaLink: '/design',
    type: 'internal',
    backgroundColor: 'linear-gradient(135deg, #722ED1 0%, #9254DE 50%, #b37feb 100%)',
    textColor: '#ffffff',
    overlay: true,
    overlayOpacity: 0.1,
    position: 'left',
    badge: '推荐'
  }
];