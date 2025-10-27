/**
 * 万象生活优化图片组件
 * 提供懒加载、WebP支持、性能监控等功能
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Image, Skeleton } from 'antd';
import styled from '@emotion/styled';
import { createMediaQuery } from '../styles';

const StyledImage = styled(Image)`
  .ant-image {
    border-radius: var(--footer-radius-base, 6px);
    overflow: hidden;
    transition: var(--footer-transition-base, 0.3s cubic-bezier(0.4, 0, 0.2, 1));
  }

  .ant-image:hover {
    transform: scale(1.02);
    box-shadow: var(--footer-shadow-base, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06));
  }

  .ant-image img {
    transition: opacity var(--footer-transition-fast, 0.1s cubic-bezier(0.4, 0, 0.2, 1));
  }

  ${createMediaQuery('md')} {
    .ant-image:hover {
      transform: none;
    }
  }
`;

const ImageWrapper = styled.div<{ loaded: boolean; error: boolean }>`
  position: relative;
  overflow: hidden;
  border-radius: var(--footer-radius-base, 6px);
  background: var(--footer-bg-secondary, #fafafa);
  transition: var(--footer-transition-base, 0.3s cubic-bezier(0.4, 0, 0.2, 1));

  ${props => props.loaded && `
    .image-skeleton {
      opacity: 0;
      visibility: hidden;
    }
  `}

  ${props => props.error && `
    background: var(--footer-error-bg, #fff2f0);
    border: 1px solid var(--footer-error-border, #ffccc7);
  `}

  /* 加载状态 */
  .image-skeleton {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 1;
    transition: opacity var(--footer-transition-base, 0.3s cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* 错误状态 */
  .image-error {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--footer-error, #ff4d4f);
    font-size: var(--footer-font-size-lg, 16px);
    text-align: center;
  }
`;

const PlaceholderIcon = styled.div`
  width: 48px;
  height: 48px;
  margin: 0 auto var(--footer-space-sm, 8px);
  background: var(--footer-error, #ff4d4f);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
`;

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  lazy?: boolean;
  webp?: boolean;
  fallbackSrc?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
  quality?: number;
  sizes?: string;
}

/**
 * 优化图片组件
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width = '100%',
  height = 'auto',
  className,
  style,
  lazy = true,
  webp = true,
  fallbackSrc,
  placeholder,
  onLoad,
  onError,
  priority = false,
  quality = 80,
  sizes = '(max-width: 768px) 100vw, 50vw',
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 检查WebP支持
  const checkWebPSupport = useCallback((): boolean => {
    if (!webp) return false;

    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }, [webp]);

  // 生成优化后的图片URL
  const generateOptimizedSrc = useCallback((originalSrc: string): string => {
    try {
      const url = new URL(originalSrc, window.location.origin);

      // 添加质量参数
      if (url.searchParams.has('quality') === false) {
        url.searchParams.set('quality', quality.toString());
      }

      // 添加WebP格式支持
      if (checkWebPSupport() && !url.searchParams.has('format')) {
        url.searchParams.set('format', 'webp');
      }

      // 添加响应式参数
      if (url.searchParams.has('responsive') === false) {
        url.searchParams.set('responsive', 'true');
      }

      return url.toString();
    } catch (error) {
      // 如果URL解析失败，返回原始URL
      return originalSrc;
    }
  }, [checkWebPSupport, quality]);

  // 处理图片加载
  const handleImageLoad = useCallback(() => {
    setLoaded(true);
    setError(false);
    onLoad?.();

    // 性能监控
    if (imgRef.current && 'performance' in window) {
      const loadTime = performance.now() - (imgRef.current as any).loadStartTime;
      console.log(`Image load time: ${loadTime.toFixed(2)}ms`, src);
    }
  }, [onLoad, src]);

  // 处理图片加载错误
  const handleImageError = useCallback(() => {
    setError(true);
    setLoaded(false);
    onError?.();

    // 尝试加载备用图片
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setError(false);
    }
  }, [onError, fallbackSrc, currentSrc]);

  // 设置懒加载观察器
  const setupIntersectionObserver = useCallback(() => {
    if (!lazy || priority) return;

    if (!('IntersectionObserver' in window)) {
      // 不支持IntersectionObserver，直接加载图片
      setCurrentSrc(generateOptimizedSrc(src));
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSrc(generateOptimizedSrc(src));
            observerRef.current?.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // 提前50px开始加载
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }
  }, [lazy, priority, src, generateOptimizedSrc]);

  // 组件挂载时的处理
  useEffect(() => {
    if (priority || !lazy) {
      // 高优先级或非懒加载，立即加载
      setCurrentSrc(generateOptimizedSrc(src));
    } else {
      // 设置懒加载
      setupIntersectionObserver();
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority, lazy, src, generateOptimizedSrc, setupIntersectionObserver]);

  // 生成图片样式
  const imageStyle: React.CSSProperties = {
    width,
    height,
    objectFit: 'cover',
    opacity: loaded ? 1 : 0,
    transition: 'opacity 0.3s ease',
    ...style,
  };

  // 生成占位符
  const renderPlaceholder = () => {
    if (placeholder) {
      return (
        <div
          className="image-skeleton"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${placeholder})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(5px)',
            transform: 'scale(1.1)',
          }}
        />
      );
    }

    return (
      <div className="image-skeleton">
        <Skeleton.Image
          style={{
            width: '100%',
            height: '100%'
          }}
          active
        />
      </div>
    );
  };

  // 生成错误状态
  const renderError = () => (
    <div className="image-error">
      <PlaceholderIcon>⚠️</PlaceholderIcon>
      <div>图片加载失败</div>
    </div>
  );

  return (
    <ImageWrapper loaded={loaded} error={error} className={className} style={style}>
      {/* 占位符 */}
      {!loaded && !error && renderPlaceholder()}

      {/* 错误状态 */}
      {error && renderError()}

      {/* 实际图片 */}
      {!error && currentSrc && (
        <StyledImage
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          preview={false}
          style={imageStyle}
          onLoad={handleImageLoad}
          onError={handleImageError}
          fallback={fallbackSrc}
          sizes={sizes}
          loading={lazy && !priority ? 'lazy' : 'eager'}
          decoding="async"
        />
      )}

      {/* 图片加载时间记录（用于性能分析） */}
      {process.env.NODE_ENV === 'development' && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof performance !== 'undefined' && performance.mark) {
                  performance.mark('image-load-start-${src.replace(/[^a-zA-Z0-9]/g, '')}');
                }
              })();
            `,
          }}
        />
      )}
    </ImageWrapper>
  );
};

/**
 * 微信二维码优化图片组件
 */
export const WeChatQRImage: React.FC<Omit<OptimizedImageProps, 'alt' | 'priority'>> = (props) => {
  return (
    <OptimizedImage
      {...props}
      alt="微信公众号二维码"
      priority={true}
      quality={90}
      webp={true}
      style={{
        width: 120,
        height: 120,
        borderRadius: 'var(--footer-radius-sm, 4px)',
        ...props.style,
      }}
    />
  );
};

/**
 * 社交媒体图标优化图片组件
 */
export const SocialIconImage: React.FC<Omit<OptimizedImageProps, 'alt'>> = (props) => {
  return (
    <OptimizedImage
      {...props}
      alt="社交媒体图标"
      quality={80}
      webp={true}
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        ...props.style,
      }}
    />
  );
};

export default OptimizedImage;