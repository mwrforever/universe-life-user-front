import React, { useCallback } from 'react';
import { InfiniteScroll, Spin } from 'antd';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { TaskCard } from './TaskCard';
import { TaskEmptyState, NetworkErrorState } from '../ui';
import { useTaskInfinite } from '../../hooks';
import { Task } from '../../types';

// 样式化任务列表容器
const TaskListContainer = styled.div`
  min-height: 400px;
`;

const TaskListContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// 加载更多指示器
const LoadMoreIndicator = styled.div`
  text-align: center;
  padding: 24px;
`;

// 任务列表组件属性
interface TaskListProps {
  filter?: unknown;
  onTaskView?: (task: Task) => void;
  onTaskFavorite?: (taskId: string, isFavorite: boolean) => void;
}

// 任务列表组件
export const TaskList: React.FC<TaskListProps> = ({
  filter,
  onTaskView,
  onTaskFavorite,
}) => {
  const { tasks, isLoading, isFetching, hasNextPage, fetchNextPage, error, grabTask, isGrabbing } =
    useTaskInfinite(filter);

  // 处理加载更多
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetching, fetchNextPage]);

  // 处理任务接单
  const handleTaskGrab = useCallback(
    async (taskId: string) => {
      try {
        await grabTask(taskId);
        // 可以在这里显示成功提示
      } catch (error) {
        // 可以在这里显示错误提示
        console.error('接单失败:', error);
      }
    },
    [grabTask]
  );

  // 错误状态
  if (error) {
    return (
      <TaskListContainer>
        <NetworkErrorState onRefresh={() => window.location.reload()} />
      </TaskListContainer>
    );
  }

  // 加载状态
  if (isLoading && tasks.length === 0) {
    return (
      <TaskListContainer>
        <LoadMoreIndicator>
          <Spin size='large' />
          <div style={{ marginTop: 16, color: '#999' }}>加载任务中...</div>
        </LoadMoreIndicator>
      </TaskListContainer>
    );
  }

  // 空状态
  if (!isLoading && tasks.length === 0) {
    return (
      <TaskListContainer>
        <TaskEmptyState />
      </TaskListContainer>
    );
  }

  // 列表动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

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

  return (
    <TaskListContainer>
      <InfiniteScroll
        next={handleLoadMore}
        hasMore={hasNextPage}
        loader={
          <LoadMoreIndicator>
            <Spin />
            <div style={{ marginTop: 8, color: '#999' }}>
              {isFetching ? '加载中...' : '上拉加载更多'}
            </div>
          </LoadMoreIndicator>
        }
        endMessage={
          <div style={{ textAlign: 'center', padding: '24px', color: '#999' }}>
            {tasks.length > 0 ? '没有更多任务了' : ''}
          </div>
        }
        dataLength={tasks.length}
        hasChildren={tasks.length > 0}
      >
        <TaskListContent variants={containerVariants} initial='hidden' animate='visible'>
          {tasks.map((task) => (
            <motion.div key={task.id} variants={itemVariants}>
              <TaskCard
                task={task}
                onGrab={handleTaskGrab}
                onFavorite={onTaskFavorite}
                onView={onTaskView}
                isGrabbing={isGrabbing}
              />
            </motion.div>
          ))}
        </TaskListContent>
      </InfiniteScroll>

      {/* 底部加载指示器 */}
      {isFetching && (
        <LoadMoreIndicator>
          <Spin />
          <div style={{ marginTop: 8, color: '#999' }}>加载中...</div>
        </LoadMoreIndicator>
      )}
    </TaskListContainer>
  );
};

export default TaskList;
