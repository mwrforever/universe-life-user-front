import React from 'react';
import styled from '@emotion/styled';

const BackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
`;

const FloatingElement = styled.div`
  position: absolute;
  opacity: 0.1;
  color: white;
  font-size: 20px;
  filter: blur(0.5px);
`;

const DescriptionText = styled.div`
  position: absolute;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 300;
  line-height: 1.5;
  text-align: center;
  pointer-events: none;
`;

const PlatformDescription = styled.div`
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 1;
  max-width: 600px;
`;

const LifeIcon = styled.div`
  position: absolute;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.3);
`;

const ServiceBubble = styled.div`
  position: absolute;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  font-weight: 500;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const AnimatedBackground: React.FC = () => {
  return (
    <BackgroundContainer>
      {/* 平台描述文字 */}
      <PlatformDescription>
        🌟 万象生活 - 您身边的一站式生活服务平台
      </PlatformDescription>

      {/* 服务标签 */}
      <ServiceBubble style={{ top: '20%', left: '15%' }}>
        家政服务
      </ServiceBubble>
      <ServiceBubble style={{ top: '25%', right: '18%' }}>
        维修安装
      </ServiceBubble>
      <ServiceBubble style={{ bottom: '25%', left: '20%' }}>
        美容护理
      </ServiceBubble>
      <ServiceBubble style={{ bottom: '30%', right: '22%' }}>
        物流配送
      </ServiceBubble>

      {/* 生活图标 */}
      <LifeIcon style={{ top: '10%', left: '5%' }} title="居住">
        🏠
      </LifeIcon>
      <LifeIcon style={{ top: '15%', right: '8%' }} title="餐饮">
        🍽️
      </LifeIcon>
      <LifeIcon style={{ top: '50%', left: '5%', transform: 'translateY(-50%)' }} title="出行">
        🚗
      </LifeIcon>
      <LifeIcon style={{ top: '45%', right: '5%', transform: 'translateY(-50%)' }} title="购物">
        🛒
      </LifeIcon>
      <LifeIcon style={{ bottom: '15%', left: '7%' }} title="娱乐">
        🎬
      </LifeIcon>
      <LifeIcon style={{ bottom: '12%', right: '6%' }} title="工作">
        💼
      </LifeIcon>

      {/* 装饰性元素 */}
      <FloatingElement style={{
        animation: 'float 8s ease-in-out infinite',
        animationDelay: '0s'
      }}>
        ✨
      </FloatingElement>
      <FloatingElement style={{
        animation: 'float 10s ease-in-out infinite',
        animationDelay: '2s'
      }}>
        💫
      </FloatingElement>
      <FloatingElement style={{
        animation: 'float 12s ease-in-out infinite',
        animationDelay: '4s'
      }}>
        ⭐
      </FloatingElement>
      <FloatingElement style={{
        animation: 'float 9s ease-in-out infinite',
        animationDelay: '6s'
      }}>
        🌟
      </FloatingElement>
      <FloatingElement style={{
        animation: 'float 11s ease-in-out infinite',
        animationDelay: '8s'
      }}>
        ✦
      </FloatingElement>
      <FloatingElement style={{
        animation: 'float 13s ease-in-out infinite',
        animationDelay: '10s'
      }}>
        💫
      </FloatingElement>

      {/* 底部描述 */}
      <DescriptionText
        style={{
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        连接您与美好生活
      </DescriptionText>

      {/* 添加CSS动画 */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) rotate(5deg);
          }
          75% {
            transform: translateY(10px) rotate(-5deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.2);
          }
        }

        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          20%, 80% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
        }

        ${PlatformDescription} {
          animation: slideDown 20s ease-in-out infinite;
        }

        ${LifeIcon} {
          animation: pulse 3s ease-in-out infinite;
        }

        ${ServiceBubble} {
          animation: bubbleFloat 5s ease-in-out infinite;
        }

        @keyframes bubbleFloat {
          0%, 100% {
            transform: translateY(0px);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-30px);
            opacity: 1;
          }
        }
      `}</style>
    </BackgroundContainer>
  );
};

export default AnimatedBackground;