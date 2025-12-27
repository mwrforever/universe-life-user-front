/**
 * HeaderMain组件的类型定义
 * Brand & Search Header模块
 */

export interface SearchCategory {
  key: string;
  label: string;
  value: string;
}

export interface HotSearchTag {
  key: string;
  label: string;
  url?: string;
  onClick?: () => void;
}

export interface HeaderMainProps {
  /** 品牌Logo图片路径 */
  logoSrc?: string;
  /** Logo alt文本 */
  logoAlt?: string;
  /** Logo宽度 */
  logoWidth?: number;
  /** Logo高度 */
  logoHeight?: number;
  /** Logo点击回调 */
  onBrandClick?: () => void;
  /** 搜索分类列表 */
  searchCategories?: SearchCategory[];
  /** 默认选中的搜索分类 */
  defaultCategory?: string;
  /** 热门搜索标签 */
  hotSearchTags?: HotSearchTag[];
  /** 搜索回调 */
  onSearch?: (query: string, category: string) => void;
  /** 发布需求回调 */
  onPostRequest?: () => void;
  /** 我的需求回调 */
  onCartClick?: () => void;
  /** 占位符文本列表（用于循环显示） */
  placeholderTexts?: string[];
  /** 自定义样式类名 */
  className?: string;
}

export interface HeaderMainTheme {
  /** 主色调 */
  primaryColor: string;
  /** 搜索栏边框颜色 */
  searchBorderColor: string;
  /** 搜索栏聚焦边框颜色 */
  searchFocusBorderColor: string;
  /** 搜索按钮背景色 */
  searchButtonBg: string;
  /** 背景色 */
  backgroundColor: string;
}