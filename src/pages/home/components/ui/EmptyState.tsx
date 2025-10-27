import React from 'react';
import { Empty, Button } from 'antd';
import styled from '@emotion/styled';

// 样式化容器
const EmptyContainer = styled.div`
  padding: 60px 20px;
  text-align: center;
`;

const EmptyDescription = styled.div`
  color: #999;
  font-size: 14px;
  margin-top: 16px;
  margin-bottom: 24px;
`;

const EmptyActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
`;

// 空状态组件属性
interface EmptyStateProps {
  image?: string;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  onRefresh?: () => void;
  onSetting?: () => void;
}

// 任务列表空状态
export const TaskEmptyState: React.FC<EmptyStateProps> = ({
  title = '暂无任务',
  description = '附近还没有发布的任务，换个筛选条件试试',
  onRefresh,
}) => {
  return (
    <EmptyContainer>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <EmptyDescription>
            {description}
          </EmptyDescription>
        }
      />
      <EmptyActions>
        {onRefresh && (
          <Button type="primary" onClick={onRefresh}>
            刷新试试
          </Button>
        )}
      </EmptyActions>
    </EmptyContainer>
  );
};

// 搜索结果空状态
export const SearchEmptyState: React.FC<EmptyStateProps> = ({
  title = '未找到相关内容',
  description = '换个关键词或筛选条件试试',
  onRefresh,
}) => {
  return (
    <EmptyContainer>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <EmptyDescription>
            {description}
          </EmptyDescription>
        }
      />
      <EmptyActions>
        {onRefresh && (
          <Button onClick={onRefresh}>
            清空筛选
          </Button>
        )}
      </EmptyActions>
    </EmptyContainer>
  );
};

// 网络错误空状态
export const NetworkErrorState: React.FC<EmptyStateProps> = ({
  title = '网络连接异常',
  description = '请检查网络连接后重试',
  onRefresh,
}) => {
  return (
    <EmptyContainer>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <EmptyDescription>
            {description}
          </EmptyDescription>
        }
      />
      <EmptyActions>
        {onRefresh && (
          <Button type="primary" onClick={onRefresh}>
            重新加载
          </Button>
        )}
      </EmptyActions>
    </EmptyContainer>
  );
};

export default EmptyState;