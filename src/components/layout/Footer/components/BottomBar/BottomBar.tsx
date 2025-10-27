import React from 'react';
import { Layout } from 'antd';
import styled from '@emotion/styled';
import LinkSection from './LinkSection';
import LegalSection from './LegalSection';
import SocialSection from './SocialSection';
import { useFooterConfig } from '../../config/footerConfig';
import type { BottomBarProps } from '../../../types/component';

const { Footer: AntFooter } = Layout;

// 样式化底部栏容器
const BottomBarContainer = styled(AntFooter)`
  background: ${({ theme }) => theme.token?.colorBgContainer || '#001529'};
  padding: 0;
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.token?.colorBorder || 'rgba(255, 255, 255, 0.1)'};

  .bottom-bar-content {
    width: 100%;
    display: flex;
    flex-direction: column;

    // 内容区块间距调整
    .link-section-wrapper {
      border-bottom: 1px solid ${({ theme }) => theme.token?.colorBorder || 'rgba(255, 255, 255, 0.1)'};
    }

    .social-section-wrapper {
      border-bottom: 1px solid ${({ theme }) => theme.token?.colorBorder || 'rgba(255, 255, 255, 0.1)'};
    }

    // 移除底部最后一个边框
    .legal-section-wrapper {
      border-bottom: none;
    }
  }

  // 响应式调整
  @media (max-width: 768px) {
    .bottom-bar-content {
      .link-section-wrapper,
      .social-section-wrapper {
        border-bottom-width: 1px;
      }
    }
  }

  @media (max-width: 576px) {
    .bottom-bar-content {
      .link-section-wrapper,
      .social-section-wrapper {
        border-bottom-width: 1px;
      }
    }
  }

  // 滚动时的视觉效果
  @media (prefers-reduced-motion: no-preference) {
    .bottom-bar-content {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }
`;

interface BottomBarProps {
  links?: BottomBarProps['links'];
  legal?: BottomBarProps['legal'];
  social?: BottomBarProps['social'];
  className?: string;
  onLinkClick?: (item: any) => void;
  onSocialClick?: (item: any) => void;
}

/**
 * 万象生活底栏底部栏组件
 * 包含友情链接、法律信息、社交媒体
 */
export const BottomBar: React.FC<BottomBarProps> = ({
  links,
  legal,
  social,
  className,
  onLinkClick,
  onSocialClick
}) => {
  // 获取默认配置
  const defaultConfig = useFooterConfig();

  // 合并配置
  const finalLinks = links || defaultConfig.bottomBar.links;
  const finalLegal = legal || defaultConfig.bottomBar.legal;
  const finalSocial = social || defaultConfig.bottomBar.social;

  return (
    <BottomBarContainer
      className={`bottom-bar ${className || ''}`}
      role="contentinfo"
      aria-label="网站底部信息"
    >
      <div className="bottom-bar-content">
        {/* 友情链接区域 */}
        {finalLinks && finalLinks.length > 0 && (
          <div className="link-section-wrapper">
            <LinkSection
              links={finalLinks}
              onLinkClick={onLinkClick}
            />
          </div>
        )}

        {/* 社交媒体区域 */}
        {finalSocial && finalSocial.length > 0 && (
          <div className="social-section-wrapper">
            <SocialSection
              social={finalSocial}
              onSocialClick={onSocialClick}
            />
          </div>
        )}

        {/* 法律信息区域 */}
        {finalLegal && (
          <div className="legal-section-wrapper">
            <LegalSection legal={finalLegal} />
          </div>
        )}
      </div>
    </BottomBarContainer>
  );
};

export default BottomBar;