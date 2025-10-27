import React from 'react';
import { Tabs } from 'antd';
import styled from '@emotion/styled';
import { useTaskFilter } from '../../hooks';

// 样式化导航容器
const NavigationContainer = styled.div`
  background: #fff;
  padding: 0 16px;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 73px; // 头部高度
  z-index: 99;
`;

const NavigationContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

// 导航标签配置
const navItems = [
  {
    key: 'latest',
    label: '综合',
  },
  {
    key: 'budget_high',
    label: '高价',
  },
  {
    key: 'distance',
    label: '距离',
  },
  {
    key: 'urgent',
    label: '加急',
  },
];

// 导航组件属性
interface NavigationProps {
  onTabChange?: (activeKey: string) => void;
  activeKey?: string;
}

// 导航组件
export const Navigation: React.FC<NavigationProps> = ({
  onTabChange,
  activeKey = 'latest',
}) => {
  const { filter, updateSortBy, resetFilter } = useTaskFilter();

  const handleTabChange = (key: string) => {
    // 重置筛选条件并更新排序
    resetFilter();

    // 根据tab key更新筛选条件
    switch (key) {
      case 'latest':
        updateSortBy('latest');
        break;
      case 'budget_high':
        updateSortBy('budget_high');
        break;
      case 'distance':
        updateSortBy('distance');
        break;
      case 'urgent':
        updateSortBy('deadline');
        updateFilter({ isUrgent: true });
        break;
    }

    onTabChange?.(key);
  };

  return (
    <NavigationContainer>
      <NavigationContent>
        <Tabs
          activeKey={activeKey}
          onChange={handleTabChange}
          centered
          size="large"
          items={navItems.map(item => ({
            key: item.key,
            label: item.label,
          }))}
          style={{
            marginBottom: 0,
          }}
        />
      </NavigationContent>
    </NavigationContainer>
  );
};

export default Navigation;