import React, { useState } from 'react';
import {
  Space,
  Input,
  Avatar,
  Badge,
  Dropdown,
  Button,
  Typography,
  AutoComplete,
  message,
} from 'antd';
import {
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { selectAuthUser, selectIsAuthenticated, logoutAsync } from '@/store/slices/authSlice';
import { useDebounce } from '../../hooks/useDebounce';
import { useSearchSuggestions } from '../../hooks/useHomeData';

const { Text } = Typography;

// 样式化头部容器
const HeaderContainer = styled.div`
  background: #fff;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #1890ff;
  margin-right: 24px;
`;

const SearchContainer = styled.div`
  flex: 1;
  max-width: 400px;
  margin: 0 24px;
`;

const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

// 头部组件属性
interface HeaderProps {
  onSearch?: (value: string) => void;
  onLogoClick?: () => void;
}

// 头部组件
export const Header: React.FC<HeaderProps> = ({ onSearch, onLogoClick }) => {
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearchValue = useDebounce(searchValue, 300);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // 搜索建议
  const { data: suggestions = [] } = useSearchSuggestions(
    debouncedSearchValue,
    searchValue.trim().length > 0
  );

  const handleSearch = (value: string) => {
    onSearch?.(value);
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'profile':
        // 跳转到个人资料页
        navigate('/profile');
        break;
      case 'settings':
        // 跳转到设置页
        navigate('/settings');
        break;
      case 'orders':
        // 跳转到我的订单页
        navigate('/orders');
        break;
      case 'published':
        // 跳转到已发布任务页
        navigate('/published');
        break;
      case 'logout':
        // 使用Redux异步登出
        handleLogout();
        break;
    }
  };

  // 处理登出
  const handleLogout = async () => {
    try {
      await dispatch(logoutAsync()).unwrap();
      message.success('退出登录成功');
      navigate('/');
    } catch (error: unknown) {
      message.error(typeof error === 'string' ? error : '退出登录失败');
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'orders',
      icon: <MessageOutlined />,
      label: '我的订单',
    },
    {
      key: 'published',
      icon: <SettingOutlined />,
      label: '已发布任务',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  return (
    <HeaderContainer>
      <HeaderContent>
        {/* Logo */}
        <Logo onClick={onLogoClick} style={{ cursor: 'pointer' }}>
          万象生活
        </Logo>

        {/* 搜索框 */}
        <SearchContainer>
          <AutoComplete
            style={{ width: '100%' }}
            options={suggestions.map(suggestion => ({
              value: suggestion.text,
              label: (
                <Space>
                  <Text type={suggestion.type === 'keyword' ? 'primary' : 'secondary'}>
                    {suggestion.text}
                  </Text>
                  {suggestion.count && (
                    <Text type='secondary' style={{ fontSize: 12 }}>
                      {suggestion.count}个结果
                    </Text>
                  )}
                </Space>
              ),
            }))}
            onSelect={handleSearch}
            filterOption={false}
          >
            <Input.Search
              placeholder='搜索任务、服务或地点'
              allowClear
              enterButton={<SearchOutlined />}
              size='large'
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              onSearch={handleSearch}
            />
          </AutoComplete>
        </SearchContainer>

        {/* 用户操作区 */}
        <UserActions>
          {isAuthenticated ? (
            <>
              {/* 消息通知 */}
              <Badge count={0} size='small'>
                <Button
                  type='text'
                  icon={<BellOutlined />}
                  size='large'
                  onClick={() => {
                    navigate('/messages');
                  }}
                />
              </Badge>

              {/* 用户头像下拉菜单 */}
              <Dropdown
                menu={{
                  items: userMenuItems,
                  onClick: handleUserMenuClick,
                }}
                placement='bottomRight'
                trigger={['click']}
              >
                <Space style={{ cursor: 'pointer' }}>
                  <Avatar size='large' src={user?.avatar} icon={<UserOutlined />} />
                  <Text>{user?.nickname || user?.username || '用户'}</Text>
                </Space>
              </Dropdown>
            </>
          ) : (
            /* 未登录状态 */
            <Space>
              <Button
                onClick={() => {
                  navigate('/login');
                }}
              >
                登录
              </Button>
              <Button
                type='primary'
                onClick={() => {
                  navigate('/register');
                }}
              >
                注册
              </Button>
            </Space>
          )}
        </UserActions>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
