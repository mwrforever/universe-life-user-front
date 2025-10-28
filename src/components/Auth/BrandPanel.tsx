import React from 'react';
import styled from 'styled-components';

const BrandContainer = styled.div`
  text-align: center;
  color: white;
  z-index: 2;
  position: relative;

  /* 丰富的生活元素装饰 */
  &::before {
    content: '🏘️';
    position: absolute;
    top: 20px;
    left: 20px;
    font-size: 24px;
    opacity: 0.6;
    animation: float 6s ease-in-out infinite;
  }

  &::after {
    content: '🌳';
    position: absolute;
    top: 30px;
    right: 20px;
    font-size: 20px;
    opacity: 0.5;
    animation: float 8s ease-in-out infinite reverse;
  }

  /* 额外的生活元素 */
  &:nth-child(1) {
    content: '🐦';
    position: absolute;
    top: 15%;
    right: 15%;
    font-size: 16px;
    opacity: 0.4;
    animation: birdFly 12s linear infinite;
  }
`;

/* 额外的装饰元素 */
const LifeElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;

  &::before {
    content: '🌺';
    position: absolute;
    bottom: 20%;
    left: 10%;
    font-size: 18px;
    opacity: 0.5;
    animation: sway 7s ease-in-out infinite;
  }

  &::after {
    content: '🦋';
    position: absolute;
    top: 35%;
    left: 8%;
    font-size: 16px;
    opacity: 0.4;
    animation: butterflyFly 15s ease-in-out infinite;
  }

  @keyframes birdFly {
    0% {
      transform: translate(0, 0) scale(1);
    }
    25% {
      transform: translate(30px, -10px) scale(1.1);
    }
    50% {
      transform: translate(60px, 5px) scale(0.9);
    }
    75% {
      transform: translate(40px, -15px) scale(1.05);
    }
    100% {
      transform: translate(0, 0) scale(1);
    }
  }

  @keyframes butterflyFly {
    0%,
    100% {
      transform: translate(0, 0) rotate(0deg);
    }
    25% {
      transform: translate(20px, -20px) rotate(15deg);
    }
    50% {
      transform: translate(40px, 10px) rotate(-10deg);
    }
    75% {
      transform: translate(15px, -10px) rotate(5deg);
    }
  }
`;

const AdditionalElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;

  &::before {
    content: '🐝';
    position: absolute;
    top: 25%;
    right: 12%;
    font-size: 14px;
    opacity: 0.3;
    animation: beeBuzz 10s linear infinite;
  }

  &::after {
    content: '🌿';
    position: absolute;
    bottom: 25%;
    right: 15%;
    font-size: 16px;
    opacity: 0.4;
    animation: sway 8s ease-in-out infinite reverse;
  }

  @keyframes beeBuzz {
    0% {
      transform: translate(0, 0);
    }
    20% {
      transform: translate(-15px, -10px);
    }
    40% {
      transform: translate(10px, -20px);
    }
    60% {
      transform: translate(-20px, -5px);
    }
    80% {
      transform: translate(5px, -15px);
    }
    100% {
      transform: translate(0, 0);
    }
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;

const LogoWrapper = styled.div`
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ffffff 0%, #e6f7ff 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;

  &::before {
    content: '🏠';
    font-size: 40px;
    position: relative;
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(24, 144, 255, 0.1) 2px, transparent 2px);
    background-size: 8px 8px;
    animation: rotate 30s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Logo周围的生活元素 */
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  }
`;

const BrandName = styled.h1`
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  letter-spacing: 1px;
`;

const BrandSlogan = styled.p`
  font-size: 18px;
  font-weight: 400;
  margin-bottom: 40px;
  opacity: 0.9;
  line-height: 1.6;
`;

const Description = styled.div`
  font-size: 16px;
  line-height: 1.8;
  opacity: 0.85;
  margin-bottom: 40px;
  max-width: 320px;
`;

const Features = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 40px;
  position: relative;

  /* 底部装饰性生活元素 */
  &::before {
    content: '🌻';
    position: absolute;
    bottom: -15px;
    left: 10px;
    font-size: 18px;
    opacity: 0.4;
    animation: sway 4s ease-in-out infinite;
  }

  &::after {
    content: '🦋';
    position: absolute;
    bottom: 20px;
    right: 15px;
    font-size: 16px;
    opacity: 0.5;
    animation: sway 5s ease-in-out infinite reverse;
  }

  @keyframes sway {
    0%,
    100% {
      transform: translateX(0px) rotate(0deg);
    }
    50% {
      transform: translateX(5px) rotate(5deg);
    }
  }
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
`;

const FeatureIcon = styled.span`
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
`;

const FeatureText = styled.div`
  text-align: left;
`;

const FeatureTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
`;

const FeatureDesc = styled.div`
  font-size: 12px;
  opacity: 0.8;
`;

const BrandPanel: React.FC = () => {
  const features = [
    {
      icon: '🏡',
      title: '智慧社区',
      desc: '连接邻里，共建美好家园',
    },
    {
      icon: '🛍️',
      title: '便民服务',
      desc: '生活所需，一键触达',
    },
    {
      icon: '💝',
      title: '温暖生活',
      desc: '让每一天都充满温度',
    },
  ];

  return (
    <BrandContainer>
      <LifeElements />
      <AdditionalElements />
      <LogoWrapper>
        <Logo />
      </LogoWrapper>

      <BrandName>万象生活</BrandName>
      <BrandSlogan>让生活更美好</BrandSlogan>

      <Description>
        致力于打造智慧、便捷、温暖的社区生活服务平台， 为您提供全方位的生活解决方案。
      </Description>

      <Features>
        {features.map((feature, index) => (
          <Feature key={index}>
            <FeatureIcon>{feature.icon}</FeatureIcon>
            <FeatureText>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDesc>{feature.desc}</FeatureDesc>
            </FeatureText>
          </Feature>
        ))}
      </Features>
    </BrandContainer>
  );
};

export default BrandPanel;
