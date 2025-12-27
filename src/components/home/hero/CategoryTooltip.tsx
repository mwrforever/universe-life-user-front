import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import type { Category } from '../../../types/hero-category';

// ==================== 样式化组件 ====================

// 悬浮提示容器
const TooltipContainer = styled.div<{ visible: boolean; position: { x: number; y: number } }>`
  position: fixed;
  top: ${props => props.position.y}px;
  left: ${props => props.position.x}px;
  z-index: 1000; /* 高于所有内容 */
  pointer-events: ${props => props.visible ? 'auto' : 'none'};
  opacity: ${props => props.visible ? 1 : 0};
  transform: ${props => props.visible ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
`;

// 提示内容卡片
const TooltipCard = styled.div<{ categoryColor?: string }>`
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 20px;
  min-width: 320px;
  max-width: 400px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.15),
    0 8px 16px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;

  /* 顶部装饰条 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.categoryColor || '#ff6000'};
    border-radius: 12px 12px 0 0;
  }

  /* 左侧箭头 */
  &::after {
    content: '';
    position: absolute;
    top: 20px;
    left: -6px;
    width: 12px;
    height: 12px;
    background: rgba(255, 255, 255, 0.98);
    border-left: 1px solid rgba(0, 0, 0, 0.05);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    transform: rotate(45deg);
  }
`;

// 分类标题区域
const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
`;

// 分类图标
const CategoryIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.03);
  color: #666;
  font-size: 18px;
`;

// 分类信息
const CategoryInfo = styled.div`
  flex: 1;
`;

// 分类名称
const CategoryName = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  line-height: 1.4;
`;

// 分类描述
const CategoryDescription = styled.p`
  margin: 4px 0 0 0;
  font-size: 13px;
  color: #8c8c8c;
  line-height: 1.4;
`;

// 特色标签
const FeaturedTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const Tag = styled.span<{ hot?: boolean }>`
  padding: 4px 10px;
  background: ${props => props.hot ? 'rgba(255, 80, 0, 0.08)' : 'rgba(0, 0, 0, 0.04)'};
  color: ${props => props.hot ? '#ff6000' : '#666'};
  border-radius: 6px;
  font-size: 12px;
  font-weight: ${props => props.hot ? '500' : '400'};
  border: 1px solid ${props => props.hot ? 'rgba(255, 80, 0, 0.2)' : 'rgba(0, 0, 0, 0.06)'};
  display: flex;
  align-items: center;
  gap: 4px;

  ${props => props.hot && `
    &::before {
      content: '🔥';
      font-size: 10px;
    }
  `}
`;

// 子分类预览
const SubcategoryPreview = styled.div`
  margin-top: 12px;
`;

const SubcategoryTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 13px;
  font-weight: 500;
  color: #262626;
`;

const SubcategoryList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
`;

const SubcategoryItem = styled.div`
  padding: 6px 8px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.06);
    color: #262626;
  }
`;

const SubcategoryIcon = styled.span`
  font-size: 12px;
  opacity: 0.6;
`;

// ==================== 组件Props ====================

interface CategoryTooltipProps {
  category: Category | null;
  visible: boolean;
  position: { x: number; y: number };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

// ==================== CategoryTooltip组件 ====================

export const CategoryTooltip: React.FC<CategoryTooltipProps> = ({
  category,
  visible,
  position,
  onMouseEnter,
  onMouseLeave
}) => {
  // 计算热门标签
  const getHotTags = useCallback(() => {
    if (!category?.subcategories) return [];

    const allTags = category.subcategories.flatMap(sub => sub.tags);
    return allTags
      .filter(tag => tag.hot)
      .slice(0, 6); // 最多显示6个热门标签
  }, [category]);

  // 计算预览子分类
  const getPreviewSubcategories = useCallback(() => {
    if (!category?.subcategories) return [];
    return category.subcategories.slice(0, 4); // 最多显示4个子分类
  }, [category]);

  if (!category) return null;

  const hotTags = getHotTags();
  const previewSubcategories = getPreviewSubcategories();

  return (
    <TooltipContainer
      visible={visible}
      position={position}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <TooltipCard categoryColor={category.color}>
        <CategoryHeader>
          <CategoryIcon>
            {category.icon}
          </CategoryIcon>
          <CategoryInfo>
            <CategoryName>{category.name}</CategoryName>
            <CategoryDescription>{category.description}</CategoryDescription>
          </CategoryInfo>
        </CategoryHeader>

        {/* 热门标签 */}
        {hotTags.length > 0 && (
          <FeaturedTags>
            {hotTags.map(tag => (
              <Tag key={tag.id} hot={tag.hot}>
                {tag.name}
                {tag.count && ` (${tag.count})`}
              </Tag>
            ))}
          </FeaturedTags>
        )}

        {/* 子分类预览 */}
        {previewSubcategories.length > 0 && (
          <SubcategoryPreview>
            <SubcategoryTitle>热门服务</SubcategoryTitle>
            <SubcategoryList>
              {previewSubcategories.map(sub => (
                <SubcategoryItem key={sub.id}>
                  <SubcategoryIcon>
                    {sub.icon}
                  </SubcategoryIcon>
                  <span>{sub.name}</span>
                </SubcategoryItem>
              ))}
            </SubcategoryList>
          </SubcategoryPreview>
        )}
      </TooltipCard>
    </TooltipContainer>
  );
};