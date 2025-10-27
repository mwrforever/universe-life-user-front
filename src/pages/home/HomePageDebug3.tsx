import React from 'react';
import { Typography, Card, Spin, Alert } from 'antd';
import styled from '@emotion/styled';

const { Title } = Typography;

// 样式化容器
const HomeContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
`;

// 测试自定义Hook
export const HomePageDebug3: React.FC = () => {
  // 逐步测试每个Hook
  const [testStep, setTestStep] = React.useState(1);

  // 测试导入
  let importError = null;
  try {
    // 这里我们先测试导入是否有问题
    const testServices = require('../services');
    const testTypes = require('../types');
    console.log('Services导入成功:', testServices);
    console.log('Types导入成功:', testTypes);
  } catch (error) {
    importError = error;
    console.error('导入失败:', error);
  }

  return (
    <HomeContainer>
      <Card style={{ maxWidth: 800, margin: '0 auto' }}>
        <Title level={2}>🔍 Hook和导入测试</Title>

        {/* 导入测试 */}
        <div style={{ marginBottom: '20px' }}>
          <h3>模块导入测试:</h3>
          {importError ? (
            <Alert
              message="导入失败"
              description={String(importError)}
              type="error"
              showIcon
            />
          ) : (
            <Alert
              message="导入成功"
              description="所有模块导入正常"
              type="success"
              showIcon
            />
          )}
        </div>

        {/* 逐步测试 */}
        <div style={{ marginBottom: '20px' }}>
          <h3>测试步骤:</h3>
          <ol>
            <li>✅ 基础组件渲染</li>
            <li>✅ 模块导入</li>
            <li>⏳ 待测试: React-Query Hook</li>
            <li>⏳ 待测试: 自定义Hook</li>
            <li>⏳ 待测试: 组件渲染</li>
          </ol>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>调试信息:</h3>
          <p>当前步骤: {testStep}</p>
          <p>React版本: {React.version}</p>
          <p>环境: {process.env.NODE_ENV}</p>
        </div>
      </Card>
    </HomeContainer>
  );
};

export default HomePageDebug3;