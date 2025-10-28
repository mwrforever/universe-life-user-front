import React, { useState } from 'react';
import { Form, Input, Button, message, Typography, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import AnimatedBackground from '@/components/Background/AnimatedBackground';

const { Title, Text, Link } = Typography;

// 定义表单数据类型
interface RegisterInfoFormData {
  username: string;
  nickname: string;
  password: string;
  confirmPassword: string;
}

// 样式化组件 - 与登录页面保持一致
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
  max-width: 420px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  position: relative;
  z-index: 1;

  .ant-card-body {
    padding: 32px 28px;
  }
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 24px;

  .logo {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #ff6b00 0%, #ff8c00 100%);
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: white;
    margin-bottom: 12px;
    box-shadow: 0 6px 20px rgba(255, 107, 0, 0.3);
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

    &:hover,
    &:focus-within {
      border-color: #ff6b00;
      box-shadow: 0 0 0 2px rgba(255, 107, 0, 0.1);
    }

    .ant-input {
      background: transparent;
      font-size: 14px;
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

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: #666;
  font-size: 13px;
  margin-bottom: 12px;
  transition: color 0.3s ease;

  &:hover {
    color: #ff6b00;
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;

  .login-text {
    color: #666;
    font-size: 13px;

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

const RegisterInfoPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 获取第一步传递的数据
  const { phone, verificationCode } = location.state || {};

  const onFinish = async (values: unknown) => {
    const formData = values as RegisterInfoFormData;
    setLoading(true);
    try {
      // 模拟注册API调用
      const registerData = {
        phone,
        verificationCode,
        ...formData,
      };
      console.log('最终注册数据:', registerData);
      await new Promise(resolve => setTimeout(resolve, 1500));

      message.success('注册成功！');
      navigate('/login');
    } catch {
      message.error('注册失败，请检查信息后重试');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate('/register');
  };

  const goToLogin = () => {
    navigate('/login');
  };

  // 如果没有第一步数据，重定向到注册第一步
  if (!phone || !verificationCode) {
    navigate('/register');
    return null;
  }

  return (
    <RegisterContainer>
      <AnimatedBackground />
      <RegisterCard>
        <LogoContainer>
          <div className='logo'>🏠</div>
          <Title level={2} style={{ margin: 0, color: '#333', fontWeight: 600 }}>
            完善账户信息
          </Title>
          <Text type='secondary'>手机号已验证：{phone}</Text>
        </LogoContainer>

        <BackButton href='#' onClick={goBack}>
          ← 返回上一步
        </BackButton>

        <StyledForm name='register-step2' onFinish={onFinish} layout='vertical' size='large'>
          <Form.Item
            name='username'
            label='用户名'
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, max: 20, message: '用户名长度为3-20个字符' },
              {
                pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
                message: '用户名只能包含字母、数字、下划线和中文',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#999' }} />}
              placeholder='请输入用户名'
              autoComplete='username'
            />
          </Form.Item>

          <Form.Item
            name='nickname'
            label='用户昵称'
            rules={[
              { required: true, message: '请输入用户昵称' },
              { min: 2, max: 20, message: '昵称长度为2-20个字符' },
              { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/, message: '昵称只能包含中文、字母和数字' },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#999' }} />}
              placeholder='请输入用户昵称'
              autoComplete='nickname'
            />
          </Form.Item>

          <Form.Item
            name='password'
            label='密码'
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, max: 20, message: '密码长度为6-20个字符' },
              { pattern: /^(?=.*[a-zA-Z])(?=.*\d)/, message: '密码必须包含字母和数字' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#999' }} />}
              placeholder='请输入密码'
              autoComplete='new-password'
            />
          </Form.Item>

          <Form.Item
            name='confirmPassword'
            label='确认密码'
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
              placeholder='请再次输入密码'
              autoComplete='new-password'
            />
          </Form.Item>

          <Form.Item>
            <StyledButton type='primary' htmlType='submit' loading={loading}>
              {loading ? '注册中...' : '完成注册'}
            </StyledButton>
          </Form.Item>
        </StyledForm>

        <LoginLink>
          <span className='login-text'>
            已有账号？
            <Link href='/login' className='login-link' onClick={goToLogin}>
              立即登录
            </Link>
          </span>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default RegisterInfoPage;
