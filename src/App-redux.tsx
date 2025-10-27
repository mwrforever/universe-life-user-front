import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { store } from '@/store';
import { Card, Button, Typography } from 'antd';

const { Title, Paragraph } = Typography;

// 简单的首页组件
const Home = () => (
  <div style={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  }}>
    <Card
      style={{
        width: '100%',
        maxWidth: '600px',
        textAlign: 'center',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Title level={1} style={{ color: '#1890ff', marginBottom: '24px' }}>
        万象生活
      </Title>
      <Paragraph style={{ fontSize: '18px', color: '#666', marginBottom: '32px' }}>
        Redux + Ant Design 测试页面
      </Paragraph>
      <Button type="primary" size="large">
        测试按钮
      </Button>
    </Card>
  </div>
);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<div>404 - 页面不存在</div>} />
          </Routes>
        </Router>
      </ConfigProvider>
    </Provider>
  );
};

export default App;