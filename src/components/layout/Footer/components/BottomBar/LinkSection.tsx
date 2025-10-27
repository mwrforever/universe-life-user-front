import React from 'react';
import { Typography, Row, Col, Divider } from 'antd';
import styled from '@emotion/styled';
import type { FooterLink } from '../../../types/component';

const { Title, Link } = Typography;

// 样式化链接区域容器
const LinkSectionContainer = styled.div`
  width: 100%;
  padding: 32px 0;
  border-bottom: 1px solid ${({ theme }) => theme.token?.colorBorder || 'rgba(255, 255, 255, 0.1)'};

  @media (max-width: 768px) {
    padding: 24px 0;
  }

  @media (max-width: 576px) {
    padding: 20px 0;
  }

  .link-section-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;

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

  .link-category {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    .category-title {
      color: ${({ theme }) => theme.token?.colorText || '#ffffff'};
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;

      @media (max-width: 768px) {
        font-size: 15px;
        margin-bottom: 12px;
      }
    }

    .link-list {
      display: flex;
      flex-direction: column;
      gap: 8px;

      @media (max-width: 768px) {
        gap: 6px;
      }

      .footer-link {
        color: ${({ theme }) => theme.token?.colorTextSecondary || 'rgba(255, 255, 255, 0.65)'};
        text-decoration: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 0;
        border-radius: 4px;

        &:hover {
          color: ${({ theme }) => theme.token?.colorPrimary || '#1890ff'};
          background: rgba(24, 144, 255, 0.1);
          padding: 4px 8px;
          margin: 0 -8px;
        }

        &:focus-visible {
          outline: 2px solid ${({ theme }) => theme.token?.colorPrimary || '#1890ff'};
          outline-offset: 2px;
        }

        .link-icon {
          font-size: 14px;
          opacity: 0.7;
          transition: opacity 0.3s ease;
        }

        &:hover .link-icon {
          opacity: 1;
        }

        // 外部链接指示器
        &.external-link::after {
          content: '↗';
          font-size: 12px;
          opacity: 0.6;
          margin-left: 2px;
        }
      }
    }
  }
`;

// 链接分组接口
interface LinkGroup {
  id: string;
  title: string;
  links: FooterLink[];
}

interface LinkSectionProps {
  links: FooterLink[];
  className?: string;
  onLinkClick?: (item: FooterLink) => void;
}

/**
 * 万象生活底栏链接区域组件
 * 支持链接分组、外部链接标识、无障碍访问
 */
export const LinkSection: React.FC<LinkSectionProps> = ({
  links,
  className,
  onLinkClick
}) => {
  // 处理链接点击
  const handleLinkClick = (e: React.MouseEvent, item: FooterLink) => {
    // 触发外部事件回调
    onLinkClick?.(item);

    // 发送分析事件
    if (item.analytics) {
      console.log('Analytics Event:', item.analytics);
    }

    // 外部链接处理
    if (item.external) {
      // 已经由target和rel属性处理，这里无需额外逻辑
    }
  };

  // 对链接进行分组（可以根据实际需求修改分组逻辑）
  const linkGroups: LinkGroup[] = React.useMemo(() => {
    const groups: LinkGroup[] = [
      {
        id: 'company',
        title: '公司',
        links: []
      },
      {
        id: 'user',
        title: '用户',
        links: []
      },
      {
        id: 'legal',
        title: '法律',
        links: []
      }
    ];

    // 根据链接ID进行分组
    links.forEach(link => {
      const linkId = link.id.toLowerCase();

      if (['about', 'contact', 'license'].some(id => linkId.includes(id))) {
        groups[0].links.push(link); // 公司
      } else if (['help', 'orders', 'profile'].some(id => linkId.includes(id))) {
        groups[1].links.push(link); // 用户
      } else if (['privacy', 'terms'].some(id => linkId.includes(id))) {
        groups[2].links.push(link); // 法律
      } else {
        // 默认分到公司组
        groups[0].links.push(link);
      }
    });

    // 过滤掉空分组
    return groups.filter(group => group.links.length > 0);
  }, [links]);

  // 渲染单个链接
  const renderLink = (item: FooterLink) => {
    return (
      <Link
        key={item.id}
        href={item.href}
        target={item.target || (item.external ? '_blank' : '_self')}
        rel={item.rel || (item.external ? 'noopener noreferrer' : undefined)}
        className={`footer-link ${item.external ? 'external-link' : ''}`}
        aria-label={item.description}
        title={item.description}
        onClick={(e) => handleLinkClick(e, item)}
      >
        {item.icon && <span className="link-icon">{item.icon}</span>}
        {item.title}
      </Link>
    );
  };

  // 如果没有链接，返回null
  if (!links || links.length === 0) {
    return null;
  }

  return (
    <LinkSectionContainer className={className}>
      <div className="link-section-content">
        <Row gutter={[32, 24]}>
          {linkGroups.map((group) => (
            <Col
              key={group.id}
              xs={24}
              sm={12}
              md={8}
              lg={6}
              xl={6}
              className="link-category"
            >
              <h3 className="category-title">
                {group.title}
              </h3>
              <div className="link-list">
                {group.links.map(renderLink)}
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </LinkSectionContainer>
  );
};

export default LinkSection;