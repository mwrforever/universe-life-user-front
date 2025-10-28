import React, { useState } from 'react';
import { Form, Input, Button, message, Typography, Card, Tabs } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  PhoneOutlined,
  MailOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import AnimatedBackground from '@/components/Background/AnimatedBackground';

const { Title, Text, Link } = Typography;

// 定义表单数据类型
interface PasswordResetFormData {
  account: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PhoneResetFormData {
  phone: string;
  verificationCode: string;
  newPassword: string;
  confirmPassword: string;
}

interface EmailResetFormData {
  email: string;
  verificationCode: string;
  newPassword: string;
  confirmPassword: string;
}

// 样式化组件 - 与登录页面保持一致
const ForgotPasswordContainer = styled.div`
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

const ForgotPasswordCard = styled(Card)`
  width: 100%;
  max-width: 420px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  position: relative;
  z-index: 1;

  .ant-card-body {
    padding: 24px 20px;
  }
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 16px;

  .logo {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #ff6b00 0%, #ff8c00 100%);
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;
    margin-bottom: 10px;
    box-shadow: 0 4px 16px rgba(255, 107, 0, 0.3);
  }
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: #666;
  font-size: 12px;
  margin-bottom: 10px;
  transition: color 0.3s ease;

  &:hover {
    color: #ff6b00;
  }
`;

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 14px;
  }

  .ant-input-affix-wrapper {
    height: 40px;
    border-radius: 8px;
    border: 1px solid #e1e5e9;
    transition: all 0.3s ease;

    &:hover,
    &:focus-within {
      border-color: #ff6b00;
      box-shadow: 0 0 0 2px rgba(255, 107, 0, 0.1);
    }

    .ant-input {
      background: transparent;
      font-size: 13px;
    }
  }

  .ant-select-selector {
    height: 40px !important;
    border-radius: 8px !important;
    border: 1px solid #e1e5e9 !important;

    .ant-select-selection-item {
      line-height: 38px !important;
      font-size: 13px;
    }
  }

  .verification-input {
    .ant-input-group-addon {
      padding: 0;
      border: none;
      background: transparent;
    }

    .ant-btn {
      height: 38px;
      border-radius: 0 8px 8px 0;
      background: linear-gradient(135deg, #ff6b00 0%, #ff8c00 100%);
      border: none;
      color: white;
      font-weight: 500;
      font-size: 12px;

      &:hover {
        background: linear-gradient(135deg, #ff8c00 0%, #ff6b00 100%);
      }

      &:disabled {
        background: #f5f5f5;
        color: #999;
      }
    }
  }
`;

const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    margin-bottom: 18px;

    &::before {
      border-bottom: 1px solid #f0f0f0;
    }

    .ant-tabs-tab {
      padding: 10px 14px;
      font-weight: 500;
      font-size: 13px;
      color: #666;

      &.ant-tabs-tab-active {
        color: #ff6b00;
      }

      &:hover {
        color: #ff8c00;
      }
    }

    .ant-tabs-ink-bar {
      background: #ff6b00;
    }
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 44px;
  border-radius: 10px;
  background: linear-gradient(135deg, #ff6b00 0%, #ff8c00 100%);
  border: none;
  font-size: 15px;
  font-weight: 600;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 107, 0, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 0, 0.4);
    background: linear-gradient(135deg, #ff8c00 0%, #ff6b00 100%);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;

  .login-text {
    color: #666;
    font-size: 12px;

    .login-link {
      color: #ff6b00;
      font-weight: 600;
      margin-left: 4px;
      transition: color 0.3s ease;

      &:hover {
        color: #ff8c00;
      }
    }
  }
`;

const ForgotPasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [resetMethod, setResetMethod] = useState<'password' | 'phone' | 'email'>('password');
  const navigate = useNavigate();

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendVerificationCode = (type: 'phone' | 'email') => {
    message.success(`${type === 'phone' ? '手机' : '邮箱'}验证码已发送`);
    startCountdown();
  };

  const onPasswordReset = async (values: unknown) => {
    const formData = values as PasswordResetFormData;
    setLoading(true);
    try {
      console.log('原密码重置数据:', formData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      message.success('密码重置成功！请使用新密码登录');
      navigate('/login');
    } catch {
      message.error('重置失败，请检查信息后重试');
    } finally {
      setLoading(false);
    }
  };

  const onPhoneReset = async (values: unknown) => {
    const formData = values as PhoneResetFormData;
    setLoading(true);
    try {
      console.log('手机验证码重置数据:', formData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      message.success('验证码验证成功！请设置新密码');
    } catch {
      message.error('验证失败，请检查信息后重试');
    } finally {
      setLoading(false);
    }
  };

  const onEmailReset = async (values: unknown) => {
    const formData = values as EmailResetFormData;
    setLoading(true);
    try {
      console.log('邮箱验证码重置数据:', formData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      message.success('验证码验证成功！请设置新密码');
    } catch {
      message.error('验证失败，请检查信息后重试');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate('/login');
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <ForgotPasswordContainer>
      <AnimatedBackground />
      <ForgotPasswordCard>
        <LogoContainer>
          <div className='logo'>🔐</div>
          <Title level={2} style={{ margin: 0, color: '#333', fontWeight: 600 }}>
            忘记密码
          </Title>
          <Text type='secondary'>选择一种方式重置您的密码</Text>
        </LogoContainer>

        <BackButton href='#' onClick={goBack}>
          <ArrowLeftOutlined /> 返回登录
        </BackButton>

        <StyledTabs activeKey={resetMethod} onChange={key => setResetMethod(key as 'password' | 'phone' | 'email')}>
          <Tabs.TabPane tab='原密码验证' key='password'>
            <StyledForm
              name='password-reset'
              onFinish={onPasswordReset}
              layout='vertical'
              size='large'
            >
              <Form.Item
                name='account'
                label='账号'
                rules={[
                  { required: true, message: '请输入账号' },
                  { min: 3, message: '账号至少3个字符' },
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#999' }} />}
                  placeholder='请输入用户名、手机号或邮箱'
                  autoComplete='username'
                />
              </Form.Item>

              <Form.Item
                name='oldPassword'
                label='原密码'
                rules={[
                  { required: true, message: '请输入原密码' },
                  { min: 6, message: '密码至少6个字符' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#999' }} />}
                  placeholder='请输入原密码'
                  autoComplete='current-password'
                />
              </Form.Item>

              <Form.Item
                name='newPassword'
                label='新密码'
                rules={[
                  { required: true, message: '请输入新密码' },
                  { min: 6, max: 20, message: '密码长度为6-20个字符' },
                  { pattern: /^(?=.*[a-zA-Z])(?=.*\d)/, message: '密码必须包含字母和数字' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#999' }} />}
                  placeholder='请输入新密码'
                  autoComplete='new-password'
                />
              </Form.Item>

              <Form.Item
                name='confirmPassword'
                label='确认新密码'
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: '请确认新密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#999' }} />}
                  placeholder='请再次输入新密码'
                  autoComplete='new-password'
                />
              </Form.Item>

              <Form.Item>
                <StyledButton type='primary' htmlType='submit' loading={loading}>
                  {loading ? '重置中...' : '重置密码'}
                </StyledButton>
              </Form.Item>
            </StyledForm>
          </Tabs.TabPane>

          <Tabs.TabPane tab='手机验证码' key='phone'>
            <StyledForm name='phone-reset' onFinish={onPhoneReset} layout='vertical' size='large'>
              <Form.Item
                name='phone'
                label='手机号'
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined style={{ color: '#999' }} />}
                  placeholder='请输入手机号'
                  autoComplete='tel'
                />
              </Form.Item>

              <Form.Item
                name='verificationCode'
                label='验证码'
                rules={[
                  { required: true, message: '请输入验证码' },
                  { len: 6, message: '验证码为6位数字' },
                ]}
              >
                <Input
                  className='verification-input'
                  prefix={<span style={{ color: '#999' }}>🔢</span>}
                  placeholder='请输入验证码'
                  addonAfter={
                    <Button
                      type='link'
                      onClick={() => sendVerificationCode('phone')}
                      disabled={countdown > 0}
                      style={{ padding: '0 16px' }}
                    >
                      {countdown > 0 ? `${countdown}s` : '获取验证码'}
                    </Button>
                  }
                />
              </Form.Item>

              <Form.Item
                name='newPassword'
                label='新密码'
                rules={[
                  { required: true, message: '请输入新密码' },
                  { min: 6, max: 20, message: '密码长度为6-20个字符' },
                  { pattern: /^(?=.*[a-zA-Z])(?=.*\d)/, message: '密码必须包含字母和数字' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#999' }} />}
                  placeholder='请输入新密码'
                  autoComplete='new-password'
                />
              </Form.Item>

              <Form.Item
                name='confirmPassword'
                label='确认新密码'
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: '请确认新密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#999' }} />}
                  placeholder='请再次输入新密码'
                  autoComplete='new-password'
                />
              </Form.Item>

              <Form.Item>
                <StyledButton type='primary' htmlType='submit' loading={loading}>
                  {loading ? '验证中...' : '验证并重置'}
                </StyledButton>
              </Form.Item>
            </StyledForm>
          </Tabs.TabPane>

          <Tabs.TabPane tab='邮箱验证码' key='email'>
            <StyledForm name='email-reset' onFinish={onEmailReset} layout='vertical' size='large'>
              <Form.Item
                name='email'
                label='邮箱地址'
                rules={[
                  { required: true, message: '请输入邮箱地址' },
                  { type: 'email', message: '请输入正确的邮箱地址' },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: '#999' }} />}
                  placeholder='请输入邮箱地址'
                  autoComplete='email'
                />
              </Form.Item>

              <Form.Item
                name='verificationCode'
                label='验证码'
                rules={[
                  { required: true, message: '请输入验证码' },
                  { len: 6, message: '验证码为6位数字' },
                ]}
              >
                <Input
                  className='verification-input'
                  prefix={<span style={{ color: '#999' }}>🔢</span>}
                  placeholder='请输入邮箱验证码'
                  addonAfter={
                    <Button
                      type='link'
                      onClick={() => sendVerificationCode('email')}
                      disabled={countdown > 0}
                      style={{ padding: '0 16px' }}
                    >
                      {countdown > 0 ? `${countdown}s` : '获取验证码'}
                    </Button>
                  }
                />
              </Form.Item>

              <Form.Item
                name='newPassword'
                label='新密码'
                rules={[
                  { required: true, message: '请输入新密码' },
                  { min: 6, max: 20, message: '密码长度为6-20个字符' },
                  { pattern: /^(?=.*[a-zA-Z])(?=.*\d)/, message: '密码必须包含字母和数字' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#999' }} />}
                  placeholder='请输入新密码'
                  autoComplete='new-password'
                />
              </Form.Item>

              <Form.Item
                name='confirmPassword'
                label='确认新密码'
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: '请确认新密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#999' }} />}
                  placeholder='请再次输入新密码'
                  autoComplete='new-password'
                />
              </Form.Item>

              <Form.Item>
                <StyledButton type='primary' htmlType='submit' loading={loading}>
                  {loading ? '验证中...' : '验证并重置'}
                </StyledButton>
              </Form.Item>
            </StyledForm>
          </Tabs.TabPane>
        </StyledTabs>

        <LoginLink>
          <span className='login-text'>
            想起密码了？
            <Link href='/login' className='login-link' onClick={goToLogin}>
              立即登录
            </Link>
          </span>
        </LoginLink>
      </ForgotPasswordCard>
    </ForgotPasswordContainer>
  );
};

export default ForgotPasswordPage;
