import React from 'react';
import { Divider, Button, Space, Typography, message } from 'antd';
import { WechatOutlined, QqOutlined, AlipayOutlined, WeiboOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Text } = Typography;

interface ThirdPartyLoginProps {
  className?: string;
  type?: 'login' | 'register';
}

const Container = styled.div`
  margin-top: 24px;
  width: 100%;
`;

const DividerContainer = styled(Divider)`
  && {
    margin: 20px 0;
    font-size: 13px;
    color: #999;

  &.ant-divider-with-text {
    .ant-divider-inner-text {
      color: #999;
      font-size: 13px;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const StyledButton = styled(Button)<{ $type?: 'login' | 'register'; $color?: string }>`
  && {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 1px solid ${({ $color }) => $color || '#ddd'};
    background: white;
    transition: all 0.3s ease;
    font-size: 20px;
    font-weight: 500;
    position: relative;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-color: ${({ $color }) => $color || '#ddd'};
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    }

    .anticon {
      font-size: 20px;
      color: ${({ $color }) => $color || '#666'};
      display: inline-block;
    }

    /* 隐藏文字，只显示图标 */
    span:not(.anticon) {
      display: none;
    }

    /* 微信按钮特殊样式 */
    &[data-platform="wechat"] {
      background: linear-gradient(135deg, #07C160 0%, #06AE56 100%);
      border-color: #07C160;
      color: white;

      &:hover {
        background: linear-gradient(135deg, #06AE56 0%, #059B4C 100%);
        border-color: #06AE56;
        box-shadow: 0 4px 12px rgba(7, 193, 96, 0.25);
      }

      .anticon {
        color: white;
      }

      span {
        color: white;
      }
    }

    /* QQ按钮特殊样式 */
    &[data-platform="qq"] {
      background: linear-gradient(135deg, #12B7F5 0%, #0EA5E9 100%);
      border-color: #12B7F5;
      color: white;

      &:hover {
        background: linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%);
        border-color: #0EA5E9;
        box-shadow: 0 4px 12px rgba(18, 183, 245, 0.25);
      }

      .anticon {
        color: white;
      }

      span {
        color: white;
      }
    }

    /* 支付宝按钮特殊样式 */
    &[data-platform="alipay"] {
      background: linear-gradient(135deg, #1677FF 0%, #1465E0 100%);
      border-color: #1677FF;
      color: white;

      &:hover {
        background: linear-gradient(135deg, #1465E0 0%, #1351C4 100%);
        border-color: #1465E0;
        box-shadow: 0 4px 12px rgba(22, 119, 255, 0.25);
      }

      .anticon {
        color: white;
      }

      span {
        color: white;
      }
    }

    /* 微博按钮特殊样式 - 使用官方橙色 */
    &[data-platform="weibo"] {
      background: linear-gradient(135deg, #FF8200 0%, #E67E00 100%);
      border-color: #FF8200;
      color: white;

      &:hover {
        background: linear-gradient(135deg, #E67E00 0%, #CC7300 100%);
        border-color: #E67E00;
        box-shadow: 0 4px 12px rgba(255, 130, 0, 0.25);
      }

      .anticon {
        color: white;
      }

      span {
        color: white;
      }
    }

    @media (max-width: 480px) {
      width: 44px;
      height: 44px;

      .anticon {
        font-size: 18px;
      }
    }

    @media (max-width: 360px) {
      width: 40px;
      height: 40px;

      .anticon {
        font-size: 16px;
      }
    }
  }
`;

const Description = styled(Text)`
  && {
    font-size: 11px;
    color: #999;
    text-align: center;
    display: block;
    margin-top: 12px;
  }
`;

const ThirdPartyLogin: React.FC<ThirdPartyLoginProps> = ({
  className,
  type = 'login'
}) => {
  const handleThirdPartyLogin = (platform: string) => {
    const action = type === 'login' ? '登录' : '注册';
    message.info(`${platform}${action}功能开发中...`);

    // 这里可以添加实际的第三方登录逻辑
    console.log(`${type} with ${platform}`);
  };

  const thirdPartyPlatforms = [
    {
      name: '微信',
      icon: <WechatOutlined />,
      color: '#07C160',
      key: 'wechat'
    },
    {
      name: 'QQ',
      icon: <QqOutlined />,
      color: '#12B7F5',
      key: 'qq'
    },
    {
      name: '支付宝',
      icon: <AlipayOutlined />,
      color: '#1677FF',
      key: 'alipay'
    },
    {
      name: '微博',
      icon: <WeiboOutlined />,
      color: '#FF8200',
      key: 'weibo'
    }
  ];

  const dividerText = type === 'login' ? '其他登录方式' : '快速注册';

  return (
    <Container className={className}>
      <DividerContainer plain>
        {dividerText}
      </DividerContainer>

      <ButtonContainer>
        {thirdPartyPlatforms.map((platform) => (
          <StyledButton
            key={platform.key}
            $type={type}
            $color={platform.color}
            data-platform={platform.key}
            onClick={() => handleThirdPartyLogin(platform.name)}
            title={`${platform.name}${type === 'login' ? '登录' : '注册'}`}
          >
            {platform.icon}
          </StyledButton>
        ))}
      </ButtonContainer>

      <Description>
        {type === 'login'
          ? '使用第三方账号快速登录，安全便捷'
          : '使用第三方账号快速注册，节省时间'
        }
      </Description>
    </Container>
  );
};

export default ThirdPartyLogin;