import React from 'react';
import { Tabs } from 'antd';
import { AppstoreOutlined, RiseOutlined, ClockCircleOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';

// 本地定义类型，避免导入问题
type FilterType = 'comprehensive' | 'price' | 'newest';

// 粘性过滤栏容器
const FilterBarContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 20px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  /* 添加阴影效果 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  /* 确保在滚动时保持固定 */
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #f0f0f0 20%, #f0f0f0 80%, transparent);
  }
`;

// 过滤栏内容区域
const FilterBarContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
`;

// 左侧标题
const FilterTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 8px;
`;

// 右侧统计信息
const FilterStats = styled.div`
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    display: none;
  }
`;

// 自定义Tabs样式
const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    margin: 0;

    &::before {
      border-bottom: none;
    }
  }

  .ant-tabs-tab {
    padding: 16px 0;
    margin: 0 20px;
    font-size: 16px;
    font-weight: 500;
    color: #666;
    border: none;
    position: relative;

    &:hover {
      color: #ff6000;
    }

    &.ant-tabs-tab-active {
      color: #ff6000;
      font-weight: 600;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 24px;
        height: 3px;
        background: #ff6000;
        border-radius: 2px;
      }
    }
  }

  .ant-tabs-ink-bar {
    display: none;
  }

  .ant-tabs-content-holder {
    display: none;
  }

  @media (max-width: 768px) {
    .ant-tabs-tab {
      margin: 0 12px;
      font-size: 14px;
    }
  }
`;

// 过滤项配置
const filterItems = [
  {
    key: 'comprehensive' as FilterType,
    label: '综合排序',
    icon: <AppstoreOutlined />,
  },
  {
    key: 'price' as FilterType,
    label: '价格优先',
    icon: <RiseOutlined />,
  },
  {
    key: 'newest' as FilterType,
    label: '最新发布',
    icon: <ClockCircleOutlined />,
  },
];

// 过滤栏属性
interface OrderFilterBarProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  totalCount?: number;
  loading?: boolean;
}

// OrderFilterBar 组件
const OrderFilterBar: React.FC<OrderFilterBarProps> = ({
  activeFilter,
  onFilterChange,
  totalCount = 0,
  loading = false
}) => {
  const tabItems = filterItems.map(item => ({
    key: item.key,
    label: (
      <div data-testid={`filter-${item.key}`} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {item.icon}
        <span>{item.label}</span>
      </div>
    ),
  }));

  return (
    <FilterBarContainer data-testid="order-filter-bar">
      <FilterBarContent>
        <FilterTitle data-testid="filter-title">
          <AppstoreOutlined />
          <span>订单广场</span>
        </FilterTitle>

        <StyledTabs
          data-testid="filter-tabs"
          activeKey={activeFilter}
          onChange={onFilterChange}
          items={tabItems}
          size="small"
        />

        <FilterStats data-testid="filter-stats">
          <span>共 {totalCount} 个订单</span>
          {loading && <span style={{ color: '#ff6000' }}>加载中...</span>}
        </FilterStats>
      </FilterBarContent>
    </FilterBarContainer>
  );
};

export default OrderFilterBar;