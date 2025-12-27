import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import styled from '@emotion/styled';
import OrderCard from './OrderCard';
import OrderCardSkeleton from './OrderCardSkeleton';
import OrderFilterBar from './OrderFilterBar';
import EndOfListDivider from './EndOfListDivider';
// import MockDataGenerator from '../../../data/mock-data-generator';
import type { OrderItem } from '../../../types/order.types';
import { getCategoryColors } from '../../../data/category-icons';
import { uiLogger } from '../../../utils/logger';

// FilterType 类型定义
type FilterType = 'comprehensive' | 'price' | 'newest';

// 临时简化数据生成
const MockDataGenerator = {
  generateOrders: (offset: number = 0, limit: number = 12) => {
    uiLogger.info('🧪 使用简化MockDataGenerator', { offset, limit });
    return Array(limit).fill(null).map((_, index) => ({
      id: `order_${offset + index}`,
      title: ['英雄联盟黄金段位代练', '公司Logo设计制作', '高等数学期末辅导', '企业财务记账外包'][index % 4],
      description: '专业服务，质量保证，价格优惠',
      category: ['gaming', 'design', 'campus', 'enterprise'][index % 4],
      tags: [
        [{ id: '1', name: 'LOL代练', color: '#FFE4E1' }],
        [{ id: '13', name: 'UI设计', color: '#FFF0F0' }],
        [{ id: '9', name: '课程辅导', color: '#F0FFFF' }],
        [{ id: '5', name: '企业注册', color: '#F0FFF0' }]
      ][index % 4],
      price: { symbol: '¥', integer: 100 + (index * 50), decimal: '.00', currency: 'CNY' },
      stats: { viewingCount: 10 + index, favoriteCount: 5 + index, shareCount: 1 + index },
      visualAnchor: {
        type: 'icon',
        icon: 'unified-icon', // 使用统一图标系统
        backgroundColor: getCategoryColors(['gaming', 'design', 'campus', 'enterprise'][index % 4]).primary
      },
      status: 'pending',
      createdAt: new Date(Date.now() - index * 1000 * 60),
      updatedAt: new Date(),
      deadline: new Date(Date.now() + (7 + index) * 24 * 60 * 60 * 1000),
      location: ['北京', '上海', '广州', '深圳'][index % 4],
      difficulty: ['easy', 'medium', 'hard'][index % 3]
    }));
  },
  getBatchSize: () => 12,
  getMaxItems: () => 100,
  hasMoreData: (currentCount: number) => currentCount < 100
};

/**
 * OrderFeedContainer 属性接口
 */
export interface OrderFeedContainerProps {
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
 * 内部状态接口
 */
interface FeedState {
  orders: OrderItem[];
  isLoading: boolean;
  hasMore: boolean;
  filterType: FilterType;
  currentPage: number;
  totalCount: number;
  error: string | null;
}

// 订单信息流容器 - 增强版性能优化
const OrderFeedContainerWrapper = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  position: relative;
`;

// 网格布局容器 - 增强版响应式设计
const GridContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  /* 响应式网格布局 - 4-5列 */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;

  /* 使用 content-visibility 优化性能 */
  contain: layout style paint;

  /* 大屏幕 - 5列 */
  @media (min-width: 1400px) {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 18px;
  }

  /* 中等屏幕 - 4列 */
  @media (min-width: 1024px) and (max-width: 1399px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }

  /* 小屏幕 - 3列 */
  @media (min-width: 768px) and (max-width: 1023px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
    padding: 16px;
  }

  /* 移动端 - 2列 */
  @media (max-width: 767px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
    padding: 12px;
  }

  /* 超小屏幕 - 1列 */
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 12px;
  }
`;

// 加载更多容器 - 触发区域
const LoadMoreTrigger = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;

  /* 确保触发区域在视口外时仍然可以触发 */
  position: relative;
`;

// 骨架屏容器 - 网格对齐
const SkeletonContainer = styled.div`
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
  width: 100%;

  /* 继承父级网格布局 */
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));

  @media (min-width: 1400px) {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 18px;
  }

  @media (min-width: 1024px) and (max-width: 1399px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
  }

  @media (max-width: 767px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

// 错误状态容器
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: #666;
`;

const ErrorTitle = styled.h3`
  margin-bottom: 12px;
  color: #ff4d4f;
  font-size: 18px;
`;

const ErrorMessage = styled.p`
  margin-bottom: 20px;
  font-size: 14px;
`;

const RetryButton = styled.button`
  padding: 8px 20px;
  background: #ff6000;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;

  &:hover {
    background: #ff8000;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

/**
 * OrderFeedContainer 组件
 *
 * 智能无限滚动订单信息流容器，支持：
 * - 基于 IntersectionObserver 的滚动检测
 * - 100条订单数据的分批加载
 * - 性能优化的渲染
 * - 淘宝风格的骨架屏效果
 * - 完整的错误处理和重试机制
 *
 * @example 基础用法
 * ```tsx
 * <OrderFeedContainer />
 * ```
 *
 * @example 自定义配置
 * ```tsx
 * <OrderFeedContainer
 *   initialFilterType="price"
 *   onGrabOrder={(id) => uiLogger.info('抢单操作:', { orderId: id })}
 *   enableInfiniteScroll={true}
 * />
 * ```
 */
const OrderFeedContainer: React.FC<OrderFeedContainerProps> = ({
  initialFilterType = 'comprehensive',
  className,
  onGrabOrder,
  onLoadComplete,
  enableInfiniteScroll = true
}) => {
  // 状态管理
  const [state, setState] = useState<FeedState>({
    orders: [],
    isLoading: false,
    hasMore: true,
    filterType: initialFilterType,
    currentPage: 0,
    totalCount: 0,
    error: null
  });

  // Refs
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isInitialLoadRef = useRef(true);

  // 批量大小和最大数量常量
  const BATCH_SIZE = MockDataGenerator.getBatchSize();
  const MAX_ITEMS = MockDataGenerator.getMaxItems();

  /**
   * 排序函数集合
   */
  const sortFunctions = useMemo(() => ({
    comprehensive: (orders: OrderItem[]) =>
      [...orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    price: (orders: OrderItem[]) =>
      [...orders].sort((a, b) => a.price.integer - b.price.integer),
    newest: (orders: OrderItem[]) =>
      [...orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }), []);

  /**
   * 加载订单数据
   * @param page 页码（从0开始）
   * @param isInitialLoad 是否为初始加载
   */
  const loadOrders = useCallback(async (page: number, isInitialLoad: boolean = false) => {
    try {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null
      }));

      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 800));

      // 生成新数据
      const newOrders = MockDataGenerator.generateOrders(page * BATCH_SIZE, BATCH_SIZE);
      const hasMoreData = MockDataGenerator.hasMoreData((page + 1) * BATCH_SIZE);

      setState(prev => {
        let finalOrders;
        if (isInitialLoad) {
          // 初始加载：直接使用新数据
          finalOrders = newOrders;
        } else {
          // 后续加载：追加到现有数据
          finalOrders = [...prev.orders, ...newOrders];
        }

        // 应用排序（对于初始加载或过滤器变化）
        if (isInitialLoad || prev.filterType !== 'comprehensive') {
          finalOrders = sortFunctions[prev.filterType](finalOrders);
        }

        const loadedCount = finalOrders.length;

        return {
          ...prev,
          orders: finalOrders,
          isLoading: false,
          hasMore: hasMoreData,
          currentPage: page,
          totalCount: loadedCount
        };
      });

      // 回调通知加载完成 - 使用最新的orders长度
      setState(prev => {
        onLoadComplete?.(prev.orders.length);
        return prev;
      });

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : '加载失败'
      }));
    }
  }, [sortFunctions, onLoadComplete, BATCH_SIZE]);

  /**
   * 处理过滤器变更
   * @param newFilterType 新的过滤器类型
   */
  const handleFilterChange = useCallback((newFilterType: FilterType) => {
    setState(prev => {
      const filteredOrders = sortFunctions[newFilterType](prev.orders);
      return {
        ...prev,
        filterType: newFilterType,
        orders: filteredOrders
      };
    });
  }, [sortFunctions]);

  /**
   * 处理抢单
   * @param orderId 订单ID
   */
  const handleGrabOrder = useCallback((orderId: string) => {
    onGrabOrder?.(orderId);

    // 更新本地状态
    setState(prev => ({
      ...prev,
      orders: prev.orders.map(order =>
        order.id === orderId
          ? { ...order, status: 'in_progress' as const }
          : order
      )
    }));
  }, [onGrabOrder]);

  /**
   * 重试加载
   */
  const handleRetry = useCallback(() => {
    setState(prev => {
      loadOrders(prev.currentPage, isInitialLoadRef.current);
      return prev;
    });
  }, [loadOrders]);

  /**
   * 设置 Intersection Observer
   */
  const setupIntersectionObserver = useCallback(() => {
    if (!enableInfiniteScroll || !loadMoreRef.current) return;

    // 清理旧的 observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // 创建新的 observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (
          entry.isIntersecting &&
          state.hasMore &&
          !state.isLoading &&
          !state.error
        ) {
          loadOrders(state.currentPage + 1);
        }
      },
      {
        root: null,
        rootMargin: '200px', // 提前200px触发加载
        threshold: 0.1
      }
    );

    // 开始观察
    observerRef.current.observe(loadMoreRef.current);
  }, [enableInfiniteScroll, state.hasMore, state.isLoading, state.error, loadOrders, state.currentPage]);

  /**
   * 初始加载
   */
  useEffect(() => {
    if (isInitialLoadRef.current) {
      loadOrders(0, true);
      isInitialLoadRef.current = false;
    }
  }, [loadOrders]);

  /**
   * 设置 Intersection Observer
   */
  useEffect(() => {
    setupIntersectionObserver();

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [setupIntersectionObserver]);

  /**
   * 渲染骨架屏网格
   */
  const renderSkeletonGrid = (count: number) => (
    <SkeletonContainer>
      {Array.from({ length: count }).map((_, index) => (
        <OrderCardSkeleton key={`skeleton-${index}`} />
      ))}
    </SkeletonContainer>
  );

  /**
   * 渲染加载中状态
   */
  if (state.isLoading && state.orders.length === 0) {
    return (
      <OrderFeedContainerWrapper className={className}>
        <OrderFilterBar
          activeFilter={state.filterType}
          onFilterChange={handleFilterChange}
          totalCount={0}
          loading={true}
        />
        <GridContainer>
          {renderSkeletonGrid(8)}
        </GridContainer>
      </OrderFeedContainerWrapper>
    );
  }

  /**
   * 渲染错误状态
   */
  if (state.error && state.orders.length === 0) {
    return (
      <OrderFeedContainerWrapper className={className}>
        <OrderFilterBar
          activeFilter={state.filterType}
          onFilterChange={handleFilterChange}
          totalCount={0}
          loading={false}
        />
        <ErrorContainer>
          <ErrorTitle>加载失败</ErrorTitle>
          <ErrorMessage>{state.error}</ErrorMessage>
          <RetryButton onClick={handleRetry} disabled={state.isLoading}>
            {state.isLoading ? '重试中...' : '重试'}
          </RetryButton>
        </ErrorContainer>
      </OrderFeedContainerWrapper>
    );
  }

  return (
    <OrderFeedContainerWrapper className={className} data-testid="order-feed-container">
      <OrderFilterBar
        activeFilter={state.filterType}
        onFilterChange={handleFilterChange}
        totalCount={state.orders.length}
        loading={state.isLoading}
      />

      <GridContainer>
        {/* 使用 React.memo 优化的订单卡片渲染 */}
        {state.orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onGrabOrder={handleGrabOrder}
            loading={state.isLoading}
          />
        ))}
      </GridContainer>

      {/* 加载更多触发区域 */}
      {enableInfiniteScroll && state.hasMore && !state.error && (
        <LoadMoreTrigger ref={loadMoreRef} data-testid="load-more-trigger">
          {state.isLoading ? (
            renderSkeletonGrid(Math.min(3, BATCH_SIZE))
          ) : (
            <div style={{ color: '#999', fontSize: '14px' }}>
              向下滚动加载更多...
            </div>
          )}
        </LoadMoreTrigger>
      )}

      {/* 列表底部 */}
      {!state.hasMore && state.orders.length > 0 && (
        <EndOfListDivider
          showStats
          loadedCount={state.orders.length}
          maxCount={MAX_ITEMS}
        />
      )}

      {/* 错误状态（在有数据时显示） */}
      {state.error && state.orders.length > 0 && (
        <ErrorContainer>
          <ErrorMessage>加载失败: {state.error}</ErrorMessage>
          <RetryButton onClick={handleRetry} disabled={state.isLoading}>
            重试
          </RetryButton>
        </ErrorContainer>
      )}
    </OrderFeedContainerWrapper>
  );
};

export default OrderFeedContainer;