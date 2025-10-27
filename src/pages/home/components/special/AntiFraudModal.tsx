import React, { useEffect } from 'react';
import { Modal, Button, Space, Typography, Alert } from 'antd';
import { SafetyCertificateOutlined, CloseOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useLocalStorage } from '../../hooks';

const { Title, Text } = Typography;

// 样式化模态框内容
const ModalContent = styled.div`
  text-align: center;
  padding: 20px;
`;

const FraudIcon = styled.div`
  font-size: 64px;
  color: #ff4d4f;
  margin-bottom: 24px;
`;

const StepContainer = styled.div`
  margin: 24px 0;
  text-align: left;
`;

const StepItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  padding: 12px;
  background: #fff7e6;
  border-radius: 8px;
  border-left: 4px solid #fa8c16;
`;

const StepNumber = styled.div`
  width: 24px;
  height: 24px;
  background: #fa8c16;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 12px;
  flex-shrink: 0;
`;

const StepContent = styled.div`
  flex: 1;
`;

// 防骗弹窗组件属性
interface AntiFraudModalProps {
  visible?: boolean;
  onClose?: () => void;
}

// 防骗弹窗组件
export const AntiFraudModal: React.FC<AntiFraudModalProps> = ({
  visible: externalVisible,
  onClose: externalOnClose,
}) => {
  const [showModal, setShowModal] = useLocalStorage('antiFraudShown', false);
  const [visible, setVisible] = React.useState(false);

  // 检查是否首次访问
  useEffect(() => {
    if (!showModal && !externalVisible) {
      // 延迟2秒显示，给用户一些时间浏览页面
      const timer = setTimeout(() => {
        setVisible(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showModal, externalVisible]);

  const modalVisible = externalVisible ?? visible;
  const handleClose = externalOnClose ?? (() => {
    setVisible(false);
    setShowModal(true);
  });

  const fraudSteps = [
    {
      title: '平台担保交易',
      description: '所有资金通过平台担保，切勿私下转账或扫码支付',
    },
    {
      title: '确认任务完成',
      description: '收到货物或服务确认完成后，再确认收货付款',
    },
    {
      title: '保护个人信息',
      description: '不要泄露身份证、银行卡、验证码等重要信息',
    },
  ];

  return (
    <Modal
      title={
        <Space>
          <SafetyCertificateOutlined style={{ color: '#ff4d4f' }} />
          防骗安全提示
        </Space>
      }
      open={modalVisible}
      onCancel={handleClose}
      footer={[
        <Button key="close" type="primary" onClick={handleClose}>
          我已了解
        </Button>,
      ]}
      width={500}
      centered
      maskClosable={false}
    >
      <ModalContent>
        <FraudIcon>
          <SafetyCertificateOutlined />
        </FraudIcon>

        <Title level={4}>谨防诈骗，安全交易</Title>
        <Text type="secondary">
          为保障您的资金安全，请务必遵守以下防骗指南：
        </Text>

        <StepContainer>
          {fraudSteps.map((step, index) => (
            <StepItem key={index}>
              <StepNumber>{index + 1}</StepNumber>
              <StepContent>
                <Title level={5} style={{ margin: '0 0 4px 0' }}>
                  {step.title}
                </Title>
                <Text type="secondary">{step.description}</Text>
              </StepContent>
            </StepItem>
          ))}
        </StepContainer>

        <Alert
          message="遇到诈骗怎么办？"
          description="如遇可疑情况，请立即联系客服举报，我们将第一时间处理并协助您挽回损失。"
          type="warning"
          showIcon
          style={{ textAlign: 'left' }}
        />

        <div style={{ marginTop: 16 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            点击"我已了解"即表示您已阅读并同意遵守平台安全交易规则
          </Text>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default AntiFraudModal;