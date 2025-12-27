import React, { useState } from 'react';
import styled from '@emotion/styled';
import type { Category } from '../../../types/hero-category';
import { CategoryColorThemes } from '../../../data/hero-category-constants';

// ==================== 样式化组件 ====================

// 左侧浮动白色卡片容器
const FloatingCardContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  padding: 16px 0;
  height: 400px;
  overflow: hidden; /* 移除所有滚动 */
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
    border-radius: 16px;
    pointer-events: none;
  }

  /* 悬停时轻微上浮效果 */
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.12);
  }
`;

// 分类项容器
const CategoryItem = styled.div<{
  $active?: boolean;
  $color: string;
  $accentColor?: string;
}>`
  display: flex;
  align-items: center;
  padding: 22px 24px; /* 调整为22px，4个分类刚好填满400px高度 */
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 0;
  position: relative;
  background: transparent;
  flex: 1; /* 让每个分类项均分剩余空间 */

  /* 悬停效果 */
  &:hover {
    background: ${props => props.$color}10;
    transform: translateX(8px);

    /* 添加发光效果 */
    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: ${props => props.$color};
      box-shadow: ${props => props.$accentColor || props.$color} 0 0 10px;
    }
  }

  /* 激活状态 */
  ${props => props.$active && `
    background: ${props.$color}15;
    border-left: 4px solid ${props.$color};
    transform: translateX(4px);

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: ${props.$color};
      box-shadow: ${props.$accentColor || props.$color} 0 0 15px;
    }
  `}

  /* 添加选中状态的背景渐变 */
  &:hover {
    background: linear-gradient(90deg, ${props => props.$color}15 0%, transparent 100%);
  }
`;

// 分类图标容器
const CategoryIcon = styled.div<{
  $color: string;
  $active?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${props => props.$color}10;
  margin-right: 16px;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  font-size: 20px;

  /* 激活状态的图标背景 */
  ${props => props.$active && `
    background: ${props.$color}20;
    box-shadow: ${props.$color}30 0 4px 12px;
  `}

  /* 悬停效果 */
  ${CategoryItem}:hover & {
    background: ${props => props.$color}20;
    transform: scale(1.05);
    box-shadow: ${props => props.$color}25 0 4px 12px;
  }
`;

// 分类内容区域
const CategoryContent = styled.div`
  flex: 1;
  min-width: 0;
`;

// 分类名称
const CategoryName = styled.div<{
  $active?: boolean;
  $color: string;
}>`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.$active ? props.$color : '#1a1a1a'};
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s ease;

  ${CategoryItem}:hover & {
    color: ${props => props.$color};
    font-weight: 700;
  }
`;

// 分类描述
const CategoryDescription = styled.div<{
  $active?: boolean;
}>`
  font-size: 12px;
  color: ${props => props.$active ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s ease;

  ${CategoryItem}:hover & {
    color: rgba(0, 0, 0, 0.7);
  }
`;

// 悬停指示器
const HoverIndicator = styled.div<{ $color: string }>`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: ${props => props.$color};

  ${CategoryItem}:hover & {
    opacity: 1;
    transform: translateY(-50%) translateX(4px);
  }
`;

// 无形hit-area用于解决间隙问题，扩展到Mega Panel宽度
const HitArea = styled.div`
  position: absolute;
  top: 0;
  right: -880px; /* 扩展到覆盖整个Mega Panel区域 */
  width: 880px; /* 匹配Mega Panel宽度 + 间距 */
  height: 100%;
  z-index: 10;
  pointer-events: auto;
`;

// ==================== 组件Props ====================

interface CategoryNavProps {
  categories: Category[];
  activeCategory?: string;
  onCategoryClick?: (category: Category) => void;
  onCategoryHover?: (category: Category | null) => void;
  showMegaMenu?: boolean;
}

// ==================== CategoryNav组件 ====================

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  activeCategory,
  onCategoryClick,
  onCategoryHover,
  showMegaMenu = true
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [mouseLeaveTimer, setMouseLeaveTimer] = useState<NodeJS.Timeout | null>(null);

  const handleCategoryClick = (category: Category) => {
    onCategoryClick?.(category);
  };

  const handleMouseEnter = (category: Category) => {
    // 清除之前的延迟隐藏
    if (mouseLeaveTimer) {
      clearTimeout(mouseLeaveTimer);
      setMouseLeaveTimer(null);
    }

    setHoveredCategory(category.id);
    if (showMegaMenu) {
      onCategoryHover?.(category);
    }
  };

  const handleMouseLeave = () => {
    setHoveredCategory(null);

    if (showMegaMenu) {
      // 延迟隐藏mega menu，给用户时间移动到菜单上
      const timer = setTimeout(() => {
        onCategoryHover?.(null);
      }, 150); // 减少到150ms，提高响应性

      setMouseLeaveTimer(timer);
    }
  };

  // 组件卸载时清理定时器
  React.useEffect(() => {
    return () => {
      if (mouseLeaveTimer) {
        clearTimeout(mouseLeaveTimer);
      }
    };
  }, [mouseLeaveTimer]);

  return (
    <FloatingCardContainer
      onMouseLeave={handleMouseLeave}
    >
      {categories.map((category) => {
        const isActive = activeCategory === category.id || hoveredCategory === category.id;
        const themeColors = CategoryColorThemes[category.id as keyof typeof CategoryColorThemes];

        return (
          <CategoryItem
            key={category.id}
            $active={isActive}
            $color={category.color}
            $accentColor={category.accentColor || themeColors?.accent}
            onClick={() => handleCategoryClick(category)}
            onMouseEnter={() => handleMouseEnter(category)}
            // 移除入场动画以提高FCP性能
            // style={{
            //   animation: `slideInLeft 0.4s ease-out ${index * 0.1}s both`
            // }}
          >
            <CategoryIcon
              $color={category.color}
              $active={isActive}
            >
              {category.icon}
            </CategoryIcon>

            <CategoryContent>
              <CategoryName
                $active={isActive}
                $color={category.color}
              >
                {category.name}
              </CategoryName>
              {category.description && (
                <CategoryDescription $active={isActive}>
                  {category.description}
                </CategoryDescription>
              )}
            </CategoryContent>

            <HoverIndicator $color={category.color}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M6 3l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </HoverIndicator>

            {/* 无形hit-area解决间隙问题 */}
            {showMegaMenu && (
              <HitArea
                onMouseEnter={() => handleMouseEnter(category)}
              />
            )}
          </CategoryItem>
        );
      })}

      {/* 添加CSS动画 */}
      <style jsx global>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </FloatingCardContainer>
  );
};

export default CategoryNav;