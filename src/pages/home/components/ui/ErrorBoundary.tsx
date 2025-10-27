import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Result, Button } from 'antd';

// 错误边界组件属性
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// 错误边界组件状态
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// 错误边界组件
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // 可以在这里添加错误上报逻辑
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Result
          status="500"
          title="页面出现错误"
          subTitle={
            process.env.NODE_ENV === 'development'
              ? this.state.error?.message
              : "抱歉，页面出现了意外错误，请稍后重试"
          }
          extra={
            <Button type="primary" onClick={this.handleRetry}>
              重试
            </Button>
          }
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;