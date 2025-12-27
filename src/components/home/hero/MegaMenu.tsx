import React from 'react';
import styled from '@emotion/styled';
import { uiLogger } from '@/utils/logger';

// 内联类型定义
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
const MegaMenuOverlay = styled.div<{ $visible: boolean; $position: { x: number; y: number; width: number; height: number } }>`
  position: fixed;
  top: ${props => props.$position.y}px;
  left: ${props => props.$position.x + props.$position.width}px;
  right: 20px;
  min-height: ${props => props.$position.height}px;
  max-height: 500px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.2) inset;
  opacity: ${props => props.$visible ? 1 : 0};
  visibility: ${props => props.$visible ? 'visible' : 'hidden'};
  transform: ${props => props.$visible ? 'translateX(0)' : 'translateX(20px)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  padding: 24px;
  overflow-y: auto;

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
  }
`;

const MegaMenuHeader = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid ${props => props.$color}20;
`;

const MegaMenuIcon = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: ${props => props.$color}15;
  margin-right: 16px;
  flex-shrink: 0;

  svg {
    color: ${props => props.$color};
    font-size: 24px;
  }
`;

const MegaMenuTitle = styled.div<{ $color: string }>`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.$color};
  flex: 1;
`;

const MegaMenuDescription = styled.div`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  margin-top: 4px;
`;

const MegaMenuContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MegaMenuSection = styled.div`
  flex: 1;
`;

const MegaMenuSectionTitle = styled.h3<{ $color: string }>`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.$color};
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MegaMenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MegaMenuItem = styled.a<{ $color?: string }>`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.8);
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.05);

  &:hover {
    background: ${props => props.$color ? `${props.$color}10` : 'rgba(0, 0, 0, 0.05)'};
    color: ${props => props.$color || '#1a1a1a'};
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const MegaMenuItemIcon = styled.div<{ $color?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${props => props.$color ? `${props.$color}10` : 'rgba(0, 0, 0, 0.05)'};
  margin-right: 12px;
  flex-shrink: 0;

  svg {
    color: ${props => props.$color || '#666'};
    font-size: 16px;
  }
`;

const MegaMenuItemContent = styled.div`
  flex: 1;
`;

const MegaMenuItemTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 2px;
`;

const FeaturedItems = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const FeaturedItemCard = styled.div<{ $color?: string }>`
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background: white;
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    border-color: ${props => props.$color || 'transparent'};
  }
`;

const FeaturedItemBadge = styled.span<{ $color: string }>`
  position: absolute;
  top: 12px;
  right: 12px;
  background: ${props => props.$color};
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FeaturedItemImage = styled.div`
  width: 100%;
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  text-align: center;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const FeaturedItemTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #1a1a1a;
`;

const FeaturedItemDescription = styled.p`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  margin: 0;
  line-height: 1.4;
`;

// 组件Props接口
interface MegaMenuProps {
  category: Category;
  visible: boolean;
  onClose: () => void;
  position: { x: number; y: number; width: number; height: number };
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

// MegaMenu组件
export const MegaMenu: React.FC<MegaMenuProps> = ({
  category,
  visible,
  onClose,
  position,
  onMouseEnter,
  onMouseLeave
}) => {
  const handleItemClick = (e: React.MouseEvent, link?: string) => {
    if (link) {
      // 阻止默认行为，使用应用的路由系统
      e.preventDefault();
      uiLogger.info('Navigate to:', link);
      // 这里应该使用 React Router 的 navigate 函数
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <MegaMenuOverlay
      $visible={visible}
      $position={position}
      onMouseLeave={onMouseLeave || onClose}
      onMouseEnter={onMouseEnter}
    >
      <MegaMenuHeader $color={category.color}>
        <MegaMenuIcon $color={category.color}>
          {category.icon}
        </MegaMenuIcon>
        <div>
          <MegaMenuTitle $color={category.color}>
            {category.name}
          </MegaMenuTitle>
          {category.description && (
            <MegaMenuDescription>{category.description}</MegaMenuDescription>
          )}
        </div>
      </MegaMenuHeader>

      <MegaMenuContent>
        <MegaMenuSection>
          <MegaMenuSectionTitle $color={category.color}>
            <span>📋</span>
            子分类
          </MegaMenuSectionTitle>
          <MegaMenuList>
            {category.subcategories?.map(subcategory => (
              <MegaMenuItem
                key={subcategory.id}
                href={subcategory.link}
                $color={category.color}
                onClick={(e) => handleItemClick(e, subcategory.link)}
              >
                <MegaMenuItemIcon $color={category.color}>
                  {subcategory.icon}
                </MegaMenuItemIcon>
                <MegaMenuItemContent>
                  <MegaMenuItemTitle>{subcategory.name}</MegaMenuItemTitle>
                </MegaMenuItemContent>
              </MegaMenuItem>
            ))}
          </MegaMenuList>
        </MegaMenuSection>

        {category.featuredItems && category.featuredItems.length > 0 && (
          <MegaMenuSection>
            <MegaMenuSectionTitle $color={category.color}>
              <span>⭐</span>
              精选推荐
            </MegaMenuSectionTitle>
            <FeaturedItems>
              {category.featuredItems.map(item => (
                <FeaturedItemCard
                  key={item.id}
                  $color={category.color}
                  onClick={(e) => handleItemClick(e, item.link)}
                >
                  {item.badge && (
                    <FeaturedItemBadge $color={category.color}>
                      {item.badge}
                    </FeaturedItemBadge>
                  )}
                  <FeaturedItemImage>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.textContent = '暂无图片';
                        }}
                      />
                    ) : (
                      '暂无图片'
                    )}
                  </FeaturedItemImage>
                  <FeaturedItemTitle>{item.title}</FeaturedItemTitle>
                  <FeaturedItemDescription>{item.description}</FeaturedItemDescription>
                </FeaturedItemCard>
              ))}
            </FeaturedItems>
          </MegaMenuSection>
        )}
      </MegaMenuContent>
    </MegaMenuOverlay>
  );
};

export default MegaMenu;