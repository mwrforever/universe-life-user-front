import React, { useState, useCallback } from 'react';
import { Form, Input, Button, Checkbox, message, Typography, Modal } from 'antd';
import { UserOutlined, LockOutlined, WechatOutlined, QqOutlined, AlipayOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Link } = Typography;

interface LoginFormProps {
  className?: string;
}

const FormContainer = styled.div`
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  max-height: 90vh;
  overflow-y: auto;

  /* 自定义滚动条 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const FormTitle = styled(Title)`
  && {
    text-align: center;
    margin-bottom: 32px;
    color: #333;
    font-size: 28px;
    font-weight: 600;
  }
`;

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 16px;
  }

  .ant-input-affix-wrapper {
    height: 48px;
    border-radius: 8px;
    border: 1px solid #d9d9d9;
    transition: all 0.3s ease;

    &:hover, &:focus-within {
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
    }

    .ant-input {
      background: #fff;
      font-size: 15px;
      padding: 8px 12px;
    }

    .ant-input-prefix {
      color: #bfbfbf;
      font-size: 16px;
    }
  }

  .ant-btn {
    height: 48px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
  }

  .ant-btn-primary {
    background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
    border: none;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);

    &:hover {
      background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%);
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }
`;

const RememberForgotContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  .ant-checkbox-wrapper {
    color: #666;
  }

  .forgot-link {
    color: #1890ff;
    font-size: 14px;
    transition: color 0.3s ease;

    &:hover {
      color: #40a9ff;
    }
  }
`;

const ThirdPartyContainer = styled.div`
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
`;

const ThirdPartyTitle = styled.div`
  text-align: center;
  margin-bottom: 16px;
  color: #999;
  font-size: 14px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #f0f0f0;
    transform: translateY(-50%);
  }

  span {
    background: #fff;
    padding: 0 16px;
    position: relative;
    z-index: 1;
  }
`;

const SocialButtonsContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const SocialButton = styled(Button)`
  flex: 1;
  height: 44px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: #fff;
  color: #666;
  font-size: 14px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    border-color: #1890ff;
    color: #1890ff;
    background: rgba(24, 144, 255, 0.04);
    transform: translateY(-1px);
  }

  .social-icon {
    font-size: 18px;
  }
`;

const RegisterLinkContainer = styled.div`
  text-align: center;
  margin-top: 24px;
  color: #666;
  font-size: 14px;

  .register-link {
    color: #1890ff;
    font-weight: 500;
    margin-left: 4px;
    transition: color 0.3s ease;

    &:hover {
      color: #40a9ff;
    }
  }
`;

const LoginForm: React.FC<LoginFormProps> = ({ className }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // 模拟登录API调用
      console.log('登录数据:', values);
      await new Promise(resolve => setTimeout(resolve, 1500));

      message.success('登录成功！');
      // 这里可以设置用户状态和token
      navigate('/');
    } catch (error) {
      message.error('登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (type: string) => {
    message.info(`${type}登录功能开发中...`);
  };

  const validateUsername = (username: string): boolean => {
    return username.length >= 3 && username.length <= 20;
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6 && password.length <= 20;
  };

  return (
    <FormContainer className={className}>
      <FormTitle>登录万象生活</FormTitle>

      <StyledForm
        form={form}
        name="login"
        onFinish={onFinish}
        autoComplete="off"
        size="large"
      >
        <Form.Item
          name="username"
          rules={[
            { required: true, message: '请输入用户名或手机号' },
            {
              validator: (_, value) => {
                if (!value || validateUsername(value)) {
                  return Promise.reject(new Error('用户名长度为3-20个字符'));
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="请输入用户名或手机号"
            autoComplete="username"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: '请输入密码' },
            {
              validator: (_, value) => {
                if (!value || validatePassword(value)) {
                  return Promise.reject(new Error('密码长度为6-20个字符'));
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请输入密码"
            autoComplete="current-password"
          />
        </Form.Item>

        <RememberForgotContainer>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>记住我</Checkbox>
          </Form.Item>
          <Link href="/reset-password" className="forgot-link">
            忘记密码？
          </Link>
        </RememberForgotContainer>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            {loading ? '登录中...' : '登录'}
          </Button>
        </Form.Item>
      </StyledForm>

      <ThirdPartyContainer>
        <ThirdPartyTitle>
          <span>或使用第三方登录</span>
        </ThirdPartyTitle>

        <SocialButtonsContainer>
          <SocialButton onClick={() => handleSocialLogin('微信')}>
            <WechatOutlined className="social-icon" />
            微信
          </SocialButton>
          <SocialButton onClick={() => handleSocialLogin('QQ')}>
            <QqOutlined className="social-icon" />
            QQ
          </SocialButton>
          <SocialButton onClick={() => handleSocialLogin('支付宝')}>
            <AlipayOutlined className="social-icon" />
            支付宝
          </SocialButton>
        </SocialButtonsContainer>
      </ThirdPartyContainer>

      <RegisterLinkContainer>
        还没有账号？
        <Link href="/register" className="register-link">
          立即注册
        </Link>
      </RegisterLinkContainer>
    </FormContainer>
  );
};

export default LoginForm;