/**
 * 登出测试组件
 * 用于测试完整的登出流程
 */

import React from 'react';
import { Button, Card, Space, message, Divider, Typography, Tag } from 'antd';
import { LogoutOutlined, ClearOutlined, ReloadOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useAuth } from '@/hooks/useAuth';
import { TokenManager } from '@/services/http/client';
import { OAuth2Service } from '@/services/oauth2/authService';
import { authLogger } from '@/utils/logger';

const { Title, Text, Paragraph } = Typography;

const TestContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const StyledCard = styled(Card)`
  margin-bottom: 20px;

  .ant-card-head {
    background: #fafafa;
  }
`;

const StatusTag = styled(Tag)`
  margin: 4px;
`;

const CodeBlock = styled.pre`
  background: #f5f5f5;
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 12px;
  margin: 8px 0;
`;

const LogoutTest: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // 获取当前Token信息
  const getTokenInfo = () => {
    const accessToken = TokenManager.getAccessToken();
    const refreshToken = TokenManager.getRefreshToken();
    const userInfo = TokenManager.getUserInfo();
    const expiresAt = localStorage.getItem('universe_token_expires_at');

    return {
      accessToken: accessToken ? `${accessToken.substring(0, 20)}...` : '无',
      refreshToken: refreshToken ? `${refreshToken.substring(0, 20)}...` : '无',
      userInfo: userInfo ? JSON.stringify(userInfo, null, 2) : '无',
      expiresAt: expiresAt ? new Date(parseInt(expiresAt)).toLocaleString() : '无',
    };
  };

  // 获取所有认证相关的存储数据
  const getAllAuthStorage = () => {
    const storageData: { [key: string]: string | null } = {};

    // Token相关
    storageData['universe_access_token'] = localStorage.getItem('universe_access_token');
    storageData['universe_refresh_token'] = localStorage.getItem('universe_refresh_token');
    storageData['universe_user_info'] = localStorage.getItem('universe_user_info');
    storageData['universe_token_expires_at'] = localStorage.getItem('universe_token_expires_at');

    // OAuth2相关
    storageData['oauth2_pkce_challenge'] = localStorage.getItem('oauth2_pkce_challenge');
    storageData['oauth2_pkce_verifier'] = localStorage.getItem('oauth2_pkce_verifier');
    storageData['oauth2_state'] = localStorage.getItem('oauth2_state');
    storageData['oauth2_redirect_url'] = localStorage.getItem('oauth2_redirect_url');
    storageData['oauth_callback_processing'] = sessionStorage.getItem('oauth_callback_processing');

    return storageData;
  };

  // 清理所有认证数据（用于测试）
  const clearAllAuthData = () => {
    TokenManager.clearTokens();
    OAuth2Service.clearPKCEData();
    OAuth2Service.clearAllAuthData();
    message.success('所有认证数据已清理');
  };

  // 处理登出
  const handleLogout = async () => {
    try {
      message.loading('正在执行登出...', 0);
      await logout();
    } catch (error) {
      message.error('登出失败');
      authLogger.error('登出错误', error);
    }
  };

  const tokenInfo = getTokenInfo();
  const allStorage = getAllAuthStorage();

  return (
    <TestContainer>
      <Title level={2}>OAuth2 登出测试</Title>

      {/* 认证状态 */}
      <StyledCard title="认证状态">
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>登录状态: </Text>
            <StatusTag color={isAuthenticated ? 'green' : 'red'}>
              {isAuthenticated ? '已登录' : '未登录'}
            </StatusTag>
          </div>

          <div>
            <Text strong>加载状态: </Text>
            <StatusTag color={isLoading ? 'orange' : 'blue'}>
              {isLoading ? '加载中' : '已就绪'}
            </StatusTag>
          </div>

          {user && (
            <div>
              <Text strong>用户信息: </Text>
              <CodeBlock>
                {JSON.stringify(user, null, 2)}
              </CodeBlock>
            </div>
          )}
        </Space>
      </StyledCard>

      {/* Token信息 */}
      <StyledCard title="Token 信息">
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>Access Token: </Text>
            <CodeBlock>
              {tokenInfo.accessToken}
            </CodeBlock>
          </div>

          <div>
            <Text strong>Refresh Token: </Text>
            <CodeBlock>
              {tokenInfo.refreshToken}
            </CodeBlock>
          </div>

          <div>
            <Text strong>过期时间: </Text>
            <Text code>{tokenInfo.expiresAt}</Text>
          </div>
        </Space>
      </StyledCard>

      {/* 存储数据 */}
      <StyledCard title="本地存储数据">
        <Paragraph>
          以下是所有认证相关的本地存储数据，登出后这些数据应该被清理：
        </Paragraph>

        <CodeBlock>
          {JSON.stringify(allStorage, null, 2)}
        </CodeBlock>
      </StyledCard>

      {/* 操作按钮 */}
      <StyledCard title="操作">
        <Space wrap>
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            disabled={!isAuthenticated || isLoading}
          >
            执行登出流程
          </Button>

          <Button
            icon={<ClearOutlined />}
            onClick={clearAllAuthData}
          >
            清理所有认证数据
          </Button>

          <Button
            icon={<ReloadOutlined />}
            onClick={() => window.location.reload()}
          >
            刷新页面
          </Button>
        </Space>
      </StyledCard>

      {/* 登出流程说明 */}
      <StyledCard title="登出流程说明">
        <Paragraph>
          完整的登出流程包含以下步骤：
        </Paragraph>

        <ol>
          <li><Text strong>撤销 Access Token</Text> - 调用 OAuth2 revoke 端点撤销访问令牌</li>
          <li><Text strong>撤销 Refresh Token</Text> - 调用 OAuth2 revoke 端点撤销刷新令牌</li>
          <li><Text strong>通知服务器登出</Text> - 可选步骤，用于清理服务器端会话</li>
          <li><Text strong>清理本地数据</Text> - 清除所有存储的认证信息</li>
          <li><Text strong>跳转到首页</Text> - 使用完全刷新确保所有状态都被清理</li>
        </ol>

        <Divider />

        <Paragraph>
          <Text type="secondary">
            注意：即使服务器通信失败，本地数据也会被清理，确保用户能够登出。
          </Text>
        </Paragraph>
      </StyledCard>
    </TestContainer>
  );
};

export default LogoutTest;