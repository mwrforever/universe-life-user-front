import React, { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Tag, Button } from 'antd';
import { EyeOutlined, HeartOutlined, ShareAltOutlined, ShopOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import type { OrderItem } from '../../../types/order.types';
import { getCategoryIcon, getCategoryColors } from '../../../data/category-icons';

interface OrderCardProps {
  order: OrderItem;
  onGrabOrder?: (orderId: string) => void;
  onCardClick?: (orderId: string) => void;
  loading?: boolean;
}

// 统一分类图标组件 - 与侧边栏保持一致
const UnifiedCategoryIcon: React.FC<{ category: string; subcategory?: string }> = ({
  category,
  subcategory
}) => {
  const IconComponent = getCategoryIcon(category, subcategory);

  return (
    <>{IconComponent}</>
  );
};

// 卡片容器样式
const StyledCard = styled(Card)`
  width: 100%;
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 32px rgba(255, 80, 0, 0.15);
    border: 1px solid rgba(255, 80, 0, 0.1);
  }

  .ant-card-body {
    padding: 16px;
  }

  .ant-card-cover::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &:hover .ant-card-cover::before {
    opacity: 1;
  }
`;

// 视觉锚点容器 - 1:4比例调整，统一灰色主题
const VisualAnchor = styled.div`
  width: 100%;
  height: 40px; /* 调整为40px，实现1:4比例 (40px:160px内容区域) */
  background:
    radial-gradient(circle at 20% 20%, #80808022 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, #80808018 0%, transparent 50%),
    linear-gradient(135deg, #999999 0%, #cccccc 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  /* 微妙的网格背景纹理 */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.5;
    z-index: 0;
  }

  /* 顶部装饰条 - 统一灰色主题 */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg,
      transparent 0%,
      #999999 20%,
      #999999 80%,
      transparent 100%);
    z-index: 5;
  }

  /* 添加轻微的shimmer动画 */
  .shimmer {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.08) 50%, transparent 70%);
    animation: shimmer 3s infinite;
    opacity: 0.6;
    z-index: 1;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
    100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
  }
`;

// 图标容器 - 适配40px高度的紧凑尺寸，图标颜色与分类标签保持一致
const CategoryIconContainer = styled.div<{ $categoryColor: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: ${props => props.$categoryColor}12;
  backdrop-filter: blur(10px);
  margin-bottom: 2px;
  position: relative;
  z-index: 3;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  /* 多层阴影效果 - 营造立体感 */
  box-shadow:
    0 8px 32px ${props => props.$categoryColor}20,
    0 4px 16px ${props => props.$categoryColor}15,
    inset 0 1px 0 rgba(255, 255, 255, 0.3);

  /* 内发光效果 */
  &::before {
    content: '';
    position: absolute;
    inset: 1px;
    border-radius: 7px;
    background: linear-gradient(135deg,
      ${props => props.$categoryColor}08 0%,
      transparent 50%,
      ${props => props.$categoryColor}04 100%);
    z-index: -1;
  }

  /* 外光晕效果 */
  &::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 10px;
    background: radial-gradient(circle at center,
      ${props => props.$categoryColor}10 0%,
      transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -2;
  }

  /* 悬停时的增强效果 */
  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow:
      0 12px 40px ${props => props.$categoryColor}30,
      0 6px 20px ${props => props.$categoryColor}20,
      inset 0 1px 0 rgba(255, 255, 255, 0.4);

    &::after {
      opacity: 1;
    }
  }

  svg {
    color: ${props => props.$categoryColor};
    font-size: 16px;
    filter:
      drop-shadow(0 2px 4px ${props => props.$categoryColor}25)
      saturate(1.2)
      brightness(1.1);
    transition: all 0.3s ease;
    position: relative;
    z-index: 4;
  }

  &:hover svg {
    transform: scale(1.1);
    filter:
      drop-shadow(0 4px 8px ${props => props.$categoryColor}35)
      saturate(1.4)
      brightness(1.2);
  }
`;

// 背景装饰圆圈 - 适配40px高度，统一灰色主题
const BackgroundDecorations = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 1;

  /* 大型装饰圆圈 */
  &::before {
    content: '';
    position: absolute;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: radial-gradient(circle,
      #99999915 0%,
      #99999908 40%,
      transparent 70%);
    top: -8px;
    right: -8px;
    opacity: 0.8;
    animation: float 6s ease-in-out infinite;
  }

  /* 小型装饰圆圈 */
  &::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: radial-gradient(circle,
      #99999912 0%,
      transparent 60%);
    bottom: -4px;
    left: -4px;
    opacity: 0.6;
    animation: float 8s ease-in-out infinite reverse;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-8px) rotate(180deg); }
  }
`;

// 图标光晕效果 - 适配28px尺寸，统一灰色主题
const IconGlow = styled.div`
  position: absolute;
  inset: -2px;
  border-radius: 10px;
  background: conic-gradient(from 0deg at 50% 50%,
    transparent 0deg,
    #99999920 90deg,
    transparent 180deg,
    #99999920 270deg,
    transparent 360deg);
  opacity: 0;
  animation: rotateGlow 4s linear infinite;
  z-index: 2;
  transition: opacity 0.3s ease;

  ${CategoryIconContainer}:hover & {
    opacity: 0.6;
  }

  @keyframes rotateGlow {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// 图标脉冲效果 - 适配28px尺寸，统一灰色主题
const IconPulse = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 8px;
  background: #99999910;
  opacity: 0;
  z-index: 1;
  animation: pulse 2s ease-in-out infinite;

  ${CategoryIconContainer}:hover & {
    animation: none;
    opacity: 0;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0;
      transform: scale(1);
    }
    50% {
      opacity: 0.3;
      transform: scale(1.05);
    }
  }
`;

// 分类名称标签 - 保持彩色显示
const CategoryLabel = styled.div<{ $categoryColor: string }>`
  position: absolute;
  top: 12px;
  left: 12px;
  background: ${props => props.$categoryColor}10;
  color: ${props => props.$categoryColor};
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(8px);
  border: 1px solid ${props => props.$categoryColor}20;
  z-index: 2;
`;

// 标题容器 - 恢复正常大小
const TitleContainer = styled.div`
  margin: 12px 0 8px 0;
  min-height: 44px; /* 支持两行文本 */
`;

// 标题文本 - 恢复正常大小
const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  color: #1a1a1a;
  margin: 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// 描述容器 - 恢复正常大小
const DescriptionContainer = styled.div`
  margin: 0 0 8px 0;
  min-height: 32px; /* 支持两行文本 */
`;

// 描述文本 - 恢复正常大小
const Description = styled.p`
  font-size: 13px;
  line-height: 16px;
  color: #666;
  margin: 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
`;

// 标签容器 - 恢复正常大小
const TagsContainer = styled.div`
  margin: 8px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-height: 28px;
`;

// 药丸标签样式
const PillTag = styled(Tag)`
  font-size: 12px;
  font-weight: 500;
  border-radius: 12px;
  border: none;
  padding: 2px 8px;
  color: #333;
  margin: 0;
  line-height: 20px;

  /* 使用data属性来设置背景色 */
  &[data-color] {
    background: var(--tag-color);
  }
`;

// 价格容器 - 恢复正常大小
const PriceContainer = styled.div`
  margin: 12px 0 8px 0;
  display: flex;
  align-items: baseline;
  gap: 2px;
`;

// 货币符号 - 恢复正常大小
const CurrencySymbol = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #ff4757;
  font-family: 'DIN', 'Roboto', sans-serif;
`;

// 整数部分 - 恢复正常大小
const IntegerPrice = styled.span`
  font-size: 28px;
  font-weight: 700;
  color: #ff4757;
  font-family: 'DIN', 'Roboto', sans-serif;
  line-height: 1;
`;

// 小数部分 - 恢复正常大小
const DecimalPrice = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #ff4757;
  font-family: 'DIN', 'Roboto', sans-serif;
`;

// 统计信息容器 - 恢复正常大小
const StatsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
  font-size: 13px;
  color: #999;
`;

// 统计项
const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

// 悬停按钮容器
const HoverButtonContainer = styled.div<{ $visible: boolean }>`
  position: absolute;
  bottom: 16px;
  right: 16px;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translateY(${props => props.$visible ? '0px' : '8px'});
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: ${props => props.$visible ? 'auto' : 'none'};
  z-index: 10;
`;

// 抢单按钮
const GrabOrderButton = styled(Button)`
  background: linear-gradient(135deg, #ff6000 0%, #ff8c00 100%);
  border: none;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  height: 36px;
  padding: 0 20px;
  box-shadow: 0 4px 12px rgba(255, 96, 0, 0.3);

  &:hover {
    background: linear-gradient(135deg, #ff8c00 0%, #ff6000 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255, 96, 0, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

// OrderCard 组件 - 性能优化版本，使用 React.memo
const OrderCardComponent: React.FC<OrderCardProps> = ({ order, onGrabOrder, onCardClick }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const categoryColors = getCategoryColors(order.category);

  const handleGrabOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    onGrabOrder?.(order.id);
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(order.id);
    } else {
      navigate(`/task/${order.id}`);
    }
  };

  // 获取分类中文名称
  const getCategoryName = (category: string): string => {
    const categoryNames: Record<string, string> = {
      gaming: '游戏',
      enterprise: '企业服务',
      campus: '校园',
      design: '设计'
    };
    return categoryNames[category] || '其他';
  };

  return (
    <StyledCard
      data-testid={`order-card-${order.id}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      cover={
        <VisualAnchor>
          <div className="shimmer" />
          <BackgroundDecorations />
          <CategoryLabel $categoryColor={categoryColors.primary}>
            {getCategoryName(order.category)}
          </CategoryLabel>
          <IconPulse />
          <IconGlow />
          <CategoryIconContainer $categoryColor={categoryColors.primary}>
            <UnifiedCategoryIcon
              category={order.category}
            />
          </CategoryIconContainer>
        </VisualAnchor>
      }
    >
      <TitleContainer>
        <Title>{order.title}</Title>
      </TitleContainer>

      <DescriptionContainer>
        <Description>{order.description}</Description>
      </DescriptionContainer>

      <TagsContainer>
        {order.tags.map((tag) => (
          <PillTag
            key={tag.id}
            data-color={tag.color}
            style={{ "--tag-color": tag.color }}
          >
            {tag.name}
          </PillTag>
        ))}
      </TagsContainer>

      <PriceContainer data-testid="order-price">
        <CurrencySymbol data-currency-symbol>{order.price.symbol}</CurrencySymbol>
        <IntegerPrice data-price-integer>{order.price.integer}</IntegerPrice>
        <DecimalPrice data-price-decimal>{order.price.decimal}</DecimalPrice>
      </PriceContainer>

      <StatsContainer>
        <StatItem data-testid="viewing-stat">
          <EyeOutlined />
          <span>{order.stats.viewingCount}人正在看</span>
        </StatItem>
        <StatItem data-testid="favorite-stat">
          <HeartOutlined />
          <span>{order.stats.favoriteCount}</span>
        </StatItem>
        <StatItem data-testid="share-stat">
          <ShareAltOutlined />
          <span>{order.stats.shareCount}</span>
        </StatItem>
      </StatsContainer>

      <HoverButtonContainer $visible={isHovered}>
        <GrabOrderButton
          type="primary"
          icon={<ShopOutlined />}
          onClick={handleGrabOrder}
          data-testid="grab-order-btn"
        >
          抢单
        </GrabOrderButton>
      </HoverButtonContainer>
    </StyledCard>
  );
};

/**
 * 使用 React.memo 优化性能的 OrderCard 组件
 *
 * 只有当以下 props 发生变化时才会重新渲染：
 * - order.id
 * - order.status
 * - order.stats
 * - onGrabOrder 函数引用
 */
const OrderCard = memo(OrderCardComponent, (prevProps, nextProps) => {
  // 深度比较关键属性
  return (
    prevProps.order.id === nextProps.order.id &&
    prevProps.order.status === nextProps.order.status &&
    prevProps.order.stats.viewingCount === nextProps.order.stats.viewingCount &&
    prevProps.order.stats.favoriteCount === nextProps.order.stats.favoriteCount &&
    prevProps.order.stats.shareCount === nextProps.order.stats.shareCount &&
    prevProps.onGrabOrder === nextProps.onGrabOrder
  );
});

OrderCard.displayName = 'OrderCard';

export default OrderCard;