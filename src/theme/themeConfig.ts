/**
 * 主题配置文件
 * 为分类配置提供颜色和样式主题
 */

export const categoryThemes = {
  gaming: {
    colors: {
      primary: '#ff6000',
      secondary: '#ff8c00',
      accent: '#ff4500',
      background: '#fff5f0',
      text: '#262626'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #ff6000 0%, #ff8c00 100%)',
      card: 'linear-gradient(135deg, #fff5f0 0%, #ffe7d9 100%)',
      button: 'linear-gradient(135deg, #ff6000 0%, #ff4500 100%)'
    }
  },
  enterprise: {
    colors: {
      primary: '#1890ff',
      secondary: '#40a9ff',
      accent: '#096dd9',
      background: '#f0f8ff',
      text: '#262626'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
      card: 'linear-gradient(135deg, #f0f8ff 0%, #e6f4ff 100%)',
      button: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)'
    }
  },
  academic: {
    colors: {
      primary: '#52c41a',
      secondary: '#73d13d',
      accent: '#389e0d',
      background: '#f6ffed',
      text: '#262626'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
      card: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
      button: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)'
    }
  },
  design: {
    colors: {
      primary: '#722ed1',
      secondary: '#9254de',
      accent: '#531dab',
      background: '#f9f0ff',
      text: '#262626'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
      card: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
      button: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)'
    }
  }
};

// 分类ID到主题key的映射
const categoryIdToThemeKey: Record<string, keyof typeof categoryThemes> = {
  'gaming': 'gaming',
  'game': 'gaming',
  'enterprise': 'enterprise',
  'business': 'enterprise',
  'campus': 'academic',
  'academic': 'academic',
  'design': 'design',
  'creative': 'design',
};

// 默认主题
const defaultTheme = {
  colors: {
    primary: '#ff6000',
    secondary: '#ff8c00',
    accent: '#ff4500',
    background: '#ffffff',
    text: '#262626',
    border: '#e2e8f0',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #ff6000 0%, #ff8c00 100%)',
    card: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    button: 'linear-gradient(135deg, #ff6000 0%, #ff4500 100%)',
  },
  typography: {
    headingFont: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
};

/**
 * 根据分类ID获取对应的主题配置
 */
export function getCategoryTheme(categoryId: string | null | undefined) {
  if (!categoryId) return defaultTheme;
  
  const themeKey = categoryIdToThemeKey[categoryId.toLowerCase()];
  if (!themeKey) return defaultTheme;
  
  const theme = categoryThemes[themeKey];
  return {
    ...theme,
    colors: {
      ...theme.colors,
      border: '#e2e8f0',
    },
    typography: {
      headingFont: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
  };
}

export default categoryThemes;