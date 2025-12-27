import React, { useState } from 'react';
import styled from '@emotion/styled';

// 内联类型定义，避免导入问题
interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description?: string;
  subcategories?: Subcategory[];
  featuredItems?: FeaturedItem[];
}

interface Subcategory {
  id: string;
  name: string;
  icon?: React.ReactNode;
  link?: string;
}

interface FeaturedItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  badge?: string;
}

// 样式化组件
const SidebarContainer = styled.div`
  background: white;
  border-radius: 16px 0 0 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  padding: 20px 0;
  height: 400px;
  overflow-y: auto;
  position: relative;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 2px;
  }
`;

const CategoryItem = styled.div<{ $active?: boolean; $color: string }>`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 0;
  position: relative;

  &:hover {
    background: ${props => props.$color}10;
    transform: translateX(4px);
  }

  ${props => props.$active && `
    background: ${props.$color}15;
    border-left: 4px solid ${props.$color};

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: ${props.$color};
    }
  `}
`;

const CategoryIcon = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${props => props.$color}10;
  margin-right: 16px;
  flex-shrink: 0;

  svg {
    color: ${props => props.$color};
  }
`;

const CategoryContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const CategoryName = styled.div<{ $active?: boolean; $color: string }>`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.$active ? props.$color : '#1a1a1a'};
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CategoryDescription = styled.div<{ $active?: boolean }>`
  font-size: 12px;
  color: ${props => props.$active ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const HoverIndicator = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.3s ease;

  ${CategoryItem}:hover & {
    opacity: 1;
  }
`;

// 组件Props接口
interface CategorySidebarProps {
  categories: Category[];
  activeCategory?: string;
  onCategoryClick?: (category: Category) => void;
  onCategoryHover?: (category: Category | null) => void;
  showMegaMenu?: boolean;
}

// CategorySidebar组件
export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  activeCategory,
  onCategoryClick,
  onCategoryHover,
  showMegaMenu = true
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: Category) => {
    onCategoryClick?.(category);
  };

  const handleMouseEnter = (category: Category) => {
    setHoveredCategory(category.id);
    if (showMegaMenu) {
      onCategoryHover?.(category);
    }
  };

  const handleMouseLeave = () => {
    setHoveredCategory(null);
    if (showMegaMenu) {
      // 延迟隐藏mega menu，给用户时间移动到菜单上
      setTimeout(() => {
        onCategoryHover?.(null);
      }, 100);
    }
  };

  return (
    <SidebarContainer>
      {categories.map(category => (
        <CategoryItem
          key={category.id}
          $active={activeCategory === category.id || hoveredCategory === category.id}
          $color={category.color}
          onClick={() => handleCategoryClick(category)}
          onMouseEnter={() => handleMouseEnter(category)}
          onMouseLeave={handleMouseLeave}
        >
          <CategoryIcon $color={category.color}>
            {category.icon}
          </CategoryIcon>
          <CategoryContent>
            <CategoryName
              $active={activeCategory === category.id || hoveredCategory === category.id}
              $color={category.color}
            >
              {category.name}
            </CategoryName>
            {category.description && (
              <CategoryDescription
                $active={activeCategory === category.id || hoveredCategory === category.id}
              >
                {category.description}
              </CategoryDescription>
            )}
          </CategoryContent>
          <HoverIndicator>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              style={{ color: category.color }}
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
        </CategoryItem>
      ))}
    </SidebarContainer>
  );
};

export default CategorySidebar;