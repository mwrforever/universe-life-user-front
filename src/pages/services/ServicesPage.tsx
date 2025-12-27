/**
 * 服务大厅页面 - 淘宝风格
 * 分类筛选条件 + 服务列表展示
 * 每屏12个服务，滚动懒加载，节流防抖
 */

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfigProvider, Input, Tag, Empty, Spin } from 'antd';
import {
  AppstoreOutlined,
  SearchOutlined,
  ThunderboltOutlined,
  RocketOutlined,
  BookOutlined,
  HighlightOutlined,
  StarFilled,
  UserOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { getTheme } from '@/components/layout/TopNavBar';
import { useAuth } from '@/hooks/useAuth';
import { PageContainer, ContentWrapper, MainCard, BackToTopButton } from '@/components/common';
import { throttle, debounce } from '@/utils';

const PAGE_SIZE = 12;

interface ServiceItem {
  id: string;
  title: string;
  category: string;
  categoryId: string;
  price: number;
  rating: number;
  orderCount: number;
  provider: string;
  tags: string[];
}

interface CategoryFilter {
  id: string;
  name: string;
  icon: React.ReactNode;
}


const HeaderSection = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #f2f2f2;
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const TitleArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .icon-wrapper {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #ff6000 0%, #ff8c00 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    .anticon {
      font-size: 20px;
      color: #fff;
    }
  }

  .title {
    font-size: 20px;
    font-weight: 700;
    color: #1a1a1a;
  }

  .subtitle {
    font-size: 12px;
    color: #999;
    margin-top: 2px;
  }
`;

const SearchBox = styled(Input)`
  width: 320px;
  height: 38px;
  border-radius: 19px;
  border: 2px solid #ff6000;
  padding-left: 14px;

  &:hover,
  &:focus {
    border-color: #ff6000;
    box-shadow: 0 0 0 2px rgba(255, 96, 0, 0.1);
  }

  .ant-input {
    font-size: 13px;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterSection = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid #f2f2f2;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FilterLabel = styled.div`
  font-size: 13px;
  color: #666;
  font-weight: 500;
  white-space: nowrap;
`;

const FilterTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const FilterTab = styled.div<{ active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 18px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${p => (p.active ? '#ff6000' : '#f5f5f5')};
  color: ${p => (p.active ? '#fff' : '#666')};
  font-weight: ${p => (p.active ? 600 : 400)};

  .anticon {
    font-size: 14px;
  }

  &:hover {
    background: ${p => (p.active ? '#ff6000' : '#ffe8dc')};
    color: ${p => (p.active ? '#fff' : '#ff6000')};
  }
`;

const ServicesSection = styled.div`
  padding: 16px 24px 24px;
`;

const ResultInfo = styled.div`
  font-size: 12px;
  color: #999;
  margin-bottom: 14px;
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ServiceCard = styled.div`
  background: #fff;
  border-radius: 10px;
  border: 1px solid #f2f2f2;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    border-color: #ffe1d6;
    box-shadow: 0 8px 20px rgba(255, 96, 0, 0.1);
    transform: translateY(-3px);
  }
`;

const ServiceImage = styled.div`
  height: 110px;
  background: linear-gradient(135deg, #fff8f5 0%, #fff0eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .placeholder-icon {
    font-size: 32px;
    color: #ffcdb8;
  }
`;

const ServiceBadge = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  background: linear-gradient(135deg, #ff6000 0%, #ff8c00 100%);
  color: #fff;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 600;
`;

const ServiceContent = styled.div`
  padding: 12px;
`;

const ServiceTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ServiceMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const ServiceRating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #999;
`;

const ServiceOrders = styled.div`
  font-size: 11px;
  color: #999;
`;

const ServiceFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ServicePrice = styled.div`
  font-size: 16px;
  font-weight: 800;
  color: #ff6000;

  .unit {
    font-size: 11px;
    font-weight: 600;
  }

  .suffix {
    font-size: 11px;
    font-weight: 400;
    color: #999;
    margin-left: 2px;
  }
`;

const ServiceProvider = styled.div`
  font-size: 11px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
`;

const ServiceTag = styled(Tag)`
  margin: 0;
  font-size: 10px;
  padding: 0 6px;
  border-radius: 4px;
  border: none;
  background: #f5f5f5;
  color: #666;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px 0;
  color: #ff6000;
`;

const EndMessage = styled.div`
  text-align: center;
  padding: 20px 0;
  font-size: 13px;
  color: #999;
`;

const categoryFilters: CategoryFilter[] = [
  { id: 'all', name: '全部', icon: <AppstoreOutlined /> },
  { id: 'gaming', name: '游戏服务', icon: <ThunderboltOutlined /> },
  { id: 'enterprise', name: '企业服务', icon: <RocketOutlined /> },
  { id: 'campus', name: '校园生态', icon: <BookOutlined /> },
  { id: 'design', name: '设计创意', icon: <HighlightOutlined /> },
];

const generateMockServices = (): ServiceItem[] => {
  const templates = [
    { title: 'LOL代练上分', category: '游戏服务', categoryId: 'gaming', provider: '王者代练', tags: ['效率高', '安全可靠'] },
    { title: '电商详情页UI设计', category: '设计创意', categoryId: 'design', provider: '设计达人', tags: ['精品', '修改满意'] },
    { title: 'PRD需求梳理与评审', category: '企业服务', categoryId: 'enterprise', provider: '产品专家', tags: ['专业', '高效'] },
    { title: '毕业论文排版+查重', category: '校园生态', categoryId: 'campus', provider: '学术助手', tags: ['快速', '通过率高'] },
    { title: '王者荣耀陪玩', category: '游戏服务', categoryId: 'gaming', provider: '甜心陪玩', tags: ['声音好听', '技术好'] },
    { title: 'Logo设计方案', category: '设计创意', categoryId: 'design', provider: '创意工坊', tags: ['原创', '商用授权'] },
    { title: 'Python数据分析', category: '校园生态', categoryId: 'campus', provider: '代码侠', tags: ['按时交付', '包修改'] },
    { title: '小程序开发定制', category: '企业服务', categoryId: 'enterprise', provider: '码上飞', tags: ['源码交付', '售后保障'] },
    { title: 'APEX代练冲分', category: '游戏服务', categoryId: 'gaming', provider: '猎杀者', tags: ['上分快', '包售后'] },
    { title: '海报设计制作', category: '设计创意', categoryId: 'design', provider: '视觉大师', tags: ['创意独特', '交付快'] },
    { title: '商业计划书撰写', category: '企业服务', categoryId: 'enterprise', provider: '商务顾问', tags: ['专业', '高成功率'] },
    { title: '考研资料整理', category: '校园生态', categoryId: 'campus', provider: '学霸笔记', tags: ['全面', '重点突出'] },
  ];

  const services: ServiceItem[] = [];
  for (let i = 0; i < 60; i++) {
    const template = templates[i % templates.length];
    services.push({
      id: `SV${String(i + 1).padStart(3, '0')}`,
      title: `${template.title} #${i + 1}`,
      category: template.category,
      categoryId: template.categoryId,
      price: Math.floor(Math.random() * 2000) + 50,
      rating: Number((4.5 + Math.random() * 0.5).toFixed(1)),
      orderCount: Math.floor(Math.random() * 3000) + 100,
      provider: template.provider,
      tags: template.tags,
    });
  }
  return services;
};

const allMockServices = generateMockServices();

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { toTopNavBarUser } = useAuth();
  const [searchKeyword, setSearchKeyword] = useState('');
  const searchKeywordRef = useRef(searchKeyword);

  // 同步 searchKeyword 到 ref，确保 debounce 中总是获取最新值
  useEffect(() => {
    searchKeywordRef.current = searchKeyword;
  }, [searchKeyword]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const loadingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const servicesGridRef = useRef<HTMLDivElement>(null);

  const filteredServices = useMemo(() => {
    let result = allMockServices;

    if (activeCategory !== 'all') {
      result = result.filter((s: ServiceItem) => s.categoryId === activeCategory);
    }

    const kw = searchKeyword.trim().toLowerCase();
    if (kw) {
      result = result.filter(
        (s: ServiceItem) =>
          s.title.toLowerCase().includes(kw) ||
          s.category.includes(kw) ||
          s.provider.toLowerCase().includes(kw)
      );
    }

    return result;
  }, [activeCategory, searchKeyword]);

  const displayedServices = useMemo(() => {
    return filteredServices.slice(0, displayCount);
  }, [filteredServices, displayCount]);

  const hasMore = displayCount < filteredServices.length;

  const loadMore = useCallback(() => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setIsLoading(true);

    setTimeout(() => {
      setDisplayCount(prev => Math.min(prev + PAGE_SIZE, filteredServices.length));
      setIsLoading(false);
      loadingRef.current = false;
    }, 500);
  }, [hasMore, filteredServices.length]);

  const handleScroll = useMemo(
    () =>
      throttle(() => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

        if (servicesGridRef.current) {
          const gridRect = servicesGridRef.current.getBoundingClientRect();
          setShowBackToTop(gridRect.top <= 0);
        }

        if (!loadingRef.current && hasMore) {
          const threshold = 200;
          if (scrollTop + clientHeight >= scrollHeight - threshold) {
            loadMore();
          }
        }
      }, 200),
    [loadMore, hasMore]
  );

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    setDisplayCount(PAGE_SIZE);
  }, [activeCategory, searchKeyword]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleServiceClick = (serviceId: string) => {
    navigate(`/task/${serviceId}`);
  };

  const handleSearch = useMemo(
    () => debounce(() => {
      const keyword = searchKeywordRef.current.trim();
      if (keyword) {
        navigate(`/market?q=${encodeURIComponent(keyword)}`);
      }
    }, 300),
    [navigate]
  );

  return (
    <ConfigProvider theme={getTheme('bright')}>
      <PageContainer>
        <TopNavBar
          user={toTopNavBarUser()}
          onNavigate={(path) => navigate(path)}
          showHomeLink={true}
        />

        <ContentWrapper>
          <MainCard>
            {/* Header */}
            <HeaderSection>
              <HeaderTop>
                <TitleArea>
                  <div className="icon-wrapper">
                    <AppstoreOutlined />
                  </div>
                  <div>
                    <div className="title">服务大厅</div>
                    <div className="subtitle">海量优质服务，一站式解决需求</div>
                  </div>
                </TitleArea>

                <SearchBox
                  placeholder="搜索服务..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onPressEnter={handleSearch}
                  prefix={<SearchOutlined style={{ color: '#ff6000' }} />}
                  allowClear
                />
              </HeaderTop>
            </HeaderSection>

            {/* Filter Tabs */}
            <FilterSection>
              <FilterLabel>分类：</FilterLabel>
              <FilterTabs>
                {categoryFilters.map((cat) => (
                  <FilterTab
                    key={cat.id}
                    active={activeCategory === cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    {cat.icon}
                    {cat.name}
                  </FilterTab>
                ))}
              </FilterTabs>
            </FilterSection>

            {/* Services List */}
            <ServicesSection ref={containerRef}>
              <ResultInfo>
                共找到 <strong style={{ color: '#ff6000' }}>{filteredServices.length}</strong> 个服务
                {displayedServices.length < filteredServices.length && (
                  <span style={{ marginLeft: 8 }}>
                    （已加载 {displayedServices.length} 个）
                  </span>
                )}
              </ResultInfo>

              {filteredServices.length === 0 ? (
                <div style={{ padding: '40px 0' }}>
                  <Empty description="暂无符合条件的服务" />
                </div>
              ) : (
                <>
                  <ServicesGrid ref={servicesGridRef}>
                    {displayedServices.map((service: ServiceItem) => (
                      <ServiceCard
                        key={service.id}
                        onClick={() => handleServiceClick(service.id)}
                      >
                        <ServiceImage>
                          <AppstoreOutlined className="placeholder-icon" />
                          <ServiceBadge>HOT</ServiceBadge>
                        </ServiceImage>

                        <ServiceContent>
                          <ServiceTitle title={service.title}>{service.title}</ServiceTitle>

                          <ServiceMeta>
                            <ServiceRating>
                              <StarFilled style={{ color: '#faad14' }} />
                              <span>{service.rating}</span>
                            </ServiceRating>
                            <ServiceOrders>{service.orderCount}人购买</ServiceOrders>
                          </ServiceMeta>

                          <ServiceFooter>
                            <ServicePrice>
                              <span className="unit">¥</span>
                              {service.price}
                              <span className="suffix">起</span>
                            </ServicePrice>
                            <ServiceProvider>
                              <UserOutlined />
                              {service.provider}
                            </ServiceProvider>
                          </ServiceFooter>

                          <TagsRow>
                            {service.tags.map((tag: string, idx: number) => (
                              <ServiceTag key={idx}>{tag}</ServiceTag>
                            ))}
                          </TagsRow>
                        </ServiceContent>
                      </ServiceCard>
                    ))}
                  </ServicesGrid>

                  {isLoading && (
                    <LoadingWrapper>
                      <Spin indicator={<LoadingOutlined spin />} />
                      <span style={{ marginLeft: 8 }}>加载中...</span>
                    </LoadingWrapper>
                  )}

                  {!hasMore && displayedServices.length > 0 && (
                    <EndMessage>— 已加载全部服务 —</EndMessage>
                  )}
                </>
              )}
            </ServicesSection>
          </MainCard>
        </ContentWrapper>

        {/* 回到顶部按钮 */}
        <BackToTopButton visible={showBackToTop} onClick={scrollToTop} />
      </PageContainer>
    </ConfigProvider>
  );
};

export default ServicesPage;
