import React, { useState, useRef, useEffect } from 'react';
import { Image } from 'antd';
import styled from '@emotion/styled';

// 样式化图片容器
const ImageContainer = styled.div<{ aspectRatio?: number }>`
  position: relative;
  overflow: hidden;
  background: #f5f5f5;
  border-radius: 8px;
  ${props => props.aspectRatio && `aspect-ratio: ${props.aspectRatio};`}
`;

const Placeholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 12px;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

// 懒加载图片组件属性
interface LazyImageProps {
  src: string;
  alt: string;
  fallback?: string;
  aspectRatio?: number;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  onClick?: () => void;
}

// 懒加载图片组件
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  fallback = '/images/placeholder.png',
  aspectRatio,
  className,
  style,
  onLoad,
  onError,
  onClick,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 使用Intersection Observer检测图片是否进入视口
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px', // 提前50px开始加载
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <ImageContainer
      ref={containerRef}
      aspectRatio={aspectRatio}
      className={className}
      style={style}
      onClick={onClick}
    >
      {!isLoaded && !hasError && (
        <Placeholder>
          {!isInView ? '等待加载' : '加载中...'}
        </Placeholder>
      )}
      {isInView && (
        <StyledImage
          ref={imgRef}
          src={hasError ? fallback : src}
          alt={alt}
          preview={false}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}
    </ImageContainer>
  );
};

export default LazyImage;