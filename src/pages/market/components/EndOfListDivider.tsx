import React from 'react';
import styled from '@emotion/styled';

/**
 * "已经到底了"分隔线组件
 * 淘宝风格的列表底部提示组件
 */
const EndOfListContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px 40px;
  width: 100%;
  margin-top: 40px;
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    #e0e0e0 20%,
    #d0d0d0 50%,
    #e0e0e0 80%,
    transparent 100%
  );
  max-width: 200px;
`;

const EndText = styled.div`
  padding: 0 24px;
  color: #999;
  font-size: 14px;
  font-weight: 400;
  white-space: nowrap;
  user-select: none;

  /* 淘宝风格字体 */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
`;

const IconWrapper = styled.div`
  margin: 0 8px;
  color: #ccc;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * EndOfListDivider 属性接口
 */
export interface EndOfListDividerProps {
  /**
   * 显示的文本内容
   * @default "已经到底了"
   */
  text?: string;

  /**
   * 是否显示统计信息
   * @default false
   */
  showStats?: boolean;

  /**
   * 已加载的项目数量
   */
  loadedCount?: number;

  /**
   * 最大项目数量
   */
  maxCount?: number;

  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * EndOfListDivider 组件
 *
 * 智能无限滚动的底部提示组件，支持多种显示模式
 *
 * @example 基础用法
 * ```tsx
 * <EndOfListDivider />
 * ```
 *
 * @example 带统计信息
 * ```tsx
 * <EndOfListDivider
 *   showStats
 *   loadedCount={48}
 *   maxCount={100}
 *   text="已显示全部订单"
 * />
 * ```
 */
const EndOfListDivider: React.FC<EndOfListDividerProps> = ({
  text = "已经到底了",
  showStats = false,
  loadedCount = 0,
  maxCount = 0,
  className
}) => {
  // 根据不同的加载情况显示不同的文本
  const getDisplayText = (): string => {
    if (showStats && loadedCount > 0 && maxCount > 0) {
      if (loadedCount >= maxCount) {
        return `最多展示${maxCount}条`;
      } else {
        return `已加载${loadedCount}条，共${maxCount}条`;
      }
    }
    return text;
  };

  const displayText = getDisplayText();

  return (
    <EndOfListContainer className={className}>
      <DividerLine />
      <EndText>
        {showStats && loadedCount > 0 && (
          <IconWrapper>
            📋
          </IconWrapper>
        )}
        {displayText}
        {showStats && loadedCount >= maxCount && (
          <IconWrapper>
            ✨
          </IconWrapper>
        )}
      </EndText>
      <DividerLine />
    </EndOfListContainer>
  );
};

export default EndOfListDivider;