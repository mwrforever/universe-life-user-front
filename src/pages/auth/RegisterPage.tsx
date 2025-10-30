import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Typography, Card } from 'antd';
import {
  PhoneOutlined,
  WechatOutlined,
  QqOutlined,
  AlipayOutlined,
  WeiboOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import TermsModal from '@/components/Legal/TermsModal';
import AnimatedBackground from '@/components/Background/AnimatedBackground';

const { Title, Text, Link } = Typography;

// 定义表单数据类型
interface RegisterFormData {
  phone: string;
  verificationCode: string;
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
    padding: 28px 24px;
  }
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;

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

  .verification-input {
    .ant-input-group-addon {
      padding: 0;
      border: none;
      background: transparent;
    }

    .ant-btn {
      height: 42px;
      border-radius: 0 10px 10px 0;
      background: linear-gradient(135deg, #ff6b00 0%, #ff8c00 100%);
      border: none;
      color: white;
      font-weight: 500;
      font-size: 13px;

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

const DividerContainer = styled.div`
  text-align: center;
  margin: 18px 0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #e1e5e9;
  }

  span {
    background: rgba(255, 255, 255, 0.95);
    padding: 0 16px;
    color: #999;
    font-size: 13px;
    position: relative;
  }
`;

// 官方第三方登录图标样式
const SocialButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 16px;

  .social-btn {
    height: 44px;
    border: 1px solid #e1e5e9;
    border-radius: 50%;
    background: white;
    color: #666;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;

    &:hover {
      border-color: #ff6b00;
      color: #ff6b00;
      background: rgba(255, 107, 0, 0.04);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 107, 0, 0.2);
    }

    .social-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }

    // 微信绿色
    &.wechat .social-icon {
      color: #07c160;
      font-size: 20px;
    }

    // QQ蓝色
    &.qq .social-icon {
      color: #12b7f5;
      font-size: 20px;
    }

    // 支付宝蓝色
    &.alipay .social-icon {
      color: #1677ff;
      font-size: 20px;
    }

    // 微博红色
    &.weibo .social-icon {
      color: #ff8200;
      font-size: 20px;
    }
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;

  .login-text {
    color: #666;
    font-size: 14px;

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

const LegalLinks = styled.div`
  text-align: center;
  margin-top: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;

  .legal-text {
    color: #666;
    font-size: 12px;
    line-height: 1.5;

    .legal-link {
      color: #ff6b00;
      text-decoration: none;
      margin: 0 2px;
      transition: color 0.3s ease;

      &:hover {
        color: #ff8c00;
        text-decoration: underline;
      }
    }
  }
`;

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [termsVisible, setTermsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'user' | 'privacy' | 'disclaimer'>('user');
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // 监听手机号变化，实时验证格式
  const phoneValue = Form.useWatch('phone', form);
  const [phoneValid, setPhoneValid] = useState(false);

  useEffect(() => {
    if (phoneValue) {
      const isValid = /^1[3-9]\d{9}$/.test(phoneValue);
      setPhoneValid(isValid);
    } else {
      setPhoneValid(false);
    }
  }, [phoneValue]);

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

  const sendVerificationCode = async () => {
    // 清除之前的消息提示
    message.destroy();

    // 获取手机号
    const phone = form.getFieldValue('phone');

    // 强制检查：如果没有手机号，直接返回
    if (!phone || phone.trim() === '') {
      message.error('请先输入手机号！');
      return;
    }

    // 检查长度
    if (phone.length !== 11) {
      message.error(`手机号必须为11位，当前输入了 ${phone.length} 位`);
      return;
    }

    // 检查格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      message.error('请输入正确的手机号格式');
      return;
    }

    // 表单验证
    try {
      await form.validateFields(['phone']);
    } catch (error) {
      message.error('请确保手机号格式正确');
      return;
    }

    // 所有验证通过，发送验证码
    try {
      // 模拟发送验证码API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      message.success('验证码已发送到您的手机');
      startCountdown();
    } catch {
      message.error('验证码发送失败，请稍后重试');
    }
  };

  const onFinish = async (values: unknown) => {
    const formData = values as RegisterFormData;
    setLoading(true);
    try {
      // 模拟验证码验证
      await new Promise(resolve => setTimeout(resolve, 1500));

      message.success('验证码验证成功！');

      // 跳转到第二步：账户信息填写
      navigate('/register/info', {
        state: {
          phone: formData.phone,
          verificationCode: formData.verificationCode,
        },
        replace: true,
      });
    } catch {
      message.error('验证失败，请检查信息后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (type: string) => {
    message.info(`${type}注册功能开发中...`);
  };

  const showTerms = (tab: 'user' | 'privacy' | 'disclaimer') => {
    setActiveTab(tab);
    setTermsVisible(true);
  };

  const closeTerms = () => {
    setTermsVisible(false);
  };

  return (
    <RegisterContainer>
      <AnimatedBackground />
      <RegisterCard>
        <LogoContainer>
          <div className='logo'>🏠</div>
          <Title level={2} style={{ margin: 0, color: '#333', fontWeight: 600 }}>
            注册万象生活
          </Title>
          <Text type='secondary'>开启品质生活之旅</Text>
        </LogoContainer>

        <StyledForm form={form} name='register-step1' onFinish={onFinish} layout='vertical' size='large'>
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
                  type='primary'
                  onClick={sendVerificationCode}
                  disabled={countdown > 0 || !phoneValid}
                  style={{
                    padding: '0 16px',
                    opacity: countdown > 0 || !phoneValid ? 0.5 : 1,
                    cursor: countdown > 0 || !phoneValid ? 'not-allowed' : 'pointer'
                  }}
                >
                  {countdown > 0 ? `${countdown}s` : '获取验证码'}
                </Button>
              }
            />
          </Form.Item>

          <Form.Item>
            <StyledButton type='primary' htmlType='submit' loading={loading}>
              {loading ? '验证中...' : '下一步'}
            </StyledButton>
          </Form.Item>
        </StyledForm>

        <DividerContainer>
          <span>或使用以下方式注册</span>
        </DividerContainer>

        <SocialButtons>
          <Button
            className='social-btn wechat'
            onClick={() => handleSocialLogin('微信')}
            title='微信注册'
          >
            <span className='social-icon'>
              <WechatOutlined />
            </span>
          </Button>

          <Button className='social-btn qq' onClick={() => handleSocialLogin('QQ')} title='QQ注册'>
            <span className='social-icon'>
              <QqOutlined />
            </span>
          </Button>

          <Button
            className='social-btn alipay'
            onClick={() => handleSocialLogin('支付宝')}
            title='支付宝注册'
          >
            <span className='social-icon'>
              <AlipayOutlined />
            </span>
          </Button>

          <Button
            className='social-btn weibo'
            onClick={() => handleSocialLogin('微博')}
            title='微博注册'
          >
            <span className='social-icon'>
              <WeiboOutlined />
            </span>
          </Button>
        </SocialButtons>

        <LoginLink>
          <span className='login-text'>
            已有账号？
            <Link href='/login' className='login-link'>
              立即登录
            </Link>
          </span>
        </LoginLink>

        <LegalLinks>
          <p className='legal-text'>
            注册即表示同意
            <Link
              href='#'
              className='legal-link'
              onClick={e => {
                e.preventDefault();
                showTerms('user');
              }}
            >
              《用户服务协议》
            </Link>
            和
            <Link
              href='#'
              className='legal-link'
              onClick={e => {
                e.preventDefault();
                showTerms('privacy');
              }}
            >
              《隐私政策》
            </Link>
            及
            <Link
              href='#'
              className='legal-link'
              onClick={e => {
                e.preventDefault();
                showTerms('disclaimer');
              }}
            >
              《平台免责声明》
            </Link>
          </p>
        </LegalLinks>
      </RegisterCard>

      <TermsModal visible={termsVisible} onClose={closeTerms} defaultActiveTab={activeTab} />
    </RegisterContainer>
  );
};

export default RegisterPage;
