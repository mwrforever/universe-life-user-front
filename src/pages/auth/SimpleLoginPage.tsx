import React, {useState} from 'react';
import {Button, Card, Checkbox, Form, Input, message, Tabs, Typography} from 'antd';
import {
    AlipayOutlined,
    LockOutlined,
    MailOutlined,
    PhoneOutlined,
    QqOutlined,
    UserOutlined,
    WechatOutlined,
    WeiboOutlined
} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import styled from '@emotion/styled';
import TermsModal from '@/components/Legal/TermsModal';
import AnimatedBackground from '@/components/Background/AnimatedBackground';

const {Title, Text, Link} = Typography;

// 样式化组件
const LoginContainer = styled.div`
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

const LoginCard = styled(Card)`
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
        background: linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%);
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

        &:hover, &:focus-within {
            border-color: #FF6B00;
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
            background: linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%);
            border: none;
            color: white;
            font-weight: 500;
            font-size: 13px;

            &:hover {
                background: linear-gradient(135deg, #FF8C00 0%, #FF6B00 100%);
            }

            &:disabled {
                background: #f5f5f5;
                color: #999;
            }
        }
    }
`;

const StyledTabs = styled(Tabs)`
    .ant-tabs-nav {
        margin-bottom: 20px;

        &::before {
            border-bottom: 1px solid #f0f0f0;
        }

        .ant-tabs-tab {
            padding: 10px 14px;
            font-weight: 500;
            font-size: 14px;
            color: #666;

            &.ant-tabs-tab-active {
                color: #FF6B00;
            }

            &:hover {
                color: #FF8C00;
            }
        }

        .ant-tabs-ink-bar {
            background: #FF6B00;
        }
    }
`;

const StyledButton = styled(Button)`
    width: 100%;
    height: 44px;
    border-radius: 10px;
    background: linear-gradient(135deg, #FF6B00 0%, #FF8C00 100%);
    border: none;
    font-size: 15px;
    font-weight: 600;
    color: white;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(255, 107, 0, 0.3);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255, 107, 0, 0.4);
        background: linear-gradient(135deg, #FF8C00 0%, #FF6B00 100%);
    }

    &:active {
        transform: translateY(0);
    }
`;

const ActionsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .ant-checkbox-wrapper {
        color: #666;
        font-size: 13px;
    }

    .forgot-link {
        color: #FF6B00;
        font-size: 13px;
        transition: color 0.3s ease;

        &:hover {
            color: #FF8C00;
        }
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
        font-size: 12px;
        position: relative;
    }
`;

// 官方第三方登录图标样式 - 与注册页面保持一致
const SocialButtons = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 16px;

    .social-btn {
        height: 40px;
        border: 1px solid #e1e5e9;
        border-radius: 50%;
        background: white;
        color: #666;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;

        &:hover {
            border-color: #FF6B00;
            color: #FF6B00;
            background: rgba(255, 107, 0, 0.04);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 107, 0, 0.2);
        }

        .social-icon {
            width: 20px;
            height: 20px;
            border-radius: 50%;
        }

        // 微信绿色

        &.wechat .social-icon {
            color: #07C160;
            font-size: 18px;
        }

        // QQ蓝色

        &.qq .social-icon {
            color: #12B7F5;
            font-size: 18px;
        }

        // 支付宝蓝色

        &.alipay .social-icon {
            color: #1677FF;
            font-size: 18px;
        }

        // 微博红色

        &.weibo .social-icon {
            color: #FF8200;
            font-size: 18px;
        }
    }
`;

const RegisterLink = styled.div`
    text-align: center;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;

    .register-text {
        color: #666;
        font-size: 13px;

        .register-link {
            color: #FF6B00;
            font-weight: 600;
            margin-left: 4px;
            transition: color 0.3s ease;

            &:hover {
                color: #FF8C00;
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
            color: #FF6B00;
            text-decoration: none;
            margin: 0 2px;
            transition: color 0.3s ease;

            &:hover {
                color: #FF8C00;
                text-decoration: underline;
            }
        }
    }
`;

const SimpleLoginPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [termsVisible, setTermsVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<'user' | 'privacy' | 'disclaimer'>('user');
    const [loginType, setLoginType] = useState<'password' | 'phone' | 'email'>('password');
    const [countdown, setCountdown] = useState(0);
    const navigate = useNavigate();

    const startCountdown = () => {
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
    };

    const sendVerificationCode = () => {
        message.success('验证码已发送');
        startCountdown();
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            // 模拟登录API调用
            console.log('登录数据:', values);
            await new Promise(resolve => setTimeout(resolve, 1500));

            message.success('登录成功！');
            // 这里可以设置用户状态和token
            navigate('/');
        } catch (error) {
            message.error('登录失败，请检查信息后重试');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (type: string) => {
        message.info(`${type}登录功能开发中...`);
    };

    const showTerms = (tab: 'user' | 'privacy' | 'disclaimer') => {
        setActiveTab(tab);
        setTermsVisible(true);
    };

    const closeTerms = () => {
        setTermsVisible(false);
    };

    return (
        <LoginContainer>
            <AnimatedBackground/>
            <LoginCard>
                <LogoContainer>
                    <div className="logo">🏠</div>
                    <Title level={2} style={{margin: 0, color: '#333', fontWeight: 600}}>
                        万象生活
                    </Title>
                    <Text type="secondary">您身边的生活服务专家</Text>
                </LogoContainer>

                <StyledTabs activeKey={loginType} onChange={(key) => setLoginType(key as any)}>
                    <Tabs.TabPane tab="密码登录" key="password">
                        <StyledForm
                            name="password-login"
                            initialValues={{remember: true}}
                            onFinish={onFinish}
                            size="large"
                        >
                            <Form.Item
                                name="username"
                                rules={[
                                    {required: true, message: '请输入用户名、手机号或邮箱'},
                                    {min: 3, message: '用户名至少3个字符'}
                                ]}
                            >
                                <Input
                                    prefix={<UserOutlined style={{color: '#999'}}/>}
                                    placeholder="请输入用户名、手机号或邮箱"
                                    autoComplete="username"
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[
                                    {required: true, message: '请输入密码'},
                                    {min: 6, message: '密码至少6个字符'}
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined style={{color: '#999'}}/>}
                                    placeholder="请输入密码"
                                    autoComplete="current-password"
                                />
                            </Form.Item>

                            <ActionsContainer>
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>记住我</Checkbox>
                                </Form.Item>
                                <Link href="/forgot-password" className="forgot-link">
                                    忘记密码？
                                </Link>
                            </ActionsContainer>

                            <Form.Item>
                                <StyledButton type="primary" htmlType="submit" loading={loading}>
                                    {loading ? '登录中...' : '登录'}
                                </StyledButton>
                            </Form.Item>
                        </StyledForm>
                    </Tabs.TabPane>

                    <Tabs.TabPane tab="手机验证码登录" key="phone">
                        <StyledForm
                            name="phone-login"
                            onFinish={onFinish}
                            size="large"
                        >
                            <Form.Item
                                name="phone"
                                rules={[
                                    {required: true, message: '请输入手机号'},
                                    {pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号'}
                                ]}
                            >
                                <Input
                                    prefix={<PhoneOutlined style={{color: '#999'}}/>}
                                    placeholder="请输入手机号"
                                    autoComplete="tel"
                                />
                            </Form.Item>

                            <Form.Item
                                name="verificationCode"
                                rules={[
                                    {required: true, message: '请输入验证码'},
                                    {len: 6, message: '验证码为6位数字'}
                                ]}
                            >
                                <Input
                                    className="verification-input"
                                    prefix={<span style={{color: '#999'}}>🔢</span>}
                                    placeholder="请输入验证码"
                                    addonAfter={
                                        <Button
                                            type="link"
                                            onClick={sendVerificationCode}
                                            disabled={countdown > 0}
                                            style={{padding: '0 16px'}}
                                        >
                                            {countdown > 0 ? `${countdown}s` : '获取验证码'}
                                        </Button>
                                    }
                                />
                            </Form.Item>

                            <Form.Item>
                                <StyledButton type="primary" htmlType="submit" loading={loading}>
                                    {loading ? '登录中...' : '登录'}
                                </StyledButton>
                            </Form.Item>
                        </StyledForm>
                    </Tabs.TabPane>

                    <Tabs.TabPane tab="邮箱验证码登录" key="email">
                        <StyledForm
                            name="email-login"
                            onFinish={onFinish}
                            size="large"
                        >
                            <Form.Item
                                name="email"
                                rules={[
                                    {required: true, message: '请输入邮箱地址'},
                                    {type: 'email', message: '请输入正确的邮箱地址'}
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined style={{color: '#999'}}/>}
                                    placeholder="请输入邮箱地址"
                                    autoComplete="email"
                                />
                            </Form.Item>

                            <Form.Item
                                name="emailVerificationCode"
                                rules={[
                                    {required: true, message: '请输入邮箱验证码'},
                                    {len: 6, message: '验证码为6位数字'}
                                ]}
                            >
                                <Input
                                    className="verification-input"
                                    prefix={<span style={{color: '#999'}}>🔢</span>}
                                    placeholder="请输入邮箱验证码"
                                    addonAfter={
                                        <Button
                                            type="link"
                                            onClick={sendVerificationCode}
                                            disabled={countdown > 0}
                                            style={{padding: '0 16px'}}
                                        >
                                            {countdown > 0 ? `${countdown}s` : '获取验证码'}
                                        </Button>
                                    }
                                />
                            </Form.Item>

                            <Form.Item>
                                <StyledButton type="primary" htmlType="submit" loading={loading}>
                                    {loading ? '登录中...' : '登录'}
                                </StyledButton>
                            </Form.Item>
                        </StyledForm>
                    </Tabs.TabPane>
                </StyledTabs>

                <DividerContainer>
                    <span>或使用以下方式登录</span>
                </DividerContainer>

                <SocialButtons>
                    <Button
                        className="social-btn wechat"
                        onClick={() => handleSocialLogin('微信')}
                        title="微信登录"
                    >
            <span className="social-icon">
              <WechatOutlined/>
            </span>
                    </Button>

                    <Button
                        className="social-btn qq"
                        onClick={() => handleSocialLogin('QQ')}
                        title="QQ登录"
                    >
            <span className="social-icon">
              <QqOutlined/>
            </span>
                    </Button>

                    <Button
                        className="social-btn alipay"
                        onClick={() => handleSocialLogin('支付宝')}
                        title="支付宝登录"
                    >
            <span className="social-icon">
              <AlipayOutlined/>
            </span>
                    </Button>

                    <Button
                        className="social-btn weibo"
                        onClick={() => handleSocialLogin('微博')}
                        title="微博登录"
                    >
            <span className="social-icon">
              <WeiboOutlined/>
            </span>
                    </Button>
                </SocialButtons>

                <RegisterLink>
          <span className="register-text">
            还没有账号？
            <Link href="/register" className="register-link">
              立即注册
            </Link>
          </span>
                </RegisterLink>

                <LegalLinks>
                    <p className="legal-text">
                        登录即表示同意
                        <Link href="#" className="legal-link" onClick={(e) => {
                            e.preventDefault();
                            showTerms('user');
                        }}>
                            《用户服务协议》
                        </Link>
                        和
                        <Link href="#" className="legal-link" onClick={(e) => {
                            e.preventDefault();
                            showTerms('privacy');
                        }}>
                            《隐私政策》
                        </Link>
                        及
                        <Link href="#" className="legal-link" onClick={(e) => {
                            e.preventDefault();
                            showTerms('disclaimer');
                        }}>
                            《平台免责声明》
                        </Link>
                    </p>
                </LegalLinks>
            </LoginCard>

            <TermsModal
                visible={termsVisible}
                onClose={closeTerms}
                defaultActiveTab={activeTab}
            />
        </LoginContainer>
    );
};

export default SimpleLoginPage;