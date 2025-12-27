/**
 * 我的收藏页面 - 淘宝风格
 * 收藏的服务/商品管理页面
 */

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ConfigProvider,
  Card,
  Tag,
  Spin,
  message,
  Button,
  Segmented,
  Input,
  Checkbox,
  Dropdown,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  StarOutlined,
  StarFilled,
  SearchOutlined,
  DeleteOutlined,
  ShopOutlined,
  ThunderboltOutlined,
  DesktopOutlined,
  TeamOutlined,
  BookOutlined,
  MoreOutlined,
  HeartFilled,
  ClockCircleOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { getTheme } from '@/components/layout/TopNavBar';
import { useAuth } from '@/hooks/useAuth';

// 收藏类型
type FavoriteType = 'service' | 'shop' | 'article';
type FilterType = 'all' | FavoriteType;

// 分类类型
type CategoryType = 'all' | 'gaming' | 'design' | 'enterprise' | 'campus';

// 收藏项接口
interface FavoriteItem {
  id: string;
  title: string;
  type: FavoriteType;
  category: CategoryType;
  categoryLabel: string;
  price?: number;
  originalPrice?: number;
  image: string;
  shopName?: string;
  shopId?: string;
  rating?: number;
  sales?: number;
  tags?: string[];
  createdAt: string;
  isValid: boolean; // 是否有效（商品可能下架）
}

// 页面容器
const PageContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
`;

// 内容包裹
const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 18px 20px 28px;

  @media (max-width: 768px) {
    padding: 14px 12px 22px;
  }
`;

// 头部区域
const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 12px 0 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

// 标题区域
const TitleArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  .title {
    font-size: 20px;
    font-weight: 700;
    color: #1a1a1a;
    line-height: 1.2;
  }

  .subtitle {
    font-size: 12px;
    color: #999;
    margin-top: 2px;
  }

  .count {
    font-size: 13px;
    color: #ff6000;
    font-weight: 500;
    margin-left: 8px;
  }
`;

// 控制区域
const ControlsArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

// 搜索框
const SearchBox = styled(Input)`
  width: 260px;

  .ant-input {
    font-size: 13px;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// 主卡片
const MainCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

  .ant-card-body {
    padding: 0;
  }
`;

// 列表头部
const ListHeader = styled.div`
  padding: 16px 18px;
  border-bottom: 1px solid #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

// 头部左侧
const ListHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

// 头部右侧
const ListHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

// 分类筛选
const CategoryTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 18px;
  border-bottom: 1px solid #f2f2f2;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

// 分类标签
const CategoryTab = styled.button<{ active?: boolean }>`
  padding: 6px 14px;
  border-radius: 16px;
  border: 1px solid ${(p) => (p.active ? '#ff6000' : '#e8e8e8')};
  background: ${(p) => (p.active ? '#fff5f0' : '#fff')};
  color: ${(p) => (p.active ? '#ff6000' : '#666')};
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    border-color: #ff6000;
    color: #ff6000;
  }

  .anticon {
    font-size: 12px;
  }
`;

// 收藏列表
const FavoritesList = styled.div`
  padding: 16px;
`;

// 收藏项卡片
const FavoriteCard = styled.div<{ invalid?: boolean }>`
  background: #fff;
  border-radius: 10px;
  border: 1px solid #f2f2f2;
  padding: 16px;
  display: flex;
  gap: 16px;
  transition: all 0.2s ease;
  opacity: ${(p) => (p.invalid ? 0.6 : 1)};
  position: relative;

  & + & {
    margin-top: 12px;
  }

  &:hover {
    border-color: #ffe1d6;
    box-shadow: 0 6px 18px rgba(255, 96, 0, 0.08);
    transform: translateY(-1px);
  }

  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

// 选择框容器
const CheckboxWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  padding-top: 2px;
`;

// 图片区域
const ImageWrapper = styled.div`
  position: relative;
  width: 140px;
  height: 140px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  background: #f9f9f9;

  @media (max-width: 576px) {
    width: 100%;
    height: 180px;
  }
`;

// 收藏项图片
const FavoriteImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// 无效标签
const InvalidBadge = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
`;

// 收藏项信息
const FavoriteInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

// 标题行
const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
`;

// 收藏项标题
const FavoriteTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    color: #ff6000;
  }
`;

// 标签行
const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
`;

// 店铺信息
const ShopInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
  cursor: pointer;

  &:hover {
    color: #ff6000;
  }

  .anticon {
    font-size: 14px;
  }
`;

// 底部信息
const BottomInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
`;

// 价格区域
const PriceArea = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

// 当前价格
const CurrentPrice = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #ff6000;

  .unit {
    font-size: 13px;
    font-weight: 600;
    margin-right: 2px;
  }
`;

// 原价
const OriginalPrice = styled.span`
  font-size: 13px;
  color: #bbb;
  text-decoration: line-through;
`;

// 操作按钮组
const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// 收藏时间
const FavoriteTime = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #bbb;
  margin-top: 8px;

  .anticon {
    font-size: 12px;
  }
`;

// 批量操作栏
const BatchActionBar = styled.div<{ visible?: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transform: translateY(${(p) => (p.visible ? '0' : '100%')});
  transition: transform 0.3s ease;
  z-index: 100;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
`;

// 批量操作左侧
const BatchLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

// 批量操作右侧
const BatchRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

// 加载容器
const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 380px;
`;

// 未登录卡片
const NotLoggedInCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 56px 40px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const NotLoggedInIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: #fff5f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  .anticon {
    font-size: 36px;
    color: #ff6000;
  }
`;

const NotLoggedInTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 10px;
`;

const NotLoggedInDesc = styled.div`
  font-size: 13px;
  color: #999;
  margin-bottom: 18px;
`;

const LoginButton = styled.button`
  background: #ff6000;
  color: #fff;
  border: none;
  padding: 10px 44px;
  border-radius: 22px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(255, 96, 0, 0.28);

  &:hover {
    background: #e85500;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(255, 96, 0, 0.34);
  }

  &:active {
    transform: translateY(0);
  }
`;

// 空状态
const EmptyWrapper = styled.div`
  padding: 60px 20px;
  text-align: center;

  .empty-icon {
    width: 120px;
    height: 120px;
    margin: 0 auto 20px;
    background: #fafafa;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    .anticon {
      font-size: 48px;
      color: #ddd;
    }
  }

  .empty-title {
    font-size: 15px;
    color: #999;
    margin-bottom: 16px;
  }
`;

// 分类图标映射
const categoryIcons: Record<CategoryType, React.ReactNode> = {
  all: <StarOutlined />,
  gaming: <ThunderboltOutlined />,
  design: <DesktopOutlined />,
  enterprise: <TeamOutlined />,
  campus: <BookOutlined />,
};

// 分类标签映射
const categoryLabels: Record<CategoryType, string> = {
  all: '全部',
  gaming: '游戏代练',
  design: '设计服务',
  enterprise: '企业服务',
  campus: '校园生态',
};

// 模拟收藏数据
const mockFavorites: FavoriteItem[] = [
  {
    id: 'FAV001',
    title: '【王者荣耀】星耀→王者 上分代练 安全高效 包售后',
    type: 'service',
    category: 'gaming',
    categoryLabel: '游戏代练',
    price: 299,
    originalPrice: 399,
    image: 'https://picsum.photos/seed/gaming1/400/400',
    shopName: '巅峰代练工作室',
    shopId: 'S001',
    rating: 4.9,
    sales: 2341,
    tags: ['官方认证', '极速上分', '售后保障'],
    createdAt: '2025-12-10 15:30',
    isValid: true,
  },
  {
    id: 'FAV002',
    title: '电商详情页设计 淘宝天猫京东主图海报 高转化设计',
    type: 'service',
    category: 'design',
    categoryLabel: '设计服务',
    price: 199,
    originalPrice: 299,
    image: 'https://picsum.photos/seed/design1/400/400',
    shopName: '创意设计工坊',
    shopId: 'S002',
    rating: 4.8,
    sales: 1856,
    tags: ['资深设计师', '无限修改', '源文件'],
    createdAt: '2025-12-09 10:20',
    isValid: true,
  },
  {
    id: 'FAV003',
    title: '企业商业计划书撰写 BP融资路演PPT 项目策划方案',
    type: 'service',
    category: 'enterprise',
    categoryLabel: '企业服务',
    price: 599,
    originalPrice: 899,
    image: 'https://picsum.photos/seed/enterprise1/400/400',
    shopName: '商业咨询顾问',
    shopId: 'S003',
    rating: 4.9,
    sales: 892,
    tags: ['资深顾问', '1对1服务', '成功案例'],
    createdAt: '2025-12-08 18:45',
    isValid: true,
  },
  {
    id: 'FAV004',
    title: '【LOL】代练上分 钻石→大师 全区服务 不满意退款',
    type: 'service',
    category: 'gaming',
    categoryLabel: '游戏代练',
    price: 499,
    image: 'https://picsum.photos/seed/gaming2/400/400',
    shopName: '电竞大神代练',
    shopId: 'S004',
    rating: 4.7,
    sales: 3102,
    tags: ['职业选手', '24h在线'],
    createdAt: '2025-12-07 09:15',
    isValid: false,
  },
  {
    id: 'FAV005',
    title: '毕业论文指导 开题报告 文献综述 降重修改润色',
    type: 'service',
    category: 'campus',
    categoryLabel: '校园生态',
    price: 159,
    originalPrice: 259,
    image: 'https://picsum.photos/seed/campus1/400/400',
    shopName: '学术辅导中心',
    shopId: 'S005',
    rating: 4.8,
    sales: 4521,
    tags: ['硕博团队', '各专业', '包通过'],
    createdAt: '2025-12-06 14:30',
    isValid: true,
  },
  {
    id: 'FAV006',
    title: 'Logo设计 品牌VI设计 企业标志设计 原创定制',
    type: 'service',
    category: 'design',
    categoryLabel: '设计服务',
    price: 299,
    originalPrice: 499,
    image: 'https://picsum.photos/seed/design2/400/400',
    shopName: '品牌视觉设计',
    shopId: 'S006',
    rating: 4.9,
    sales: 2134,
    tags: ['多套方案', '原创保证', '商用授权'],
    createdAt: '2025-12-05 11:00',
    isValid: true,
  },
];

// 类型筛选选项
const typeOptions: { label: string; value: FilterType }[] = [
  { label: '全部', value: 'all' },
  { label: '服务', value: 'service' },
  { label: '店铺', value: 'shop' },
  { label: '文章', value: 'article' },
];

const UserFavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, login, toTopNavBarUser } = useAuth();

  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterCategory, setFilterCategory] = useState<CategoryType>('all');
  const [keyword, setKeyword] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 过滤收藏列表
  const filteredFavorites = useMemo(() => {
    let result = mockFavorites;

    // 按类型筛选
    if (filterType !== 'all') {
      result = result.filter((item) => item.type === filterType);
    }

    // 按分类筛选
    if (filterCategory !== 'all') {
      result = result.filter((item) => item.category === filterCategory);
    }

    // 按关键词搜索
    const kw = keyword.trim();
    if (kw) {
      result = result.filter(
        (item) =>
          item.title.includes(kw) ||
          item.shopName?.includes(kw) ||
          item.categoryLabel.includes(kw)
      );
    }

    return result;
  }, [filterType, filterCategory, keyword]);

  // 全选状态
  const isAllSelected =
    filteredFavorites.length > 0 &&
    filteredFavorites.every((item) => selectedIds.includes(item.id));

  // 处理全选
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredFavorites.map((item) => item.id));
    }
  };

  // 处理单选
  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // 取消收藏
  const handleRemoveFavorite = (id: string) => {
    message.success('已取消收藏');
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  };

  // 批量取消收藏
  const handleBatchRemove = () => {
    if (selectedIds.length === 0) {
      message.warning('请先选择要取消收藏的商品');
      return;
    }
    message.success(`已取消收藏 ${selectedIds.length} 个商品`);
    setSelectedIds([]);
  };

  // 查看详情
  const handleViewDetail = (item: FavoriteItem) => {
    if (!item.isValid) {
      message.warning('该服务已下架');
      return;
    }
    message.info(`查看详情：${item.title}`);
  };

  // 立即购买
  const handleBuy = (item: FavoriteItem) => {
    if (!item.isValid) {
      message.warning('该服务已下架');
      return;
    }
    message.info('购买功能待接入');
  };

  // 更多操作菜单
  const getMoreMenuItems = (item: FavoriteItem): MenuProps['items'] => [
    {
      key: 'similar',
      label: '找相似',
      onClick: () => message.info('找相似功能待接入'),
    },
    {
      key: 'share',
      label: '分享',
      onClick: () => message.info('分享功能待接入'),
    },
    {
      type: 'divider',
    },
    {
      key: 'remove',
      label: '取消收藏',
      danger: true,
      onClick: () => handleRemoveFavorite(item.id),
    },
  ];

  // 加载中
  if (isLoading) {
    return (
      <ConfigProvider theme={getTheme('bright')}>
        <PageContainer>
          <TopNavBar
            user={toTopNavBarUser()}
            onNavigate={(path) => navigate(path)}
            showHomeLink={true}
          />
          <LoadingContainer>
            <Spin size="large" />
          </LoadingContainer>
        </PageContainer>
      </ConfigProvider>
    );
  }

  // 未登录
  if (!isAuthenticated || !user) {
    return (
      <ConfigProvider theme={getTheme('bright')}>
        <PageContainer>
          <TopNavBar
            user={toTopNavBarUser()}
            onNavigate={(path) => navigate(path)}
            showHomeLink={true}
          />
          <ContentWrapper>
            <div style={{ width: '100%', maxWidth: 560, margin: '40px auto' }}>
              <NotLoggedInCard>
                <NotLoggedInIcon>
                  <StarOutlined />
                </NotLoggedInIcon>
                <NotLoggedInTitle>登录后查看"我的收藏"</NotLoggedInTitle>
                <NotLoggedInDesc>
                  收藏你喜欢的服务和店铺，随时查看和比较
                </NotLoggedInDesc>
                <LoginButton onClick={() => login()}>立即登录</LoginButton>
              </NotLoggedInCard>
            </div>
          </ContentWrapper>
        </PageContainer>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider theme={getTheme('bright')}>
      <PageContainer>
        <TopNavBar
          user={toTopNavBarUser()}
          onNavigate={(path) => navigate(path)}
          showHomeLink={true}
        />

        <ContentWrapper>
          {/* 头部 */}
          <HeaderRow>
            <TitleArea>
              <HeartFilled style={{ color: '#ff6000', fontSize: 20 }} />
              <div>
                <div className="title">
                  我的收藏
                  <span className="count">({mockFavorites.length})</span>
                </div>
                <div className="subtitle">管理你收藏的服务和店铺</div>
              </div>
            </TitleArea>

            <ControlsArea>
              <SearchBox
                allowClear
                placeholder="搜索收藏的服务/店铺"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </ControlsArea>
          </HeaderRow>

          {/* 主卡片 */}
          <MainCard>
            {/* 类型筛选 */}
            <ListHeader>
              <ListHeaderLeft>
                <Segmented
                  options={typeOptions}
                  value={filterType}
                  onChange={(v) => setFilterType(v as FilterType)}
                />
              </ListHeaderLeft>
              <ListHeaderRight>
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={selectedIds.length > 0 && !isAllSelected}
                  onChange={handleSelectAll}
                >
                  全选
                </Checkbox>
              </ListHeaderRight>
            </ListHeader>

            {/* 分类筛选 */}
            <CategoryTabs>
              {(Object.keys(categoryLabels) as CategoryType[]).map((cat) => (
                <CategoryTab
                  key={cat}
                  active={filterCategory === cat}
                  onClick={() => setFilterCategory(cat)}
                >
                  {categoryIcons[cat]}
                  {categoryLabels[cat]}
                </CategoryTab>
              ))}
            </CategoryTabs>

            {/* 收藏列表 */}
            <FavoritesList>
              {filteredFavorites.length === 0 ? (
                <EmptyWrapper>
                  <div className="empty-icon">
                    <StarOutlined />
                  </div>
                  <div className="empty-title">
                    {keyword
                      ? '没有找到匹配的收藏'
                      : '暂无收藏，去逛逛发现好服务吧'}
                  </div>
                  <Button
                    type="primary"
                    style={{ background: '#ff6000', borderColor: '#ff6000' }}
                    onClick={() => navigate('/services')}
                  >
                    去逛逛
                  </Button>
                </EmptyWrapper>
              ) : (
                filteredFavorites.map((item) => (
                  <FavoriteCard key={item.id} invalid={!item.isValid}>
                    <CheckboxWrapper>
                      <Checkbox
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleSelect(item.id)}
                      />
                    </CheckboxWrapper>

                    <ImageWrapper>
                      <FavoriteImage
                        src={item.image}
                        alt={item.title}
                        onClick={() => handleViewDetail(item)}
                      />
                      {!item.isValid && <InvalidBadge>已下架</InvalidBadge>}
                    </ImageWrapper>

                    <FavoriteInfo>
                      <TitleRow>
                        <FavoriteTitle onClick={() => handleViewDetail(item)}>
                          {item.title}
                        </FavoriteTitle>
                        <Dropdown
                          menu={{ items: getMoreMenuItems(item) }}
                          trigger={['click']}
                        >
                          <Button
                            type="text"
                            size="small"
                            icon={<MoreOutlined />}
                          />
                        </Dropdown>
                      </TitleRow>

                      <TagsRow>
                        <Tag color="orange" style={{ marginInlineEnd: 0 }}>
                          {item.categoryLabel}
                        </Tag>
                        {item.tags?.slice(0, 3).map((tag) => (
                          <Tag key={tag} style={{ marginInlineEnd: 0 }}>
                            {tag}
                          </Tag>
                        ))}
                      </TagsRow>

                      {item.shopName && (
                        <ShopInfo onClick={() => message.info('店铺详情待接入')}>
                          <ShopOutlined />
                          <span>{item.shopName}</span>
                          {item.rating && (
                            <>
                              <StarFilled style={{ color: '#ffb400', fontSize: 12 }} />
                              <span>{item.rating}</span>
                            </>
                          )}
                          {item.sales && <span>· 已售 {item.sales}</span>}
                        </ShopInfo>
                      )}

                      <BottomInfo>
                        <PriceArea>
                          {item.price !== undefined && (
                            <CurrentPrice>
                              <span className="unit">¥</span>
                              {item.price}
                            </CurrentPrice>
                          )}
                          {item.originalPrice && (
                            <OriginalPrice>¥{item.originalPrice}</OriginalPrice>
                          )}
                        </PriceArea>

                        <ActionButtons>
                          <Button
                            size="small"
                            onClick={() => handleRemoveFavorite(item.id)}
                            icon={<DeleteOutlined />}
                          >
                            取消收藏
                          </Button>
                          <Button
                            size="small"
                            type="primary"
                            style={{
                              background: item.isValid ? '#ff6000' : '#ccc',
                              borderColor: item.isValid ? '#ff6000' : '#ccc',
                            }}
                            disabled={!item.isValid}
                            onClick={() => handleBuy(item)}
                          >
                            立即购买
                          </Button>
                        </ActionButtons>
                      </BottomInfo>

                      <FavoriteTime>
                        <ClockCircleOutlined />
                        收藏于 {item.createdAt}
                      </FavoriteTime>
                    </FavoriteInfo>
                  </FavoriteCard>
                ))
              )}
            </FavoritesList>
          </MainCard>
        </ContentWrapper>

        {/* 批量操作栏 */}
        <BatchActionBar visible={selectedIds.length > 0}>
          <BatchLeft>
            <Checkbox
              checked={isAllSelected}
              indeterminate={selectedIds.length > 0 && !isAllSelected}
              onChange={handleSelectAll}
            >
              全选
            </Checkbox>
            <span style={{ color: '#666', fontSize: 13 }}>
              已选择 <b style={{ color: '#ff6000' }}>{selectedIds.length}</b> 个
            </span>
          </BatchLeft>
          <BatchRight>
            <Button danger onClick={handleBatchRemove} icon={<DeleteOutlined />}>
              批量取消收藏
            </Button>
          </BatchRight>
        </BatchActionBar>
      </PageContainer>
    </ConfigProvider>
  );
};

export default UserFavoritesPage;
