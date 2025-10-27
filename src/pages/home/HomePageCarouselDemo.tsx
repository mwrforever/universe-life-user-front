import React, { useState } from 'react';
import { ConfigProvider, Switch, Button, Space, Card, Typography, Divider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { BannerCarouselSimple } from './components/banner/BannerCarouselSimple';
import { simpleCarouselData } from '../../data/simpleCarouselData';

const { Title, Paragraph } = Typography;

// 扩展的轮播图数据，包含更多交互功能
const enhancedCarouselData = [
  {
    id: '1',
    title: '🚀 探索无限宇宙',
    description: '开启人类太空文明新纪元，体验前所未有的星际生活',
    image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1920&h=960&fit=crop&auto=format',
    ctaText: '开始探索',
    ctaLink: '/explore',
    type: 'internal' as const,
    order: 1,
    isActive: true,
  },
  {
    id: '2',
    title: '🛸 空间站任务',
    description: '高回报太空任务等你挑战，赢取丰厚奖励成就传奇',
    image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e3?w=1920&h=960&fit=crop&auto=format',
    ctaText: '接受任务',
    ctaLink: '/tasks',
    type: 'internal' as const,
    order: 2,
    isActive: true,
  },
  {
    id: '3',
    title: '⭐ 星际公民特权',
    description: '尊享宇宙生活专属权益，解锁独家太空体验',
    image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e4?w=1920&h=960&fit=crop&auto=format',
    ctaText: '了解会员',
    ctaLink: '/membership',
    type: 'internal' as const,
    order: 3,
    isActive: true,
  },
  {
    id: '4',
    title: '🌌 宇宙生活新纪元',
    description: '科技创新引领未来，打造人类第二家园',
    image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e5?w=1920&h=960&fit=crop&auto=format',
    ctaText: '了解更多',
    ctaLink: '/about',
    type: 'internal' as const,
    order: 4,
    isActive: true,
  },
];

// 轮播图演示页面
export const HomePageCarouselDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [useEnhancedData, setUseEnhancedData] = useState(true);
  const [banners, setBanners] = useState(enhancedCarouselData);

  // 处理轮播图点击
  const handleBannerClick = (banner: any) => {
    console.log('轮播图点击:', banner);
    alert(`点击了轮播图: ${banner.title}\n描述: ${banner.description}\n链接: ${banner.ctaLink}`);
  };

  // 切换数据源
  const toggleDataSource = () => {
    setUseEnhancedData(!useEnhancedData);
    setBanners(useEnhancedData ? simpleCarouselData : enhancedCarouselData);
  };

  // 切换加载状态
  const toggleLoading = () => {
    setLoading(!loading);
  };

  // 添加轮播项
  const addBanner = () => {
    const newBanner = {
      id: Date.now().toString(),
      title: `🎯 新轮播项 ${banners.length + 1}`,
      description: '这是一个动态添加的轮播项，展示组件的灵活性',
      image: `https://images.unsplash.com/photo-1446776877081-d282a0f896e${Math.floor(Math.random() * 5) + 2}?w=1920&h=960&fit=crop&auto=format`,
      ctaText: '立即体验',
      ctaLink: '/new-feature',
      type: 'internal' as const,
      order: banners.length + 1,
      isActive: true,
    };
    setBanners([...banners, newBanner]);
  };

  // 移除最后一个轮播项
  const removeBanner = () => {
    if (banners.length > 1) {
      setBanners(banners.slice(0, -1));
    }
  };

  return (
    <ConfigProvider locale={zhCN}>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          {/* 页面标题 */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Title style={{
              color: 'white',
              marginBottom: '16px',
              textShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}>
              🎠 轮播图组件演示
            </Title>
            <Paragraph style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: '18px',
              textShadow: '0 1px 4px rgba(0,0,0,0.3)'
            }}>
              功能完整的轮播图组件，支持自动播放、键盘导航、响应式布局
            </Paragraph>
          </div>

          {/* 控制面板 */}
          <Card
            title="🎛️ 控制面板"
            style={{
              marginBottom: '32px',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(12px)'
            }}
          >
            <Space wrap>
              <div>
                <span style={{ marginRight: '8px' }}>增强数据:</span>
                <Switch
                  checked={useEnhancedData}
                  onChange={toggleDataSource}
                />
              </div>
              <div>
                <span style={{ marginRight: '8px' }}>加载状态:</span>
                <Switch
                  checked={loading}
                  onChange={toggleLoading}
                />
              </div>
              <Button onClick={addBanner} type="primary">
                添加轮播项
              </Button>
              <Button onClick={removeBanner} disabled={banners.length <= 1}>
                移除轮播项
              </Button>
            </Space>

            <Divider />

            <div style={{ color: '#666', fontSize: '14px' }}>
              <div>📊 当前轮播项数量: {banners.length}</div>
              <div>🎨 数据源: {useEnhancedData ? '增强数据 (4项)' : '简单数据 (3项)'}</div>
              <div>⚡ 状态: {loading ? '加载中' : '正常'}</div>
            </div>
          </Card>

          {/* 轮播图组件 */}
          <BannerCarouselSimple
            banners={banners}
            loading={loading}
            onBannerClick={handleBannerClick}
          />

          {/* 功能说明 */}
          <Card
            title="✨ 功能特性"
            style={{
              marginTop: '40px',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(12px)'
            }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              <div>
                <h4 style={{ color: '#333', marginBottom: '12px' }}>🎯 核心功能</h4>
                <ul style={{ color: '#666', lineHeight: '1.8', paddingLeft: '20px' }}>
                  <li>自动播放 / 手动切换</li>
                  <li>左右箭头导航</li>
                  <li>底部指示器点击</li>
                  <li>键盘快捷键支持</li>
                  <li>响应式布局设计</li>
                </ul>
              </div>

              <div>
                <h4 style={{ color: '#333', marginBottom: '12px' }}>🎨 交互效果</h4>
                <ul style={{ color: '#666', lineHeight: '1.8', paddingLeft: '20px' }}>
                  <li>平滑过渡动画</li>
                  <li>悬停暂停播放</li>
                  <li>按钮微交互效果</li>
                  <li>内容渐入动画</li>
                  <li>光影扫描特效</li>
                </ul>
              </div>

              <div>
                <h4 style={{ color: '#333', marginBottom: '12px' }}>🛠️ 技术特性</h4>
                <ul style={{ color: '#666', lineHeight: '1.8', paddingLeft: '20px' }}>
                  <li>TypeScript 类型安全</li>
                  <li>图片预加载机制</li>
                  <li>错误处理和降级</li>
                  <li>无障碍访问支持</li>
                  <li>性能优化设计</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* 键盘快捷键说明 */}
          <Card
            title="⌨️ 键盘快捷键"
            style={{
              marginTop: '24px',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(12px)'
            }}
          >
            <Space wrap>
              <Button code>←</Button>
              <span>上一张</span>
              <Button code>→</Button>
              <span>下一张</span>
              <Button code>Home</Button>
              <span>第一张</span>
              <Button code>End</Button>
              <span>最后一张</span>
            </Space>
          </Card>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default HomePageCarouselDemo;