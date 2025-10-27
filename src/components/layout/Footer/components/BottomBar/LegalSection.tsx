import React from 'react';
import { Typography, Space, Divider } from 'antd';
import styled from '@emotion/styled';
import type { LegalLinks } from '../../../types/component';

const { Text, Link } = Typography;

// 样式化法律信息容器
const LegalSectionContainer = styled.div`
  width: 100%;
  padding: 24px 0;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid ${({ theme }) => theme.token?.colorBorder || 'rgba(255, 255, 255, 0.1)'};

  @media (max-width: 768px) {
    padding: 20px 0;
  }

  @media (max-width: 576px) {
    padding: 16px 0;
  }

  .legal-section-content {
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

  .legal-links {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 24px;
    margin-bottom: 16px;

    @media (max-width: 768px) {
      gap: 16px;
      margin-bottom: 12px;
    }

    @media (max-width: 576px) {
      gap: 12px;
      margin-bottom: 8px;
      flex-direction: column;
      align-items: center;
    }

    .legal-link {
      color: ${({ theme }) => theme.token?.colorTextTertiary || 'rgba(255, 255, 255, 0.45)'};
      text-decoration: none;
      font-size: 13px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      padding: 4px 8px;
      border-radius: 4px;

      &:hover {
        color: ${({ theme }) => theme.token?.colorPrimary || '#1890ff'};
        background: rgba(24, 144, 255, 0.1);
      }

      &:focus-visible {
        outline: 2px solid ${({ theme }) => theme.token?.colorPrimary || '#1890ff'};
        outline-offset: 2px;
      }

      @media (max-width: 768px) {
        font-size: 12px;
        padding: 3px 6px;
      }
    }
  }

  .legal-divider {
    border-color: ${({ theme }) => theme.token?.colorBorder || 'rgba(255, 255, 255, 0.1)'};
    margin: 16px 0;

    @media (max-width: 768px) {
      margin: 12px 0;
    }

    @media (max-width: 576px) {
      margin: 8px 0;
    }
  }

  .copyright-info {
    color: ${({ theme }) => theme.token?.colorTextTertiary || 'rgba(255, 255, 255, 0.45)'};
    font-size: 12px;
    line-height: 1.5;

    @media (max-width: 768px) {
      font-size: 11px;
    }

    .copyright-text {
      margin-bottom: 8px;

      @media (max-width: 576px) {
        margin-bottom: 6px;
      }
    }

    .icp-info {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;

      @media (max-width: 576px) {
        gap: 8px;
        flex-direction: column;
        line-height: 1.4;
      }

      .icp-item {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;

        @media (max-width: 768px) {
          font-size: 10px;
        }
      }
    }
  }

  // 响应式布局调整
  @media (max-width: 576px) {
    .legal-links {
      .ant-divider-vertical {
        height: 12px;
        margin: 0 8px;
      }
    }
  }
`;

interface LegalSectionProps {
  legal: LegalLinks;
  className?: string;
}

/**
 * 万象生活底栏法律信息组件
 * 显示版权信息、ICP备案号、公安备案号等
 */
export const LegalSection: React.FC<LegalSectionProps> = ({
  legal,
  className
}) => {
  // 处理法律链接点击
  const handleLegalLinkClick = (linkType: string) => {
    console.log(`Legal link clicked: ${linkType}`);
    // 这里可以添加分析事件跟踪
  };

  // 渲染ICP备案信息
  const renderICPInfo = () => {
    const items = [];

    if (legal.icp) {
      items.push(
        <span key="icp" className="icp-item">
          <span>{legal.icp}</span>
        </span>
      );
    }

    if (legal.police) {
      items.push(
        <span key="police" className="icp-item">
          <span>{legal.police}</span>
        </span>
      );
    }

    return items;
  };

  // 渲染法律链接
  const renderLegalLinks = () => {
    const links = [];

    if (legal.privacy) {
      links.push(
        <Link
          key="privacy"
          href={legal.privacy}
          target="_blank"
          rel="noopener noreferrer"
          className="legal-link"
          onClick={() => handleLegalLinkClick('privacy')}
        >
          隐私政策
        </Link>
      );
    }

    if (legal.terms) {
      links.push(
        <Link
          key="terms"
          href={legal.terms}
          target="_blank"
          rel="noopener noreferrer"
          className="legal-link"
          onClick={() => handleLegalLinkClick('terms')}
        >
          服务条款
        </Link>
      );
    }

    if (legal.license) {
      links.push(
        <Link
          key="license"
          href={legal.license}
          target="_blank"
          rel="noopener noreferrer"
          className="legal-link"
          onClick={() => handleLegalLinkClick('license')}
        >
          营业执照
        </Link>
      );
    }

    // 如果没有法律链接，返回null
    if (links.length === 0) {
      return null;
    }

    return (
      <div className="legal-links">
        <Space split={<Divider type="vertical" className="legal-divider" />}>
          {links}
        </Space>
      </div>
    );
  };

  return (
    <LegalSectionContainer className={className}>
      <div className="legal-section-content">
        {/* 法律链接 */}
        {renderLegalLinks()}

        {/* 版权信息 */}
        <div className="copyright-info">
          {legal.copyright && (
            <div className="copyright-text">
              <Text>{legal.copyright}</Text>
            </div>
          )}

          {/* ICP备案信息 */}
          {(legal.icp || legal.police) && (
            <div className="icp-info">
              {renderICPInfo()}
            </div>
          )}
        </div>
      </div>
    </LegalSectionContainer>
  );
};

export default LegalSection;