import React, { useCallback } from 'react';
import { message } from 'antd';
import OrderFeedContainer from './OrderFeedContainer';

// FilterType 类型定义
type FilterType = 'comprehensive' | 'price' | 'newest';

interface OrderFeedProps {
  /**
   * 初始过滤器类型
   * @default 'comprehensive'
   */
  initialFilterType?: FilterType;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 抢单回调函数
   */
  onGrabOrder?: (orderId: string) => void;

  /**
   * 加载完成回调
   */
  onLoadComplete?: (loadedCount: number) => void;

  /**
   * 是否启用无限滚动
   * @default true
   */
  enableInfiniteScroll?: boolean;
}

/**
 * OrderFeed 组件 - OrderFeedContainer 的简化包装器
 *
 * 为了保持向后兼容性，提供简化的 API
 *
 * @example 基础用法
 * ```tsx
 * <OrderFeed />
 * ```
 *
 * @example 自定义配置
 * ```tsx
 * <OrderFeed
 *   initialFilterType="price"
 *   onGrabOrder={(id) => console.log('抢单操作:', { orderId: id })}
 * />
 * ```
 */
const OrderFeed: React.FC<OrderFeedProps> = ({
  initialFilterType = 'comprehensive',
  className,
  onGrabOrder,
  onLoadComplete,
  enableInfiniteScroll = true
}) => {
  // 处理抢单 - 添加成功提示
  const handleGrabOrder = useCallback((orderId: string) => {
    try {
      onGrabOrder?.(orderId);
      message.success('抢单成功！请及时联系卖家');
    } catch {
      message.error('抢单失败，请重试');
    }
  }, [onGrabOrder]);

  return (
    <OrderFeedContainer
      initialFilterType={initialFilterType}
      className={className}
      onGrabOrder={handleGrabOrder}
      onLoadComplete={onLoadComplete}
      enableInfiniteScroll={enableInfiniteScroll}
    />
  );
};

export default OrderFeed;