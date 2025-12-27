/**
 * OAuth2 认证回调页面
 * 处理授权码交换、Token获取和用户信息加载
 * 淘宝风格设计 - 简洁明亮的电商体验
 */

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Alert, Progress } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { OAuth2Service } from '@/services/oauth2/authService';
import { authLogger } from '@/utils/logger';

// 淘宝风格容器 - 纯净白色背景
const CallbackContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  padding: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

// 淘宝风格卡片 - 简洁设计
const CallbackCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-width: 480px;
  width: 100%;
  text-align: center;
  border: 1px solid #f0f0f0;
  position: relative;
  overflow: hidden;
`;

// 淘宝风格顶部装饰条
const TopDecoration = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ff6000 0%, #ff7a1f 50%, #ff6000 100%);
  background-size: 200% 100%;
  animation: loading-progress 2s ease-in-out infinite;

  @keyframes loading-progress {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

// 淘宝风格加载图标容器
const LoadingIconContainer = styled.div`
  margin-bottom: 24px;
  position: relative;
  display: inline-block;

  /* 淘宝橙色旋转圆环 */
  .taobao-loading-ring {
    width: 64px;
    height: 64px;
    border: 4px solid #f5f5f5;
    border-top: 4px solid #ff6000;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  /* 内部小圆点 */
  .taobao-loading-dot {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    background: #ff6000;
    border-radius: 50%;
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.2);
      opacity: 0.7;
    }
  }
`;

// 淘宝风格标题
const TaobaoTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 12px;
  line-height: 1.4;
`;

// 淘宝风格副标题
const TaobaoSubtitle = styled.div`
  font-size: 14px;
  color: #666666;
  margin-bottom: 32px;
  line-height: 1.5;
`;

// 淘宝风格进度条
const TaobaoProgress = styled(Progress)`
  margin-bottom: 24px;

  .ant-progress-bg {
    background: linear-gradient(90deg, #ff6000 0%, #ff7a1f 100%);
  }

  .ant-progress-inner {
    background: #f5f5f5;
  }
`;

// 淘宝风格步骤指示器
const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 32px;

  .step-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #f0f0f0;
    transition: all 0.3s ease;

    &.active {
      background: #ff6000;
      transform: scale(1.2);
    }

    &.completed {
      background: #52c41a;
    }
  }
`;

// 淘宝风格按钮组
const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;

  .ant-btn {
    border-radius: 6px;
    height: 40px;
    padding: 0 24px;
    font-weight: 500;

    &.ant-btn-primary {
      background: #ff6000;
      border-color: #ff6000;

      &:hover {
        background: #ff7a1f;
        border-color: #ff7a1f;
      }
    }
  }
`;

const AuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showDetails, setShowDetails] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  // 步骤定义
  const steps = ['验证参数', '交换授权码', '获取用户信息', '完成认证'];

  useEffect(() => {
    // 添加防重复处理标志
    const isProcessing = sessionStorage.getItem('oauth_callback_processing');
    if (isProcessing === 'true') {
      authLogger.warn('⚠️ OAuth回调正在处理中，跳过重复执行');
      return;
    }

    const handleCallback = async () => {
      try {
        // 标记开始处理
        sessionStorage.setItem('oauth_callback_processing', 'true');
        authLogger.info('🚀 开始处理OAuth回调...');

        // 步骤1: 验证参数
        setCurrentStep(0);
        setProgress(25);
        await new Promise(resolve => setTimeout(resolve, 500)); // 模拟处理时间

        // 获取授权参数
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        authLogger.info('📋 回调参数:', {
          code: code ? '***已获取***' : '未获取',
          state: state ? '***已获取***' : '未获取',
          error,
          errorDescription
        });

        // 检查是否有错误
        if (error) {
          authLogger.error('❌ 授权服务器返回错误:', error);
          setErrorMessage(errorDescription || error);
          setStatus('error');
          return;
        }

        // 检查必要参数
        if (!code || !state) {
          authLogger.error('❌ 缺少必要的授权参数');
          setErrorMessage('缺少必要的授权参数');
          setStatus('error');
          return;
        }

        // 步骤2: 交换授权码
        setCurrentStep(1);
        setProgress(50);

        // 处理授权回调
        const result = await OAuth2Service.handleAuthorizationCallback(code, state);

        if (result.success) {
          // 步骤3: 获取用户信息
          setCurrentStep(2);
          setProgress(75);
          await new Promise(resolve => setTimeout(resolve, 500));

          authLogger.info('✅ OAuth认证成功');
          setCurrentStep(3);
          setProgress(100);
          setStatus('success');

          // 获取保存的重定向URL
          const redirectUrl = OAuth2Service.getRedirectUrl();

          // 延迟跳转，让用户看到成功状态
          setTimeout(() => {
            authLogger.info('🔄 跳转到:', redirectUrl || '/');
            navigate(redirectUrl || '/', { replace: true });
          }, 1500);
        } else {
          authLogger.error('❌ OAuth认证失败:', result.error);
          setErrorMessage(result.error || '认证失败');
          setStatus('error');
        }
      } catch (err) {
        authLogger.error('❌ 认证回调处理失败:', err);
        setErrorMessage(err instanceof Error ? err.message : '未知错误');
        setStatus('error');
      } finally {
        // 清理处理标志
        sessionStorage.removeItem('oauth_callback_processing');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  const handleRetryLogin = () => {
    navigate('/login', { replace: true });
  };

  const handleBackToHome = () => {
    navigate('/', { replace: true });
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            {/* 顶部装饰条 */}
            <TopDecoration />

            {/* 加载动画 */}
            <LoadingIconContainer>
              <div className="taobao-loading-ring" />
              <div className="taobao-loading-dot" />
            </LoadingIconContainer>

            {/* 标题和副标题 */}
            <TaobaoTitle>正在完成认证...</TaobaoTitle>
            <TaobaoSubtitle>
              正在处理您的登录信息，请稍候...
            </TaobaoSubtitle>

            {/* 进度条 */}
            <TaobaoProgress
              percent={progress}
              showInfo={false}
              strokeColor={{
                '0%': '#ff6000',
                '100%': '#ff7a1f',
              }}
            />

            {/* 步骤指示器 */}
            <StepIndicator>
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`step-dot ${
                    index < currentStep ? 'completed' :
                    index === currentStep ? 'active' : ''
                  }`}
                />
              ))}
            </StepIndicator>

            {/* 当前步骤文字 */}
            <div style={{
              fontSize: '13px',
              color: '#999',
              marginBottom: '16px'
            }}>
              {steps[currentStep]}
            </div>
          </>
        );

      case 'success':
        return (
          <>
            {/* 顶部装饰条 */}
            <TopDecoration />

            {/* 成功图标 */}
            <div style={{ marginBottom: '24px' }}>
              <CheckCircleOutlined
                style={{
                  color: '#52c41a',
                  fontSize: '64px',
                  animation: 'success-bounce 0.6s ease-out'
                }}
              />
            </div>

            <TaobaoTitle>认证成功！</TaobaoTitle>
            <TaobaoSubtitle>
              欢迎回来，正在跳转到首页...
            </TaobaoSubtitle>

            <ButtonGroup>
              <Button type="primary" onClick={handleBackToHome}>
                立即跳转
              </Button>
            </ButtonGroup>
          </>
        );

      case 'error':
        return (
          <>
            {/* 错误图标 */}
            <div style={{ marginBottom: '24px' }}>
              <CloseCircleOutlined
                style={{
                  color: '#ff4d4f',
                  fontSize: '64px'
                }}
              />
            </div>

            <TaobaoTitle>认证失败</TaobaoTitle>
            <TaobaoSubtitle>
              登录过程中发生错误，请重试
            </TaobaoSubtitle>

            <ButtonGroup>
              <Button type="primary" onClick={handleRetryLogin}>
                重新登录
              </Button>
              <Button onClick={handleBackToHome}>
                返回首页
              </Button>
            </ButtonGroup>

            {/* 错误详情切换按钮 */}
            <Button
              type="link"
              style={{
                marginTop: '16px',
                fontSize: '12px',
                color: '#999'
              }}
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? '隐藏' : '显示'}错误详情
            </Button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <CallbackContainer>
      <CallbackCard>
        {renderContent()}

        {status === 'error' && showDetails && (
          <Alert
            message="错误详情"
            description={errorMessage}
            type="error"
            showIcon
            style={{
              marginTop: '24px',
              textAlign: 'left',
              fontSize: '13px',
              borderRadius: '8px',
              border: '1px solid #ffccc7',
              background: '#fff2f0'
            }}
          />
        )}
      </CallbackCard>

      {/* 全局样式定义 */}
      <style jsx>{`
        @keyframes success-bounce {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </CallbackContainer>
  );
};

export default AuthCallbackPage;