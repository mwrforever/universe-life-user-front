import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
// import SimpleFooter from '@/components/layout/Footer/SimpleFooter'; // 已替换为TaobaoFooter
import { TaobaoFooter } from '@/components/layout/Footer';
import StickyFooterWrapper from '@/components/layout/Footer/StickyFooterWrapper';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { HeaderMain } from '@/components/layout/HeaderMain';
import { getTheme } from '@/components/layout/TopNavBar';
import { HeroContainer } from '@/components/home/hero';
import { categoryData, carouselData } from '../../data/hero-category-data';
import logo from '@/assets/logo.png';
import type { User, NotificationItem } from '@/components/layout/TopNavBar/types';
import OrderFeed from '../market/components/OrderFeed';


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

// 搜索容器样式 - 用于首页搜索功能
const SearchSection = styled.div`
  padding: 24px 0;
  text-align: center;
  background: linear-gradient(135deg, rgba(255, 107, 0, 0.05) 0%, rgba(255, 140, 0, 0.02) 100%);
  border-radius: 16px;
  margin: 20px 0;
`;

const SearchContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  position: relative;

  @media (max-width: 768px) {
    margin: 0 16px;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  height: 48px;
  border-radius: 24px;
  border: 2px solid rgba(255, 107, 0, 0.1);
  background: white;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
  padding: 0 20px 0 56px;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  &:focus {
    outline: none;
    border-color: #ff6b00;
    box-shadow: 0 0 0 4px rgba(255, 107, 0, 0.2);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    height: 44px;
    font-size: 14px;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #ff6b00;
  font-size: 20px;
`;


// 简化的首页组件
export const HomePageBasic: React.FC = () => {
  const navigate = useNavigate();

  // TopNavBar状态管理
  const [currentUser, setCurrentUser] = useState<User>({
    id: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    avatar: undefined,
    role: 'user',
    isOnline: true,
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: '新消息',
      content: '您的订单已发货',
      time: new Date(),
      read: false,
      type: 'info',
    },
    {
      id: '2',
      title: '系统通知',
      content: '您的账户已通过实名认证',
      time: new Date(),
      read: false,
      type: 'success',
    },
  ]);

  
  // HeaderMain事件处理
  const handleHeaderSearch = (query: string, category: string) => {
    console.log('Header搜索:', query, '分类:', category);
    // 这里可以添加实际的搜索逻辑
  };

  const handleBrandClick = () => {
    console.log('点击品牌Logo');
    navigate('/');
  };

  const handlePostRequest = () => {
    console.log('发布需求');
    navigate('/post-request');
  };

  const handleCartClick = () => {
    console.log('点击任务单');
    navigate('/cart');
  };

  
  // HeroSection 事件处理
  const handleCategoryClick = (category: any) => {
    console.log('点击分类:', category);
    navigate(`/category/${category.id}`);
  };

  const handleCarouselItemClick = (item: any) => {
    console.log('点击轮播图:', item);
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
            notifications={notifications}
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
            onCartClick={handleCartClick}
            cartCount={3}
          />

          {/* Hero Section - 淘宝风格重构成分类侧边栏 + 轮播图 */}
          <HeroContainer
            categories={categoryData}
            carouselItems={carouselData}
            onCategoryClick={handleCategoryClick}
            onCarouselItemClick={handleCarouselItemClick}
            autoplayInterval={5000}
            showMegaMenu={true}
            containerWidth={1200}
            borderRadius={16}
          />

          {/* Order Feed - 订单广场 */}
          <ContentContainer style={{ background: 'transparent', paddingTop: '0px' }}>
            <OrderFeedSection>
              <SectionTitle>
                <div>
                  <h2>🔥 热门订单</h2>
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
                onClick={() => navigate('/market')}
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
                orders={[]}
                loading={false}
                filterType="comprehensive"
                onFilterChange={(filterType) => console.log('Filter changed to:', filterType)}
                onGrabOrder={(orderId) => {
                  console.log('Grab order:', orderId);
                  // 这里可以添加抢单逻辑
                  // 显示成功提示
                  alert('抢单成功！订单ID: ' + orderId);
                }}
                onLoadMore={() => {
                  console.log('Load more orders');
                  // 这里可以添加加载更多逻辑
                }}
                hasMore={false}
              />
            </OrderFeedSection>
          </ContentContainer>
        </HomeContainer>
      </StickyFooterWrapper>
    </ConfigProvider>
  );
};

export default HomePageBasic;
