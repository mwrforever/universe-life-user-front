import React from 'react';
import { Modal, Typography, Button } from 'antd';
import styled from 'styled-components';

const { Title, Paragraph, Text } = Typography;

interface AgreementModalProps {
  visible: boolean;
  onClose: () => void;
  type: 'user' | 'privacy';
}

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 12px;
    overflow: hidden;
  }

  .ant-modal-header {
    background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
    border-bottom: none;
    padding: 20px 24px;

    .ant-modal-title {
      color: white;
      font-size: 18px;
      font-weight: 600;
    }
  }

  .ant-modal-body {
    padding: 24px;
    max-height: 60vh;
    overflow-y: auto;
  }

  .ant-modal-footer {
    border-top: 1px solid #f0f0f0;
    padding: 16px 24px;
  }

  /* 自定义滚动条样式 */
  .ant-modal-body::-webkit-scrollbar {
    width: 6px;
  }

  .ant-modal-body::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  .ant-modal-body::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  .ant-modal-body::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const ContentContainer = styled.div`
  line-height: 1.8;
  color: #333;
`;

const Section = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled(Title)`
  && {
    color: #1890ff;
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 600;
  }
`;

const StyledParagraph = styled(Paragraph)`
  && {
    margin-bottom: 12px;
    text-align: justify;
    font-size: 14px;
    line-height: 1.8;
  }
`;

const ListContainer = styled.ul`
  margin: 12px 0;
  padding-left: 20px;

  li {
    margin-bottom: 8px;
    font-size: 14px;
    line-height: 1.6;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const HighlightText = styled(Text)`
  && {
    color: #1890ff;
    font-weight: 500;
  }
`;

const FooterNote = styled.div`
  text-align: center;
  color: #666;
  font-size: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
`;

const AgreementModal: React.FC<AgreementModalProps> = ({
  visible,
  onClose,
  type
}) => {
  const isUserAgreement = type === 'user';

  const title = isUserAgreement ? '万象生活用户服务协议' : '万象生活隐私政策';

  const renderUserAgreement = () => (
    <ContentContainer>
      <Section>
        <StyledParagraph>
          欢迎使用万象生活平台！本协议是您与万象生活平台运营方之间关于使用万象生活平台服务的法律协议。
        </StyledParagraph>
      </Section>

      <Section>
        <SectionTitle level={4}>1. 服务说明</SectionTitle>
        <StyledParagraph>
          万象生活是一个智慧社区生活服务平台，致力于为用户提供便捷、高效的社区生活服务，包括但不限于社区通知、便民服务、邻里互动等功能。
        </StyledParagraph>
      </Section>

      <Section>
        <SectionTitle level={4}>2. 用户注册</SectionTitle>
        <StyledParagraph>
          您需要注册账户才能使用本平台的完整功能。注册时您应当提供真实、准确、完整的个人信息，并及时更新这些信息。
        </StyledParagraph>
      </Section>

      <Section>
        <SectionTitle level={4}>3. 用户行为规范</SectionTitle>
        <StyledParagraph>
          在使用本平台服务时，您承诺遵守以下行为规范：
        </StyledParagraph>
        <ListContainer>
          <li>不得利用本平台进行违法违规活动</li>
          <li>不得发布虚假、有害、侵犯他人权益的信息</li>
          <li>不得干扰或破坏本平台的正常运行</li>
          <li>尊重他人隐私，不得泄露他人个人信息</li>
          <li>遵守社区公共秩序，维护良好的网络环境</li>
        </ListContainer>
      </Section>

      <Section>
        <SectionTitle level={4}>4. 知识产权</SectionTitle>
        <StyledParagraph>
          本平台的内容和服务受知识产权法律保护。未经授权，您不得复制、修改、分发本平台的任何内容。
        </StyledParagraph>
      </Section>

      <Section>
        <SectionTitle level={4}>5. 免责声明</SectionTitle>
        <StyledParagraph>
          本平台仅提供信息中介服务，不对用户发布的内容承担法律责任。用户因使用本平台服务而产生的任何纠纷，应当通过友好协商解决。
        </StyledParagraph>
      </Section>

      <Section>
        <SectionTitle level={4}>6. 协议修改</SectionTitle>
        <StyledParagraph>
          我们保留随时修改本协议的权利。协议修改后，我们会通过适当方式通知用户。如果您继续使用本平台服务，即表示您同意修改后的协议。
        </StyledParagraph>
      </Section>

      <FooterNote>
        本协议最后更新时间：2024年1月1日
      </FooterNote>
    </ContentContainer>
  );

  const renderPrivacyPolicy = () => (
    <ContentContainer>
      <Section>
        <StyledParagraph>
          万象生活非常重视用户的隐私保护。本隐私政策说明了我们如何收集、使用、存储和保护您的个人信息。
        </StyledParagraph>
      </Section>

      <Section>
        <SectionTitle level={4}>1. 信息收集</SectionTitle>
        <StyledParagraph>
          我们可能收集以下类型的个人信息：
        </StyledParagraph>
        <ListContainer>
          <li><HighlightText>账户信息：</HighlightText>用户名、昵称、手机号等注册信息</li>
          <li><HighlightText>使用信息：</HighlightText>您使用平台服务的行为记录</li>
          <li><HighlightText>设备信息：</HighlightText>您的设备型号、操作系统等信息</li>
          <li><HighlightText>位置信息：</HighlightText>基于您的授权获取的地理位置信息</li>
        </ListContainer>
      </Section>

      <Section>
        <SectionTitle level={4}>2. 信息使用</SectionTitle>
        <StyledParagraph>
          我们使用您的个人信息用于：
        </StyledParagraph>
        <ListContainer>
          <li>提供、维护和改进我们的服务</li>
          <li>处理您的请求和交易</li>
          <li>向您发送服务相关通知</li>
          <li>个性化您的使用体验</li>
          <li>保护平台安全和防止欺诈</li>
        </ListContainer>
      </Section>

      <Section>
        <SectionTitle level={4}>3. 信息保护</SectionTitle>
        <StyledParagraph>
          我们采用行业标准的安全措施保护您的个人信息，包括但不限于加密传输、访问控制、安全审计等技术手段。
        </StyledParagraph>
      </Section>

      <Section>
        <SectionTitle level={4}>4. 信息共享</SectionTitle>
        <StyledParagraph>
          除以下情况外，我们不会向第三方共享您的个人信息：
        </StyledParagraph>
        <ListContainer>
          <li>获得您的明确同意</li>
          <li>法律法规要求或政府部门要求</li>
          <li>为保护我们的权利和安全需要</li>
          <li>与可信赖的服务提供商合作（在保密前提下）</li>
        </ListContainer>
      </Section>

      <Section>
        <SectionTitle level={4}>5. 您的权利</SectionTitle>
        <StyledParagraph>
          您有权：
        </StyledParagraph>
        <ListContainer>
          <li>访问和更新您的个人信息</li>
          <li>删除您的账户和相关信息</li>
          <li>撤回您对信息处理的同意</li>
          <li>对隐私保护问题提出投诉和建议</li>
        </ListContainer>
      </Section>

      <Section>
        <SectionTitle level={4}>6. Cookie使用</SectionTitle>
        <StyledParagraph>
          我们使用Cookie和类似技术来改善您的使用体验。您可以通过浏览器设置控制Cookie的使用。
        </StyledParagraph>
      </Section>

      <FooterNote>
        本隐私政策最后更新时间：2024年1月1日
      </FooterNote>
    </ContentContainer>
  );

  return (
    <StyledModal
      title={title}
      open={visible}
      onCancel={onClose}
      width={600}
      footer={[
        <Button key="close" type="primary" onClick={onClose}>
          我已了解
        </Button>
      ]}
    >
      {isUserAgreement ? renderUserAgreement() : renderPrivacyPolicy()}
    </StyledModal>
  );
};

export default AgreementModal;