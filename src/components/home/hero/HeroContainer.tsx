import React, { useState, useRef, useCallback } from 'react';
import styled from '@emotion/styled';
import type { Category, CarouselItem } from '../../../types/hero-category';
import { CategoryNav } from './CategoryNav';
import { MegaPanel } from './MegaPanel';
import { Banner } from './Banner';
import { uiLogger } from '@/utils/logger';

// ==================== Z-Index层级策略 ====================
/*
Z-Index层级定义（从低到高）：
1. Background: 0-10
2. Content: 10-50
3. Header: 50-99 (TopNavBar + HeaderMain)
4. MegaPanel: 100 (在Carousel之上，Header之下)
5. Tooltips/Popovers: 101+
6. Modals: 1000+
*/

// ==================== 样式化组件 ====================

// Hero Section主容器 - 1200px居中布局
const HeroContainerWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 20px;
  position: relative;
  z-index: 1; /* 基础层级 */

  @media (max-width: 768px) {
    padding: 16px 12px;
  }
`;

// Hero内容区域 - 网格布局
const HeroContent = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  height: 400px;
  position: relative;
  z-index: 2; /* 内容层级 */

  @media (max-width: 1024px) {
    grid-template-columns: 240px 1fr;
    gap: 20px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    height: auto;
    gap: 16px;

    /* 移动端隐藏侧边栏 */
    .category-nav-container {
      display: none;
    }

    /* 轮播图占满宽度 */
    .banner-container {
      grid-column: 1;
      grid-row: 1;
    }
  }
`;

// 侧边栏容器 - 相对定位用于MegaPanel定位
const SidebarContainer = styled.div`
  position: relative;
  z-index: 3; /* 侧边栏层级 */
  height: 100%;

  /* 为MegaPanel提供定位基准 */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: -40px;
    width: 40px;
    height: 100%;
    z-index: 4; /* hit-area层级 */
    pointer-events: auto;
  }
`;

// 轮播图容器
const BannerWrapper = styled.div`
  position: relative;
  z-index: 1; /* 轮播图层级，低于MegaPanel */
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
`;


// ==================== 组件Props ====================

interface HeroContainerProps {
  categories: Category[];
  carouselItems: CarouselItem[];
  onCategoryClick?: (category: Category) => void;
  onCarouselItemClick?: (item: CarouselItem) => void;
  autoplayInterval?: number;
  showMegaMenu?: boolean;
}

// ==================== HeroContainer组件 ====================

export const HeroContainer: React.FC<HeroContainerProps> = ({
  categories,
  carouselItems,
  onCategoryClick,
  onCarouselItemClick,
  autoplayInterval = 5000,
  showMegaMenu = true
}) => {
  // 状态管理
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);
  const [megaMenuVisible, setMegaMenuVisible] = useState<boolean>(false);
  const [isScrollLocked, setIsScrollLocked] = useState<boolean>(false);

  // Refs
  const sidebarRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const megaPanelRef = useRef<HTMLDivElement>(null);

  // ==================== 滚动锁定工具函数 ====================

  const lockScroll = useCallback(() => {
    if (isScrollLocked) return;

    const originalStyle = window.getComputedStyle(document.body);
    const originalOverflow = originalStyle.overflow;
    const originalPosition = originalStyle.position;
    const originalTop = originalStyle.top;
    const originalWidth = originalStyle.width;

    // 保存原始样式
    const scrollY = window.scrollY;

    // 锁定滚动
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    // 保存原始样式到data属性
    document.body.setAttribute('data-original-overflow', originalOverflow);
    document.body.setAttribute('data-original-position', originalPosition);
    document.body.setAttribute('data-original-top', originalTop);
    document.body.setAttribute('data-original-width', originalWidth);
    document.body.setAttribute('data-scroll-y', scrollY.toString());

    setIsScrollLocked(true);
  }, [isScrollLocked]);

  const unlockScroll = useCallback(() => {
    if (!isScrollLocked) return;

    // 恢复原始样式
    const originalOverflow = document.body.getAttribute('data-original-overflow') || '';
    const originalPosition = document.body.getAttribute('data-original-position') || '';
    const originalTop = document.body.getAttribute('data-original-top') || '';
    const originalWidth = document.body.getAttribute('data-original-width') || '';
    const scrollY = parseInt(document.body.getAttribute('data-scroll-y') || '0');

    document.body.style.overflow = originalOverflow;
    document.body.style.position = originalPosition;
    document.body.style.top = originalTop;
    document.body.style.width = originalWidth;

    // 恢复滚动位置
    window.scrollTo(0, scrollY);

    // 清理data属性
    document.body.removeAttribute('data-original-overflow');
    document.body.removeAttribute('data-original-position');
    document.body.removeAttribute('data-original-top');
    document.body.removeAttribute('data-original-width');
    document.body.removeAttribute('data-scroll-y');

    setIsScrollLocked(false);
  }, [isScrollLocked]);

  // ==================== 事件处理函数 ====================

  const handleCategoryClick = useCallback((category: Category) => {
    uiLogger.info('Category clicked:', category.name);
    setActiveCategory(category.id);
    onCategoryClick?.(category);

    // 点击分类时隐藏MegaMenu并解锁滚动
    setMegaMenuVisible(false);
    setHoveredCategory(null);
    unlockScroll();
  }, [onCategoryClick, unlockScroll]);

  const handleCategoryHover = useCallback((category: Category | null) => {
    // 清除之前的延迟
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    if (category) {
      // 有新的分类时，立即显示并锁定滚动
      setHoveredCategory(category);
      setMegaMenuVisible(true);
      if (showMegaMenu) {
        lockScroll();
      }
    } else {
      // 只有在没有MegaPanel显示时才设置延迟隐藏
      if (!megaMenuVisible) {
        hoverTimeoutRef.current = setTimeout(() => {
          setHoveredCategory(null);
          setMegaMenuVisible(false);
          unlockScroll();
        }, 300);
      }
    }
  }, [showMegaMenu, lockScroll, unlockScroll, megaMenuVisible]);

  const handleCarouselItemClick = useCallback((item: CarouselItem) => {
    uiLogger.info('Carousel item clicked:', item.title);
    onCarouselItemClick?.(item);
  }, [onCarouselItemClick]);

  const handleMegaPanelMouseEnter = useCallback(() => {
    // 鼠标进入MegaPanel时，取消隐藏定时器
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  const handleMegaPanelMouseLeave = useCallback(() => {
    // 鼠标离开MegaPanel时，延迟隐藏
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
      setMegaMenuVisible(false);
      unlockScroll();
    }, 200);
  }, [unlockScroll]);

  const handleMegaPanelClose = useCallback(() => {
    setHoveredCategory(null);
    setMegaMenuVisible(false);
    unlockScroll();
  }, [unlockScroll]);

  
  // ==================== 位置计算函数 ====================

  const getSidebarPosition = useCallback(() => {
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
  }, []);

  // ==================== 组件卸载清理 ====================

  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      // 确保组件卸载时解锁滚动
      if (isScrollLocked) {
        unlockScroll();
      }
    };
  }, [isScrollLocked, unlockScroll]);

  // ==================== 全局点击处理 ====================

  React.useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      // 点击MegaPanel外部时关闭
      const target = event.target as Element;
      if (
        megaMenuVisible &&
        !target.closest('.mega-panel') &&
        !target.closest('.category-nav') &&
        !target.closest('[data-mega-panel-ignore]') && // 添加忽略标志
        megaPanelRef.current && !megaPanelRef.current.contains(target) && // 确保不在MegaPanel内
        sidebarRef.current && !sidebarRef.current.contains(target) // 确保不在CategoryNav内
      ) {
        handleMegaPanelClose();
      }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      // ESC键关闭MegaMenu
      if (event.key === 'Escape' && megaMenuVisible) {
        handleMegaPanelClose();
      }
    };

    if (megaMenuVisible) {
      document.addEventListener('click', handleGlobalClick);
      document.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [megaMenuVisible, handleMegaPanelClose]);

  // ==================== 渲染 ====================

  return (
    <HeroContainerWrapper ref={containerRef}>
      <HeroContent>
        {/* 左侧分类导航 */}
        <div className="category-nav-container">
          <SidebarContainer ref={sidebarRef}>
            <CategoryNav
              categories={categories}
              activeCategory={activeCategory || undefined}
              onCategoryClick={handleCategoryClick}
              onCategoryHover={handleCategoryHover}
              showMegaMenu={showMegaMenu}
            />
          </SidebarContainer>
        </div>

        {/* 右侧轮播图 */}
        <div className="banner-container">
          <BannerWrapper>
            <Banner
              items={carouselItems}
              autoplay={true}
              autoplayInterval={autoplayInterval}
              showDots={true}
              showNav={true}
              onItemClick={handleCarouselItemClick}
            />
          </BannerWrapper>
        </div>
      </HeroContent>

      {/* Mega Panel - Z-Index: 100 */}
      {showMegaMenu && hoveredCategory && megaMenuVisible && (
        <div className="mega-panel" ref={megaPanelRef}>
          <MegaPanel
            category={hoveredCategory}
            visible={true}
            onClose={handleMegaPanelClose}
            position={getSidebarPosition()}
            onMouseEnter={handleMegaPanelMouseEnter}
            onMouseLeave={handleMegaPanelMouseLeave}
          />
        </div>
      )}

      {/* 添加CSS用于动画效果 */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .category-nav-container {
          animation: fadeIn 0.6s ease-out;
        }

        .banner-container {
          animation: fadeIn 0.6s ease-out 0.2s both;
        }

        /* 确保正确的触摸事件处理 */
        @media (hover: none) and (pointer: coarse) {
          .category-nav-container {
            /* 移动端优化 */
          }

          .mega-panel {
            /* 移动端可以显示为全屏或更大的区域 */
            position: fixed !important;
            top: auto !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100vw !important;
            max-height: 50vh !important;
            border-radius: 16px 16px 0 0 !important;
          }
        }
      `}</style>
    </HeroContainerWrapper>
  );
};

