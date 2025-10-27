// 万象生活底栏多语言系统入口

export { useFooterLocale, createFooterLocale, getFooterTranslation } from './useFooterLocale';
export type { FooterLocaleType, FooterLocaleKeys, FooterLocalePath } from './types';

// 导出语言包（供外部直接使用）
import zhCN from './zh-CN.json';
import enUS from './en-US.json';

export { zhCN, enUS };

// 默认导出
export default useFooterLocale;