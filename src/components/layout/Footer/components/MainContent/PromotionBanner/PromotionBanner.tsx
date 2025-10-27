import React, { useState } from 'react';
import { Button, ConfigProvider } from 'antd';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import type { PromotionBanner as PromotionBannerType } from '../../../types/component';

// 样式化推广横幅容器
const StyledPromotionBannerContainer = styled.div<{
  backgroundColor?: string;
  textColor?: string;
  backgroundImage?: string;
}>`
  position: relative;
  border-radius: ${({ theme }) => theme.token?.borderRadius || 12}px;
  padding: 32px 24px;
  margin: 24px 0;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  // 背景样式
  ${({ backgroundColor, backgroundImage, theme }) => {
    if (backgroundImage) {
      return `
        background-image: url(${backgroundImage});
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          z-index: 1;
        }
      `;
    } else if (backgroundColor) {
      return `
        background: ${backgroundColor};
      `;
    } else {
      return `
        background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
      `;
    }
  }}

  // 文字颜色
  color: ${({ textColor }) => textColor || '#ffffff'};

  // 悬停效果
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  // 内容容器
  .promotion-content {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;

    @media (max-width: 768px) {
      flex-direction: column;
      text-align: center;
      gap: 16px;
    }
  }

  // 文字内容
  .promotion-text {
    flex: 1;

    .promotion-title {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 8px 0;
      line-height: 1.2;

      @media (max-width: 768px) {
        font-size: 20px;
      }

      @media (max-width: 576px) {
        font-size: 18px;
      }
    }

    .promotion-description {
      font-size: 16px;
      margin: 0;
      opacity: 0.9;
      line-height: 1.4;

      @media (max-width: 768px) {
        font-size: 14px;
      }
    }
  }

  // 按钮区域
  .promotion-actions {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-shrink: 0;

    @media (max-width: 768px) {
      justify-content: center;
    }
  }

  // 关闭按钮
  .promotion-close {
    position: absolute;
    top: 16px;
    right: 16px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: inherit;
    font-size: 16px;
    transition: all 0.3s ease;
    z-index: 3;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.95);
    }

    @media (max-width: 576px) {
      top: 12px;
      right: 12px;
      width: 28px;
      height: 28px;
      font-size: 14px;
    }
  }

  // 装饰元素
  .promotion-decoration {
    position: absolute;
    pointer-events: none;

    &.decoration-1 {
      top: 10%;
      left: 5%;
      width: 60px;
      height: 60px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
    }

    &.decoration-2 {
      bottom: 15%;
      right: 8%;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 50%;
    }
  }

  // 动画效果
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  .promotion-decoration {
    animation: float 3s ease-in-out infinite;
  }

  .promotion-decoration.decoration-2 {
    animation-delay: 1.5s;
  }
`;

interface PromotionBannerProps {
  promotion: PromotionBannerType;
  className?: string;
  onClick?: (promotion: PromotionBannerType) => void;
  onClose?: () => void;
}

/**
 * 万象生活推广横幅组件
 * 支持背景图片、渐变色、关闭按钮、响应式布局
 */
export const PromotionBanner: React.FC<PromotionBannerProps> = ({
  promotion,
  className,
  onClick,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  // 处理横幅点击
  const handleBannerClick = () => {
    // 触发外部事件回调
    onClick?.(promotion);

    // 发送分析事件
    if (promotion.analytics) {
      console.log('Analytics Event:', promotion.analytics);
    }

    // 处理链接跳转
    if (promotion.link) {
      navigate(promotion.link);
    }
  };

  // 处理关闭按钮点击
  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡

    setIsVisible(false);

    // 触发关闭事件
    onClose?.();

    // 发送分析事件（如果需要）
    console.log('Promotion banner closed');

    // 动画结束后移除组件
    setTimeout(() => {
      // 这里可以由父组件控制渲染
    }, 300);
  };

  // 处理按钮点击
  const handleButtonClick = (e: React.MouseEvent, buttonHref?: string) => {
    e.stopPropagation(); // 阻止事件冒泡

    if (buttonHref) {
      navigate(buttonHref);
    } else {
      handleBannerClick();
    }
  };

  // 如果不可见，返回null
  if (!isVisible) {
    return null;
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: promotion.textColor || '#ffffff',
        },
      }}
    >
      <StyledPromotionBannerContainer
        backgroundColor={promotion.backgroundColor}
        textColor={promotion.textColor}
        backgroundImage={promotion.image}
        className={className}
        onClick={handleBannerClick}
        role="banner"
        aria-label={promotion.title}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleBannerClick();
          }
        }}
      >
        {/* 装饰元素 */}
        <div className="promotion-decoration decoration-1" />
        <div className="promotion-decoration decoration-2" />

        {/* 关闭按钮 */}
        {promotion.closable && (
          <button
            className="promotion-close"
            onClick={handleCloseClick}
            aria-label="关闭推广横幅"
          >
            ×
          </button>
        )}

        {/* 主要内容 */}
        <div className="promotion-content">
          {/* 文字内容 */}
          <div className="promotion-text">
            <h3 className="promotion-title">{promotion.title}</h3>
            {promotion.description && (
              <p className="promotion-description">{promotion.description}</p>
            )}
          </div>

          {/* 操作按钮 */}
          {(promotion.button || promotion.link) && (
            <div className="promotion-actions">
              {promotion.button ? (
                <Button
                  type={promotion.button.type || 'primary'}
                  size="large"
                  onClick={(e) => handleButtonClick(e, promotion.button?.href)}
                  style={{
                    background: promotion.button.type === 'primary'
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'transparent',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    color: 'inherit',
                    backdropFilter: 'blur(10px)',
                    border: promotion.button.type === 'primary'
                      ? '1px solid rgba(255, 255, 255, 0.3)'
                      : '1px solid rgba(255, 255, 255, 0.5)',
                  }}
                >
                  {promotion.button.text}
                </Button>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  ghost
                  onClick={handleBannerClick}
                  style={{
                    color: 'inherit',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  了解更多
                </Button>
              )}
            </div>
          )}
        </div>
      </StyledPromotionBannerContainer>
    </ConfigProvider>
  );
};

export default PromotionBanner;