import React from 'react';
import { Carousel } from 'antd';
import './BannerCarouselSimple.css';

// 轮播图数据类型
export interface BannerItem {
  id: string;
  title: string;
  description: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
  type?: 'internal' | 'external';
  order: number;
  isActive: boolean;
}

// 轮播图简化版组件属性
interface BannerCarouselSimpleProps {
  banners: BannerItem[];
  loading?: boolean;
  onBannerClick?: (banner: BannerItem) => void;
}

// 自定义箭头组件
const CustomPrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      className="custom-prev-arrow"
      onClick={onClick}
    >
      ❮
    </div>
  );
};

const CustomNextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      className="custom-next-arrow"
      onClick={onClick}
    >
      ❯
    </div>
  );
};

// 简化版轮播图组件
export const BannerCarouselSimple: React.FC<BannerCarouselSimpleProps> = ({
  banners,
  loading = false,
  onBannerClick,
}) => {
  // 处理轮播图点击
  const handleBannerClick = (banner: BannerItem) => {
    onBannerClick?.(banner);
  };

  if (loading) {
    return (
      <div style={{
        width: '100%',
        height: '480px',
        background: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '20px',
        border: '1px solid #e8e8e8'
      }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>加载中...</div>
        </div>
      </div>
    );
  }

  if (!banners || banners.length === 0) {
    return (
      <div style={{
        width: '100%',
        height: '480px',
        background: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '20px',
        border: '1px solid #e8e8e8'
      }}>
        <div style={{ textAlign: 'center', color: '#999' }}>
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>暂无轮播内容</div>
          <div style={{ fontSize: '14px' }}>请添加轮播图数据</div>
        </div>
      </div>
    );
  }

  const activeBanners = banners
    .filter(banner => banner.isActive)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="banner-carousel-container" style={{
      width: '100%',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      background: '#fff',
      border: '1px solid rgba(0, 0, 0, 0.06)'
    }}>
      <Carousel
        autoplay
        dots={{ className: 'custom-dots' }}
        effect="fade"
        style={{ height: '480px' }}
        arrows
        prevArrow={<CustomPrevArrow />}
        nextArrow={<CustomNextArrow />}
      >
        {activeBanners.map((banner) => (
          <div key={banner.id} onClick={() => handleBannerClick(banner)}>
            <div style={{
              height: '480px',
              backgroundImage: `url(${banner.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              cursor: 'pointer',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '40px',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                color: '#fff'
              }}>
                <h3 style={{ color: '#fff', margin: '0 0 8px 0', fontSize: '24px' }}>
                  {banner.title}
                </h3>
                {banner.description && (
                  <p style={{ color: '#fff', margin: 0, fontSize: '16px', opacity: 0.9 }}>
                    {banner.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};


export default BannerCarouselSimple;