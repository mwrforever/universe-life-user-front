import React, { useState, useRef, useEffect } from 'react';
import { PullToRefresh as AntPullToRefresh } from 'antd-mobile';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';

// 样式化容器
const RefreshContainer = styled.div`
  position: relative;
  overflow: hidden;
`;

// 金币雨容器
const CoinRainContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
`;

// 金币样式
const Coin = styled(motion.div)`
  position: absolute;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.4);
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b8860b;
  font-weight: bold;
`;

// 下拉刷新组件属性
interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
  disabled?: boolean;
}

// 金币雨组件
const CoinRain: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [coins, setCoins] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  useEffect(() => {
    if (isActive) {
      // 生成30个金币
      const newCoins = Array.from({ length: 30 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
      }));
      setCoins(newCoins);

      // 动画结束后清理
      const timer = setTimeout(() => {
        setCoins([]);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isActive]);

  return (
    <AnimatePresence>
      {isActive && (
        <CoinRainContainer>
          {coins.map((coin) => (
            <Coin
              key={coin.id}
              initial={{
                y: -50,
                x: `${coin.x}%`,
                opacity: 1,
                rotate: 0,
              }}
              animate={{
                y: window.innerHeight + 50,
                opacity: [1, 1, 0],
                rotate: 360,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2 + Math.random(),
                delay: coin.delay,
                ease: 'easeIn',
              }}
            >
              ¥
            </Coin>
          ))}
        </CoinRainContainer>
      )}
    </AnimatePresence>
  );
};

// 下拉刷新组件
export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  threshold = 60,
  disabled = false,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCoinRain, setShowCoinRain] = useState(false);
  const refreshTimeoutRef = useRef<NodeJS.Timeout>();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setShowCoinRain(true);

    try {
      await onRefresh();
    } finally {
      // 延迟重置状态，让用户看到动画效果
      refreshTimeoutRef.current = setTimeout(() => {
        setIsRefreshing(false);
        setShowCoinRain(false);
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  return (
    <RefreshContainer>
      <AntPullToRefresh
        onRefresh={handleRefresh}
        threshold={threshold}
        disabled={disabled}
        refreshing={isRefreshing}
      >
        {children}
      </AntPullToRefresh>
      <CoinRain isActive={showCoinRain} />
    </RefreshContainer>
  );
};

export default PullToRefresh;