import React from 'react';
import { Card, Badge } from 'antd';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { ResponsiveGrid } from '../ui';
import type { GridItem as GridItemType } from '../../types';

// 样式化宫格项
const GridItemContainer = styled(motion.div)`
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #f0f0f0;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: #1890ff;
  }
`;

const GridIcon = styled.div<{ color?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.color || '#1890ff'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  margin-bottom: 8px;
  transition: transform 0.3s ease;
`;

const GridTitle = styled.div`
  font-size: 14px;
  color: #333;
  font-weight: 500;
  text-align: center;
`;

const GridBadge = styled(Badge)`
  position: absolute;
  top: 8px;
  right: 8px;
`;

// 宫格项组件属性
interface GridItemProps {
  item: GridItemType;
  onClick?: (item: GridItemType) => void;
}

// 宫格项组件
const GridItem: React.FC<GridItemProps> = ({ item, onClick }) => {
  const handleClick = () => {
    // 统计点击
    if (window.gtag) {
      window.gtag('event', 'grid_item_click', {
        grid_id: item.id,
        grid_title: item.title,
      });
    }

    onClick?.(item);

    // 处理跳转
    if (item.link) {
      window.location.href = item.link;
    }
  };

  return (
    <GridItemContainer
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {item.badge && item.badge > 0 && <GridBadge count={item.badge} size='small' />}
      <GridIcon color={item.color}>
        {/* 这里应该根据item.icon渲染对应的图标 */}
        <span>{item.icon}</span>
      </GridIcon>
      <GridTitle>{item.title}</GridTitle>
    </GridItemContainer>
  );
};

// 快速宫格组件属性
interface QuickGridProps {
  gridItems: GridItemType[];
  loading?: boolean;
  onItemClick?: (item: GridItemType) => void;
}

// 快速宫格组件
export const QuickGrid: React.FC<QuickGridProps> = ({ gridItems, loading, onItemClick }) => {
  // 容器动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // 子项动画变体
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  if (loading) {
    return (
      <Card title='快速服务' style={{ marginBottom: 24 }}>
        <ResponsiveGrid mobileCols={3} tabletCols={4} desktopCols={6}>
          {Array.from({ length: 6 }).map((_, index) => (
            <GridItemContainer key={index}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: '#f0f0f0',
                  marginBottom: 8,
                }}
              />
              <div
                style={{
                  width: 40,
                  height: 12,
                  background: '#f0f0f0',
                  borderRadius: 4,
                }}
              />
            </GridItemContainer>
          ))}
        </ResponsiveGrid>
      </Card>
    );
  }

  if (!gridItems || gridItems.length === 0) {
    return null;
  }

  return (
    <Card title='快速服务' style={{ marginBottom: 24 }}>
      <motion.div variants={containerVariants} initial='hidden' animate='visible'>
        <ResponsiveGrid mobileCols={3} tabletCols={4} desktopCols={6} gutter={[16, 16]}>
          {gridItems.map(item => (
            <motion.div key={item.id} variants={itemVariants}>
              <GridItem item={item} onClick={onItemClick} />
            </motion.div>
          ))}
        </ResponsiveGrid>
      </motion.div>
    </Card>
  );
};

export default QuickGrid;
