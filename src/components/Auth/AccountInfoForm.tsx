import React, { useState, useCallback } from 'react';
import { Form, Input, Button, Progress } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { checkUsernameAvailability } from '@/utils/mockApi';
import {
  validateUsername,
  validateNickname,
  validatePassword,
  validateConfirmPassword,
} from '@/utils/validation';

interface AccountInfoFormProps {
  className?: string;
  phone: string;
  onSubmit: (values: AccountInfoFormValues) => Promise<void>;
  loading?: boolean;
  onBackToRegister?: () => void;
}

interface AccountInfoFormValues {
  username: string;
  nickname: string;
  password: string;
  confirmPassword: string;
}

const FormContainer = styled.div`
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 40px 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1;
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

  @media (max-width: 768px) {
    max-width: 95%;
    padding: 30px 20px;
    margin: 0 10px;
  }

  @media (max-width: 480px) {
    max-width: 98%;
    padding: 25px 15px;
    margin: 0 5px;
    border-radius: 12px;
  }
`;

const FormTitle = styled.h2`
  text-align: center;
  margin-bottom: 28px;
  color: #333333;
  font-size: 24px;
  font-weight: 600;
  position: relative;

  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
    margin: 12px auto 0;
    border-radius: 2px;
  }
`;

const StyledForm = styled(Form)`
  width: 100%;

  .ant-form-item {
    margin-bottom: 20px;
  }

  .ant-input,
  .ant-input-password {
    border-radius: 8px;
    border: 1px solid #d9d9d9;
    transition: all 0.3s ease;

    &:focus,
    &.ant-input-focused {
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
  }
`;

const PasswordStrengthContainer = styled.div`
  margin-top: 8px;
`;

const PasswordStrengthLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  margin-bottom: 4px;
`;

const UsernameAvailability = styled.div<{ status?: 'checking' | 'available' | 'unavailable' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  margin-top: 4px;

  color: ${({ status }) => {
    switch (status) {
      case 'checking':
        return '#1890ff';
      case 'available':
        return '#52c41a';
      case 'unavailable':
        return '#ff4d4f';
      default:
        return 'inherit';
    }
  }};
`;

const SubmitButton = styled(Button)`
  width: 100%;
  height: 44px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border: none;
  margin-top: 10px;

  &:hover {
    background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &.ant-btn-loading {
    background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  }
`;

const BackToRegisterLink = styled.div`
  text-align: center;
  margin-top: 20px;

  span {
    color: #1890ff;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    transition: all 0.3s ease;

    &:hover {
      color: #40a9ff;
      transform: translateX(-2px);
    }
  }
`;

const AccountInfoForm: React.FC<AccountInfoFormProps> = ({
  className,
  onSubmit,
  loading = false,
  onBackToRegister,
}) => {
  const [form] = Form.useForm();
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'checking' | 'available' | 'unavailable'>();

  // 计算密码强度
  const calculatePasswordStrength = (
    password: string
  ): { score: number; level: 'weak' | 'medium' | 'strong'; text: string } => {
    let score = 0;

    // 长度检查
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // 复杂性检查
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    if (score <= 2) return { score: 33, level: 'weak', text: '弱' };
    if (score <= 4) return { score: 66, level: 'medium', text: '中' };
    return { score: 100, level: 'strong', text: '强' };
  };

  // 实时验证用户名
  const validateUsernameField = useCallback(async (_: unknown, value: string) => {
    if (!value) {
      setUsernameStatus(undefined);
      return Promise.reject(new Error('请输入用户名'));
    }

    const validation = validateUsername(value);
    if (!validation.valid) {
      setUsernameStatus('unavailable');
      return Promise.reject(new Error(validation.message));
    }

    // 检查用户名可用性
    if (validation.valid) {
      try {
        setUsernameChecking(true);
        setUsernameStatus('checking');
        const result = await checkUsernameAvailability(value);
        if (!result.available) {
          setUsernameStatus('unavailable');
          return Promise.reject(new Error('用户名已被占用'));
        }
        setUsernameStatus('available');
        return Promise.resolve();
      } catch {
        setUsernameStatus(undefined);
        return Promise.reject(new Error('检查用户名时发生错误'));
      } finally {
        setUsernameChecking(false);
      }
    }
  }, []);

  // 处理表单提交
  const handleSubmit = async (values: unknown) => {
    const formData = values as AccountInfoFormValues;
    try {
      await onSubmit(formData);
    } catch {
      console.error('提交失败');
    }
  };

  return (
    <FormContainer className={className}>
      <FormTitle>完善账户信息</FormTitle>
      <StyledForm form={form} layout='vertical' onFinish={handleSubmit} autoComplete='off'>
        <Form.Item
          label='用户名'
          name='username'
          rules={[
            { required: true, message: '请输入用户名' },
            { validator: validateUsernameField },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder='请输入用户名' size='large' />
        </Form.Item>

        {usernameStatus && (
          <UsernameAvailability status={usernameStatus}>
            {usernameChecking && <span>检查中...</span>}
            {usernameStatus === 'available' && (
              <>
                <CheckCircleOutlined />
                <span>用户名可用</span>
              </>
            )}
            {usernameStatus === 'unavailable' && (
              <>
                <ExclamationCircleOutlined />
                <span>用户名不可用</span>
              </>
            )}
          </UsernameAvailability>
        )}

        <Form.Item
          label='昵称'
          name='nickname'
          rules={[
            { required: true, message: '请输入昵称' },
            {
              validator: async (_: unknown, value: string) => {
                if (!value) return Promise.reject(new Error('请输入昵称'));
                const validation = validateNickname(value);
                if (!validation.valid) {
                  return Promise.reject(new Error(validation.message));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder='请输入昵称' size='large' />
        </Form.Item>

        <Form.Item
          label='密码'
          name='password'
          rules={[
            { required: true, message: '请输入密码' },
            {
              validator: async (_: unknown, value: string) => {
                if (!value) return Promise.reject(new Error('请输入密码'));
                const validation = validatePassword(value);
                if (!validation.valid) {
                  return Promise.reject(new Error(validation.message));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder='请输入密码' size='large' />
        </Form.Item>

        <Form.Item
          label='确认密码'
          name='confirmPassword'
          dependencies={['password']}
          rules={[
            { required: true, message: '请确认密码' },
            {
              validator: async (_: unknown, value: string) => {
                if (!value) return Promise.reject(new Error('请确认密码'));
                const password = form.getFieldValue('password');
                const validation = validateConfirmPassword(value, password);
                if (!validation.valid) {
                  return Promise.reject(new Error(validation.message));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder='请再次输入密码' size='large' />
        </Form.Item>

        <Form.Item
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.password !== currentValues.password
          }
        >
          {({ getFieldValue }) => {
            const password = getFieldValue('password');
            if (password) {
              const strength = calculatePasswordStrength(password);
              return (
                <PasswordStrengthContainer>
                  <PasswordStrengthLabel>
                    <span>密码强度：</span>
                    <span
                      style={{
                        color:
                          strength.level === 'weak'
                            ? '#ff4d4f'
                            : strength.level === 'medium'
                              ? '#faad14'
                              : '#52c41a',
                      }}
                    >
                      {strength.text}
                    </span>
                  </PasswordStrengthLabel>
                  <Progress
                    percent={strength.score}
                    strokeColor={
                      strength.level === 'weak'
                        ? '#ff4d4f'
                        : strength.level === 'medium'
                          ? '#faad14'
                          : '#52c41a'
                    }
                    showInfo={false}
                    size='small'
                  />
                </PasswordStrengthContainer>
              );
            }
            return null;
          }}
        </Form.Item>

        <SubmitButton type='primary' htmlType='submit' loading={loading}>
          完成注册
        </SubmitButton>
      </StyledForm>

      {onBackToRegister && (
        <BackToRegisterLink onClick={onBackToRegister}>
          <span>
            <RollbackOutlined />
            返回注册
          </span>
        </BackToRegisterLink>
      )}
    </FormContainer>
  );
};

export default AccountInfoForm;
