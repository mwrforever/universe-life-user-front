import React, { useState, useEffect } from 'react';
import { Card, Typography, Badge, Button } from 'antd';
import {
  RocketOutlined,
  TrophyOutlined,
  ArrowRightOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { ORDER_CATEGORIES, type OrderCategory } from '@/data/category-config';
import { getCategoryTheme } from '@/theme/themeConfig';
import type { CategoryTheme } from '@/types/order-platform';

const { Title, Paragraph } = Typography;

// ==================== 样式组件 ====================

const BentoGridContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 80px 20px;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 60px;

  .section-title {
    font-size: clamp(2.5rem, 6vw, 3.5rem) !important;
    font-weight: 700 !important;
    color: #1f2937 !important;
    margin-bottom: 16px !important;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .section-subtitle {
    font-size: clamp(1.1rem, 3vw, 1.3rem) !important;
    color: #6b7280 !important;
    margin: 0 !important;
    line-height: 1.6 !important;
    max-width: 600px;
    margin-left: auto !important;
    margin-right: auto !important;
  }
`;

const BentoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
  margin-bottom: 48px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
`;

const CategoryCard = styled(Card)<{ categoryTheme: CategoryTheme; isLarge: boolean }>`
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: none !important;
  border-radius: 20px !important;
  background: ${props => props.categoryTheme.colors.background} !important;
  color: ${props => props.categoryTheme.colors.text} !important;

  /* 网格布局适配 */
  ${props => {
    if (props.isLarge) {
      return `
        grid-column: span 6;
        grid-row: span 2;

        @media (max-width: 1024px) {
          grid-column: span 6;
          grid-row: span 2;
        }

        @media (max-width: 768px) {
          grid-column: span 4;
          grid-row: span 2;
        }
      `;
    }
    return `
      grid-column: span 3;
      grid-row: span 1;

      @media (max-width: 1024px) {
        grid-column: span 3;
      }

      @media (max-width: 768px) {
        grid-column: span 2;
      }
    `;
  }}

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(-4px) scale(1.01);
  }

  .ant-card-body {
    padding: 32px !important;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    z-index: 2;

    @media (max-width: 768px) {
      padding: 20px !important;
    }
  }

  /* 背景渐变效果 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.categoryTheme.gradients.card};
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 1;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const CategoryIcon = styled.div<{ categoryTheme: CategoryTheme; size: 'large' | 'small' }>`
  width: ${props => (props.size === 'large' ? '80px' : '60px')};
  height: ${props => (props.size === 'large' ? '80px' : '60px')};
  background: ${props => props.categoryTheme.gradients.primary};
  border-radius: ${props => (props.size === 'large' ? '24px' : '20px')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => (props.size === 'large' ? '36px' : '28px')};
  margin-bottom: 20px;
  box-shadow: 0 8px 16px ${props => props.categoryTheme.colors.primary}40;
  transition: all 0.3s ease;
  position: relative;
  z-index: 3;

  ${CategoryCard}:hover & {
    transform: rotate(5deg) scale(1.1);
    box-shadow: 0 12px 24px ${props => props.categoryTheme.colors.primary}60;
  }
`;

const CategoryTitle = styled(Title)<{ categoryTheme: CategoryTheme }>`
  color: ${props => props.categoryTheme.colors.text} !important;
  margin-bottom: 12px !important;
  font-size: ${props =>
    props.categoryTheme.typography.headingFont ? '1.8rem' : '1.5rem'} !important;
  font-weight: 700 !important;
  font-family: ${props => props.categoryTheme.typography.headingFont || 'inherit'} !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 3;
`;

const CategoryDescription = styled(Paragraph)<{ categoryTheme: CategoryTheme }>`
  color: ${props => props.categoryTheme.colors.text} !important;
  opacity: 0.9 !important;
  margin-bottom: 24px !important;
  font-size: 1rem !important;
  line-height: 1.6 !important;
  position: relative;
  z-index: 3;
`;

const CategoryStats = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  z-index: 3;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatNumber = styled.span<{ categoryTheme: CategoryTheme }>`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${props => props.categoryTheme.colors.text};
`;

const StatLabel = styled.span<{ categoryTheme: CategoryTheme }>`
  font-size: 0.9rem;
  opacity: 0.8;
  color: ${props => props.categoryTheme.colors.text};
`;

const ExploreButton = styled(Button)<{ categoryTheme: CategoryTheme }>`
  background: ${props => props.categoryTheme.gradients.button} !important;
  border: none !important;
  color: white !important;
  font-weight: 600 !important;
  height: 44px !important;
  padding: 0 24px !important;
  border-radius: 22px !important;
  transition: all 0.3s ease !important;
  position: relative;
  z-index: 3;
  box-shadow: 0 4px 12px ${props => props.categoryTheme.colors.primary}40;

  &:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 16px ${props => props.categoryTheme.colors.primary}60 !important;
    background: ${props => props.categoryTheme.gradients.button} !important;
    filter: brightness(1.1);
  }

  .anticon {
    transition: transform 0.3s ease;
  }

  &:hover .anticon {
    transform: translateX(4px);
  }
`;

const TrendingBadge = styled(Badge)<{ categoryTheme: CategoryTheme }>`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 4;

  .ant-badge-status-dot {
    width: 10px !important;
    height: 10px !important;
    background-color: ${props => props.categoryTheme.colors.accent} !important;
    box-shadow: 0 0 12px ${props => props.categoryTheme.colors.accent}80;
  }

  .ant-badge-status-text {
    color: ${props => props.categoryTheme.colors.text} !important;
    font-weight: 600 !important;
    font-size: 0.9rem !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
`;

const FloatingElements = styled.div<{ categoryTheme: CategoryTheme }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
`;

const FloatingDot = styled.div<{
  categoryTheme: CategoryTheme;
  size: number;
  top: string;
  left: string;
  delay: number;
}>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${props => props.categoryTheme.colors.primary}20;
  border-radius: 50%;
  top: ${props => props.top};
  left: ${props => props.left};
  animation: float 8s ease-in-out ${props => props.delay}s infinite;

  @keyframes float {
    0%,
    100% {
      transform: translateY(0) translateX(0) scale(1);
      opacity: 0.3;
    }
    33% {
      transform: translateY(-15px) translateX(10px) scale(1.1);
      opacity: 0.6;
    }
    66% {
      transform: translateY(10px) translateX(-10px) scale(0.9);
      opacity: 0.4;
    }
  }
`;

const GlowEffect = styled.div<{ categoryTheme: CategoryTheme }>`
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    ${props => props.categoryTheme.colors.primary}10 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 0;
`;

// ==================== 数据接口 ====================

interface CategoryBentoGridProps {
  onCategoryClick?: (category: OrderCategory) => void;
  showAllCategories?: boolean;
}

interface CategoryStats {
  id: string;
  orderCount: number;
  activeProjects: number;
  trending: boolean;
  growth: number;
}

// ==================== 主组件 ====================

export const CategoryBentoGrid: React.FC<CategoryBentoGridProps> = ({
  onCategoryClick,
  showAllCategories = true,
}) => {
  const navigate = useNavigate();
  const [categoryStats, setCategoryStats] = useState<Record<string, CategoryStats>>({});

  // 模拟分类统计数据
  useEffect(() => {
    const stats: Record<string, CategoryStats> = {
      'gaming-esports': {
        id: 'gaming-esports',
        orderCount: 2540,
        activeProjects: 1780,
        trending: true,
        growth: 156,
      },
      'enterprise-projects': {
        id: 'enterprise-projects',
        orderCount: 1890,
        activeProjects: 1320,
        trending: false,
        growth: 89,
      },
      'academic-campus': {
        id: 'academic-campus',
        orderCount: 3120,
        activeProjects: 2180,
        trending: true,
        growth: 134,
      },
      'design-multimedia': {
        id: 'design-multimedia',
        orderCount: 2780,
        activeProjects: 1950,
        trending: true,
        growth: 178,
      },
    };

    setCategoryStats(stats);

    // 模拟实时数据更新
    const interval = setInterval(() => {
      setCategoryStats(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          updated[key].orderCount += Math.floor(Math.random() * 3);
          updated[key].activeProjects += Math.floor(Math.random() * 2);
          updated[key].growth = Math.floor(Math.random() * 200) + 50;
        });
        return updated;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleCategoryClick = (category: OrderCategory) => {
    setHoveredCategory(category.id);

    if (onCategoryClick) {
      onCategoryClick(category);
    } else {
      navigate(`/category/${category.id}`);
    }

    setTimeout(() => setHoveredCategory(null), 300);
  };

  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}w`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const categories = Object.values(ORDER_CATEGORIES);

  // 第一个分类使用大卡片，其他使用小卡片
  const mainCategory = categories[0];
  const otherCategories = showAllCategories ? categories.slice(1) : categories.slice(1, 3);

  return (
    <BentoGridContainer>
      <SectionHeader>
        <Title level={2} className='section-title'>
          探索四大专业领域
        </Title>
        <Paragraph className='section-subtitle'>
          每个分类都有专业的服务标准和完善的质量保障体系， 确保您的需求得到最专业的解决方案
        </Paragraph>
      </SectionHeader>

      <BentoGrid>
        {/* 主要分类 - 大卡片 */}
        {mainCategory && (
          <CategoryCard
            key={mainCategory.id}
            categoryTheme={getCategoryTheme(mainCategory.id)}
            isLarge={true}
            onClick={() => handleCategoryClick(mainCategory)}
            onMouseEnter={() => setHoveredCategory(mainCategory.id)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <GlowEffect categoryTheme={getCategoryTheme(mainCategory.id)} />
            <FloatingElements categoryTheme={getCategoryTheme(mainCategory.id)}>
              <FloatingDot
                categoryTheme={getCategoryTheme(mainCategory.id)}
                size={8}
                top='20%'
                left='15%'
                delay={0}
              />
              <FloatingDot
                categoryTheme={getCategoryTheme(mainCategory.id)}
                size={12}
                top='60%'
                left='80%'
                delay={1}
              />
              <FloatingDot
                categoryTheme={getCategoryTheme(mainCategory.id)}
                size={6}
                top='85%'
                left='25%'
                delay={2}
              />
            </FloatingElements>

            {categoryStats[mainCategory.id]?.trending && (
              <TrendingBadge
                categoryTheme={getCategoryTheme(mainCategory.id)}
                status='processing'
                text='热门'
              />
            )}

            <div>
              <CategoryIcon categoryTheme={getCategoryTheme(mainCategory.id)} size='large'>
                {mainCategory.icon}
              </CategoryIcon>

              <CategoryTitle level={3} categoryTheme={getCategoryTheme(mainCategory.id)}>
                {mainCategory.name}
              </CategoryTitle>

              <CategoryDescription categoryTheme={getCategoryTheme(mainCategory.id)}>
                {mainCategory.description}
              </CategoryDescription>

              <CategoryStats>
                <StatItem>
                  <EyeOutlined />
                  <div>
                    <StatNumber categoryTheme={getCategoryTheme(mainCategory.id)}>
                      {formatNumber(categoryStats[mainCategory.id]?.orderCount || 0)}
                    </StatNumber>
                    <StatLabel categoryTheme={getCategoryTheme(mainCategory.id)}>
                      发布项目
                    </StatLabel>
                  </div>
                </StatItem>

                <StatItem>
                  <RocketOutlined />
                  <div>
                    <StatNumber categoryTheme={getCategoryTheme(mainCategory.id)}>
                      {formatNumber(categoryStats[mainCategory.id]?.activeProjects || 0)}
                    </StatNumber>
                    <StatLabel categoryTheme={getCategoryTheme(mainCategory.id)}>
                      进行中
                    </StatLabel>
                  </div>
                </StatItem>

                <StatItem>
                  <TrophyOutlined />
                  <div>
                    <StatNumber categoryTheme={getCategoryTheme(mainCategory.id)}>
                      +{categoryStats[mainCategory.id]?.growth || 0}%
                    </StatNumber>
                    <StatLabel categoryTheme={getCategoryTheme(mainCategory.id)}>
                      增长率
                    </StatLabel>
                  </div>
                </StatItem>
              </CategoryStats>
            </div>

            <ExploreButton
              categoryTheme={getCategoryTheme(mainCategory.id)}
              icon={<ArrowRightOutlined />}
            >
              探索领域
            </ExploreButton>
          </CategoryCard>
        )}

        {/* 其他分类 - 小卡片 */}
        {otherCategories.map(category => {
          const theme = getCategoryTheme(category.id);
          const stats = categoryStats[category.id];

          return (
            <CategoryCard
              key={category.id}
              categoryTheme={theme}
              isLarge={false}
              onClick={() => handleCategoryClick(category)}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <GlowEffect categoryTheme={theme} />
              <FloatingElements categoryTheme={theme}>
                <FloatingDot categoryTheme={theme} size={4} top='30%' left='20%' delay={0} />
                <FloatingDot categoryTheme={theme} size={6} top='70%' left='70%' delay={1} />
              </FloatingElements>

              {stats?.trending && (
                <TrendingBadge categoryTheme={theme} status='processing' text='热门' />
              )}

              <div>
                <CategoryIcon categoryTheme={theme} size='small'>
                  {category.icon}
                </CategoryIcon>

                <CategoryTitle level={4} categoryTheme={theme}>
                  {category.name}
                </CategoryTitle>

                <CategoryDescription
                  categoryTheme={theme}
                  style={{ fontSize: '0.9rem', marginBottom: 16 }}
                >
                  {category.description}
                </CategoryDescription>

                <CategoryStats style={{ gap: 16, marginBottom: 16 }}>
                  <StatItem>
                    <EyeOutlined style={{ fontSize: '14px' }} />
                    <div>
                      <StatNumber categoryTheme={theme} style={{ fontSize: '0.9rem' }}>
                        {formatNumber(stats?.orderCount || 0)}
                      </StatNumber>
                      <StatLabel categoryTheme={theme} style={{ fontSize: '0.8rem' }}>
                        项目
                      </StatLabel>
                    </div>
                  </StatItem>

                  <StatItem>
                    <RocketOutlined style={{ fontSize: '14px' }} />
                    <div>
                      <StatNumber categoryTheme={theme} style={{ fontSize: '0.9rem' }}>
                        {formatNumber(stats?.activeProjects || 0)}
                      </StatNumber>
                      <StatLabel categoryTheme={theme} style={{ fontSize: '0.8rem' }}>
                        进行中
                      </StatLabel>
                    </div>
                  </StatItem>
                </CategoryStats>
              </div>

              <ExploreButton categoryTheme={theme} size='small' icon={<ArrowRightOutlined />}>
                查看详情
              </ExploreButton>
            </CategoryCard>
          );
        })}
      </BentoGrid>
    </BentoGridContainer>
  );
};

export default CategoryBentoGrid;
