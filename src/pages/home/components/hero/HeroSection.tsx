import React, { useState, useCallback } from 'react';
import { Button, ConfigProvider } from 'antd';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// Hero内容区域样式
const HeroContainer = styled.section`
  position: relative;
  min-height: 85vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
`;

const ParticleBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
`;

const Particle = styled.div<{ $delay: number; $size: number; $type: number }>`
  position: absolute;
  background: rgba(
    255,
    255,
    255,
    ${props => (props.$type === 1 ? 0.1 : props.$type === 2 ? 0.2 : 0.3)}
  );
  border-radius: 50%;
  pointer-events: none;
  animation: float ${props => 6 + props.$delay}s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  display: flex;
  align-items: center;
  min-height: 100%;
`;

const GlassCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 3rem;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 1s ease-out;

  @media (max-width: 768px) {
    padding: 2rem;
    border-radius: 16px;
  }
`;

const TitleContainer = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const MainTitle = styled.h1`
  font-size: clamp(32px, 4vw, 54px);
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  line-height: 1.2;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 32px;
  }

  @media (min-width: 1440px) {
    font-size: 54px;
  }
`;

const Subtitle = styled.p`
  font-size: clamp(18px, 2.5vw, 24px);
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0;
  line-height: 1.5;
  font-weight: 300;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (min-width: 1440px) {
    font-size: 24px;
  }
`;

const CTAContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const StyledButton = styled(Button)<{ $variant?: 'primary' | 'secondary' }>`
  height: 48px;
  padding: 0 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  ${props =>
    props.$variant === 'primary'
      ? `
    background: linear-gradient(135deg, #7877c6 0%, #c878ff 100%);
    border: none;
    color: white;
    box-shadow: 0 4px 15px rgba(120, 119, 198, 0.4);

    &:hover, &:focus {
      background: linear-gradient(135deg, #6966b3 0%, #b86fee 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(120, 119, 198, 0.5);
    }
  `
      : `
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.3);
    color: white;
    backdrop-filter: blur(10px);

    &:hover, &:focus {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-2px);
    }
  `}

  &:active {
    transform: translateY(0);
  }
`;

// 动画定义
const fadeInUpAnimation = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const floatAnimation = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(180deg);
    }
  }
`;

// 生成粒子数据
const generateParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 6,
    type: Math.floor(Math.random() * 3) + 1,
  }));
};

// 主组件
const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [particles] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 768
      ? generateParticles(15)
      : generateParticles(30)
  );

  // 事件处理器
  const handleCreateOrder = useCallback(() => {
    navigate('/create-order');
  }, [navigate]);

  const handleFindServices = useCallback(() => {
    navigate('/market');
  }, [navigate]);

  // Ant Design 主题配置
  const theme = {
    token: {
      colorPrimary: '#7877c6',
      borderRadius: 12,
      fontSize: 16,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    },
  };

  return (
    <ConfigProvider theme={theme}>
      <style>{fadeInUpAnimation + floatAnimation}</style>

      {/* Hero 主区域 */}
      <HeroContainer>
        <ParticleBackground>
          {particles.map(particle => (
            <Particle
              key={particle.id}
              $delay={particle.delay}
              $size={particle.size}
              $type={particle.type}
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
            />
          ))}
        </ParticleBackground>

        <HeroContent>
          <GlassCard>
            <TitleContainer>
              <MainTitle>
                万象生活
                <br />
                Universe Life
              </MainTitle>
              <Subtitle>连接创意与需求 - 打破传统接单平台界限</Subtitle>
            </TitleContainer>

            <CTAContainer>
              <StyledButton
                type='primary'
                size='large'
                onClick={handleCreateOrder}
                $variant='primary'
              >
                发布需求
              </StyledButton>
              <StyledButton size='large' onClick={handleFindServices} $variant='secondary'>
                寻找服务
              </StyledButton>
            </CTAContainer>
          </GlassCard>
        </HeroContent>
      </HeroContainer>
    </ConfigProvider>
  );
};

export default HeroSection;
