import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Button, message, Typography, Tabs } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { resetPasswordByPhone, resetPasswordByCurrentPassword } from '@/utils/mockApi';
import {
  validatePassword,
  validateConfirmPassword,
  validateCurrentPassword,
  validatePhone,
  validateVerificationCode
} from '@/utils/validation';
import VerificationCodeInput from './VerificationCodeInput';

const { Title, Text, Link } = Typography;

interface ResetPasswordFormProps {
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
    margin-bottom: 24px;
    color: #333;
    font-size: 24px;
    font-weight: 600;
  }
`;

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 16px;
  }

  .ant-form-item-explain-error {
    font-size: 12px;
    margin-top: 4px;
  }

  .ant-form-item-label > label {
    font-size: 14px;
    font-weight: 500;
  }
`;

const ResetButton = styled(Button)`
  && {
    width: 100%;
    height: 48px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 8px;
    margin-top: 8px;
  }
`;

const LinkContainer = styled.div`
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;

  .ant-typography {
    color: #1890ff;

    &:hover {
      color: #40a9ff;
    }
  }
`;

const TabContainer = styled.div`
  .ant-tabs-nav {
    margin-bottom: 24px;
  }

  .ant-tabs-tab {
    font-size: 15px;
    font-weight: 500;
  }
`;

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ className }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'current' | 'phone'>('current');
  const [phoneValid, setPhoneValid] = useState(false);
  const navigate = useNavigate();

  // 监听手机号变化，验证格式
  const phoneValue = Form.useWatch('phone', form);
  useEffect(() => {
    if (phoneValue) {
      const validation = validatePhone(phoneValue);
      setPhoneValid(validation.valid);
    } else {
      setPhoneValid(false);
    }
  }, [phoneValue]);

  // 切换标签时重置表单
  const handleTabChange = useCallback((key: string) => {
    setActiveTab(key as 'current' | 'phone');
    form.resetFields();
    setPhoneValid(false);
  }, [form]);

  // 通过原密码重置
  const handleSubmitByCurrentPassword = useCallback(async (values: any) => {
    const { username, currentPassword, newPassword } = values;

    setLoading(true);

    try {
      const result = await resetPasswordByCurrentPassword({
        username: username.trim(),
        currentPassword,
        newPassword
      });

      if (result.success) {
        message.success('密码修改成功！请使用新密码登录');
        navigate('/login');
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('密码修改失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // 通过手机验证码重置
  const handleSubmitByPhone = useCallback(async (values: any) => {
    const { phone, verificationCode, newPassword } = values;

    // 验证手机号格式（再次验证）
    if (!phoneValid) {
      message.error('请输入正确的手机号格式');
      return;
    }

    setLoading(true);

    try {
      const result = await resetPasswordByPhone({
        phone: phone.trim(),
        verificationCode,
        newPassword
      });

      if (result.success) {
        message.success('密码重置成功！请使用新密码登录');
        navigate('/login');
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('密码重置失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [phoneValid, navigate]);

  // 验证用户名或手机号（当前密码方式）
  const validateUserIdentifier = useCallback((_, value: string) => {
    if (!value) {
      return Promise.reject(new Error('请输入用户名或手机号'));
    }
    if (value.length < 3) {
      return Promise.reject(new Error('至少输入3个字符'));
    }
    return Promise.resolve();
  }, []);

  // 验证当前密码
  const validateCurrentPasswordField = useCallback((_, value: string) => {
    const validation = validateCurrentPassword(value);
    if (!validation.valid) {
      return Promise.reject(new Error(validation.message));
    }
    return Promise.resolve();
  }, []);

  // 验证手机号
  const validatePhoneField = useCallback((_, value: string) => {
    if (!value) {
      return Promise.reject(new Error('请输入手机号'));
    }

    const validation = validatePhone(value);
    if (!validation.valid) {
      return Promise.reject(new Error(validation.message));
    }

    return Promise.resolve();
  }, []);

  // 验证验证码
  const validateVerificationCodeField = useCallback((_, value: string) => {
    if (!value) {
      return Promise.reject(new Error('请输入验证码'));
    }

    const validation = validateVerificationCode(value);
    if (!validation.valid) {
      return Promise.reject(new Error(validation.message));
    }

    return Promise.resolve();
  }, []);

  // 验证新密码
  const validateNewPasswordField = useCallback((_, value: string) => {
    if (!value) {
      return Promise.reject(new Error('请输入新密码'));
    }

    const validation = validatePassword(value);
    if (!validation.valid) {
      return Promise.reject(new Error(validation.message));
    }

    return Promise.resolve();
  }, []);

  // 验证确认密码
  const validateConfirmPasswordField = useCallback((_, value: string) => {
    if (!value) {
      return Promise.reject(new Error('请确认新密码'));
    }

    const newPassword = form.getFieldValue('newPassword');
    const validation = validateConfirmPassword(newPassword, value);
    if (!validation.valid) {
      return Promise.reject(new Error(validation.message));
    }

    return Promise.resolve();
  }, [form]);

  // 跳转到登录页面
  const goToLogin = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  // 当前密码重置表单
  const CurrentPasswordForm = () => (
    <StyledForm
      form={form}
      onFinish={handleSubmitByCurrentPassword}
      autoComplete="off"
      layout="vertical"
    >
      <Form.Item
        name="username"
        label="用户名/手机号"
        rules={[{ validator: validateUserIdentifier }]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="请输入用户名或手机号"
          size="large"
          autoComplete="username"
        />
      </Form.Item>

      <Form.Item
        name="currentPassword"
        label="当前密码"
        rules={[{ validator: validateCurrentPasswordField }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="请输入当前密码"
          size="large"
          autoComplete="current-password"
        />
      </Form.Item>

      <Form.Item
        name="newPassword"
        label="新密码"
        rules={[{ validator: validateNewPasswordField }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="请输入新密码（6-20个字符）"
          size="large"
          autoComplete="new-password"
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="确认新密码"
        rules={[{ validator: validateConfirmPasswordField }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="请再次输入新密码"
          size="large"
          autoComplete="new-password"
        />
      </Form.Item>

      <Form.Item>
        <ResetButton
          type="primary"
          htmlType="submit"
          loading={loading}
        >
          修改密码
        </ResetButton>
      </Form.Item>
    </StyledForm>
  );

  // 手机验证码重置表单
  const PhoneVerificationForm = () => (
    <StyledForm
      form={form}
      onFinish={handleSubmitByPhone}
      autoComplete="off"
      layout="vertical"
    >
      <Form.Item
        name="phone"
        label="手机号"
        rules={[{ validator: validatePhoneField }]}
      >
        <Input
          prefix={<PhoneOutlined />}
          placeholder="请输入注册时使用的手机号"
          size="large"
          autoComplete="tel"
        />
      </Form.Item>

      {phoneValid && (
        <Form.Item
          name="verificationCode"
          label="验证码"
          rules={[{ validator: validateVerificationCodeField }]}
        >
          <VerificationCodeInput
            phone={phoneValue}
            placeholder="请输入6位验证码"
          />
        </Form.Item>
      )}

      <Form.Item
        name="newPassword"
        label="新密码"
        rules={[{ validator: validateNewPasswordField }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="请输入新密码（6-20个字符）"
          size="large"
          autoComplete="new-password"
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="确认新密码"
        rules={[{ validator: validateConfirmPasswordField }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="请再次输入新密码"
          size="large"
          autoComplete="new-password"
        />
      </Form.Item>

      <Form.Item>
        <ResetButton
          type="primary"
          htmlType="submit"
          loading={loading}
        >
          重置密码
        </ResetButton>
      </Form.Item>
    </StyledForm>
  );

  return (
    <FormContainer className={className}>
      <FormTitle>重置密码</FormTitle>

      <TabContainer>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          centered
          items={[
            {
              key: 'current',
              label: '通过当前密码修改',
              children: <CurrentPasswordForm />,
            },
            {
              key: 'phone',
              label: '通过手机验证码重置',
              children: <PhoneVerificationForm />,
            },
          ]}
        />
      </TabContainer>

      <LinkContainer>
        <Text>想起密码了？</Text>
        <Link onClick={goToLogin}>
          返回登录
        </Link>
      </LinkContainer>
    </FormContainer>
  );
};

export default ResetPasswordForm;