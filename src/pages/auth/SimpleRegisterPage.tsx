import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message, Typography, Card, Steps } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

const { Title, Text, Link } = Typography;
const { Step } = Steps;

// 样式化组件
const RegisterContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23fff" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="%23fff" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="%23fff" opacity="0.2"/><circle cx="10" cy="50" r="0.5" fill="%23fff" opacity="0.2"/><circle cx="90" cy="30" r="0.5" fill="%23fff" opacity="0.2"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
  }
`;

const RegisterCard = styled(Card)`
  width: 100%;
  max-width: 500px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  position: relative;
  z-index: 1;

  .ant-card-body {
    padding: 40px 32px;
  }
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 32px;

  .logo {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%);
    border-radius: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    color: white;
    margin-bottom: 16px;
    box-shadow: 0 8px 24px rgba(255, 107, 0, 0.3);
  }
`;

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 16px;
  }

  .ant-input-affix-wrapper {
    height: 44px;
    border-radius: 10px;
    border: 1px solid #e1e5e9;
    transition: all 0.3s ease;

    &:hover, &:focus-within {
      border-color: #FF6B00;
      box-shadow: 0 0 0 2px rgba(255, 107, 0, 0.1);
    }

    .ant-input {
      background: transparent;
      font-size: 14px;
    }
  }

  .verification-input {
    .ant-input-group-addon {
      padding: 0;
      border: none;
      background: transparent;
    }

    .ant-btn {
      height: 42px;
      border-radius: 0 10px 10px 0;
      background: linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%);
      border: none;
      color: white;
      font-weight: 500;

      &:hover {
        background: linear-gradient(135deg, #FF8C00 0%, #FF6B00 100%);
      }

      &:disabled {
        background: #f5f5f5;
        color: #999;
      }
    }
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 44px;
  border-radius: 10px;
  background: linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%);
  border: none;
  font-size: 15px;
  font-weight: 600;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 107, 0, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 0, 0.4);
    background: linear-gradient(135deg, #FF8C00 0%, #FF6B00 100%);
  }

  &:active {
    transform: translateY(0);
  }
`;

const AgreementContainer = styled.div`
  margin: 20px 0;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;

  .ant-checkbox-wrapper {
    align-items: flex-start;
    font-size: 13px;
    line-height: 1.5;
    color: #666;
  }

  .agreement-links {
    color: #FF6B00;
    text-decoration: none;

    &:hover {
      color: #FF8C00;
      text-decoration: underline;
    }
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;

  .login-text {
    color: #666;
    font-size: 14px;

    .login-link {
      color: #FF6B00;
      font-weight: 600;
      margin-left: 4px;
      transition: color 0.3s ease;

      &:hover {
        color: #FF8C00;
      }
    }
  }
`;

const SimpleRegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendVerificationCode = () => {
    message.success('验证码已发送到您的手机');
    startCountdown();
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // 模拟注册API调用
      console.log('注册数据:', values);
      await new Promise(resolve => setTimeout(resolve, 1500));

      message.success('注册成功！');
      navigate('/login');
    } catch (error) {
      message.error('注册失败，请检查信息后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <LogoContainer>
          <div className="logo">🏠</div>
          <Title level={2} style={{ margin: 0, color: '#333', fontWeight: 600 }}>
            注册万象生活
          </Title>
          <Text type="secondary">开启品质生活之旅</Text>
        </LogoContainer>

        <StyledForm
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, max: 20, message: '用户名长度为3-20个字符' },
              { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '用户名只能包含字母、数字、下划线和中文' }
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#999' }} />}
              placeholder="请输入用户名"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
            ]}
          >
            <Input
              prefix={<PhoneOutlined style={{ color: '#999' }} />}
              placeholder="请输入手机号"
              autoComplete="tel"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入正确的邮箱地址' }
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#999' }} />}
              placeholder="请输入邮箱"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="verificationCode"
            label="验证码"
            rules={[
              { required: true, message: '请输入验证码' },
              { len: 6, message: '验证码为6位数字' }
            ]}
          >
            <Input
              className="verification-input"
              prefix={<span style={{ color: '#999' }}>🔢</span>}
              placeholder="请输入验证码"
              addonAfter={
                <Button
                  type="link"
                  onClick={sendVerificationCode}
                  disabled={countdown > 0}
                  style={{ padding: '0 16px' }}
                >
                  {countdown > 0 ? `${countdown}s` : '获取验证码'}
                </Button>
              }
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, max: 20, message: '密码长度为6-20个字符' },
              { pattern: /^(?=.*[a-zA-Z])(?=.*\d)/, message: '密码必须包含字母和数字' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#999' }} />}
              placeholder="请输入密码"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#999' }} />}
              placeholder="请再次输入密码"
              autoComplete="new-password"
            />
          </Form.Item>

          <AgreementContainer>
            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                { required: true, message: '请阅读并同意用户协议和隐私政策' }
              ]}
              noStyle
            >
              <Checkbox>
                我已阅读并同意
                <Link href="/terms" className="agreement-links" target="_blank">
                  《用户服务协议》
                </Link>
                和
                <Link href="/privacy" className="agreement-links" target="_blank">
                  《隐私政策》
                </Link>
              </Checkbox>
            </Form.Item>
          </AgreementContainer>

          <Form.Item>
            <StyledButton type="primary" htmlType="submit" loading={loading}>
              {loading ? '注册中...' : '立即注册'}
            </StyledButton>
          </Form.Item>
        </StyledForm>

        <LoginLink>
          <span className="login-text">
            已有账号？
            <Link href="/login" className="login-link">
              立即登录
            </Link>
          </span>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default SimpleRegisterPage;