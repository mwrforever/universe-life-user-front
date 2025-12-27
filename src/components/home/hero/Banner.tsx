import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from '@emotion/styled';
import type { CarouselItem } from '../../../types/hero-category';

// ==================== 样式化组件 ====================

// 轮播图主容器 - 1200px居中，圆角设计
const BannerContainer = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: #f5f5f5;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);

  /* 添加微妙的边框 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.05) 100%
    );
    border-radius: 16px;
    pointer-events: none;
    z-index: 1;
  }
`;

// 轮播图内容区域
const BannerContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
`;

// 轮播项容器
const BannerSlide = styled.div<{
  $backgroundColor?: string;
  $textColor?: string;
  $position?: 'left' | 'center' | 'right';
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => props.$backgroundColor || '#f5f5f5'};
  color: ${props => props.$textColor || '#ffffff'};
  display: flex;
  align-items: center;
  justify-content: ${props => {
    switch (props.$position) {
      case 'left': return 'flex-start';
      case 'center': return 'center';
      case 'right': return 'flex-end';
      default: return 'center';
    }
  }};
  padding: 60px;
  opacity: 0;
  transform: translateX(100%);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px;

  /* 添加3D装饰元素 */
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: float 20s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    33% { transform: translate(-30px, -30px) rotate(120deg); }
    66% { transform: translate(30px, -20px) rotate(240deg); }
  }

  /* 激活状态 */
  &.active {
    opacity: 1;
    transform: translateX(0);
    z-index: 2;
  }

  /* 进入状态 */
  &.enter {
    transform: translateX(100%);
  }

  /* 离开状态 */
  &.exit {
    transform: translateX(-100%);
  }
`;

// 轮播图文本内容
const BannerText = styled.div`
  position: relative;
  z-index: 3;
  max-width: 600px;
  text-align: ${props => props.$position === 'center' ? 'center' : 'left'};

  h2 {
    font-size: 48px;
    font-weight: 700;
    margin: 0 0 16px 0;
    line-height: 1.2;
    text-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    animation: slideInUp 0.8s ease-out 0.2s both;
  }

  p {
    font-size: 18px;
    margin: 0 0 32px 0;
    opacity: 0.9;
    line-height: 1.6;
    text-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
    animation: slideInUp 0.8s ease-out 0.3s both;
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// CTA按钮
const CTAButton = styled.button<{ $color?: string }>`
  background: ${props => props.$color || '#ffffff'};
  color: ${props => props.$color ? '#ffffff' : '#1a1a1a'};
  border: ${props => props.$color ? '2px solid transparent' : '2px solid rgba(255, 255, 255, 0.3)'};
  padding: 14px 32px;
  border-radius: 28px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideInUp 0.8s ease-out 0.4s both;
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    background: ${props => props.$color ? `${props.$color}dd` : 'rgba(255, 255, 255, 0.95)'};
    border-color: ${props => props.$color || 'rgba(255, 255, 255, 0.5)'};
  }

  &:active {
    transform: translateY(0);
  }
`;

// 徽章
const Badge = styled.span<{ $color?: string }>`
  position: absolute;
  top: 24px;
  right: 24px;
  background: ${props => props.$color || '#ff6b00'};
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  animation: slideInUp 0.8s ease-out 0.5s both;
  z-index: 4;
`;

// 自定义指示器容器
const DotsContainer = styled.div`
  position: absolute;
  bottom: 24px;
  right: 24px;
  display: flex;
  gap: 8px;
  z-index: 10;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 20px;
`;

// 自定义指示器点 - 小矩形设计
const Dot = styled.button<{ $active: boolean }>`
  width: 24px;
  height: 4px;
  border: none;
  background: ${props => props.$active ? '#ffffff' : 'rgba(255, 255, 255, 0.4)'};
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;

  &:hover {
    background: rgba(255, 255, 255, 0.8);
    transform: scaleX(1.2);
  }

  ${props => props.$active && `
    background: #ffffff;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    transform: scaleX(1.3);
  `}
`;

// 导航按钮
const NavButton = styled.button<{ $direction: 'prev' | 'next' }>`
  position: absolute;
  top: 50%;
  ${props => props.$direction === 'prev' ? 'left: 24px' : 'right: 24px'};
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.95);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  svg {
    width: 20px;
    height: 20px;
    color: #333;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: ${props => props.$direction === 'prev' ? 'translateX(-2px)' : 'translateX(2px)'};
  }
`;

// ==================== 组件Props ====================

interface BannerProps {
  items: CarouselItem[];
  autoplay?: boolean;
  autoplayInterval?: number;
  showDots?: boolean;
  showNav?: boolean;
  onItemClick?: (item: CarouselItem) => void;
}

// ==================== Banner组件 ====================

export const Banner: React.FC<BannerProps> = ({
  items,
  autoplay = true,
  autoplayInterval = 5000,
  showDots = true,
  showNav = true,
  onItemClick
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 使用useCallback优化handleNext和handlePrev函数
  const handleNext = useCallback(() => {
    if (isTransitioning || items.length <= 1) return;

    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % items.length);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  }, [isTransitioning, items.length]);

  const handlePrev = useCallback(() => {
    if (isTransitioning || items.length <= 1) return;

    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  }, [isTransitioning, items.length]);

  // 自动轮播
  useEffect(() => {
    if (autoplay && items.length > 1) {
      intervalRef.current = setInterval(() => {
        handleNext();
      }, autoplayInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoplay, autoplayInterval, items.length, handleNext]);

  
  const handleDotClick = (index: number) => {
    if (isTransitioning || index === currentIndex) return;

    setIsTransitioning(true);
    setCurrentIndex(index);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  const handleItemClick = (item: CarouselItem) => {
    onItemClick?.(item);

    if (item.ctaLink) {
      if (item.type === 'external') {
        window.open(item.ctaLink, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = item.ctaLink;
      }
    }
  };

  const handleMouseEnter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (autoplay && items.length > 1) {
      intervalRef.current = setInterval(() => {
        handleNext();
      }, autoplayInterval);
    }
  };

  if (items.length === 0) {
    return (
      <BannerContainer>
        <BannerContent>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#999'
          }}>
            暂无轮播内容
          </div>
        </BannerContent>
      </BannerContainer>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <BannerContainer
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <BannerContent>
        {items.map((item, index) => (
          <BannerSlide
            key={item.id}
            $backgroundColor={item.backgroundColor}
            $textColor={item.textColor}
            $position={item.position}
            className={
              index === currentIndex ? 'active' :
              index === (currentIndex - 1 + items.length) % items.length ? 'exit' :
              'enter'
            }
          >
            <BannerText $position={item.position}>
              <h2>{item.title}</h2>
              {item.subtitle && <p>{item.subtitle}</p>}
              {item.ctaText && (
                <CTAButton
                  $color={item.textColor === '#ffffff' ? undefined : item.textColor}
                  onClick={() => handleItemClick(item)}
                >
                  {item.ctaText}
                </CTAButton>
              )}
            </BannerText>
          </BannerSlide>
        ))}

        {/* 徽章 */}
        {currentItem.badge && (
          <Badge>{currentItem.badge}</Badge>
        )}

        {/* 导航按钮 */}
        {showNav && items.length > 1 && (
          <>
            <NavButton $direction="prev" onClick={handlePrev}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </NavButton>
            <NavButton $direction="next" onClick={handleNext}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </NavButton>
          </>
        )}

        {/* 自定义指示器 */}
        {showDots && items.length > 1 && (
          <DotsContainer>
            {items.map((_, index) => (
              <Dot
                key={index}
                $active={index === currentIndex}
                onClick={() => handleDotClick(index)}
              />
            ))}
          </DotsContainer>
        )}
      </BannerContent>
    </BannerContainer>
  );
};

export default Banner;