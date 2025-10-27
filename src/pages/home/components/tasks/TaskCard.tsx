import React from 'react';
import {
  Card,
  Tag,
  Progress,
  Button,
  Avatar,
  Typography,
  Space,
  Divider,
  Tooltip
} from 'antd';
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  UserOutlined,
  HeartOutlined,
  HeartFilled,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { LazyImage } from '../ui';
import { Task } from '../../types';

const { Text, Title } = Typography;

// 样式化任务卡片
const TaskCardContainer = styled(motion(Card))<{ priority?: string }>`
  margin-bottom: 16px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  border-left: 4px solid ${props => {
    switch (props.priority) {
      case 'urgent': return '#ff4d4f';
      case 'high': return '#fa8c16';
      case 'normal': return '#1890ff';
      default: return '#d9d9d9';
    }
  }};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

// 急任务角标
const UrgentBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: #ff4d4f;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  z-index: 1;
`;

// 任务图片容器
const TaskImageContainer = styled.div`
  position: relative;
  height: 160px;
  overflow: hidden;
  margin: -16px -16px 12px -16px;
`;

// 任务内容区域
const TaskContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

// 任务头部信息
const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

// 任务标签区域
const TaskTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
`;

// 任务底部信息
const TaskFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
`;

// 用户信息区域
const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// 价格显示
const PriceText = styled(Text)`
  font-size: 18px;
  font-weight: 600;
  color: #ff4d4f;
`;

// 任务卡片组件属性
interface TaskCardProps {
  task: Task;
  onGrab?: (taskId: string) => void;
  onFavorite?: (taskId: string, isFavorite: boolean) => void;
  onView?: (task: Task) => void;
  isGrabbing?: boolean;
  isFavorite?: boolean;
}

// 任务卡片组件
export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onGrab,
  onFavorite,
  onView,
  isGrabbing = false,
  isFavorite = false,
}) => {
  const handleCardClick = () => {
    onView?.(task);
  };

  const handleGrab = (e: React.MouseEvent) => {
    e.stopPropagation();
    onGrab?.(task.id);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.(task.id, !isFavorite);
  };

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 跳转到用户详情页
    window.location.href = `/user/${task.publisher.id}`;
  };

  // 格式化距离显示
  const formatDistance = (distance?: number) => {
    if (!distance) return '';
    if (distance < 1000) return `${distance}m`;
    return `${(distance / 1000).toFixed(1)}km`;
  };

  // 格式化截止时间
  const formatDeadline = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `剩余${days}天`;
    if (hours > 0) return `剩余${hours}小时`;
    return '即将截止';
  };

  // 获取任务状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'in_progress': return 'blue';
      case 'completed': return 'green';
      case 'cancelled': return 'default';
      case 'expired': return 'red';
      default: return 'default';
    }
  };

  // 获取任务状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待接单';
      case 'in_progress': return '进行中';
      case 'completed': return '已完成';
      case 'cancelled': return '已取消';
      case 'expired': return '已过期';
      default: return '未知';
    }
  };

  return (
    <TaskCardContainer
      priority={task.priority}
      hoverable
      onClick={handleCardClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* 急任务角标 */}
      {task.isUrgent && (
        <UrgentBadge>
          <ExclamationCircleOutlined /> 急
        </UrgentBadge>
      )}

      {/* 任务图片 */}
      {task.images && task.images.length > 0 && (
        <TaskImageContainer>
          <LazyImage
            src={task.images[0]}
            alt={task.title}
            aspectRatio={16 / 9}
          />
        </TaskImageContainer>
      )}

      {/* 任务内容 */}
      <TaskContent>
        {/* 任务标题和状态 */}
        <TaskHeader>
          <Title level={4} ellipsis={{ rows: 2 }} style={{ margin: 0, flex: 1 }}>
            {task.title}
          </Title>
          <Tag color={getStatusColor(task.status)}>
            {getStatusText(task.status)}
          </Tag>
        </TaskHeader>

        {/* 任务描述 */}
        <Text type="secondary" ellipsis={{ rows: 2 }}>
          {task.description}
        </Text>

        {/* 任务标签 */}
        <TaskTags>
          {task.category && (
            <Tag color="blue">{task.category}</Tag>
          )}
          {task.isRemote && (
            <Tag color="green">远程</Tag>
          )}
          {task.tags.slice(0, 3).map(tag => (
            <Tag key={tag} color="default">{tag}</Tag>
          ))}
        </TaskTags>

        {/* 位置和时间信息 */}
        <Space size="large" split={<Divider type="vertical" />}>
          <Space>
            <EnvironmentOutlined />
            <Text type="secondary">
              {task.location.address}
              {task.location.distance && (
                <span style={{ marginLeft: 4 }}>
                  ({formatDistance(task.location.distance)})
                </span>
              )}
            </Text>
          </Space>
          <Space>
            <ClockCircleOutlined />
            <Text type="secondary">
              {formatDeadline(task.deadline)}
            </Text>
          </Space>
        </Space>

        {/* 申请进度 */}
        {task.maxApplicants > 0 && (
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              申请进度: {task.applicantCount}/{task.maxApplicants}
            </Text>
            <Progress
              percent={(task.applicantCount / task.maxApplicants) * 100}
              showInfo={false}
              size="small"
              style={{ marginTop: 4 }}
            />
          </div>
        )}

        {/* 底部信息 */}
        <TaskFooter>
          {/* 发布者信息 */}
          <UserInfo>
            <Avatar
              size="small"
              src={task.publisher.avatar}
              icon={<UserOutlined />}
              onClick={handleUserClick}
              style={{ cursor: 'pointer' }}
            />
            <Space>
              <Text type="secondary">{task.publisher.nickname}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                评分 {task.publisher.rating}
              </Text>
            </Space>
          </UserInfo>

          {/* 价格和操作 */}
          <Space>
            <PriceText>¥{task.budget}</PriceText>
            <Tooltip title={isFavorite ? '取消收藏' : '收藏任务'}>
              <Button
                type="text"
                icon={isFavorite ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                onClick={handleFavorite}
              />
            </Tooltip>
            {task.status === 'pending' && (
              <Button
                type="primary"
                size="small"
                loading={isGrabbing}
                onClick={handleGrab}
              >
                立即接单
              </Button>
            )}
          </Space>
        </TaskFooter>
      </TaskContent>
    </TaskCardContainer>
  );
};

export default TaskCard;