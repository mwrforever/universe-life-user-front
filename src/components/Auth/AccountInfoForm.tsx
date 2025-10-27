import React, { useState, useCallback } from 'react';
import { Form, Input, Button, Progress } from 'antd';
import { UserOutlined, LockOutlined, CheckCircleOutlined, ExclamationCircleOutlined, RollbackOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { checkUsernameAvailability } from '@/utils/mockApi';
import {
  validateUsername,
  validateNickname,
  validatePassword,
  validateConfirmPassword
} from '@/utils/validation';


interface AccountInfoFormProps {
  className?: string;
  phone: string;
  onSubmit: (values: any) => Promise<void>;
  loading?: boolean;
  onBackToRegister?: () => void;
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

  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 28px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px);
    background-size: 15px 15px;
    animation: float 25s linear infinite;
  }

  @keyframes float {
    0% { transform: translate(0, 0) rotate(0deg); }
    100% { transform: translate(-30px, -30px) rotate(360deg); }
  }

  .phone-icon {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 18px;
    position: relative;
    z-index: 1;
    flex-shrink: 0;
  }

  .info-content {
    flex: 1;
    position: relative;
    z-index: 1;
    min-width: 0;

    .info-label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.85);
      margin-bottom: 4px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .phone-number {
      font-size: 16px;
      color: white;
      font-weight: 600;
      letter-spacing: 0.8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .verified-badge {
    color: rgba(255, 255, 255, 0.9);
    font-size: 18px;
    position: relative;
    z-index: 1;
    flex-shrink: 0;
  }
`;

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 24px;
  }

  .ant-form-item-label > label {
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    margin-bottom: 8px;
    height: auto;
  }

  .ant-form-item-explain-error {
    font-size: 12px;
    margin-top: 6px;
    line-height: 1.4;
  }

  .ant-input-affix-wrapper {
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    transition: all 0.3s ease;
    padding: 10px 12px;
    height: 44px;
    font-size: 14px;
    display: flex;
    align-items: center;

    &:hover {
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.05);
    }

    &.ant-input-affix-wrapper-focused {
      border-color: #1890ff;
      box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
    }

    .ant-input {
      font-size: 14px;
      padding: 0;
      text-align: left;
      line-height: 22px;
      display: flex;
      align-items: center;

      &::placeholder {
        color: #999999;
        font-size: 13px;
        opacity: 0.8;
        line-height: 22px;
        display: flex;
        align-items: center;
      }
    }

    .anticon {
      color: #666666;
      font-size: 16px;
    }
  }

  .ant-input-password {
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    transition: all 0.3s ease;
    padding: 10px 12px;
    height: 44px;
    font-size: 14px;
    display: flex;
    align-items: center;

    &:hover {
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.05);
    }

    &.ant-input-affix-wrapper-focused {
      border-color: #1890ff;
      box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
    }

    .ant-input {
      font-size: 14px;
      text-align: left;
      line-height: 22px;
      display: flex;
      align-items: center;

      &::placeholder {
        color: #999999;
        font-size: 13px;
        opacity: 0.8;
        line-height: 22px;
        display: flex;
        align-items: center;
      }
    }

    .anticon {
      color: #666666;
      font-size: 16px;
    }
  }

  .ant-input {
    border-radius: 8px;
    font-size: 14px;
    padding: 10px 12px;
    height: 44px;
    border: 1px solid #e8e8e8;
    transition: all 0.3s ease;
    text-align: left;
    line-height: 22px;
    display: flex;
    align-items: center;

    &:hover {
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.05);
    }

    &:focus {
      border-color: #1890ff;
      box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
    }

    &::placeholder {
      color: #999999;
      font-size: 13px;
      opacity: 0.8;
      line-height: 22px;
      display: flex;
      align-items: center;
    }
  }
`;

const PasswordStrengthContainer = styled.div`
  margin-top: 8px;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
`;

const PasswordStrengthLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  .label {
    font-size: 13px;
    color: #666666;
    font-weight: 500;
  }

  .strength-text {
    font-size: 13px;
    font-weight: 600;

    &.weak {
      color: #ff4d4f;
    }

    &.medium {
      color: #fa8c16;
    }

    &.strong {
      color: #52c41a;
    }
  }
`;

const UsernameAvailability = styled.div<{ status?: 'checking' | 'available' | 'unavailable' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 13px;
  padding: 6px 8px;
  border-radius: 6px;
  background: #fafafa;
  border: 1px solid #f0f0f0;

  &.checking {
    color: #1890ff;
    background: #e6f7ff;
    border-color: #91d5ff;
  }

  &.available {
    color: #52c41a;
    background: #f6ffed;
    border-color: #b7eb8f;
  }

  &.unavailable {
    color: #ff4d4f;
    background: #fff2f0;
    border-color: #ffccc7;
  }

  .icon {
    font-size: 14px;
    font-weight: 600;
  }
`;

const SubmitButton = styled(Button)`
  && {
    width: 100%;
    height: 48px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 8px;
    margin-top: 16px;
    background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
    border: none;
    color: white;
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(135deg, #40a9ff 0%, #1890ff 100%);
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
    }

    &:active {
      background: linear-gradient(135deg, #096dd9 0%, #0050b3 100%);
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
    }

    &.ant-btn-loading {
      background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
    }

    .anticon {
      font-size: 16px;
    }
  }
`;

const BackToRegisterLink = styled.div`
  text-align: center;
  margin-top: 20px;

  .back-link {
    color: #666666;
    font-size: 14px;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;

    &:hover {
      color: #1890ff;
      text-decoration: underline;
    }

    .back-icon {
      font-size: 14px;
    }
  }
`;


const AccountInfoForm: React.FC<AccountInfoFormProps> = ({
  className,
  onSubmit,
  loading = false,
  onBackToRegister
}) => {
  const [form] = Form.useForm();
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'checking' | 'available' | 'unavailable'>();

  // 计算密码强度
  const calculatePasswordStrength = (password: string): { score: number; level: 'weak' | 'medium' | 'strong'; text: string } => {
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
  const validateUsernameField = useCallback(async (_: any, value: string) => {
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
          return Promise.reject(new Error(result.message));
        } else {
          setUsernameStatus('available');
        }
      } catch (error) {
        setUsernameStatus('unavailable');
        return Promise.reject(new Error('检查用户名可用性失败'));
      } finally {
        setUsernameChecking(false);
      }
    }

    return Promise.resolve();
  }, []);

  // 实时验证昵称
  const validateNicknameField = useCallback((_ : any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('请输入昵称'));
    }

    const validation = validateNickname(value);
    if (!validation.valid) {
      return Promise.reject(new Error(validation.message));
    }

    return Promise.resolve();
  }, []);

  // 实时验证密码
  const validatePasswordField = useCallback((_ : any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('请输入密码'));
    }

    const validation = validatePassword(value);
    if (!validation.valid) {
      return Promise.reject(new Error(validation.message));
    }

    return Promise.resolve();
  }, []);

  // 实时验证确认密码
  const validateConfirmPasswordField = useCallback((_ : any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('请确认密码'));
    }

    const password = form.getFieldValue('password');
    const validation = validateConfirmPassword(password, value);
    if (!validation.valid) {
      return Promise.reject(new Error(validation.message));
    }

    return Promise.resolve();
  }, [form]);

  // 表单提交处理
  const handleSubmit = useCallback(async (values: any) => {
    try {
      await onSubmit(values);
    } catch (error) {
      // 错误处理已在父组件中完成
    }
  }, [onSubmit]);

  // 监听密码变化来更新强度显示
  const passwordValue = Form.useWatch('password', form);
  const passwordStrength = passwordValue ? calculatePasswordStrength(passwordValue) : null;

  return (
    <FormContainer className={className}>
      <FormTitle>完善账户信息</FormTitle>

      <StyledForm
        form={form}
        onFinish={handleSubmit}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ validator: validateUsernameField }]}
          validateStatus={usernameChecking ? 'validating' : undefined}
          help={
            usernameStatus === 'checking' ? '检查用户名可用性中...' :
            usernameStatus === 'available' ? (
              <UsernameAvailability status="available">
                <CheckCircleOutlined className="icon" />
                用户名可用
              </UsernameAvailability>
            ) :
            usernameStatus === 'unavailable' ? (
              <UsernameAvailability status="unavailable">
                <ExclamationCircleOutlined className="icon" />
                用户名不可用
              </UsernameAvailability>
            ) : undefined
          }
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="请输入用户名（3-20个字符，字母数字下划线）"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </Form.Item>

        <Form.Item
          name="nickname"
          label="昵称"
          rules={[{ validator: validateNicknameField }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="请输入昵称（3-20个字符）"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[{ validator: validatePasswordField }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请输入密码（6-20个字符，字母数字下划线）"
            autoComplete="new-password"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </Form.Item>

        {passwordStrength && (
          <PasswordStrengthContainer>
            <PasswordStrengthLabel>
              <span className="label">密码强度</span>
              <span className={`strength-text ${passwordStrength.level}`}>
                {passwordStrength.text}
              </span>
            </PasswordStrengthLabel>
            <Progress
              percent={passwordStrength.score}
              strokeColor={
                passwordStrength.level === 'weak' ? '#ff4d4f' :
                passwordStrength.level === 'medium' ? '#faad14' : '#52c41a'
              }
              showInfo={false}
              size="small"
            />
          </PasswordStrengthContainer>
        )}

        <Form.Item
          name="confirmPassword"
          label="确认密码"
          rules={[{ validator: validateConfirmPasswordField }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请再次输入密码"
            autoComplete="new-password"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </Form.Item>

        <Form.Item>
          <SubmitButton
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            {loading ? '注册中...' : '完成注册'}
          </SubmitButton>
        </Form.Item>

        {onBackToRegister && (
          <BackToRegisterLink>
            <span className="back-link" onClick={onBackToRegister}>
              <RollbackOutlined className="back-icon" />
              返回注册
            </span>
          </BackToRegisterLink>
        )}
      </StyledForm>
    </FormContainer>
  );
};

export default AccountInfoForm;