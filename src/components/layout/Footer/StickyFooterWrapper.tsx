/**
 * Sticky Footer Wrapper
 * 确保页脚始终在页面底部，无论内容多少
 */

import React from 'react';
import styled from '@emotion/styled';

const StickyFooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

interface StickyFooterWrapperProps {
  children: React.ReactNode;
  footer: React.ReactNode;
}

const StickyFooterWrapper: React.FC<StickyFooterWrapperProps> = ({
  children,
  footer,
}) => {
  return (
    <StickyFooterContainer>
      <MainContent>{children}</MainContent>
      {footer}
    </StickyFooterContainer>
  );
};

export default StickyFooterWrapper;