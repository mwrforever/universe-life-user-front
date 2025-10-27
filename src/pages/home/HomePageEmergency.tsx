import React from 'react';

export const HomePageEmergency: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#fff',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        <h1 style={{ color: '#1890ff', marginBottom: '24px' }}>🚀 应急测试页面</h1>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '32px' }}>
          如果你看到这个页面，说明React基础功能正常。
        </p>
        <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', textAlign: 'left' }}>
          <h3>诊断信息:</h3>
          <p>React版本: {React.version}</p>
          <p>当前时间: {new Date().toLocaleString()}</p>
          <p>用户代理: {navigator.userAgent}</p>
        </div>
      </div>
    </div>
  );
};

export default HomePageEmergency;