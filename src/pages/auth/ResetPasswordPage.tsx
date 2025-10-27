import React from 'react';
import AuthLayout from '@/components/Auth/AuthLayout';
import ResetPasswordForm from '@/components/Auth/ResetPasswordForm';

const ResetPasswordPage: React.FC = () => {
  return (
    <AuthLayout backgroundType="reset">
      <ResetPasswordForm />
    </AuthLayout>
  );
};

export default ResetPasswordPage;