import React from 'react';
import { UniverseCarousel } from '../../../../components/carousel/UniverseCarousel';
import type { CarouselItem } from '../../../../components/carousel/UniverseCarousel';

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

// 转换数据格式
const convertToCarouselItems = (banners: BannerItem[]): CarouselItem[] => {
  return banners
    .filter(banner => banner.isActive)
    .sort((a, b) => a.order - b.order)
    .map(banner => ({
      id: banner.id,
      title: banner.title,
      description: banner.description,
      image: banner.image,
      ctaText: banner.ctaText,
      link: banner.ctaLink,
      type: banner.type
    }));
};

// 简化版轮播图组件
export const BannerCarouselSimple: React.FC<BannerCarouselSimpleProps> = ({
  banners,
  loading = false,
  onBannerClick,
}) => {
  // 处理轮播图点击
  const handleCarouselClick = (item: CarouselItem) => {
    const originalBanner = banners.find(b => b.id === item.id);
    if (originalBanner) {
      onBannerClick?.(originalBanner);
    }
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

  const carouselItems = convertToCarouselItems(banners);

  return (
    <div style={{
      width: '100%',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 15px 50px rgba(0, 0, 0, 0.25)',
      background: '#fff'
    }}>
      <UniverseCarousel
        items={carouselItems}
        autoplay={true}
        autoplaySpeed={4500}
        pauseOnHover={true}
        showArrows={true}
        showDots={true}
        height={480}
        onItemChange={(index) => {
          console.log('轮播图切换到:', index + 1);
        }}
        onItemClick={handleCarouselClick}
      />
    </div>
  );
};

export default BannerCarouselSimple;