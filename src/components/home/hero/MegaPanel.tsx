import React from 'react';
import styled from '@emotion/styled';
import type { Category, Subcategory, Tag, FeaturedItem } from '../../../types/hero-category';
import { uiLogger } from '@/utils/logger';

// ==================== 样式化组件 ====================

// Mega Panel主容器 - Glassmorphism效果，完全覆盖轮播图区域
const MegaPanelContainer = styled.div<{ $position: { x: number; y: number; width: number; height: number } }>`
  position: fixed;
  top: ${props => props.$position.y}px;
  left: ${props => props.$position.x + props.$position.width + 24}px; /* 增加24px间距 */
  width: 856px; /* 完全覆盖轮播图区域：1200px - 280px侧边栏 - 24px间距 - 40px边距 */
  height: 400px; /* 与轮播图高度一致 */
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px) saturate(180%);
  border-radius: 16px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 100; /* 在Carousel之上，Header之下 */
  overflow: hidden;
  animation: slideInFade 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* 添加微妙的玻璃质感 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0.02) 100%
    );
    border-radius: 16px;
    pointer-events: none;
  }

  /* 悬停时增强效果 */
  &:hover {
    background: rgba(255, 255, 255, 0.9);
    box-shadow:
      0 25px 70px rgba(0, 0, 0, 0.18),
      0 12px 40px rgba(0, 0, 0, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.6);
  }

  @keyframes slideInFade {
    from {
      opacity: 0;
      transform: translateX(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }
`;

// Mega Panel内容容器
const MegaPanelContent = styled.div`
  padding: 32px;
  height: 100%;
  overflow-y: auto;
  position: relative;
  z-index: 1;

  /* 自定义滚动条 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    transition: background 0.3s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }
`;

// Mega Panel头部
const MegaPanelHeader = styled.div<{ $color: string; $gradient?: string }>`
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid ${props => props.$color}20;
  background: ${props => props.$gradient || 'transparent'};
  background-clip: text;
  -webkit-background-clip: text;

  h2 {
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 700;
    color: ${props => props.$color};
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .category-icon {
    font-size: 28px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }

  .category-description {
    color: rgba(0, 0, 0, 0.6);
    font-size: 14px;
    font-weight: 500;
    margin: 0;
  }
`;

// 内容网格布局
const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 24px;
`;

// 子分类区域
const SubcategoriesSection = styled.div`
  min-width: 0;
`;

const SectionTitle = styled.h3<{ $color: string }>`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.$color};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '';
    width: 4px;
    height: 16px;
    background: ${props => props.$color};
    border-radius: 2px;
  }
`;

// 子分类列表
const SubcategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

// 子分类项
const SubcategoryItem = styled.div<{ $featured?: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${props => props.$featured ? 'rgba(0, 0, 0, 0.03)' : 'transparent'};
  border: ${props => props.$featured ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid transparent'};

  &:hover {
    background: rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }

  ${props => props.$featured && `
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.04) 0%, rgba(0, 0, 0, 0.02) 100%);

    &:hover {
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.04) 100%);
    }
  `}
`;

// 子分类图标
const SubcategoryIcon = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${props => props.$color}10;
  margin-right: 12px;
  font-size: 16px;
  flex-shrink: 0;
`;

// 子分类内容
const SubcategoryContent = styled.div`
  flex: 1;
  min-width: 0;

  .subcategory-name {
    font-size: 14px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 2px;
  }

  .subcategory-description {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
    line-height: 1.4;
  }
`;

// 标签云
const TagCloud = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

// 标签项
const TagItem = styled.span<{ $hot?: boolean; $color: string }>`
  padding: 4px 10px;
  background: ${props => props.$hot ? props.$color : 'rgba(0, 0, 0, 0.06)'};
  color: ${props => props.$hot ? '#ffffff' : 'rgba(0, 0, 0, 0.7)'};
  border-radius: 12px;
  font-size: 11px;
  font-weight: ${props => props.$hot ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;
  border: ${props => props.$hot ? 'none' : '1px solid rgba(0, 0, 0, 0.08)'};

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.$hot ? `${props.$color}40 0 4px 8px` : '0 2px 8px rgba(0, 0, 0, 0.1)'};
    background: ${props => props.$hot ? props.$color : 'rgba(0, 0, 0, 0.08)'};
  }

  ${props => props.$hot && `
    position: relative;

    &::after {
      content: '🔥';
      margin-left: 4px;
      font-size: 10px;
    }
  `}
`;

// 精选项目区域
const FeaturedSection = styled.div`
  min-width: 0;
`;

// 精选项目卡片
const FeaturedCard = styled.div<{ $color: string }>`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;

  /* 添加微妙的渐变边框 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.$color};
    opacity: 0.8;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.$color}30;

    &::before {
      opacity: 1;
      height: 4px;
    }
  }
`;

// 精选项目徽章
const FeaturedBadge = styled.span<{ $color: string }>`
  position: absolute;
  top: 12px;
  right: 12px;
  background: ${props => props.$color};
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// 精选项目标题
const FeaturedTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  line-height: 1.4;
`;

// 精选项目描述
const FeaturedDescription = styled.p`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  margin: 0 0 12px 0;
  line-height: 1.5;
`;

// 精选项目元信息
const FeaturedMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  color: rgba(0, 0, 0, 0.5);
`;

// 价格显示
const Price = styled.span<{ $color: string }>`
  font-weight: 600;
  color: ${props => props.$color};
`;

// 评分显示
const Rating = styled.span`
  color: #fa541c;
`;

// ==================== 组件Props ====================

interface MegaPanelProps {
  category: Category;
  visible: boolean;
  onClose: () => void;
  position: { x: number; y: number; width: number; height: number };
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

// ==================== MegaPanel组件 ====================

export const MegaPanel: React.FC<MegaPanelProps> = ({
  category,
  visible,
  onClose,
  position,
  onMouseEnter,
  onMouseLeave
}) => {
  if (!visible || !category) return null;

  const handleSubcategoryClick = (subcategory: Subcategory) => {
    uiLogger.info('点击子分类:', subcategory);
    if (subcategory.link) {
      // 这里可以添加路由跳转逻辑
      window.location.href = subcategory.link;
    }
    onClose();
  };

  const handleTagClick = (tag: Tag) => {
    uiLogger.info('点击标签:', tag);
    if (tag.link) {
      window.location.href = tag.link;
    }
    onClose();
  };

  const handleFeaturedItemClick = (item: FeaturedItem) => {
    uiLogger.info('点击精选项目:', item);
    if (item.link) {
      window.location.href = item.link;
    }
    onClose();
  };

  return (
    <MegaPanelContainer
      $position={position}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <MegaPanelContent>
        {/* 头部区域 */}
        <MegaPanelHeader
          $color={category.color}
          $gradient={category.gradient}
        >
          <h2>
            <span className="category-icon">{category.icon}</span>
            {category.name}
          </h2>
          {category.description && (
            <p className="category-description">{category.description}</p>
          )}
        </MegaPanelHeader>

        {/* 内容网格 */}
        <ContentGrid>
          {/* 左侧：子分类列表 */}
          <SubcategoriesSection>
            <SectionTitle $color={category.color}>
              服务分类
            </SectionTitle>
            <SubcategoryList>
              {category.subcategories?.map((subcategory) => (
                <SubcategoryItem
                  key={subcategory.id}
                  $featured={subcategory.featured}
                  onClick={() => handleSubcategoryClick(subcategory)}
                >
                  <SubcategoryIcon $color={category.color}>
                    {subcategory.icon}
                  </SubcategoryIcon>
                  <SubcategoryContent>
                    <div className="subcategory-name">{subcategory.name}</div>
                    {subcategory.description && (
                      <div className="subcategory-description">
                        {subcategory.description}
                      </div>
                    )}
                    {subcategory.tags && (
                      <TagCloud>
                        {subcategory.tags.slice(0, 3).map((tag) => (
                          <TagItem
                            key={tag.id}
                            $hot={tag.hot}
                            $color={category.color}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTagClick(tag);
                            }}
                          >
                            {tag.name}
                            {tag.count && ` (${tag.count})`}
                          </TagItem>
                        ))}
                      </TagCloud>
                    )}
                  </SubcategoryContent>
                </SubcategoryItem>
              ))}
            </SubcategoryList>
          </SubcategoriesSection>

          {/* 右侧：精选项目 */}
          <FeaturedSection>
            <SectionTitle $color={category.color}>
              精选服务
            </SectionTitle>
            {category.featuredItems?.map((item) => (
              <FeaturedCard
                key={item.id}
                $color={category.color}
                onClick={() => handleFeaturedItemClick(item)}
              >
                {item.badge && (
                  <FeaturedBadge $color={category.color}>
                    {item.badge}
                  </FeaturedBadge>
                )}
                <FeaturedTitle>{item.title}</FeaturedTitle>
                <FeaturedDescription>{item.description}</FeaturedDescription>
                <FeaturedMeta>
                  <div>
                    {item.rating && (
                      <Rating>★ {item.rating}</Rating>
                    )}
                    {item.discount && (
                      <span style={{ marginLeft: '8px', color: '#ff4d4f' }}>
                        {item.discount}
                      </span>
                    )}
                  </div>
                  {item.price && (
                    <Price $color={category.color}>{item.price}</Price>
                  )}
                </FeaturedMeta>
              </FeaturedCard>
            ))}
          </FeaturedSection>
        </ContentGrid>
      </MegaPanelContent>
    </MegaPanelContainer>
  );
};

export default MegaPanel;