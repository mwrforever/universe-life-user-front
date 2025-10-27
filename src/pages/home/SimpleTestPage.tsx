import React from 'react';

// 超级简单的测试页面
export const SimpleTestPage: React.FC = () => {
  return (
    <div style={{ padding: '20px', minHeight: '100vh', background: '#f0f0f0' }}>
      <h1 style={{ color: '#333', textAlign: 'center', marginBottom: '40px' }}>
        🚀 轮播图测试页面
      </h1>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        height: '400px',
        background: '#fff',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        color: '#666',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        ✅ 页面正常渲染！轮播图组件正在测试中...
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>如果你能看到这个页面，说明基础渲染没问题。</p>
        <p>请检查浏览器控制台是否有错误信息。</p>
      </div>
    </div>
  );
};

export default SimpleTestPage;