import React, { useState } from 'react';
import { Typography, Card, Spin, Button, Space } from 'antd';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';

const { Title } = Typography;

// 样式化容器
const HomeContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
`;

// 模拟API函数
const fetchTestData = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟网络延迟
  return {
    message: "测试数据加载成功!",
    timestamp: new Date().toISOString(),
    data: [1, 2, 3, 4, 5]
  };
};

// 调试版首页 - 测试React-Query
export const HomePageDebug2: React.FC = () => {
  const [step, setStep] = useState(1);

  // React-Query测试
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['test-data'],
    queryFn: fetchTestData,
    staleTime: 5000,
  });

  return (
    <HomeContainer>
      <Card style={{ maxWidth: 800, margin: '0 auto' }}>
        <Title level={2}>🔍 React-Query 调试测试</Title>

        {/* React-Query 状态测试 */}
        <div style={{ marginBottom: '20px', padding: '16px', background: '#f0f0f0', borderRadius: '8px' }}>
          <h3>React-Query 状态:</h3>
          <p>加载状态: {isLoading ? '加载中...' : '完成'}</p>
          <p>错误状态: {error ? '有错误' : '无错误'}</p>
          <p>数据状态: {data ? '有数据' : '无数据'}</p>

          {isLoading && <Spin size="large" />}
          {error && <div style={{ color: 'red' }}>错误: {String(error)}</div>}
          {data && (
            <div style={{ color: 'green' }}>
              <strong>数据加载成功:</strong>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
        </div>

        <Space>
          <Button onClick={() => refetch()}>重新加载数据</Button>
          <Button onClick={() => setStep(step + 1)}>下一步: {step + 1}</Button>
        </Space>

        <div style={{ marginTop: '20px' }}>
          <h3>测试结果:</h3>
          {data && <div>✅ React-Query 工作正常</div>}
          {!isLoading && !error && !data && <div>⚠️ 数据加载异常</div>}
          {error && <div>❌ React-Query 出错</div>}
        </div>
      </Card>
    </HomeContainer>
  );
};

export default HomePageDebug2;