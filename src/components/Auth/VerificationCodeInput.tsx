import React, { useState, useEffect, useCallback } from 'react';
import { Input, Button, message } from 'antd';
import styled from 'styled-components';
import { sendVerificationCode } from '@/utils/mockApi';

interface VerificationCodeInputProps {
  value?: string;
  onChange?: (value: string) => void;
  phone: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const VerificationContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  width: 100%;
`;

const VerificationInput = styled(Input)`
  flex: 1;

  .ant-input {
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 2px;
  }
`;

const SendButton = styled(Button)`
  min-width: 120px;
  height: 40px;
  white-space: nowrap;

  &.ant-btn-loading {
    min-width: 120px;
  }
`;

const CountdownText = styled.span`
  color: #999;
  font-size: 14px;
  white-space: nowrap;
  min-width: 120px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  transition: all 0.3s ease;

  &:hover {
    background: #fafafa;
    border-color: #40a9ff;
  }
`;

const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
  value = '',
  onChange,
  phone,
  placeholder = '请输入验证码',
  disabled = false,
  className,
}) => {
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);

  // 倒计时逻辑
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (isCountingDown) {
      setIsCountingDown(false);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [countdown, isCountingDown]);

  // 发送验证码
  const handleSendCode = useCallback(async () => {
    if (!phone) {
      message.error('请先输入手机号');
      return;
    }

    // 简单验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      message.error('请输入正确的手机号格式');
      return;
    }

    if (loading || isCountingDown) {
      return;
    }

    setLoading(true);

    try {
      const result = await sendVerificationCode(phone);

      if (result.success) {
        message.success(result.message);
        // 开始60秒倒计时
        setCountdown(60);
        setIsCountingDown(true);
      } else {
        message.error(result.message);
      }
    } catch {
      message.error('发送验证码失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [phone, loading, isCountingDown]);

  // 输入变化处理
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value.replace(/\D/g, ''); // 只允许数字
      const maxLength = 6;
      const truncatedValue = inputValue.slice(0, maxLength);

      onChange?.(truncatedValue);
    },
    [onChange]
  );

  // 格式化倒计时显示
  const formatCountdown = (seconds: number): string => {
    if (seconds <= 0) return '重新发送';
    return `${seconds}秒后重发`;
  };

  const buttonDisabled = loading || isCountingDown || disabled || !phone;

  return (
    <VerificationContainer className={className}>
      <VerificationInput
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={6}
        autoComplete='off'
      />
      {isCountingDown ? (
        <CountdownText>{formatCountdown(countdown)}</CountdownText>
      ) : (
        <SendButton
          type='primary'
          onClick={handleSendCode}
          loading={loading}
          disabled={buttonDisabled}
        >
          {loading ? '发送中...' : '获取验证码'}
        </SendButton>
      )}
    </VerificationContainer>
  );
};

export default VerificationCodeInput;
