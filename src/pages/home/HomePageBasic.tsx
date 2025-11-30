import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Space, Spin, Input, Drawer, Avatar, Badge, Dropdown } from 'antd';
import {
  SearchOutlined,
  MenuOutlined,
  BellOutlined,
  UserOutlined,
  FireOutlined,
  LogoutOutlined,
  SettingOutlined,
  OrderedListOutlined,
  HeartOutlined,
  MessageOutlined,
  WalletOutlined,
  StarOutlined,
  SafetyCertificateOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { BannerCarouselSimple } from './components/banner/BannerCarouselSimple';
import { simpleCarouselData } from '@/data/simpleCarouselData.ts';
import SimpleFooter from '@/components/layout/Footer/SimpleFooter';
import { usePopupAuth } from '../../components/Auth/PopupAuthManager';
import UserInfoDisplay from '../../components/Auth/UserInfoDisplay';

const { Title, Paragraph } = Typography;

// 轮播图数据类型定义
interface CarouselDataItem {
  id: string;
  title: string;
  description: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
  type?: 'internal' | 'external';
}

// 轮播图数据转换函数
const convertToBannerItems = (carouselData: CarouselDataItem[]) => {
  return carouselData.map((item, index) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    image: item.image,
    ctaText: item.ctaText,
    ctaLink: item.ctaLink || '/explore',
    type: item.type || 'internal',
    order: index + 1,
    isActive: true,
  }));
};

// 样式化容器
const HomeContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

// 新的导航栏样式组件
const NavigationContainer = styled.header`
  --navH: 64px;
  --primary: #ff6b00;
  --secondary: #ffd8b8;
  --bg: #fffdfb;
  --text1: rgba(0, 0, 0, 0.88);
  --text2: rgba(0, 0, 0, 0.56);
  --shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  --radius: 12px;
  --primary-a20: rgba(255, 107, 0, 0.2);

  position: sticky;
  top: 0;
  z-index: 1000;
  height: var(--navH);
  background: var(--bg);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: var(--shadow);

  @media (max-width: 768px) {
    --navH: 56px;
    --radius: 0;
  }
`;

const NavContent = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  height: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;

  @media (max-width: 768px) {
    padding: 0 16px;
    gap: 12px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    animation: logoWiggle 0.5s ease-in-out;
    filter: brightness(1.1);
  }

  @keyframes logoWiggle {
    0%,
    100% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(-3deg);
    }
    75% {
      transform: rotate(3deg);
    }
  }

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary) 0%, #ff8c00 100%);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  box-shadow: 0 2px 8px rgba(255, 107, 0, 0.3);

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;

  h1 {
    margin: 0;
    background: linear-gradient(135deg, var(--primary) 0%, #ff8c00 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: 20px;
    font-weight: 600;
    line-height: 1;

    @media (max-width: 768px) {
      font-size: 18px;
    }
  }

  span {
    color: var(--text2);
    font-size: 12px;
    line-height: 1;
    margin-top: 2px;

    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const SearchContainer = styled.div`
  flex: 1;
  max-width: 560px;
  position: relative;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const StyledInput = styled(Input.Search)`
  .ant-input {
    height: 40px;
    border-radius: var(--radius);
    border: 1px solid rgba(0, 0, 0, 0.06);
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(8px);
    transition: all 0.3s ease;

    &:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--primary-a20);
      background: white;
    }

    @media (max-width: 768px) {
      height: 48px;
      border-radius: 0;
    }
  }

  .ant-input-search-button {
    background: var(--primary);
    border: none;
    border-radius: 0 var(--radius) var(--radius) 0;
    height: 40px;

    &:hover {
      background: #ff8c00;
    }

    @media (max-width: 768px) {
      height: 48px;
      border-radius: 0;
    }
  }
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const PulseBadge = styled(Badge)`
  .ant-badge-dot {
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.7;
    }
  }
`;

const RippleButton = styled(Button)`
  position: relative;
  overflow: hidden;
  border-radius: var(--radius);
  transition: all 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition:
      width 0.6s,
      height 0.6s;
  }

  &:active::after {
    width: 300px;
    height: 300px;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const MobileMenuButton = styled(Button)`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: var(--radius);
    border: none;
    background: rgba(255, 255, 255, 0.8);
  }
`;

const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const UserAvatarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 20px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const UserAvatar = styled(Avatar)`
  &.ant-avatar {
    border: 2px solid var(--primary);
  }
`;

const UserName = styled.span`
  color: var(--text1);
  font-size: 14px;
  font-weight: 500;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 1024px) {
    display: none;
  }
`;

// 服务快速入口容器
const ServiceQuickEntry = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 40px;

  @media (min-width: 1200px) {
    display: flex;
    gap: 32px;
    align-items: stretch;
  }

  @media (max-width: 1199px) and (min-width: 768px) {
    display: flex;
    gap: 24px;
    align-items: stretch;
    margin-bottom: 32px;
  }

  @media (max-width: 767px) {
    display: block;
    margin-bottom: 24px;
  }
`;

const CarouselStatsContainer = styled.div`
  flex: 3.375; /* 调整到原来的1.5倍 - 这里才是真正的轮播图容器！ */
  background: #fff;
  border-radius: 16px;
  overflow: hidden; /* 确保圆角完全生效 */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06); /* 轻微阴影，更自然 */
  border: 1px solid rgba(0, 0, 0, 0.04); /* 添加微妙边框 */

  @media (max-width: 767px) {
    border-radius: 16px 16px 0 0;
  }
`;

const StatsContent = styled.div`
  padding: 16px 32px; /* 调小数据概览块的内边距 */
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%);
  border-top: 1px solid rgba(0, 0, 0, 0.02);

  @media (max-width: 1199px) and (min-width: 768px) {
    padding: 14px 28px; /* 相应调整 */
  }

  @media (max-width: 767px) {
    padding: 12px 20px; /* 相应调整 */
  }
`;

const StatsTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px; /* 调小标题下边距 */
  gap: 8px; /* 调小图标和文字间距 */
  font-size: 18px; /* 调小标题字体 */
  font-weight: 600;
  color: #555;

  @media (max-width: 1199px) and (min-width: 768px) {
    font-size: 16px; /* 相应调整 */
    margin-bottom: 14px; /* 相应调整 */
  }

  @media (max-width: 767px) {
    font-size: 14px; /* 相应调整 */
    margin-bottom: 12px; /* 相应调整 */
  }
`;

const CompactStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px; /* 调小网格间距 */

  @media (max-width: 1199px) and (min-width: 768px) {
    gap: 14px; /* 相应调整 */
  }

  @media (max-width: 767px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px; /* 相应调整 */
  }
`;

const CompactStatCard = styled.div`
  text-align: center;
  padding: 12px 8px; /* 调小统计卡片的内边距 */
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%);
  border-radius: 12px; /* 调小圆角 */
  border: 1px solid rgba(102, 126, 234, 0.08); /* 调小边框 */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 80px; /* 调小最小高度 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(102, 126, 234, 0.02) 0%,
      rgba(118, 75, 162, 0.02) 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.95) 100%);
    transform: translateY(-2px) scale(1.02); /* 调整hover效果 */
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15); /* 调整阴影 */
    border-color: rgba(102, 126, 234, 0.2);

    &::before {
      opacity: 1;
    }
  }

  @media (max-width: 1199px) and (min-width: 768px) {
    padding: 10px 6px; /* 相应调整 */
    min-height: 72px; /* 相应调整 */
    border-radius: 10px; /* 相应调整 */
  }

  @media (max-width: 767px) {
    padding: 8px 6px; /* 相应调整 */
    min-height: 64px; /* 相应调整 */
    border-radius: 8px; /* 相应调整 */
  }
`;

const StatNumber = styled.div`
  font-size: 22px; /* 调小数字字体 */
  font-weight: 700;
  margin-bottom: 2px; /* 调小数字和标签的间距 */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
  position: relative;
  z-index: 1;

  @media (max-width: 1199px) and (min-width: 768px) {
    font-size: 20px; /* 相应调整 */
  }

  @media (max-width: 767px) {
    font-size: 18px; /* 相应调整 */
  }
`;

const StatLabel = styled.div`
  font-size: 12px; /* 调小标签字体 */
  color: #777;
  line-height: 1;

  @media (max-width: 767px) {
    font-size: 11px; /* 相应调整 */
  }
`;

const ServiceSidebar = styled.div`
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(12px);
  border-radius: 0 12px 12px 0;
  padding: 24px 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.04);
  border-left: none;
  width: 280px; /* 增加侧边栏宽度 */
  flex-shrink: 0; /* 防止被压缩 */
  overflow-y: auto;

  @media (max-width: 1199px) and (min-width: 768px) {
    width: 220px; /* 增加平板端宽度 */
    padding: 20px 16px;
  }

  @media (max-width: 767px) {
    width: 100%;
    border-radius: 12px 12px 0 0;
    border: 1px solid rgba(0, 0, 0, 0.04);
    border-bottom: none;
    padding: 16px;
    background: rgba(255, 255, 255, 0.98);
  }
`;

const SidebarTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
  color: var(--text1);

  @media (max-width: 1199px) and (min-width: 768px) {
    font-size: 14px;
    margin-bottom: 16px;
  }

  @media (max-width: 767px) {
    font-size: 14px;
    margin-bottom: 12px;
  }
`;

const ServiceCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.04);

  &:hover {
    background: var(--secondary);
    transform: translateX(4px);
    box-shadow: 0 4px 16px rgba(255, 107, 0, 0.15);
  }

  &:active {
    transform: translateX(2px) scale(0.98);
  }

  @media (max-width: 1199px) and (min-width: 768px) {
    padding: 12px 14px;
    gap: 10px;
    margin-bottom: 6px;
  }

  @media (max-width: 767px) {
    padding: 12px 16px;
    margin-bottom: 8px;
    &:hover {
      transform: translateY(-2px);
    }
  }
`;

const ServiceIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  flex-shrink: 0;

  @media (max-width: 1199px) and (min-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }

  @media (max-width: 767px) {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }
`;

const ServiceInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ServiceName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: var(--text1);
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 1199px) and (min-width: 768px) {
    font-size: 13px;
  }
`;

const ServiceDesc = styled.div`
  font-size: 12px;
  color: var(--text2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 1199px) and (min-width: 768px) {
    font-size: 11px;
  }
`;

const MobileServiceGrid = styled.div`
  display: none;

  @media (max-width: 767px) {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding: 8px 0;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const MobileServiceCard = styled(ServiceCard)`
  flex-shrink: 0;
  min-width: 140px;
  margin-bottom: 0;
  margin-right: 8px;
`;

// 数据类型定义
interface HomeData {
  statistics: {
    totalTasks: number;
    totalUsers: number;
    totalBounty: number;
    completedTasks: number;
  };
  gridItems: Array<{
    id: number;
    title: string;
    icon: string;
    badge?: number;
  }>;
  tasks: Array<{
    id: number;
    title: string;
    description: string;
    budget: number;
    location: string;
    publisher: string;
    rating: number;
  }>;
}

// 基础首页组件 - 不使用React-Query
export const HomePageBasic: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<HomeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeFilter, setActiveFilter] = useState('综合');
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const [messageCount, setMessageCount] = useState(3);

  // 认证状态通过 usePopupAuth hook 管理
  const { isAuthenticated, user, login: popupLogin, register: popupRegister, logout: popupLogout, requireAuth } = usePopupAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 组件挂载时的初始化逻辑
    console.log('🏠 HomePageBasic 组件已挂载');
    console.log('📱 当前认证状态:', { isAuthenticated, user: user?.name });
  }, [isAuthenticated, user]);

  useEffect(() => {
    // 模拟数据加载
    const loadData = async () => {
      try {
        setLoading(true);
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockData = {
          statistics: {
            totalTasks: 15420,
            totalUsers: 8930,
            totalBounty: 2847650,
            completedTasks: 12680,
          },
          gridItems: [
            { id: 1, title: '家政保洁', icon: '🧹', badge: 23 },
            { id: 2, title: '维修安装', icon: '🔧', badge: 15 },
            { id: 3, title: '代办跑腿', icon: '🏃', badge: 8 },
            { id: 4, title: '技能服务', icon: '💼' },
          ],
          tasks: [
            {
              id: 1,
              title: '需要有人帮忙打扫客厅',
              description: '客厅面积约30平米，需要深度清洁',
              budget: 150,
              location: '朝阳区建国门外大街1号',
              publisher: '张女士',
              rating: 4.8,
            },
            {
              id: 2,
              title: '急！需要人帮忙取快递',
              description: '有两个大件快递需要帮忙取回家',
              budget: 50,
              location: '海淀区中关村大街27号',
              publisher: '李先生',
              rating: 4.5,
            },
            {
              id: 3,
              title: '空调维修上门服务',
              description: '空调不制冷，需要专业师傅上门检修',
              budget: 200,
              location: '西城区金融街33号',
              publisher: '王经理',
              rating: 4.9,
            },
            {
              id: 4,
              title: '代办营业执照年检',
              description: '需要帮忙代办公司营业执照年检业务',
              budget: 300,
              location: '东城区王府井大街88号',
              publisher: '赵总',
              rating: 4.7,
            },
            {
              id: 5,
              title: '家庭管道疏通服务',
              description: '厨房下水道堵塞严重，急需疏通',
              budget: 120,
              location: '丰台区南三环西路12号',
              publisher: '孙阿姨',
              rating: 4.6,
            },
          ],
        };

        setData(mockData);
        setError(null);
      } catch (err) {
        setError('数据加载失败');
        console.error('数据加载错误:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleTaskClick = (taskId: number) => {
    console.log('查看任务:', taskId);

    // 使用弹窗认证检查登录状态
    requireAuth(() => {
      // 需要登录时自动弹出登录窗口
      console.log('需要登录才能查看任务详情');
    });

    if (isAuthenticated) {
      // 已登录，跳转到任务详情页
      navigate(`/task/${taskId}`);
    }
  };

  const handleGrabTask = (taskId: number) => {
    console.log('接单:', taskId);

    // 使用弹窗认证检查登录状态
    requireAuth(() => {
      // 需要登录时自动弹出登录窗口
      console.log('需要登录才能接单');
    });

    if (isAuthenticated) {
      // 已登录，执行接单逻辑
      console.log('执行接单操作:', taskId);
      // 这里可以添加实际的接单API调用
    }
  };

  const handleSearch = (value: string) => {
    console.log('搜索:', value);
    setSearchKeyword(value);
    // 这里可以添加实际的搜索逻辑
  };

  const handleSearchSubmit = () => {
    if (searchKeyword.trim()) {
      console.log('执行搜索:', searchKeyword);
      // 这里可以添加实际的搜索提交逻辑
    }
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    console.log('切换筛选:', filter);
    // 这里可以添加实际的筛选逻辑
  };

  const hotTags = [
    { id: 1, text: '家政保洁', icon: '🧹', desc: '专业保洁让家焕然一新' },
    { id: 2, text: '维修安装', icon: '🔧', desc: '快速上门维修各类问题' },
    { id: 3, text: '代办跑腿', icon: '🏃', desc: '1小时内响应需求' },
    { id: 4, text: '空调清洗', icon: '❄️', desc: '深度清洗呵护健康' },
    { id: 5, text: '管道疏通', icon: '🔧', desc: '专业工具快速解决' },
    { id: 6, text: '搬家服务', icon: '📦', desc: '安全省心一站搞定' },
  ];

  const handleTagClick = (tag: { text: string }) => {
    console.log('点击热门标签:', tag.text);
    setSearchKeyword(tag.text);
  };

  const handleMobileMenu = () => {
    setMobileDrawerVisible(true);
  };

  const handleLogin = () => {
    console.log('点击登录');
    // 使用弹窗登录
    popupLogin(() => {
      console.log('登录成功后的回调');
    });
  };

  const handleRegister = () => {
    console.log('点击注册');
    // 使用OAuth2注册流程
    popupRegister(() => {
      console.log('注册成功');
    });
  };

  const handleNotification = () => {
    console.log('点击通知');
    setMessageCount(0);
  };

  const handleLogout = () => {
    popupLogout();
  };

  if (loading) {
    console.log('页面正在加载中...');
    return (
      <HomeContainer>
        <ContentContainer>
          <Card style={{ textAlign: 'center', padding: 'clamp(40px, 8vw, 60px)' }}>
            <div style={{ marginBottom: 20 }}>
              <Spin size='large' />
            </div>
            <Title level={4} style={{ color: '#666', margin: 0 }}>
              正在加载首页数据...
            </Title>
            <Paragraph style={{ color: '#999', marginTop: 8 }}>为您推荐最优质的生活服务</Paragraph>
          </Card>
        </ContentContainer>
      </HomeContainer>
    );
  }

  if (error) {
    return (
      <HomeContainer>
        <ContentContainer>
          <Card style={{ textAlign: 'center', padding: 'clamp(30px, 6vw, 40px)' }}>
            <div style={{ fontSize: 'clamp(40px, 8vw, 60px)', marginBottom: 16 }}>😵</div>
            <Title level={3} style={{ color: '#ff4d4f', marginBottom: 8 }}>
              ❌ {error}
            </Title>
            <Paragraph style={{ color: '#666', marginBottom: 20 }}>
              服务暂时不可用，请稍后重试
            </Paragraph>
            <Button
              type='primary'
              size={window.innerWidth <= 768 ? 'middle' : 'large'}
              onClick={handleRefresh}
            >
              重新加载
            </Button>
          </Card>
        </ContentContainer>
      </HomeContainer>
    );
  }

  console.log('渲染首页，loading:', loading, 'error:', error, 'data:', !!data);
  return (
    <>
      <HomeContainer>
        {/* 新的现代化导航栏 */}
        <NavigationContainer>
          <NavContent>
            {/* Logo区域 */}
            <LogoContainer>
              <LogoIcon>🏠</LogoIcon>
              <LogoText>
                <h1>万象生活</h1>
                <span>您身边的生活服务专家</span>
              </LogoText>
            </LogoContainer>

            {/* 搜索区域 */}
            <SearchContainer>
              <StyledInput
                placeholder='搜索家政服务、维修安装、代办跑腿...'
                value={searchKeyword}
                onChange={e => handleSearch(e.target.value)}
                onSearch={handleSearchSubmit}
                enterButton={<SearchOutlined />}
              />
            </SearchContainer>

            {/* 桌面端用户操作区 */}
            <UserActions>
              <UserInfoDisplay />
            </UserActions>

            {/* 移动端菜单按钮 */}
            <MobileMenuButton icon={<MenuOutlined />} onClick={handleMobileMenu} />
          </NavContent>
        </NavigationContainer>

        {/* 移动端抽屉 */}
        <Drawer
          title='更多操作'
          placement='right'
          onClose={() => setMobileDrawerVisible(false)}
          open={mobileDrawerVisible}
          width={280}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 移动端用户信息 */}
            <UserInfoDisplay compact={true} />

            {/* 快捷菜单 */}
            {isAuthenticated ? (
              <>
                <Button block icon={<UserOutlined />} onClick={() => navigate('/user/profile')}>
                  个人中心
                </Button>
                <Button block icon={<OrderedListOutlined />} onClick={() => navigate('/user/orders')}>
                  我的项目
                </Button>
                <Button block icon={<HeartOutlined />} onClick={() => navigate('/user/favorites')}>
                  我的收藏
                </Button>
                <Button block icon={<MessageOutlined />} onClick={() => navigate('/messages')}>
                  消息中心 {messageCount > 0 && `(${messageCount})`}
                </Button>
                <Button block icon={<SettingOutlined />} onClick={() => navigate('/user/settings')}>
                  设置
                </Button>
                <Button block icon={<LogoutOutlined />} onClick={handleLogout}>
                  退出登录
                </Button>
              </>
            ) : (
              <>
                <Button
                  block
                  type='primary'
                  onClick={handleLogin}
                  style={{
                    background: 'var(--primary)',
                    borderColor: 'var(--primary)',
                  }}
                >
                  登录
                </Button>
                <Button
                  block
                  onClick={handleRegister}
                >
                  注册
                </Button>
              </>
            )}
          </div>
        </Drawer>

        {/* 主要内容 */}
        <ContentContainer style={{ paddingTop: '20px' }}>
          {/* 服务快速入口区域 */}
          <ServiceQuickEntry>
            {/* 桌面端左侧服务边栏 */}
            <ServiceSidebar>
              <SidebarTitle>
                <FireOutlined style={{ color: 'var(--primary)' }} />
                快速服务
              </SidebarTitle>
              {hotTags.map(tag => (
                <ServiceCard key={tag.id} onClick={() => handleTagClick(tag)}>
                  <ServiceIcon>{tag.icon}</ServiceIcon>
                  <ServiceInfo>
                    <ServiceName>{tag.text}</ServiceName>
                    <ServiceDesc>{tag.desc}</ServiceDesc>
                  </ServiceInfo>
                </ServiceCard>
              ))}
            </ServiceSidebar>

            {/* 轮播图容器 */}
            <CarouselStatsContainer>
              <BannerCarouselSimple
                banners={convertToBannerItems(simpleCarouselData)}
                loading={loading}
                onBannerClick={banner => {
                  console.log('轮播图点击:', banner.title);
                  if (banner.ctaLink) {
                    if (banner.type === 'external') {
                      window.open(banner.ctaLink, '_blank', 'noopener,noreferrer');
                    } else {
                      navigate(banner.ctaLink);
                    }
                  }
                }}
              />
              <StatsContent>
                <StatsTitle>📊 平台数据概览</StatsTitle>
                <CompactStatsGrid>
                  <CompactStatCard>
                    <StatNumber>{data?.statistics.totalTasks.toLocaleString()}</StatNumber>
                    <StatLabel>累计任务</StatLabel>
                  </CompactStatCard>
                  <CompactStatCard>
                    <StatNumber>{data?.statistics.totalUsers.toLocaleString()}</StatNumber>
                    <StatLabel>注册用户</StatLabel>
                  </CompactStatCard>
                  <CompactStatCard>
                    <StatNumber>¥{(data?.statistics.totalBounty / 10000).toFixed(1)}万</StatNumber>
                    <StatLabel>累计赏金</StatLabel>
                  </CompactStatCard>
                  <CompactStatCard>
                    <StatNumber>
                      {Math.round(
                        (data?.statistics.completedTasks / data?.statistics.totalTasks) * 100
                      )}
                      %
                    </StatNumber>
                    <StatLabel>完成率</StatLabel>
                  </CompactStatCard>
                </CompactStatsGrid>
              </StatsContent>
            </CarouselStatsContainer>
          </ServiceQuickEntry>

          {/* 移动端水平滚动服务 */}
          <MobileServiceGrid>
            {hotTags.map(tag => (
              <MobileServiceCard key={tag.id} onClick={() => handleTagClick(tag)}>
                <ServiceIcon>{tag.icon}</ServiceIcon>
                <ServiceInfo>
                  <ServiceName>{tag.text}</ServiceName>
                  <ServiceDesc>{tag.desc}</ServiceDesc>
                </ServiceInfo>
              </MobileServiceCard>
            ))}
          </MobileServiceGrid>

          {/* 快速宫格 */}
          <Card title='⚡ 快速服务' style={{ marginBottom: 24 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: 12,
              }}
            >
              {data?.gridItems.map(item => (
                <div
                  key={item.id}
                  style={{
                    textAlign: 'center',
                    padding: 'clamp(16px, 4vw, 20px)',
                    background: '#fff',
                    border: '1px solid #f0f0f0',
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: 'clamp(24px, 6vw, 32px)', marginBottom: 8 }}>
                    {item.icon}
                  </div>
                  <div style={{ fontSize: 'clamp(12px, 3vw, 14px)' }}>{item.title}</div>
                  {item.badge && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        background: '#ff4d4f',
                        color: '#fff',
                        borderRadius: 4,
                        padding: '2px 6px',
                        fontSize: 'clamp(10px, 2.5vw, 12px)',
                      }}
                    >
                      {item.badge}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* 任务标签 */}
          <Card style={{ marginBottom: 24 }}>
            <Space wrap size='small'>
              {['综合', '最新', '高价', '距离'].map(filter => (
                <Button
                  key={filter}
                  type={activeFilter === filter ? 'primary' : 'default'}
                  onClick={() => handleFilterChange(filter)}
                  size={window.innerWidth <= 768 ? 'small' : 'middle'}
                >
                  {filter}
                </Button>
              ))}
            </Space>
          </Card>

          {/* 任务列表 */}
          <Card title='📋 任务列表' style={{ marginBottom: 24 }}>
            {data?.tasks.map(task => (
              <div
                key={task.id}
                style={{
                  padding: 'clamp(12px, 3vw, 16px)',
                  background: '#fff',
                  border: '1px solid #f0f0f0',
                  borderRadius: 8,
                  marginBottom: 16,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => handleTaskClick(task.id)}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 8,
                    flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
                    gap: window.innerWidth <= 768 ? '8px' : '0',
                  }}
                >
                  <Title
                    level={4}
                    style={{
                      margin: 0,
                      flex: 1,
                      fontSize: 'clamp(16px, 4vw, 20px)',
                    }}
                  >
                    {task.title}
                  </Title>
                  <div
                    style={{
                      fontSize: 'clamp(16px, 4vw, 18px)',
                      fontWeight: 'bold',
                      color: '#ff4d4f',
                    }}
                  >
                    ¥{task.budget}
                  </div>
                </div>
                <Paragraph
                  style={{
                    margin: '0 0 8px 0',
                    color: '#666',
                    fontSize: 'clamp(13px, 3vw, 14px)',
                  }}
                >
                  {task.description}
                </Paragraph>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <Space wrap size='small'>
                    <span style={{ fontSize: 'clamp(11px, 2.5vw, 13px)' }}>📍 {task.location}</span>
                    <span style={{ fontSize: 'clamp(11px, 2.5vw, 13px)' }}>👤 {task.publisher}</span>
                    <span style={{ fontSize: 'clamp(11px, 2.5vw, 13px)' }}>⭐ {task.rating}</span>
                  </Space>
                  <Button
                    type='primary'
                    size={window.innerWidth <= 768 ? 'small' : 'middle'}
                    onClick={e => {
                      e.stopPropagation();
                      handleGrabTask(task.id);
                    }}
                  >
                    立即接单
                  </Button>
                </div>
              </div>
            ))}
          </Card>

          {/* 万象生活企业级底栏 */}
          <SimpleFooter />
        </ContentContainer>
      </HomeContainer>

          </>
  );
};

export default HomePageBasic; // 强制刷新文件
// 强制刷新文件
