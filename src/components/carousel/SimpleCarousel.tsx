import React, { useState } from 'react';
import styled from '@emotion/styled';

const CarouselContainer = styled.div`
  width: 100%;
  height: 400px;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
`;

const CarouselSlide = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
  background-size: cover;
  background-position: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1;
  }
`;

const SlideContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 20px;
`;

const SlideTitle = styled.h2`
  font-size: 32px;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
`;

const SlideDescription = styled.p`
  font-size: 18px;
  margin-bottom: 24px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
`;

const SlideButton = styled.button`
  padding: 12px 24px;
  background: #FF6B00;
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #FF8C00;
    transform: translateY(-2px);
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  z-index: 3;
  transition: all 0.3s ease;

  &:hover {
    background: white;
    transform: translateY(-50%) scale(1.1);
  }
`;

const PrevButton = styled(NavigationButton)`
  left: 16px;
`;

const NextButton = styled(NavigationButton)`
  right: 16px;
`;

const DotsContainer = styled.div`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 3;
`;

const Dot = styled.button<{ active: boolean }>`
  width: ${props => props.active ? '24px' : '8px'};
  height: 8px;
  background: ${props => props.active ? '#FF6B00' : 'rgba(255, 255, 255, 0.5)'};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? '#FF8C00' : 'rgba(255, 255, 255, 0.8)'};
  }
`;

interface SimpleCarouselProps {
  items: Array<{
    id: string;
    title: string;
    description: string;
    image: string;
    ctaText?: string;
  }>;
}

export const SimpleCarousel: React.FC<SimpleCarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!items || items.length === 0) {
    return <div>暂无轮播内容</div>;
  }

  const currentItem = items[currentIndex];

  return (
    <CarouselContainer>
      <CarouselSlide style={{ backgroundImage: `url(${currentItem.image})` }}>
        <SlideContent>
          <SlideTitle>{currentItem.title}</SlideTitle>
          <SlideDescription>{currentItem.description}</SlideDescription>
          {currentItem.ctaText && (
            <SlideButton onClick={() => alert(`点击了: ${currentItem.title}`)}>
              {currentItem.ctaText}
            </SlideButton>
          )}
        </SlideContent>
      </CarouselSlide>

      {items.length > 1 && (
        <>
          <PrevButton onClick={goToPrevious}>‹</PrevButton>
          <NextButton onClick={goToNext}>›</NextButton>
          <DotsContainer>
            {items.map((_, index) => (
              <Dot
                key={index}
                active={index === currentIndex}
                onClick={() => goToSlide(index)}
              />
            ))}
          </DotsContainer>
        </>
      )}
    </CarouselContainer>
  );
};

export default SimpleCarousel;