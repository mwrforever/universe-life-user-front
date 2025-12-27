import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { TaobaoFooter } from '@/components/layout/Footer';
import StickyFooterWrapper from '@/components/layout/Footer/StickyFooterWrapper';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { HeaderMain } from '@/components/layout/HeaderMain';
import { getTheme } from '@/components/layout/TopNavBar';
import { HeroContainer } from '@/components/home/hero';
import { categoryData, carouselData } from '../../data/hero-category-data';
import logo from '@/assets/logo.png';
import type { User } from '@/components/layout/TopNavBar/types';
import OrderFeed from '../market/components/OrderFeed';
import type { Category, CarouselItem } from '@/types/hero-category.ts';
import { useAuth } from '@/hooks/useAuth';
import { uiLogger } from '@/utils/logger';
import { BackToTopButton } from '@/components/common';
import { throttle } from '@/utils/throttle';


// 样式化容器
const HomeContainer = styled.div`
  background: #f8fafc;
  transition: 'background 0.3s ease';
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

// Order Feed 容器样式
const OrderFeedSection = styled.div`
  background: #ffffff;
  border-radius: 12px;
  margin: 24px 0;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    margin: 16px;
    border-radius: 8px;
  }
`;

// Section 标题样式
const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(135deg, #fff8f5 0%, #ffffff 100%);

  h2 {
    font-size: 20px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .subtitle {
    font-size: 14px;
    color: #666;
    margin-top: 4px;
  }

  @media (max-width: 768px) {
    padding: 16px;

    h2 {
      font-size: 18px;
    }
  }
`;

// 简化的首页组件
export const HomePageBasic: React.FC = () => {
  const navigate = useNavigate();
  const { toTopNavBarUser } = useAuth();

  // TopNavBar状态管理 - 使用认证状态
  const [currentUser] = useState<User | undefined>(() =>
    toTopNavBarUser()
  );

  // 回到顶部按钮状态
  const [showBackToTop, setShowBackToTop] = useState(false);
  const orderFeedRef = useRef<HTMLDivElement>(null);

  const handleScroll = useMemo(
    () => throttle(() => {
      if (orderFeedRef.current) {
        const rect = orderFeedRef.current.getBoundingClientRect();
        setShowBackToTop(rect.top <= 0);
      }
    }, 200),
    []
  );

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
  
  
  // HeaderMain事件处理
  const handleHeaderSearch = (query: string, category: string) => {
    uiLogger.info('Header搜索:', query, '分类:', category);
    // 这里可以添加实际的搜索逻辑
  };

  const handleBrandClick = () => {
    uiLogger.info('点击品牌Logo');
    navigate('/');
  };

  const handlePostRequest = () => {
    uiLogger.info('发布需求');
    navigate('/create-order');
  };

  const handleMyOrders = () => {
    uiLogger.info('我的需求');
    navigate('/tasks/client/all');
  };

  
  // HeroSection 事件处理
  const handleCategoryClick = (category: Category) => {
    uiLogger.info('点击分类:', category);
    navigate(`/category/${category.id}`);
  };

  const handleCarouselItemClick = (item: CarouselItem) => {
    uiLogger.info('点击轮播图:', item);
    if (item.ctaLink) {
      if (item.type === 'external') {
        window.open(item.ctaLink, '_blank', 'noopener,noreferrer');
      } else {
        navigate(item.ctaLink);
      }
    }
  };

  
  return (
    <ConfigProvider theme={getTheme('bright')}>
      <StickyFooterWrapper
        footer={
          <HomeContainer style={{ background: '#f8fafc' }}>
            {/* 使用新的淘宝风格Footer */}
            <TaobaoFooter />
          </HomeContainer>
        }
      >
        <HomeContainer style={{
          background: '#f8fafc',
          transition: 'background 0.3s ease'
        }}>
          {/* 淘宝风格TopNavBar导航栏 */}
          <TopNavBar
            user={currentUser}
            onNavigate={(path) => navigate(path)}
          />

          {/* Brand & Search Header */}
          <HeaderMain
            logoSrc={logo}
            logoAlt="Universe Life"
            logoWidth={280}
            logoHeight={96}
            onBrandClick={handleBrandClick}
            onSearch={handleHeaderSearch}
            onPostRequest={handlePostRequest}
            onCartClick={handleMyOrders}
          />

          {/* Hero Section - 淘宝风格重构成分类侧边栏 + 轮播图 */}
          <HeroContainer
            categories={categoryData}
            carouselItems={carouselData}
            onCategoryClick={handleCategoryClick}
            onCarouselItemClick={handleCarouselItemClick}
            autoplayInterval={5000}
            showMegaMenu={true}
          />

          {/* Order Feed - 订单广场 */}
          <ContentContainer style={{ background: 'transparent', paddingTop: '0px' }}>
            <OrderFeedSection ref={orderFeedRef}>
              <SectionTitle>
                <div>
                  <h2>🔥 热门服务</h2>
                  <div className="subtitle">精选优质服务，快速响应</div>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #ff6000 0%, #ff8c00 100%)',
                  color: 'white',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(255, 96, 0, 0.3)'
                }}
                onClick={() => navigate('/services')}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 96, 0, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 96, 0, 0.3)';
                }}
                >
                  查看全部
                </div>
              </SectionTitle>
              <OrderFeed
                onGrabOrder={(orderId) => {
                  uiLogger.info('Grab order:', orderId);
                }}
                enableInfiniteScroll={false}
              />
            </OrderFeedSection>
          </ContentContainer>

          {/* 回到顶部按钮 */}
          <BackToTopButton visible={showBackToTop} onClick={scrollToTop} />
        </HomeContainer>
      </StickyFooterWrapper>
    </ConfigProvider>
  );
};

export default HomePageBasic;
