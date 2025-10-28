import React, { useState } from 'react';
import { FloatButton, Drawer, List, Typography, Space, Divider } from 'antd';
import {
  CustomerServiceOutlined,
  MessageOutlined,
  QuestionCircleOutlined,
  PhoneOutlined,
  WechatOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const { Text, Title } = Typography;

// 样式化抽屉内容
const DrawerContent = styled.div`
  padding: 24px;
`;

const ServiceItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 12px;

  &:hover {
    background: #f5f5f5;
    transform: translateX(4px);
  }
`;

const ServiceIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #1890ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  margin-right: 16px;
  flex-shrink: 0;
`;

const ServiceInfo = styled.div`
  flex: 1;
`;

// FAQ数据
const faqData = [
  {
    id: '1',
    question: '如何发布任务？',
    answer: '点击首页的"发布任务"按钮，填写任务详情并设置赏金即可发布。',
    category: '任务发布',
  },
  {
    id: '2',
    question: '如何接单赚钱？',
    answer: '浏览任务列表，找到感兴趣的任务后点击"立即接单"，完成任务后即可获得赏金。',
    category: '任务接单',
  },
  {
    id: '3',
    question: '赏金如何提现？',
    answer: '在个人中心绑定银行卡后，可申请提现，提现将在1-3个工作日内到账。',
    category: '资金管理',
  },
  {
    id: '4',
    question: '任务纠纷如何处理？',
    answer: '如遇任务纠纷，可联系客服或申请平台仲裁，我们将根据证据进行公正处理。',
    category: '纠纷处理',
  },
  {
    id: '5',
    question: '如何保证交易安全？',
    answer: '平台采用担保交易模式，赏金先由平台保管，任务完成确认后才会支付给接单者。',
    category: '安全保障',
  },
];

// 客服组件属性
interface CustomerServiceProps {
  visible?: boolean;
  onClose?: () => void;
}

// 客服组件
export const CustomerService: React.FC<CustomerServiceProps> = ({
  visible: externalVisible,
  onClose: externalOnClose,
}) => {
  const [internalVisible, setInternalVisible] = useState(false);

  const visible = externalVisible ?? internalVisible;
  const onClose = externalOnClose ?? (() => setInternalVisible(false));

  const handleServiceClick = (type: string) => {
    switch (type) {
      case 'chat':
        // 打开在线聊天
        window.open('https://chat.example.com', '_blank');
        break;
      case 'phone':
        // 拨打客服电话
        window.location.href = 'tel:400-123-4567';
        break;
      case 'wechat':
        // 显示微信二维码
        break;
      case 'faq':
        // 显示FAQ列表
        break;
    }
  };

  const handleFAQClick = (faq: (typeof faqData)[0]) => {
    setSelectedFAQ(faq);
  };

  const serviceTypes = [
    {
      key: 'chat',
      icon: <MessageOutlined />,
      title: '在线客服',
      description: '7×24小时在线服务',
      color: '#1890ff',
    },
    {
      key: 'phone',
      icon: <PhoneOutlined />,
      title: '电话客服',
      description: '400-123-4567',
      color: '#52c41a',
    },
    {
      key: 'wechat',
      icon: <WechatOutlined />,
      title: '微信客服',
      description: '扫描二维码添加',
      color: '#52c41a',
    },
    {
      key: 'faq',
      icon: <QuestionCircleOutlined />,
      title: '帮助中心',
      description: '常见问题解答',
      color: '#fa8c16',
    },
  ];

  return (
    <>
      {/* 悬浮客服按钮 */}
      <FloatButton.Group
        trigger='click'
        type='primary'
        style={{
          right: 24,
          bottom: 24,
        }}
        icon={<CustomerServiceOutlined />}
        tooltip='客服支持'
      >
        <FloatButton icon={<MessageOutlined />} tooltip='在线客服' />
        <FloatButton icon={<PhoneOutlined />} tooltip='电话客服' />
        <FloatButton icon={<QuestionCircleOutlined />} tooltip='帮助中心' />
      </FloatButton.Group>

      {/* 客服抽屉 */}
      <Drawer title='客服支持' placement='right' onClose={onClose} open={visible} width={400}>
        <DrawerContent>
          <Space direction='vertical' style={{ width: '100%' }} size='large'>
            {/* 服务方式 */}
            <div>
              <Title level={4}>选择服务方式</Title>
              {serviceTypes.map(service => (
                <motion.div
                  key={service.key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ServiceItem onClick={() => handleServiceClick(service.key)}>
                    <ServiceIcon style={{ background: service.color }}>{service.icon}</ServiceIcon>
                    <ServiceInfo>
                      <Title level={5} style={{ margin: 0 }}>
                        {service.title}
                      </Title>
                      <Text type='secondary'>{service.description}</Text>
                    </ServiceInfo>
                  </ServiceItem>
                </motion.div>
              ))}
            </div>

            <Divider />

            {/* 常见问题 */}
            <div>
              <Title level={4}>常见问题</Title>
              <List
                dataSource={faqData}
                renderItem={item => (
                  <List.Item
                    onClick={() => handleFAQClick(item)}
                    style={{ cursor: 'pointer', padding: '12px 0' }}
                  >
                    <List.Item.Meta
                      avatar={<QuestionCircleOutlined style={{ color: '#1890ff' }} />}
                      title={item.question}
                      description={item.category}
                    />
                  </List.Item>
                )}
              />
            </div>

            {/* 工作时间 */}
            <div
              style={{
                textAlign: 'center',
                padding: '16px',
                background: '#f5f5f5',
                borderRadius: 8,
              }}
            >
              <Text strong>客服工作时间</Text>
              <br />
              <Text type='secondary'>周一至周日: 9:00-22:00</Text>
              <br />
              <Text type='secondary'>节假日正常服务</Text>
            </div>
          </Space>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CustomerService;
