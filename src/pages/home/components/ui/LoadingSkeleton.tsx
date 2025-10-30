import React from 'react';
import { Skeleton, Card } from 'antd';
import styled from '@emotion/styled';

// 骨架屏容器
const SkeletonContainer = styled.div`
  padding: 16px;
`;

// 任务卡片骨架屏
export const TaskCardSkeleton: React.FC = () => {
  return (
    <Card hoverable style={{ marginBottom: 16 }}>
      <SkeletonContainer>
        <Skeleton.Image style={{ width: '100%', height: 160, marginBottom: 12 }} />
        <Skeleton active paragraph={{ rows: 2, width: ['80%', '60%'] }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
          <Skeleton.Button size='small' style={{ width: 80 }} />
          <Skeleton.Button size='small' style={{ width: 60 }} />
        </div>
      </SkeletonContainer>
    </Card>
  );
};

// 轮播图骨架屏
export const BannerSkeleton: React.FC = () => {
  return (
    <Skeleton.Image
      style={{
        width: '100%',
        height: 180,
        borderRadius: 8,
        marginBottom: 24,
      }}
      active
    />
  );
};

// 宫格项骨架屏
export const GridItemSkeleton: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '20px 10px' }}>
      <Skeleton.Avatar size={48} style={{ marginBottom: 8 }} />
      <Skeleton.Button size='small' style={{ width: 60, margin: '0 auto' }} />
    </div>
  );
};

// 列表骨架屏
export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div>
      {Array.from({ length: count }).map((_, index) => (
        <TaskCardSkeleton key={index} />
      ))}
    </div>
  );
};

// 通用骨架屏组件
const LoadingSkeleton: React.FC<{ type?: 'card' | 'list' | 'banner' }> = ({ type = 'card' }) => {
  switch (type) {
    case 'list':
      return <ListSkeleton />;
    case 'banner':
      return <BannerSkeleton />;
    default:
      return <TaskCardSkeleton />;
  }
};

export default LoadingSkeleton;
