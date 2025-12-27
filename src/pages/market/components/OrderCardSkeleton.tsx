import React from 'react';
import { Card } from 'antd';
import styled from '@emotion/styled';

// 骨架屏卡片样式 - 增强版淘宝风格
const SkeletonCard = styled(Card)`
  width: 100%;
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.3s ease;

  .ant-card-body {
    padding: 16px;
  }

  /* 悬停时轻微上浮效果 */
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }
`;

// 增强版骨架屏视觉锚点 - 更真实的渐变效果
const SkeletonVisualAnchor = styled.div`
  width: 100%;
  height: 160px;
  background: linear-gradient(
    270deg,
    #f5f5f5 0%,
    #eeeeee 20%,
    #f0f0f0 40%,
    #e8e8e8 60%,
    #f5f5f5 80%,
    #eeeeee 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.8s ease-in-out infinite;
  position: relative;
  overflow: hidden;

  /* 添加微妙的边框光晕效果 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
    animation: shimmer-line 2s ease-in-out infinite;
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    50% {
      background-position: 100% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  @keyframes shimmer-line {
    0%, 100% {
      transform: translateX(-100%);
    }
    50% {
      transform: translateX(100%);
    }
  }
`;

// 增强版骨架屏内容区域 - 自定义Shimmer效果
const SkeletonContent = styled.div`
  .skeleton-title {
    height: 44px;
    margin: 12px 0 8px 0;
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 200% 100%;
    border-radius: 6px;
    animation: shimmer-text 2s ease-in-out infinite;
  }

  .skeleton-tags {
    height: 28px;
    margin: 8px 0;
    background: linear-gradient(
      90deg,
      #f5f5f5 25%,
      #eeeeee 50%,
      #f5f5f5 75%
    );
    background-size: 200% 100%;
    border-radius: 14px;
    animation: shimmer-text 1.8s ease-in-out infinite;
    animation-delay: 0.2s;
  }

  .skeleton-price {
    height: 32px;
    margin: 12px 0 8px 0;
    background: linear-gradient(
      90deg,
      #f8f8f8 25%,
      #f0f0f0 50%,
      #f8f8f8 75%
    );
    background-size: 200% 100%;
    border-radius: 4px;
    animation: shimmer-text 2.2s ease-in-out infinite;
    animation-delay: 0.4s;
  }

  .skeleton-stats {
    height: 20px;
    margin-top: 8px;
    background: linear-gradient(
      90deg,
      #fafafa 25%,
      #f5f5f5 50%,
      #fafafa 75%
    );
    background-size: 200% 100%;
    border-radius: 10px;
    animation: shimmer-text 1.6s ease-in-out infinite;
    animation-delay: 0.6s;
  }

  @keyframes shimmer-text {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

// 增强版骨架屏组件
const OrderCardSkeleton: React.FC = () => {
  return (
    <SkeletonCard>
      <SkeletonVisualAnchor />
      <SkeletonContent>
        {/* 标题骨架 - 支持两行文本 */}
        <div className="skeleton-title" />

        {/* 标签骨架 */}
        <div
          className="skeleton-tags"
          style={{ width: '60%' }}
        />

        {/* 价格骨架 */}
        <div
          className="skeleton-price"
          style={{ width: '80%' }}
        />

        {/* 统计信息骨架 */}
        <div
          className="skeleton-stats"
          style={{ width: '40%' }}
        />
      </SkeletonContent>
    </SkeletonCard>
  );
};

// 骨架屏网格组件
export const OrderCardSkeletonGrid: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '20px',
      padding: '20px'
    }}>
      {Array.from({ length: count }).map((_, index) => (
        <OrderCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default OrderCardSkeleton;