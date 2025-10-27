import React, { useState } from 'react';
import { Typography, Modal, QRCode, Space, Tooltip } from 'antd';
import styled from '@emotion/styled';
import {
  WechatOutlined,
  GithubOutlined,
  WeiboOutlined,
  QqOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import type { SocialLink } from '../../../types/component';

const { Text } = Typography;

// 样式化社交媒体区域容器
const SocialSectionContainer = styled.div`
  width: 100%;
  padding: 32px 0;

  @media (max-width: 768px) {
    padding: 24px 0;
  }

  @media (max-width: 576px) {
    padding: 20px 0;
  }

  .social-section-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    text-align: center;

    @media (max-width: 1200px) {
      padding: 0 16px;
    }

    @media (max-width: 768px) {
      padding: 0 12px;
    }

    @media (max-width: 576px) {
      padding: 0 8px;
    }
  }

  .social-title {
    color: ${({ theme }) => theme.token?.colorText || '#ffffff'};
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;

    @media (max-width: 768px) {
      font-size: 15px;
      margin-bottom: 12px;
    }
  }

  .social-links {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      gap: 12px;
    }

    @media (max-width: 576px) {
      gap: 8px;
    }

    .social-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      color: ${({ theme }) => theme.token?.colorTextSecondary || 'rgba(255, 255, 255, 0.65)'};
      text-decoration: none;
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      font-size: 18px;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-color: ${({ theme }) => theme.token?.colorPrimary || '#1890ff'};
        color: ${({ theme }) => theme.token?.colorPrimary || '#1890ff'};
        background: rgba(24, 144, 255, 0.1);
      }

      &:active {
        transform: translateY(0);
      }

      &:focus-visible {
        outline: 2px solid ${({ theme }) => theme.token?.colorPrimary || '#1890ff'};
        outline-offset: 2px;
      }

      @media (max-width: 768px) {
        width: 40px;
        height: 40px;
        font-size: 16px;
      }

      @media (max-width: 576px) {
        width: 36px;
        height: 36px;
        font-size: 14px;
      }
    }

    .social-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .social-description {
    color: ${({ theme }) => theme.token?.colorTextTertiary || 'rgba(255, 255, 255, 0.45)'};
    font-size: 13px;
    margin-top: 12px;
    line-height: 1.4;

    @media (max-width: 768px) {
      font-size: 12px;
      margin-top: 8px;
    }
  }
`;

// 二维码模态框样式
const QRCodeModal = styled(Modal)`
  .ant-modal-content {
    background: ${({ theme }) => theme.token?.colorBgContainer || '#001529'};
    border-radius: 12px;
    overflow: hidden;
  }

  .ant-modal-header {
    background: transparent;
    border-bottom: 1px solid ${({ theme }) => theme.token?.colorBorder || 'rgba(255, 255, 255, 0.1)'};

    .ant-modal-title {
      color: ${({ theme }) => theme.token?.colorText || '#ffffff'};
    }
  }

  .ant-modal-body {
    padding: 24px;
    text-align: center;

    .qr-code-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;

      .qr-code {
        border-radius: 8px;
        overflow: hidden;
        border: 4px solid white;
      }

      .qr-description {
        color: ${({ theme }) => theme.token?.colorTextSecondary || 'rgba(255, 255, 255, 0.65)'};
        font-size: 14px;
        line-height: 1.4;
      }
    }
  }

  .ant-modal-close {
    color: ${({ theme }) => theme.token?.colorTextSecondary || 'rgba(255, 255, 255, 0.65)'};

    &:hover {
      color: ${({ theme }) => theme.token?.colorText || '#ffffff'};
    }
  }
`;

interface SocialSectionProps {
  social: SocialLink[];
  className?: string;
  onSocialClick?: (item: SocialLink) => void;
}

/**
 * 万象生活底栏社交媒体组件
 * 支持二维码弹窗、外链跳转、图标选择
 */
export const SocialSection: React.FC<SocialSectionProps> = ({
  social,
  className,
  onSocialClick
}) => {
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [currentQRCode, setCurrentQRCode] = useState<SocialLink | null>(null);

  // 图标映射
  const iconMap: Record<string, React.ReactNode> = {
    wechat: <WechatOutlined />,
    github: <GithubOutlined />,
    weibo: <WeiboOutlined />,
    qq: <QqOutlined />,
    default: <GlobalOutlined />,
  };

  // 处理社交媒体链接点击
  const handleSocialClick = (item: SocialLink) => {
    // 触发外部事件回调
    onSocialClick?.(item);

    // 发送分析事件
    if (item.analytics) {
      console.log('Analytics Event:', item.analytics);
    }

    // 如果有二维码，显示二维码弹窗
    if (item.qrCode) {
      setCurrentQRCode(item);
      setQrModalVisible(true);
    } else if (item.href) {
      // 外部链接在新窗口打开
      window.open(item.href, '_blank', 'noopener,noreferrer');
    }
  };

  // 关闭二维码弹窗
  const handleQRModalClose = () => {
    setQrModalVisible(false);
    setCurrentQRCode(null);
  };

  // 渲染社交媒体图标
  const renderSocialIcon = (item: SocialLink) => {
    const icon = item.icon ? iconMap[item.icon] || iconMap.default : iconMap.default;

    return (
      <Tooltip key={item.id} title={item.title} placement="top">
        <a
          className="social-link"
          onClick={() => handleSocialClick(item)}
          role="button"
          tabIndex={0}
          aria-label={item.description || item.title}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleSocialClick(item);
            }
          }}
        >
          <span className="social-icon">{icon}</span>
        </a>
      </Tooltip>
    );
  };

  // 如果没有社交媒体链接，返回null
  if (!social || social.length === 0) {
    return null;
  }

  return (
    <>
      <SocialSectionContainer className={className}>
        <div className="social-section-content">
          <h3 className="social-title">关注我们</h3>

          <div className="social-links" role="navigation" aria-label="社交媒体链接">
            {social.map(renderSocialIcon)}
          </div>

          <p className="social-description">
            扫码关注万象生活，获取更多优惠资讯
          </p>
        </div>
      </SocialSectionContainer>

      {/* 二维码弹窗 */}
      <QRCodeModal
        open={qrModalVisible}
        onCancel={handleQRModalClose}
        footer={null}
        title={currentQRCode?.modal?.title || currentQRCode?.title}
        width={currentQRCode?.modal?.width || 320}
        centered
      >
        {currentQRCode?.qrCode && (
          <div className="qr-code-container">
            <div className="qr-code">
              <QRCode
                value={currentQRCode.qrCode}
                size={200}
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>

            {currentQRCode.modal?.description && (
              <p className="qr-description">
                {currentQRCode.modal.description}
              </p>
            )}
          </div>
        )}
      </QRCodeModal>
    </>
  );
};

export default SocialSection;