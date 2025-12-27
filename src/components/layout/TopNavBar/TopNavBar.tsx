/**
 * TopNavBar - 淘宝/天猫风格顶部导航栏
 * Modern Bright主题，简洁明亮的电商设计
 */

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Dropdown } from 'antd';
import {
  EnvironmentOutlined,
  AppstoreOutlined,
  CaretDownOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import type { MenuProps } from 'antd';
import type { TopNavBarProps } from './types';
import AuthButtonGroup from '@/components/Auth/AuthButtonGroup';

// 淘宝风格主容器
const TaobaoNavbar = styled.div`
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  height: 36px;
  line-height: 36px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 12px;
  color: #666;
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
`;

// 导航容器
const NavbarContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
`;

// 左侧区域
const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

// 右侧区域
const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

// 分隔符
const Separator = styled.span`
  color: #e8e8e8;
  margin: 0 8px;
`;

// 导航项基础样式
const NavItemBase = styled.span<{ active?: boolean }>`
  color: ${p => (p.active ? '#ff6000' : '#666')};
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  line-height: 1;
  font-weight: ${p => (p.active ? 500 : 400)};
  background-color: ${p => (p.active ? '#fff5f0' : 'transparent')};

  &:hover {
    color: #ff6000;
    background-color: #fff5f0;
  }
`;



// 下拉菜单样式
const StyledDropdown = styled(Dropdown)`
  .ant-dropdown {
    .ant-dropdown-menu {
      box-shadow: 0 6px 16px -8px rgba(0,0,0,0.08);
      border: 1px solid #f0f0f0;
      border-radius: 8px;
      padding: 8px 0;

      .ant-dropdown-menu-item {
        font-size: 12px;
        padding: 8px 16px;
        color: #666;

        &:hover {
          background-color: #fff5f0;
          color: #ff6000;
        }

        &:active {
          background-color: #ffe7d6;
        }
      }
    }
  }
`;

// 模拟数据
const mockRegions = [
  { key: 'beijing', label: '北京', value: 'beijing' },
  { key: 'shanghai', label: '上海', value: 'shanghai' },
  { key: 'guangzhou', label: '广州', value: 'guangzhou' },
  { key: 'shenzhen', label: '深圳', value: 'shenzhen' },
  { key: 'hangzhou', label: '杭州', value: 'hangzhou' },
];

const TopNavBar: React.FC<TopNavBarProps> = ({
  notifications = [],
  onNavigate,
  showHomeLink = false,
}) => {
  const location = useLocation();
  const [selectedRegion, setSelectedRegion] = useState('北京');
  const isServicesPage = location.pathname === '/services' || location.pathname.startsWith('/services/');

  // 地区选择菜单
  const regionMenuItems: MenuProps['items'] = mockRegions.map(region => ({
    key: region.key,
    label: region.label,
    onClick: () => setSelectedRegion(region.label),
  }));

  return (
    <TaobaoNavbar>
      <NavbarContainer>
        {/* 左侧区域 */}
        <LeftSection>
          {/* 首页链接 - 仅在非首页显示 */}
          {showHomeLink && (
            <>
              <NavItemBase onClick={() => onNavigate?.('/')}>
                <HomeOutlined />
                <span>首页</span>
              </NavItemBase>
              <Separator>|</Separator>
            </>
          )}

          {/* 地区选择器 */}
          <StyledDropdown menu={{ items: regionMenuItems }} trigger={['click']}>
            <NavItemBase>
              <EnvironmentOutlined />
              <span>{selectedRegion}</span>
              <CaretDownOutlined style={{ fontSize: '10px' }} />
            </NavItemBase>
          </StyledDropdown>

          <Separator>|</Separator>

          {/* 服务大厅 */}
          <NavItemBase active={isServicesPage} onClick={() => onNavigate?.('/services')}>
            <AppstoreOutlined />
            <span>服务大厅</span>
          </NavItemBase>
        </LeftSection>

        {/* 右侧区域 - 使用AuthButtonGroup组件 */}
        <RightSection>
          <AuthButtonGroup
            notifications={notifications}
            onNavigate={onNavigate}
          />
        </RightSection>
      </NavbarContainer>
    </TaobaoNavbar>
  );
};

export default TopNavBar;