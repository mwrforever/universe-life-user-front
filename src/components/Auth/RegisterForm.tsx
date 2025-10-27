import React, { useState, useCallback } from 'react';
import { Form, Input, Button, Checkbox, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Link } = Typography;

interface RegisterFormProps {
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

  .verification-input {
    .ant-input-group-addon {
      padding: 0;
      border: none;
      background: transparent;
    }

    .ant-btn {
      height: 46px;
      border-radius: 0 8px 8px 0;
      background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
      border: none;
      color: white;
      font-weight: 500;

      &:hover {
        background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%);
      }

      &:disabled {
        background: #f5f5f5;
        color: #999;
      }
    }
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
    color: #1890ff;
    text-decoration: none;

    &:hover {
      color: #40a9ff;
      text-decoration: underline;
    }
  }
`;

const LoginLinkContainer = styled.div`
  text-align: center;
  margin-top: 24px;
  color: #666;
  font-size: 14px;

  .login-link {
    color: #1890ff;
    font-weight: 500;
    margin-left: 4px;
    transition: color 0.3s ease;

    &:hover {
      color: #40a9ff;
    }
  }
`;

const RegisterForm: React.FC<RegisterFormProps> = ({ className }) => {
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const startCountdown = useCallback(() => {
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
  }, []);

  const sendVerificationCode = useCallback(() => {
    const phone = form.getFieldValue('phone');
    if (!phone) {
      message.error('请先输入手机号');
      return;
    }

    message.success('验证码已发送到您的手机');
    startCountdown();
  }, [form, startCountdown]);

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

  const validateUsername = (username: string): boolean => {
    return username.length >= 3 && username.length <= 20;
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6 && password.length <= 20;
  };

  const validatePhone = (phone: string): boolean => {
    return /^1[3-9]\d{9}$/.test(phone);
  };

  return (
    <FormContainer className={className}>
      <FormTitle>注册万象生活</FormTitle>

      <StyledForm
        form={form}
        name="register"
        onFinish={onFinish}
        autoComplete="off"
        size="large"
      >
        <Form.Item
          name="username"
          rules={[
            { required: true, message: '请输入用户名' },
            {
              validator: (_, value) => {
                if (!value || validateUsername(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('用户名长度为3-20个字符'));
              }
            },
            {
              pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
              message: '用户名只能包含字母、数字、下划线和中文'
            }
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="请输入用户名"
            autoComplete="username"
          />
        </Form.Item>

        <Form.Item
          name="phone"
          rules={[
            { required: true, message: '请输入手机号' },
            {
              validator: (_, value) => {
                if (!value || validatePhone(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('请输入正确的手机号'));
              }
            }
          ]}
        >
          <Input
            prefix={<PhoneOutlined />}
            placeholder="请输入手机号"
            autoComplete="tel"
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入正确的邮箱地址' }
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="请输入邮箱"
            autoComplete="email"
          />
        </Form.Item>

        <Form.Item
          name="verificationCode"
          rules={[
            { required: true, message: '请输入验证码' },
            { len: 6, message: '验证码为6位数字' }
          ]}
        >
          <Input
            className="verification-input"
            prefix={<span style={{ color: '#bfbfbf' }}>🔢</span>}
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
          rules={[
            { required: true, message: '请输入密码' },
            {
              validator: (_, value) => {
                if (!value || validatePassword(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('密码长度为6-20个字符'));
              }
            },
            {
              pattern: /^(?=.*[a-zA-Z])(?=.*\d)/,
              message: '密码必须包含字母和数字'
            }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请输入密码"
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
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
            prefix={<LockOutlined />}
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
          <Button type="primary" htmlType="submit" loading={loading} block>
            {loading ? '注册中...' : '立即注册'}
          </Button>
        </Form.Item>
      </StyledForm>

      <LoginLinkContainer>
        已有账号？
        <Link href="/login" className="login-link">
          立即登录
        </Link>
      </LoginLinkContainer>
    </FormContainer>
  );
};

export default RegisterForm;