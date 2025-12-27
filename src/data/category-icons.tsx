import {
  AndroidOutlined,
  TrophyOutlined,
  GiftOutlined,
  PlayCircleOutlined,
  BankOutlined,
  FileProtectOutlined,
  DollarOutlined,
  BookOutlined,
  ReadOutlined,
  UserOutlined,
  BgColorsOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';

// ==================== 统一分类图标配置 ====================
// 与Hero Section轮播图侧边栏保持一致的图标系统

export interface CategoryIconConfig {
  // 主分类图标
  mainIcon: React.ReactNode;
  // 子分类图标映射
  subcategoryIcons: Record<string, React.ReactNode>;
  // 颜色主题
  colors: {
    primary: string;
    background: string;
  };
}

// 游戏分类图标配置
export const gamingIcons: CategoryIconConfig = {
  mainIcon: <AndroidOutlined />,
  subcategoryIcons: {
    'lol-coaching': <TrophyOutlined />,
    'game-items': <GiftOutlined />,
    'esports-coaching': <PlayCircleOutlined />,
    'default': <AndroidOutlined />
  },
  colors: {
    primary: '#00D4FF',
    background: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)'
  }
};

// 企业服务分类图标配置
export const enterpriseIcons: CategoryIconConfig = {
  mainIcon: <BankOutlined />,
  subcategoryIcons: {
    'company-registration': <FileProtectOutlined />,
    'accounting': <DollarOutlined />,
    'default': <BankOutlined />
  },
  colors: {
    primary: '#1890FF',
    background: 'linear-gradient(135deg, #1890FF 0%, #40A9FF 100%)'
  }
};

// 校园服务分类图标配置
export const campusIcons: CategoryIconConfig = {
  mainIcon: <BookOutlined />,
  subcategoryIcons: {
    'tutoring': <ReadOutlined />,
    'skill-training': <UserOutlined />,
    'default': <BookOutlined />
  },
  colors: {
    primary: '#52C41A',
    background: 'linear-gradient(135deg, #52C41A 0%, #73D13D 100%)'
  }
};

// 设计创作分类图标配置
export const designIcons: CategoryIconConfig = {
  mainIcon: <BgColorsOutlined />,
  subcategoryIcons: {
    'ui-design': <BgColorsOutlined />,
    'video-editing': <VideoCameraOutlined />,
    'default': <BgColorsOutlined />
  },
  colors: {
    primary: '#722ED1',
    background: 'linear-gradient(135deg, #722ED1 0%, #9254DE 100%)'
  }
};

// ==================== 分类图标映射表 ====================

export const categoryIconMap: Record<string, CategoryIconConfig> = {
  gaming: gamingIcons,
  enterprise: enterpriseIcons,
  campus: campusIcons,
  design: designIcons
};

// ==================== 工具函数 ====================

/**
 * 获取分类图标
 * @param category 分类ID
 * @param subcategory 子分类ID (可选)
 * @returns React图标组件
 */
export function getCategoryIcon(category: string, subcategory?: string): React.ReactNode {
  const config = categoryIconMap[category];
  if (!config) {
    return <FileProtectOutlined />; // 默认图标
  }

  if (subcategory && config.subcategoryIcons[subcategory]) {
    return config.subcategoryIcons[subcategory];
  }

  return config.mainIcon;
}

/**
 * 获取分类颜色主题
 * @param category 分类ID
 * @returns 颜色配置对象
 */
export function getCategoryColors(category: string) {
  const config = categoryIconMap[category];
  return config?.colors || {
    primary: '#718096',
    background: 'linear-gradient(135deg, #718096 0%, #4a5568 100%)'
  };
}

/**
 * 获取所有可用分类列表
 * @returns 分类ID数组
 */
export function getAvailableCategories(): string[] {
  return Object.keys(categoryIconMap);
}

/**
 * 验证分类是否存在
 * @param category 分类ID
 * @returns 是否存在
 */
export function isValidCategory(category: string): boolean {
  return category in categoryIconMap;
}

export default categoryIconMap;