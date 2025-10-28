import React from 'react';
import { Layout } from 'antd';
import styled from 'styled-components';
import BrandPanel from './BrandPanel';

const { Content } = Layout;

interface AuthLayoutProps {
  children: React.ReactNode;
  backgroundType?: 'login' | 'register' | 'reset';
}

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;

  &.login-bg {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

    /* 登录页面生活元素 */
    &::before {
      content: '🌳';
      position: absolute;
      top: 10%;
      left: 5%;
      font-size: 40px;
      opacity: 0.3;
      animation: gentleFloat 15s ease-in-out infinite;
    }

    &::after {
      content: '🏃‍♂️';
      position: absolute;
      bottom: 15%;
      right: 8%;
      font-size: 35px;
      opacity: 0.4;
      animation: gentleFloat 18s ease-in-out infinite reverse;
    }
  }

  &.register-bg {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);

    /* 注册页面生活元素 */
    &::before {
      content: '🌻';
      position: absolute;
      top: 8%;
      right: 6%;
      font-size: 38px;
      opacity: 0.4;
      animation: gentleFloat 20s ease-in-out infinite;
    }

    &::after {
      content: '🚴‍♀️';
      position: absolute;
      bottom: 12%;
      left: 7%;
      font-size: 32px;
      opacity: 0.3;
      animation: gentleFloat 16s ease-in-out infinite reverse;
    }

    /* 额外的生活元素 */
    .life-element-1 {
      position: absolute;
      top: 15%;
      left: 8%;
      font-size: 28px;
      opacity: 0.3;
      animation: gentleFloat 18s ease-in-out infinite;
    }

    .life-element-2 {
      position: absolute;
      top: 20%;
      right: 12%;
      font-size: 35px;
      opacity: 0.35;
      animation: gentleFloat 22s ease-in-out infinite reverse;
    }

    .life-element-3 {
      position: absolute;
      bottom: 25%;
      right: 8%;
      font-size: 24px;
      opacity: 0.4;
      animation: gentleFloat 14s ease-in-out infinite;
    }

    .life-element-4 {
      position: absolute;
      bottom: 18%;
      left: 15%;
      font-size: 30px;
      opacity: 0.3;
      animation: gentleFloat 19s ease-in-out infinite reverse;
    }

    .life-element-5 {
      position: absolute;
      top: 35%;
      left: 5%;
      font-size: 26px;
      opacity: 0.35;
      animation: gentleFloat 17s ease-in-out infinite;
    }

    .life-element-6 {
      position: absolute;
      top: 40%;
      right: 10%;
      font-size: 20px;
      opacity: 0.3;
      animation: gentleFloat 15s ease-in-out infinite reverse;
    }

    .life-element-7 {
      position: absolute;
      top: 60%;
      right: 5%;
      font-size: 32px;
      opacity: 0.25;
      animation: gentleFloat 24s ease-in-out infinite;
    }

    .life-element-8 {
      position: absolute;
      bottom: 8%;
      right: 15%;
      font-size: 28px;
      opacity: 0.3;
      animation: gentleFloat 21s ease-in-out infinite reverse;
    }
  }

  &.reset-bg {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);

    /* 重置密码页面生活元素 */
    &::before {
      content: '🏡';
      position: absolute;
      top: 12%;
      left: 6%;
      font-size: 36px;
      opacity: 0.3;
      animation: gentleFloat 17s ease-in-out infinite;
    }

    &::after {
      content: '🌈';
      position: absolute;
      bottom: 18%;
      right: 5%;
      font-size: 34px;
      opacity: 0.4;
      animation: gentleFloat 19s ease-in-out infinite reverse;
    }
  }

  @keyframes gentleFloat {
    0%,
    100% {
      transform: translateY(0px) rotate(0deg);
    }
    25% {
      transform: translateY(-8px) rotate(2deg);
    }
    75% {
      transform: translateY(5px) rotate(-1deg);
    }
  }

  /* 装饰性云朵 */
  &:not(.login-bg):not(.register-bg):not(.reset-bg) {
    &::before {
      content: '☁️';
      position: absolute;
      top: 5%;
      left: 10%;
      font-size: 30px;
      opacity: 0.2;
      animation: cloudFloat 25s linear infinite;
    }
  }

  @keyframes cloudFloat {
    from {
      transform: translateX(-100px);
    }
    to {
      transform: translateX(calc(100vw + 100px));
    }
  }
`;

const StyledContent = styled(Content)`
  width: 72%;
  max-width: 864px;
  min-height: 400px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  display: flex;
  overflow: hidden;
  margin: 20px auto;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 90%;
    max-width: 90%;
    min-height: auto;
    border-radius: 0;
    margin: 0;
  }

  @media (max-width: 480px) {
    width: 95%;
    min-height: auto;
    border-radius: 0;
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
    animation: float 20s linear infinite;
  }

  @keyframes float {
    0% {
      transform: translate(0, 0) rotate(0deg);
    }
    100% {
      transform: translate(-50px, -50px) rotate(360deg);
    }
  }

  /* 生活元素装饰 */
  &::after {
    content: '';
    position: absolute;
    bottom: -10%;
    left: -5%;
    width: 110%;
    height: 30%;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 20'%3E%3Cpath d='M0,10 Q25,20 50,10 T100,10 L100,20 L0,20 Z' fill='rgba(255,255,255,0.05)'/%3E%3C/svg%3E")
      repeat-x;
    background-size: 100px 20px;
    opacity: 0.6;
    animation: wave 8s ease-in-out infinite;
  }

  @keyframes wave {
    0%,
    100% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(-25px);
    }
  }

  @media (max-width: 768px) {
    padding: 25px 20px;
    min-height: 160px;
  }

  @media (max-width: 480px) {
    padding: 20px 15px;
    min-height: 140px;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  @media (max-width: 768px) {
    padding: 25px 20px;
  }

  @media (max-width: 480px) {
    padding: 20px 15px;
  }

  @media (max-width: 360px) {
    padding: 15px 10px;
  }
`;

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, backgroundType = 'login' }) => {
  // 注册页面的生活元素
  const registerLifeElements =
    backgroundType === 'register' ? (
      <>
        <div className='life-element-1'>🏘️</div>
        <div className='life-element-2'>🌳</div>
        <div className='life-element-3'>🦋</div>
        <div className='life-element-4'>🏃‍♂️</div>
        <div className='life-element-5'>🌺</div>
        <div className='life-element-6'>🐝</div>
        <div className='life-element-7'>🌈</div>
        <div className='life-element-8'>🏡</div>
      </>
    ) : null;

  return (
    <StyledLayout className={`${backgroundType}-bg`}>
      {registerLifeElements}
      <StyledContent>
        <LeftPanel>
          <BrandPanel />
        </LeftPanel>
        <RightPanel>{children}</RightPanel>
      </StyledContent>
    </StyledLayout>
  );
};

export default AuthLayout;
