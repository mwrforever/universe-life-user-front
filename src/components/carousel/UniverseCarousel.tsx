import React, { useState, useRef, useEffect, useCallback } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';

// 轮播图数据类型
export interface CarouselItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  ctaText?: string;
  type?: 'internal' | 'external';
}

// 轮播图组件属性
interface UniverseCarouselProps {
  items: CarouselItem[];
  autoplay?: boolean;
  autoplaySpeed?: number;
  showArrows?: boolean;
  showDots?: boolean;
  pauseOnHover?: boolean;
  height?: string | number;
  onItemChange?: (index: number) => void;
  onItemClick?: (item: CarouselItem) => void;
}

// 样式化容器
const CarouselContainer = styled.div<{ height: string | number }>`
  position: relative;
  width: 100%;
  height: ${props => typeof props.height === 'number' ? `${props.height}px` : props.height};
  overflow: hidden;
  background: #000;
  border-radius: 0;
`;

// 轮播图轨道
const CarouselTrack = styled.div<{ translateX: number }>`
  display: flex;
  height: 100%;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(${props => props.translateX}px);
`;

// 单个轮播项
const CarouselSlide = styled.div<{ backgroundImage: string; isImageLoaded: boolean }>`
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  position: relative;
  background-image: ${props => props.isImageLoaded ? `url(${props.backgroundImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  transition: opacity 0.3s ease;
`;

// 渐变遮罩层
const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.3) 40%,
    rgba(0, 0, 0, 0.6) 100%
  );
  z-index: 1;
`;

// 内容容器
const ContentContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(90%, 800px);
  text-align: center;
  z-index: 2;
  color: white;
`;

// 标题 - 增加动画效果
const Title = styled.h2`
  font-size: clamp(24px, 4vw, 48px);
  font-weight: 700;
  margin: 0 0 16px 0;
  line-height: 1.2;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
  letter-spacing: -0.5px;
  animation: slideInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  opacity: 0;
  transform: translateY(30px);

  @keyframes slideInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// 描述 - 增加动画效果
const Description = styled.p`
  font-size: clamp(14px, 2.5vw, 20px);
  font-weight: 400;
  margin: 0 0 32px 0;
  line-height: 1.6;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
  opacity: 0.95;
  animation: slideInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards;
  opacity: 0;
  transform: translateY(30px);

  @keyframes slideInUp {
    to {
      opacity: 0.95;
      transform: translateY(0);
    }
  }
`;

// CTA按钮 - 增加动画效果
const CTAButton = styled.button`
  display: inline-block;
  padding: 16px 32px;
  background: linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%);
  color: white;
  border: none;
  border-radius: 32px;
  font-size: clamp(14px, 2vw, 18px);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(255, 107, 0, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  animation: slideInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s forwards;
  opacity: 0;
  transform: translateY(30px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 8px 32px rgba(255, 107, 0, 0.7);
    background: linear-gradient(135deg, #FF8C00 0%, #FF6B00 100%);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  @keyframes slideInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 14px;
  }
`;

// 左右箭头
const ArrowButton = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${props => props.direction === 'left' ? 'left: 24px;' : 'right: 24px;'}
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 3;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  color: #333;
  font-size: 18px;

  &:hover {
    background: white;
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
    ${props => props.direction === 'left' ? 'left: 12px;' : 'right: 12px;'}
    font-size: 16px;
  }
`;

// 指示器容器
const DotsContainer = styled.div`
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 3;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 32px;
  backdrop-filter: blur(8px);

  @media (max-width: 768px) {
    bottom: 16px;
    gap: 8px;
    padding: 6px 12px;
  }
`;

// 单个指示器
const Dot = styled.button<{ active: boolean }>`
  width: ${props => props.active ? '32px' : '8px'};
  height: 8px;
  background: ${props => props.active
    ? 'linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%)'
    : 'rgba(255, 255, 255, 0.4)'};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: ${props => props.active
      ? 'linear-gradient(135deg, #FF8C00 0%, #FF6B00 100%)'
      : 'rgba(255, 255, 255, 0.6)'};
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    width: ${props => props.active ? '24px' : '6px'};
    height: 6px;
  }
`;

// 轮播图组件实现
export const UniverseCarousel: React.FC<UniverseCarouselProps> = ({
  items,
  autoplay = true,
  autoplaySpeed = 4500,
  showArrows = true,
  showDots = true,
  pauseOnHover = true,
  height = 480,
  onItemChange,
  onItemClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 自动播放逻辑
  useEffect(() => {
    if (autoplay && !isPaused && items.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, autoplaySpeed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoplay, isPaused, autoplaySpeed, items.length]);

  // 暂停处理
  useEffect(() => {
    if (pauseOnHover) {
      setIsPaused(isHovered);
    }
  }, [isHovered, pauseOnHover]);

  // 图片预加载
  useEffect(() => {
    const preloadImages = async () => {
      items.forEach((item) => {
        if (item.image && !loadedImages.has(item.image)) {
          const img = new Image();
          img.onload = () => {
            setLoadedImages(prev => new Set([...prev, item.image]));
          };
          img.onerror = () => {
            console.warn(`轮播图图片加载失败: ${item.image}`);
            setLoadedImages(prev => new Set([...prev, item.image])); // 即使失败也标记为已处理
          };
          img.src = item.image;
        }
      });
    };

    if (items && items.length > 0) {
      preloadImages();
    }
  }, [items, loadedImages]);

  // 当前项变化回调
  useEffect(() => {
    onItemChange?.(currentIndex);
  }, [currentIndex, onItemChange]);

  // 导航函数
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  // 项目点击处理
  const handleItemClick = useCallback((item: CarouselItem) => {
    onItemClick?.(item);

    if (item.link) {
      if (item.type === 'external') {
        window.open(item.link, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = item.link;
      }
    }
  }, [onItemClick]);

  // CTA按钮点击
  const handleCTAClick = useCallback((e: React.MouseEvent, item: CarouselItem) => {
    e.stopPropagation();
    handleItemClick(item);
  }, [handleItemClick]);

  // 键盘导航 - 增加焦点管理和错误处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 只在用户不正在输入时响应键盘事件
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(items.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext, goToSlide, items.length]);

  if (!items || items.length === 0) {
    return (
      <CarouselContainer height={height}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#666',
          fontSize: '16px'
        }}>
          暂无轮播内容
        </div>
      </CarouselContainer>
    );
  }

  const translateX = -currentIndex * 100;

  return (
    <CarouselContainer
      ref={containerRef}
      height={height}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CarouselTrack translateX={translateX}>
        {items.map((item) => (
          <CarouselSlide
            key={item.id}
            backgroundImage={item.image}
            isImageLoaded={loadedImages.has(item.image)}
            onClick={() => handleItemClick(item)}
            role="button"
            tabIndex={0}
            aria-label={`轮播图: ${item.title}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleItemClick(item);
              }
            }}
          >
            <GradientOverlay />
            <ContentContainer>
              <Title>{item.title}</Title>
              <Description>{item.description}</Description>
              {item.ctaText && (
                <CTAButton
                  onClick={(e) => handleCTAClick(e, item)}
                  aria-label={`操作: ${item.ctaText}`}
                >
                  {item.ctaText}
                </CTAButton>
              )}
            </ContentContainer>
          </CarouselSlide>
        ))}
      </CarouselTrack>

      {/* 左右箭头 */}
      {showArrows && items.length > 1 && (
        <>
          <ArrowButton
            direction="left"
            onClick={goToPrevious}
            aria-label="上一张"
          >
            <LeftOutlined />
          </ArrowButton>
          <ArrowButton
            direction="right"
            onClick={goToNext}
            aria-label="下一张"
          >
            <RightOutlined />
          </ArrowButton>
        </>
      )}

      {/* 指示器 */}
      {showDots && items.length > 1 && (
        <DotsContainer>
          {items.map((_, index) => (
            <Dot
              key={index}
              active={index === currentIndex}
              onClick={() => goToSlide(index)}
              aria-label={`第${index + 1}张`}
            />
          ))}
        </DotsContainer>
      )}
    </CarouselContainer>
  );
};

export default UniverseCarousel;