import React, { useState } from 'react';
import { Typography, Card, Spin } from 'antd';
import styled from '@emotion/styled';

const { Title } = Typography;

// 样式化容器
const HomeContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
`;

// 调试版首页 - 逐步添加功能
export const HomePageDebug: React.FC = () => {
  const [step, setStep] = useState(1);

  return (
    <HomeContainer>
      <Card style={{ maxWidth: 800, margin: '0 auto' }}>
        <Title level={2}>🔍 首页调试模式</Title>
        <p>当前步骤: {step}</p>

        <div style={{ marginBottom: '20px' }}>
          <h3>已测试通过的功能:</h3>
          <ul>
            {step >= 1 && <li>✅ 基础React组件渲染</li>}
            {step >= 2 && <li>✅ 状态管理 (useState)</li>}
            {step >= 3 && <li>✅ 样式组件 (Emotion)</li>}
          </ul>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>下一步测试:</h3>
          <button onClick={() => setStep(step + 1)}>
            测试下一步 (Step {step + 1})
          </button>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>组件状态:</h3>
          <p>React版本: {React.version}</p>
          <p>当前时间: {new Date().toLocaleString()}</p>
        </div>
      </Card>
    </HomeContainer>
  );
};

export default HomePageDebug;