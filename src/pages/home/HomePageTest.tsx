import React from 'react';
import styled from '@emotion/styled';
import { SimpleCarousel } from '../../components/carousel/SimpleCarousel';
import { simpleCarouselData } from '../../data/simpleCarouselData';

const TestContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
`;

const TestHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;

  h1 {
    color: #333;
    margin-bottom: 8px;
  }

  p {
    color: #666;
  }
`;

// 测试页面 - 只显示轮播图
export const HomePageTest: React.FC = () => {
  console.log('测试页面渲染');

  return (
    <TestContainer>
      <TestHeader>
        <h1>🚀 轮播图测试页面</h1>
        <p>这是一个简化版本，专门用于测试轮播图功能</p>
      </TestHeader>

      <SimpleCarousel
        items={simpleCarouselData}
      />
    </TestContainer>
  );
};

export default HomePageTest;
