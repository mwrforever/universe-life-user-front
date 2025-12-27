import React, { useState, useRef, useCallback } from 'react';
import styled from '@emotion/styled';
import { CategorySidebar } from './CategorySidebar';
import { CustomCarousel } from './CustomCarousel';
import { MegaMenu } from './MegaMenu';
import { uiLogger } from '@/utils/logger';

// 内联类型定义
interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description?: string;
}

interface CarouselItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
  type?: 'internal' | 'external';
  backgroundColor?: string;
  textColor?: string;
}

interface HeroSectionProps {
  categories: Category[];
  carouselItems: CarouselItem[];
  onCategoryClick?: (category: Category) => void;
  onCarouselItemClick?: (item: CarouselItem) => void;
  autoplayInterval?: number;
  showMegaMenu?: boolean;
}

// 样式化组件
const HeroSectionContainer = styled.div`
  margin: 32px 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    margin: 16px 0;
    border-radius: 12px;
  }
`;

const HeroSectionContent = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  height: 400px;
  position: relative;

  @media (max-width: 1024px) {
    grid-template-columns: 240px 1fr;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    height: auto;
  }
`;

const ResponsiveWrapper = styled.div`
  @media (max-width: 768px) {
    .category-sidebar {
      display: none;
    }

    .carousel-container {
      grid-column: 1;
      grid-row: 1;
      border-radius: 16px !important;
    }
  }
`;

// HeroSection主组件
export const HeroSection: React.FC<HeroSectionProps> = ({
  categories,
  carouselItems,
  onCategoryClick,
  onCarouselItemClick,
  autoplayInterval = 4000,
  showMegaMenu = true
}) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);
  const [megaMenuVisible, setMegaMenuVisible] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCategoryClick = useCallback((category: Category) => {
    setActiveCategory(category.id);
    onCategoryClick?.(category);
  }, [onCategoryClick]);

  const handleCategoryHover = useCallback((category: Category | null) => {
    // 清除之前的延迟
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    if (category) {
      // 如果有新的分类，立即更新并保持显示
      setHoveredCategory(category);
      setMegaMenuVisible(true);
    } else {
      // 只有当真正离开侧边栏区域时才延迟隐藏
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredCategory(null);
        setMegaMenuVisible(false);
      }, 300); // 增加延迟到300ms，给用户更多时间
    }
  }, []);

  const handleCarouselItemClick = useCallback((item: CarouselItem) => {
    onCarouselItemClick?.(item);
  }, [onCarouselItemClick]);

  const handleCarouselChange = useCallback((current: number, next: number) => {
    uiLogger.debug('Carousel changed from', current, 'to', next);
  }, []);

  // 计算侧边栏的位置信息用于MegaMenu定位
  const getSidebarPosition = () => {
    if (!sidebarRef.current) {
      return { x: 0, y: 0, width: 280, height: 400 };
    }

    const rect = sidebarRef.current.getBoundingClientRect();
    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height
    };
  };

  // 组件卸载时清理定时器
  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <ResponsiveWrapper>
      <HeroSectionContainer>
        <HeroSectionContent>
          <div
            className="category-sidebar"
            ref={sidebarRef}
            style={{
              display: window.innerWidth <= 768 ? 'none' : 'block'
            }}
          >
            <CategorySidebar
              categories={categories}
              activeCategory={activeCategory || undefined}
              onCategoryClick={handleCategoryClick}
              onCategoryHover={handleCategoryHover}
              showMegaMenu={showMegaMenu}
            />
          </div>

          <div className="carousel-container">
            <CustomCarousel
              items={carouselItems}
              autoplay={true}
              autoplayInterval={autoplayInterval}
              showDots={true}
              dotPosition="bottom"
              onItemChange={handleCarouselChange}
              onItemClick={handleCarouselItemClick}
            />
          </div>
        </HeroSectionContent>

        {/* MegaMenu 覆盖层 */}
        {showMegaMenu && hoveredCategory && megaMenuVisible && (
          <MegaMenu
            category={hoveredCategory}
            visible={true}
            onClose={() => {
              setHoveredCategory(null);
              setMegaMenuVisible(false);
            }}
            position={getSidebarPosition()}
            onMouseEnter={() => {
              // 鼠标进入MegaMenu时取消隐藏
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
              }
            }}
            onMouseLeave={() => {
              // 鼠标离开MegaMenu时延迟隐藏，与侧边栏保持一致
              hoverTimeoutRef.current = setTimeout(() => {
                setHoveredCategory(null);
                setMegaMenuVisible(false);
              }, 300);
            }}
          />
        )}
      </HeroSectionContainer>
    </ResponsiveWrapper>
  );
};

export default HeroSection;