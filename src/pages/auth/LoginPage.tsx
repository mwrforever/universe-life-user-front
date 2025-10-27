import React from 'react';
import AuthLayout from '@/components/Auth/AuthLayout';
import LoginForm from '@/components/Auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <AuthLayout backgroundType="login">
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;