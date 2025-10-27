import React, { useState, useCallback } from 'react';
import { Form, Input, Button, Checkbox, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { loginAsync, selectAuthLoading, selectAuthError } from '@/store/slices/authSlice';
import { validateUsername, validatePassword } from '@/utils/validation';
import AgreementModal from './AgreementModal';
import ThirdPartyLogin from './ThirdPartyLogin';

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
    margin-bottom: 20px;
  }

  .ant-form-item-explain-error {
    font-size: 12px;
    margin-top: 4px;
  }
`;

const LoginButton = styled(Button)`
  && {
    width: 100%;
    height: 48px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 8px;
    margin-top: 8px;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 20px;

  .ant-checkbox {
    padding-top: 2px;
  }

  .ant-checkbox-wrapper {
    font-size: 14px;
    line-height: 1.5;
  }
`;

const LinkContainer = styled.div`
  text-align: center;
  margin-top: 24px;
  color: #666;
  font-size: 14px;

  .ant-typography {
    color: #1890ff;

    &:hover {
      color: #40a9ff;
    }
  }
`;

const AgreementLink = styled(Link)`
  && {
    color: #1890ff;
    text-decoration: underline;
    margin: 0 2px;

    &:hover {
      color: #40a9ff;
    }
  }
`;

const LoginForm: React.FC<LoginFormProps> = ({ className }) => {
  const [form] = Form.useForm();
  const [agreementVisible, setAgreementVisible] = useState<'user' | 'privacy' | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authLoading = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);

  // 表单提交处理
  const handleSubmit = useCallback(async (values: any) => {
    const { username, password, agreement } = values;

    // 检查协议确认
    if (!agreement) {
      message.error('请阅读并同意用户协议和隐私政策');
      return;
    }

    try {
      const result = await dispatch(loginAsync({
        username,
        password
      })).unwrap();

      message.success('登录成功！');

      // 跳转到首页
      navigate('/');
    } catch (error: any) {
      console.error('登录失败:', error);
      message.error(error || '登录失败，请稍后重试');
    }
  }, [dispatch, navigate]);

  // 实时验证用户名
  const validateUsernameField = useCallback((_, value: string) => {
    if (!value) {
      return Promise.reject(new Error('请输入用户名或手机号'));
    }

    const result = validateUsername(value);
    if (!result.valid) {
      return Promise.reject(new Error(result.message));
    }

    return Promise.resolve();
  }, []);

  // 实时验证密码
  const validatePasswordField = useCallback((_, value: string) => {
    if (!value) {
      return Promise.reject(new Error('请输入密码'));
    }

    const result = validatePassword(value);
    if (!result.valid) {
      return Promise.reject(new Error(result.message));
    }

    return Promise.resolve();
  }, []);

  // 打开协议弹窗
  const showAgreement = useCallback((type: 'user' | 'privacy') => {
    setAgreementVisible(type);
  }, []);

  // 关闭协议弹窗
  const hideAgreement = useCallback(() => {
    setAgreementVisible(null);
  }, []);

  // 跳转到注册页面
  const goToRegister = useCallback(() => {
    navigate('/register');
  }, [navigate]);

  // 跳转到忘记密码页面
  const goToResetPassword = useCallback(() => {
    navigate('/reset-password');
  }, [navigate]);

  return (
    <FormContainer className={className}>
      <FormTitle>用户登录</FormTitle>

      <StyledForm
        form={form}
        onFinish={handleSubmit}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          name="username"
          label="用户名/手机号"
          rules={[{ validator: validateUsernameField }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="请输入用户名或手机号"
            size="large"
            autoComplete="username"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[{ validator: validatePasswordField }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请输入密码"
            size="large"
            autoComplete="current-password"
          />
        </Form.Item>

        <CheckboxContainer>
          <Form.Item
            name="agreement"
            valuePropName="checked"
            style={{ margin: 0, flex: 1 }}
          >
            <Checkbox>
              我已阅读并同意
              <AgreementLink onClick={() => showAgreement('user')}>
                《万象生活用户服务协议》
              </AgreementLink>
              和
              <AgreementLink onClick={() => showAgreement('privacy')}>
                《万象生活隐私政策》
              </AgreementLink>
            </Checkbox>
          </Form.Item>
        </CheckboxContainer>

        <Form.Item>
          <LoginButton
            type="primary"
            htmlType="submit"
            loading={authLoading}
          >
            登录
          </LoginButton>
        </Form.Item>
      </StyledForm>

      <LinkContainer>
        <Link onClick={goToResetPassword}>
          忘记密码？
        </Link>
      </LinkContainer>

      {/* 第三方登录 */}
      <ThirdPartyLogin type="login" />

      <LinkContainer>
        <Text>还没有账号？</Text>
        <Link onClick={goToRegister}>
          立即注册
        </Link>
      </LinkContainer>

      {/* 用户协议弹窗 */}
      <AgreementModal
        visible={agreementVisible === 'user'}
        onClose={hideAgreement}
        type="user"
      />

      {/* 隐私政策弹窗 */}
      <AgreementModal
        visible={agreementVisible === 'privacy'}
        onClose={hideAgreement}
        type="privacy"
      />
    </FormContainer>
  );
};

export default LoginForm;