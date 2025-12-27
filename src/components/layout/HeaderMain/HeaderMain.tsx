/**
 * HeaderMain - Brand & Search Header模块
 * 位于TopNavBar下方，是应用的"门面"组件
 */

import React, { useState, useEffect, useRef } from 'react';
import { Input, Select, Button } from 'antd';
import {
  SearchOutlined,
  UnorderedListOutlined,
  FormOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import type { HeaderMainProps, SearchCategory, HotSearchTag } from './types';

// 主容器 - 纯白背景，高度80-100px
const HeaderMainContainer = styled.div`
  background: #ffffff;
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

// 内容容器
const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 84px;
  gap: 24px;
`;

// 左侧Logo区域
const LogoSection = styled.div`
  display: flex;
  align-items: center;
  min-width: 280px;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const LogoImage = styled.img`
  height: ${props => props.height || '40px'};
  width: ${props => props.width || 'auto'};
  object-fit: contain;
`;

// 中心搜索区域
const SearchSection = styled.div`
  flex: 1;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// 搜索栏容器 - 实现pill shape
const SearchBarContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 2px solid #ff5000;
  border-radius: 999px;
  box-shadow: 0 4px 12px rgba(255, 80, 0, 0.15);
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #ff6000;
    box-shadow: 0 6px 20px rgba(255, 96, 0, 0.25);
  }
`;

// 分类下拉菜单
const CategoryDropdown = styled(Select)`
  &.ant-select {
    .ant-select-selector {
      border: none !important;
      box-shadow: none !important;
      background: transparent !important;
      color: #666;
      font-size: 14px;
      font-weight: 500;
    }

    .ant-select-arrow {
      color: #999;
    }
  }
`;

// 搜索输入框
const SearchInput = styled(Input)`
  flex: 1;
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  font-size: 14px;

  &.ant-input {
    padding: 8px 12px;

    &::placeholder {
      color: #999;
      font-style: italic;
    }

    &:focus {
      border: none !important;
      box-shadow: none !important;
    }
  }
`;

// 搜索按钮
const SearchButton = styled(Button)`
  background: linear-gradient(135deg, #ff6000 0%, #ff8c00 100%);
  border: none;
  border-radius: 999px;
  color: white;
  font-weight: 600;
  font-size: 14px;
  height: 36px;
  padding: 0 20px;
  margin-right: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #ff8c00 0%, #ff6000 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 96, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

// 热门搜索标签区域
const HotSearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 4px;
`;

const HotSearchLabel = styled.span`
  color: #999;
  font-size: 12px;
  white-space: nowrap;
`;

const HotSearchTag = styled.a`
  color: #999;
  font-size: 12px;
  text-decoration: none;
  transition: color 0.2s ease;
  cursor: pointer;

  &:hover {
    color: #ff6000;
    text-decoration: underline;
  }
`;

// 右侧操作区域
const ActionsSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 180px;
  justify-content: flex-end;
`;

const PostRequestButton = styled(Button)`
  border: 1px solid #ff6000;
  color: #ff6000;
  background: transparent;
  border-radius: 6px;
  font-weight: 500;
  height: 36px;
  transition: all 0.2s ease;

  &:hover {
    background: #fff5f0;
    border-color: #ff6000;
    color: #ff6000;
  }
`;

const MyOrdersButton = styled(Button)`
  border: 1px solid #d9d9d9;
  background: #ffffff;
  border-radius: 6px;
  color: #666;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #ff6000;
    color: #ff6000;
  }
`;


// 默认数据
const defaultCategories: SearchCategory[] = [
  { key: 'all', label: '全部', value: 'all' },
  { key: 'gaming', label: '游戏', value: 'gaming' },
  { key: 'enterprise', label: '企业服务', value: 'enterprise' },
  { key: 'campus', label: '校园', value: 'campus' },
  { key: 'design', label: '设计', value: 'design' },
];

const defaultHotSearchTags: HotSearchTag[] = [
  { key: 'lol-boost', label: 'LOL代练' },
  { key: 'game-guide', label: '游戏攻略' },
  { key: 'code-review', label: '代码审查' },
  { key: 'ui-design', label: 'UI设计' },
  { key: 'campus-job', label: '校园兼职' },
];

const defaultPlaceholderTexts = [
  "Search for: LoL Boosting...",
  "Search for: Game Guide...",
  "Search for: Code Review...",
  "Search for: UI Design...",
  "Search for: Campus Jobs...",
];

const HeaderMain: React.FC<HeaderMainProps> = ({
  logoSrc,
  logoAlt = "Universe Life",
  logoWidth,
  logoHeight = 40,
  onBrandClick,
  searchCategories = defaultCategories,
  defaultCategory = "all",
  hotSearchTags = defaultHotSearchTags,
  onSearch,
  onPostRequest,
  onCartClick,
  placeholderTexts = defaultPlaceholderTexts,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // 循环切换placeholder文本
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) =>
        prevIndex === placeholderTexts.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // 每3秒切换一次

    return () => clearInterval(interval);
  }, [placeholderTexts.length]);

  // 处理搜索
  const handleSearch = () => {
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim(), selectedCategory);
    }
  };

  // 处理回车键搜索
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <HeaderMainContainer className={className}>
      <HeaderContent>
        {/* 左侧Logo区域 */}
        <LogoSection onClick={onBrandClick}>
          <LogoImage
            src={logoSrc}
            alt={logoAlt}
            width={logoWidth}
            height={`${logoHeight}px`}
          />
        </LogoSection>

        {/* 中心搜索区域 */}
        <SearchSection>
          <SearchBarContainer>
            {/* 分类下拉菜单 */}
            <CategoryDropdown
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={searchCategories.map(cat => ({
                label: cat.label,
                value: cat.value,
              }))}
              style={{ width: 120 }}
              size="middle"
            />

            {/* 搜索输入框 */}
            <SearchInput
              ref={inputRef}
              placeholder={placeholderTexts[placeholderIndex]}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              allowClear
            />

            {/* 搜索按钮 */}
            <SearchButton
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
            >
              搜索
            </SearchButton>
          </SearchBarContainer>

          {/* 热门搜索标签 */}
          <HotSearchContainer>
            <HotSearchLabel>热门搜索：</HotSearchLabel>
            {hotSearchTags.map((tag) => (
              <HotSearchTag
                key={tag.key}
                onClick={tag.onClick}
                href={tag.url || '#'}
              >
                {tag.label}
              </HotSearchTag>
            ))}
          </HotSearchContainer>
        </SearchSection>

        {/* 右侧操作区域 */}
        <ActionsSection>
          <PostRequestButton
            icon={<FormOutlined />}
            onClick={onPostRequest}
          >
            发布需求
          </PostRequestButton>

          <MyOrdersButton
            icon={<UnorderedListOutlined />}
            onClick={onCartClick}
          >
            我的需求
          </MyOrdersButton>
        </ActionsSection>
      </HeaderContent>
    </HeaderMainContainer>
  );
};

export default HeaderMain;