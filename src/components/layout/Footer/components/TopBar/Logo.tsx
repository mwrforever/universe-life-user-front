import React from 'react';
import { Typography } from 'antd';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import type { LogoProps } from '../../../types/component';

const { Title } = Typography;

// 样式化Logo容器
const LogoContainer = styled.div<{ size: 'small' | 'medium' | 'large' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.token?.paddingSM || 8}px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;

  // 尺寸配置
  ${({ size }) => {
    switch (size) {
      case 'small':
        return `
          .logo-icon {
            font-size: 20px;
            width: 20px;
            height: 20px;
          }
          .logo-text {
            font-size: 16px !important;
          }
        `;
      case 'large':
        return `
          .logo-icon {
            font-size: 32px;
            width: 32px;
            height: 32px;
          }
          .logo-text {
            font-size: 24px !important;
          }
        `;
      default: // medium
        return `
          .logo-icon {
            font-size: 24px;
            width: 24px;
            height: 24px;
          }
          .logo-text {
            font-size: 18px !important;
          }
        `;
    }
  }}

  &:hover {
    transform: translateY(-2px);

    .logo-text {
      color: ${({ theme }) => theme.token?.colorPrimary || '#1890ff'} !important;
    }
  }

  &:active {
    transform: translateY(0);
  }

  // 无障碍焦点样式
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.token?.colorPrimary || '#1890ff'};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.token?.borderRadius || 8}px;
  }
`;

// Logo图标容器
const LogoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  color: white;
  font-weight: bold;

  // 如果是图片URL
  &.is-image {
    background: transparent;
    border-radius: ${({ theme }) => theme.token?.borderRadius || 8}px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;

/**
 * 万象生活品牌Logo组件
 * 支持emoji、图标、图片等多种形式
 */
export const Logo: React.FC<LogoProps> = ({
  logo,
  onClick,
  className,
  size = 'medium'
}) => {
  const navigate = useNavigate();

  // 处理点击事件
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // 触发自定义事件
    onClick?.(e);

    // 导航到指定地址
    if (logo.href) {
      if (logo.external) {
        // 外部链接在新窗口打开
        window.open(logo.href, '_blank', 'noopener,noreferrer');
      } else {
        // 内部路由导航
        navigate(logo.href);
      }
    }
  };

  // 判断是否为图片URL
  const isImageUrl = (icon: string) => {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(icon);
  };

  // 渲染Logo图标
  const renderIcon = () => {
    const { icon } = logo;

    if (isImageUrl(icon)) {
      return (
        <LogoIcon className="logo-icon is-image">
          <img
            src={icon}
            alt={logo.alt || logo.text}
            loading="lazy"
          />
        </LogoIcon>
      );
    }

    return (
      <LogoIcon className="logo-icon" title={logo.alt || logo.text}>
        {icon}
      </LogoIcon>
    );
  };

  return (
    <LogoContainer
      size={size}
      className={className}
      onClick={handleClick}
      role="link"
      tabIndex={0}
      aria-label={logo.alt || logo.text}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as any);
        }
      }}
    >
      {renderIcon()}

      <Title
        level={3}
        className="logo-text"
        style={{
          margin: 0,
          color: 'inherit',
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}
        aria-hidden="true"
      >
        {logo.text}
      </Title>
    </LogoContainer>
  );
};

export default Logo;