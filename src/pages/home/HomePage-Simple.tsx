import React from 'react';
import { Card, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

// 样式化组件
const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Header = styled.header`
  text-align: center;
  padding: 60px 20px 40px;
  color: white;

  h1 {
    font-size: 3rem;
    margin-bottom: 16px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  }

  p {
    font-size: 1.2rem;
    opacity: 0.9;
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 60px;
`;

const WelcomeCard = styled(Card)`
  margin-bottom: 40px;
  text-align: center;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);

  .ant-card-body {
    padding: 40px;
  }

  h2 {
    color: #1890ff;
    margin-bottom: 16px;
  }
`;

const FeatureCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;

  .ant-card {
    border-radius: 12px;
    overflow: hidden;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    }
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
`;

// 简化版HomePage组件
export const HomePageSimple: React.FC = () => {
  const navigate = useNavigate();

  return (
    <HomeContainer>
      <Header>
        <h1>🌟 万象生活 🌟</h1>
        <p>您的生活服务专家平台</p>
      </Header>

      <MainContent>
        <WelcomeCard>
          <h2>🎉 欢迎来到万象生活！</h2>
          <p>这是万象生活用户端应用的首页。</p>
          <p>界面功能已基本恢复，正在努力完善中...</p>

          <NavigationButtons>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/login')}
            >
              🔐 登录
            </Button>
            <Button
              size="large"
              onClick={() => navigate('/register')}
            >
              📝 注册
            </Button>
          </NavigationButtons>
        </WelcomeCard>

        <FeatureCards>
          <Card title="🏠 家政服务" hoverable>
            <p>专业的家政服务，让您的生活更舒适</p>
          </Card>
          <Card title="🔧 维修服务" hoverable>
            <p>专业的维修师傅，解决各种生活问题</p>
          </Card>
          <Card title="🚚 搬运服务" hoverable>
            <p>安全高效的搬运服务，让您轻松搬家</p>
          </Card>
          <Card title="🏗 保洁服务" hoverable>
            <p>专业的保洁服务，让环境更整洁</p>
          </Card>
          <Card title="👨‍🍳 管道服务" hoverable>
            <p>专业的管通维护，解决生活设施问题</p>
          </Card>
        </FeatureCards>
      </MainContent>
    </HomeContainer>
  );
};

export default HomePageSimple;