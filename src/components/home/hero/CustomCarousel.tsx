import React, { useState, useCallback } from 'react';
import { Carousel } from 'antd';
import styled from '@emotion/styled';
import { uiLogger } from '@/utils/logger';

// 内联类型定义
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

// 样式化组件
const CarouselContainer = styled.div`
  position: relative;
  border-radius: 0 16px 16px 0;
  overflow: hidden;
  height: 400px;
  background: #f5f5f5;

  .ant-carousel {
    height: 100%;
  }

  .ant-carousel .slick-list {
    height: 100%;
    border-radius: 0 16px 16px 0;
  }

  .ant-carousel .slick-slide {
    height: 400px;
  }

  .ant-carousel .slick-slide > div {
    height: 100%;
  }
`;

const CarouselSlide = styled.div<{ $background?: string; $textColor?: string }>`
  height: 100%;
  background: ${props => props.$background || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: ${props => props.$textColor || '#ffffff'};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const SlideImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
`;

const SlideOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 100%);
  z-index: 2;
`;

const SlideContent = styled.div`
  position: relative;
  z-index: 3;
  text-align: center;
  padding: 0 60px;
  max-width: 800px;
`;

const SlideTitle = styled.h2`
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 0.8s ease-out;

  @media (max-width: 768px) {
    font-size: 32px;
    margin-bottom: 12px;
  }
`;

const SlideSubtitle = styled.p`
  font-size: 20px;
  margin-bottom: 32px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 0.8s ease-out 0.2s both;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 24px;
  }
`;

const SlideButton = styled.button<{ $color?: string }>`
  background: ${props => props.$color || '#ff6b00'};
  color: white;
  border: none;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 0.8s ease-out 0.4s both;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    padding: 10px 24px;
    font-size: 14px;
  }
`;

// 自定义指示器样式
const CustomDots = styled.ul`
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  padding: 0;
  margin: 0;
  list-style: none;
  z-index: 4;
`;

const DotItem = styled.li<{ $active?: boolean; $color?: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.$active
    ? (props.$color || '#ff6b00')
    : 'rgba(255, 255, 255, 0.4)'};
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    background: ${props => props.$color || '#ff6b00'};
    transform: scale(1.2);
  }
`;

// 组件Props接口
interface CustomCarouselProps {
  items: CarouselItem[];
  autoplay?: boolean;
  autoplayInterval?: number;
  showDots?: boolean;
  onItemChange?: (current: number, next: number) => void;
  onItemClick?: (item: CarouselItem) => void;
}

// CustomCarousel组件
export const CustomCarousel: React.FC<CustomCarouselProps> = ({
  items,
  autoplay = true,
  autoplayInterval = 4000,
  showDots = true,
  onItemChange,
  onItemClick
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // 调试日志
  React.useEffect(() => {
    uiLogger.debug('CustomCarousel items:', items);
    uiLogger.debug('Items count:', items.length);
  }, [items]);

  const handleBeforeChange = useCallback((current: number, next: number) => {
    setCurrentSlide(next);
    onItemChange?.(current, next);
  }, [onItemChange]);

  const handleItemClick = useCallback((item: CarouselItem) => {
    onItemClick?.(item);

    // 处理链接跳转
    if (item.ctaLink) {
      if (item.type === 'external') {
        window.open(item.ctaLink, '_blank', 'noopener,noreferrer');
      } else {
        // 使用 React Router 进行内部导航
        // 这里需要传入 router 或者使用全局的导航方法
        uiLogger.info('Navigate to:', item.ctaLink);
      }
    }
  }, [onItemClick]);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  // 自定义指示器组件
  const customDots = (
    <CustomDots>
      {items.map((item) => (
        <DotItem
          key={item.id}
          $active={currentSlide === items.findIndex(i => i.id === item.id)}
          $color={item.backgroundColor?.match(/#[a-fA-F0-9]{6}/)?.[0] || '#ff6b00'}
          onClick={() => handleDotClick(items.findIndex(i => i.id === item.id))}
        />
      ))}
    </CustomDots>
  );

  return (
    <CarouselContainer>
      <Carousel
        autoplay={autoplay}
        autoplaySpeed={autoplayInterval}
        dots={showDots}
        dotsClass="custom-dots"
        beforeChange={handleBeforeChange}
        effect="fade"
      >
        {items.map((item) => (
          <div key={item.id}>
            <CarouselSlide
              $background={item.backgroundColor}
              $textColor={item.textColor}
              onClick={() => handleItemClick(item)}
            >
              {item.image && (
                <SlideImage
                  src={item.image}
                  alt={item.title}
                  onError={(e) => {
                    // 图片加载失败时隐藏图片，显示渐变背景
                    e.currentTarget.style.display = 'none';
                    uiLogger.warn('Image load failed:', item.image);
                  }}
                  onLoad={() => {
                    uiLogger.debug('Image loaded successfully:', item.image);
                  }}
                />
              )}
              <SlideOverlay />
              <SlideContent>
                <SlideTitle>{item.title}</SlideTitle>
                {item.subtitle && (
                  <SlideSubtitle>{item.subtitle}</SlideSubtitle>
                )}
                {item.ctaText && (
                  <SlideButton
                    $color={item.backgroundColor?.match(/#[a-fA-F0-9]{6}/)?.[0] || '#ff6b00'}
                  >
                    {item.ctaText}
                  </SlideButton>
                )}
              </SlideContent>
            </CarouselSlide>
          </div>
        ))}
      </Carousel>
      {showDots && customDots}
    </CarouselContainer>
  );
};

export default CustomCarousel;