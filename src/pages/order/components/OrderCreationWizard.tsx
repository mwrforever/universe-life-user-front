/**
 * OrderCreationWizard - 发布需求向导
 * 2步流程：填写信息 → 确认发布
 * 视窗内显示，多文件上传支持缩略图
 */

import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  InputNumber,
  Upload,
  Button,
  Row,
  Col,
  message,
} from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import {
  CheckOutlined,
  PlusOutlined,
  DeleteOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  SendOutlined,
  PlayCircleOutlined,
  SolutionOutlined,
  ReadOutlined,
  HighlightOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { ORDER_CATEGORIES } from '@/data/category-config';
import { logger } from '@/utils/logger';

const { TextArea } = Input;

// 分类图标映射
const getCategoryIcon = (categoryId: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'gaming-esports': <PlayCircleOutlined />,
    'enterprise-projects': <SolutionOutlined />,
    'academic-campus': <ReadOutlined />,
    'design-multimedia': <HighlightOutlined />,
  };
  return iconMap[categoryId] || <SolutionOutlined />;
};

// 文件类型图标
const getFileIcon = (file: UploadFile) => {
  const type = file.type || '';
  if (type.startsWith('image/')) return <FileImageOutlined style={{ fontSize: 24, color: '#52c41a' }} />;
  if (type === 'application/pdf') return <FilePdfOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />;
  if (type.includes('word') || type.includes('document')) return <FileWordOutlined style={{ fontSize: 24, color: '#1890ff' }} />;
  return <FileWordOutlined style={{ fontSize: 24, color: '#999' }} />;
};

// ==================== 样式组件 ====================

const WizardContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 100px);
  overflow: hidden;
`;

// 步骤指示器
const StepsHeader = styled.div`
  background: #fafafa;
  padding: 20px 32px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
`;

const StepsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
`;

const StepItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StepCircle = styled.div<{ active?: boolean; completed?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  
  ${props => props.completed ? `
    background: #52c41a;
    color: white;
  ` : props.active ? `
    background: #ff6000;
    color: white;
  ` : `
    background: #e8e8e8;
    color: #999;
  `}
`;

const StepTitle = styled.span<{ active?: boolean }>`
  font-size: 14px;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? '#262626' : '#999'};
`;

const StepLine = styled.div<{ completed?: boolean }>`
  width: 100px;
  height: 2px;
  margin: 0 16px;
  background: ${props => props.completed ? '#52c41a' : '#e8e8e8'};
`;

// 表单区域 - 可滚动
const FormContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '';
    width: 3px;
    height: 16px;
    background: #ff6000;
    border-radius: 2px;
  }
`;

// 分类选择 - 横向紧凑
const CategoryRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const CategoryChip = styled.div<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1.5px solid ${props => props.selected ? '#ff6000' : '#e8e8e8'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.selected ? '#fff5f0' : '#fff'};
  
  &:hover {
    border-color: #ff6000;
  }
  
  .anticon {
    font-size: 18px;
    color: ${props => props.selected ? '#ff6000' : '#8c8c8c'};
  }
  
  span {
    font-size: 14px;
    font-weight: ${props => props.selected ? '500' : '400'};
    color: ${props => props.selected ? '#ff6000' : '#666'};
  }
`;

// 表单项
const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  margin-bottom: 8px;
  
  .required { color: #ff4d4f; margin-left: 2px; }
  .optional { color: #bfbfbf; font-weight: 400; margin-left: 6px; font-size: 12px; }
`;

const StyledInput = styled(Input)`
  height: 42px;
  border-radius: 8px;
  border: 1.5px solid #e8e8e8;
  
  &:hover, &:focus {
    border-color: #ff6000;
    box-shadow: 0 0 0 2px rgba(255, 96, 0, 0.08);
  }
`;

const StyledTextArea = styled(TextArea)`
  border-radius: 8px;
  border: 1.5px solid #e8e8e8;
  
  &:hover, &:focus {
    border-color: #ff6000;
    box-shadow: 0 0 0 2px rgba(255, 96, 0, 0.08);
  }
`;

const StyledSelect = styled(Select)`
  .ant-select-selector {
    height: 42px !important;
    border-radius: 8px !important;
    border: 1.5px solid #e8e8e8 !important;
    
    .ant-select-selection-item { line-height: 40px !important; }
    .ant-select-selection-placeholder { line-height: 40px !important; }
  }
  
  &:hover .ant-select-selector,
  &.ant-select-focused .ant-select-selector {
    border-color: #ff6000 !important;
    box-shadow: 0 0 0 2px rgba(255, 96, 0, 0.08) !important;
  }
`;

const StyledInputNumber = styled(InputNumber)`
  width: 100%;
  height: 42px;
  border-radius: 8px;
  border: 1.5px solid #e8e8e8;
  
  .ant-input-number-input { height: 40px; }
  
  &:hover, &.ant-input-number-focused {
    border-color: #ff6000;
    box-shadow: 0 0 0 2px rgba(255, 96, 0, 0.08);
  }
`;

// 预算区域
const BudgetRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BudgetDivider = styled.span`
  color: #bfbfbf;
`;

// 文件上传区域
const UploadWrapper = styled.div`
  .ant-upload-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
`;

const UploadButton = styled.div`
  width: 104px;
  height: 104px;
  border: 1.5px dashed #d9d9d9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #fafafa;
  
  &:hover {
    border-color: #ff6000;
    background: #fff5f0;
  }
  
  .anticon {
    font-size: 24px;
    color: #999;
    margin-bottom: 8px;
  }
  
  span {
    font-size: 12px;
    color: #999;
  }
`;

const FilePreview = styled.div`
  width: 104px;
  height: 104px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .file-icon {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #fafafa;
    
    .file-name {
      font-size: 10px;
      color: #666;
      max-width: 90px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-top: 4px;
    }
  }
  
  .delete-btn {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(0,0,0,0.5);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
    
    .anticon { font-size: 10px; }
  }
  
  &:hover .delete-btn {
    opacity: 1;
  }
`;

const UploadHint = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 8px;
`;

// 预览区域
const PreviewCard = styled.div`
  background: #fafafa;
  border-radius: 8px;
  padding: 20px;
`;

const PreviewItem = styled.div`
  display: flex;
  margin-bottom: 16px;
  
  &:last-child { margin-bottom: 0; }
`;

const PreviewLabel = styled.span`
  width: 80px;
  color: #999;
  font-size: 13px;
  flex-shrink: 0;
`;

const PreviewValue = styled.span`
  color: #262626;
  font-size: 14px;
`;

// 底部操作栏
const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background: #fafafa;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
`;

const SecondaryBtn = styled(Button)`
  height: 40px;
  padding: 0 24px;
  border-radius: 8px;
`;

const PrimaryBtn = styled(Button)`
  height: 40px;
  padding: 0 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, #ff6000 0%, #ff8c00 100%);
  border: none;
  
  &:hover {
    background: linear-gradient(135deg, #ff8c00 0%, #ffa040 100%);
  }
`;

// ==================== 步骤定义 ====================

const STEPS = [
  { key: 'info', title: '填写需求' },
  { key: 'confirm', title: '确认发布' },
];

// 支持的文件类型
const ACCEPT_TYPES = '.jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// ==================== 主组件 ====================

interface OrderCreationWizardProps {
  initialCategory?: string;
  onSuccess?: (orderId: string) => void;
  onCancel?: () => void;
}

export const OrderCreationWizard: React.FC<OrderCreationWizardProps> = ({
  initialCategory,
  onSuccess,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || '');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budgetMin: undefined as number | undefined,
    budgetMax: undefined as number | undefined,
    budgetType: 'negotiable',
  });

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  // 文件上传前校验
  const beforeUpload = (file: File) => {
    const isValidType = /\.(jpg|jpeg|png|gif|webp|pdf|doc|docx)$/i.test(file.name);
    if (!isValidType) {
      message.error('仅支持图片(jpg/png/gif/webp)、PDF、Word文档');
      return Upload.LIST_IGNORE;
    }
    if (file.size > MAX_FILE_SIZE) {
      message.error('文件大小不能超过5MB');
      return Upload.LIST_IGNORE;
    }
    return false; // 阻止自动上传
  };

  // 文件变化处理
  const handleFileChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // 删除文件
  const handleRemoveFile = (uid: string) => {
    setFileList(prev => prev.filter(f => f.uid !== uid));
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      if (!selectedCategory) {
        message.warning('请选择服务类别');
        return;
      }
      try {
        await form.validateFields();
        const values = form.getFieldsValue();
        setFormData(values);
        setCurrentStep(1);
      } catch {
        message.warning('请完善必填信息');
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    logger.info('发布需求:', { category: selectedCategory, ...formData, files: fileList.length });
    onSuccess?.('order-' + Date.now());
  };

  // 渲染文件预览
  const renderFilePreview = (file: UploadFile) => {
    const isImage = file.type?.startsWith('image/');
    return (
      <FilePreview key={file.uid}>
        {isImage && file.thumbUrl ? (
          <img src={file.thumbUrl} alt={file.name} />
        ) : (
          <div className="file-icon">
            {getFileIcon(file)}
            <span className="file-name">{file.name}</span>
          </div>
        )}
        <div className="delete-btn" onClick={() => handleRemoveFile(file.uid)}>
          <DeleteOutlined />
        </div>
      </FilePreview>
    );
  };

  const renderStepContent = () => {
    if (currentStep === 0) {
      return (
        <Form form={form} initialValues={formData} layout="vertical">
          <SectionTitle>选择服务类别</SectionTitle>
          <CategoryRow>
            {Object.values(ORDER_CATEGORIES).map(category => (
              <CategoryChip
                key={category.id}
                selected={selectedCategory === category.id}
                onClick={() => handleCategorySelect(category.id)}
              >
                {getCategoryIcon(category.id)}
                <span>{category.name}</span>
              </CategoryChip>
            ))}
          </CategoryRow>

          <SectionTitle>需求信息</SectionTitle>
          <FormGroup>
            <FormLabel>需求标题<span className="required">*</span></FormLabel>
            <Form.Item name="title" rules={[{ required: true, message: '请输入需求标题' }]} noStyle>
              <StyledInput placeholder="简明描述您的需求" maxLength={50} showCount />
            </Form.Item>
          </FormGroup>

          <FormGroup>
            <FormLabel>详细描述<span className="required">*</span></FormLabel>
            <Form.Item name="description" rules={[{ required: true, message: '请输入详细描述' }]} noStyle>
              <StyledTextArea rows={4} placeholder="详细说明需求内容、期望效果等" maxLength={500} showCount />
            </Form.Item>
          </FormGroup>

          <Row gutter={24}>
            <Col span={16}>
              <FormGroup>
                <FormLabel>预算范围<span className="optional">(选填)</span></FormLabel>
                <BudgetRow>
                  <Form.Item name="budgetMin" noStyle>
                    <StyledInputNumber placeholder="最低" prefix="¥" min={0} style={{ flex: 1 }} />
                  </Form.Item>
                  <BudgetDivider>—</BudgetDivider>
                  <Form.Item name="budgetMax" noStyle>
                    <StyledInputNumber placeholder="最高" prefix="¥" min={0} style={{ flex: 1 }} />
                  </Form.Item>
                </BudgetRow>
              </FormGroup>
            </Col>
            <Col span={8}>
              <FormGroup>
                <FormLabel>&nbsp;</FormLabel>
                <Form.Item name="budgetType" noStyle>
                  <StyledSelect style={{ width: '100%' }}>
                    <Select.Option value="fixed">固定价格</Select.Option>
                    <Select.Option value="negotiable">可协商</Select.Option>
                  </StyledSelect>
                </Form.Item>
              </FormGroup>
            </Col>
          </Row>

          <FormGroup>
            <FormLabel>相关附件<span className="optional">(选填)</span></FormLabel>
            <UploadWrapper>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {fileList.map(renderFilePreview)}
                <Upload
                  accept={ACCEPT_TYPES}
                  beforeUpload={beforeUpload}
                  onChange={handleFileChange}
                  fileList={fileList}
                  showUploadList={false}
                  multiple
                  listType="picture-card"
                >
                  <UploadButton>
                    <PlusOutlined />
                    <span>上传文件</span>
                  </UploadButton>
                </Upload>
              </div>
            </UploadWrapper>
            <UploadHint>支持jpg/png/gif/pdf/doc/docx，单个文件≤5MB</UploadHint>
          </FormGroup>
        </Form>
      );
    }

    // 确认发布步骤
    const category = Object.values(ORDER_CATEGORIES).find(c => c.id === selectedCategory);
    return (
      <>
        <SectionTitle>确认需求信息</SectionTitle>
        <PreviewCard>
          <PreviewItem>
            <PreviewLabel>服务类别</PreviewLabel>
            <PreviewValue style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#ff6000' }}>{category && getCategoryIcon(category.id)}</span>
              {category?.name}
            </PreviewValue>
          </PreviewItem>
          <PreviewItem>
            <PreviewLabel>需求标题</PreviewLabel>
            <PreviewValue>{formData.title || '-'}</PreviewValue>
          </PreviewItem>
          <PreviewItem>
            <PreviewLabel>详细描述</PreviewLabel>
            <PreviewValue style={{ lineHeight: 1.6 }}>{formData.description || '-'}</PreviewValue>
          </PreviewItem>
          <PreviewItem>
            <PreviewLabel>预算范围</PreviewLabel>
            <PreviewValue style={{ color: '#ff6000', fontWeight: 500 }}>
              {formData.budgetMin || formData.budgetMax 
                ? `¥${formData.budgetMin || 0} - ¥${formData.budgetMax || '不限'}` 
                : '面议'}
              <span style={{ color: '#999', fontWeight: 400, marginLeft: 6 }}>
                ({formData.budgetType === 'fixed' ? '固定价格' : '可协商'})
              </span>
            </PreviewValue>
          </PreviewItem>
          {fileList.length > 0 && (
            <PreviewItem>
              <PreviewLabel>附件</PreviewLabel>
              <PreviewValue>{fileList.length} 个文件</PreviewValue>
            </PreviewItem>
          )}
        </PreviewCard>
        <div style={{ 
          marginTop: 16, 
          padding: 12, 
          background: '#e6f7ff', 
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 13,
          color: '#1890ff'
        }}>
          💡 发布后，平台将为您匹配合适的服务者
        </div>
      </>
    );
  };

  return (
    <WizardContainer>
      {/* 步骤指示器 */}
      <StepsHeader>
        <StepsRow>
          {STEPS.map((step, index) => (
            <React.Fragment key={step.key}>
              {index > 0 && <StepLine completed={currentStep > index - 1} />}
              <StepItem>
                <StepCircle active={currentStep === index} completed={currentStep > index}>
                  {currentStep > index ? <CheckOutlined style={{ fontSize: 14 }} /> : index + 1}
                </StepCircle>
                <StepTitle active={currentStep === index}>{step.title}</StepTitle>
              </StepItem>
            </React.Fragment>
          ))}
        </StepsRow>
      </StepsHeader>

      {/* 表单内容 */}
      <FormContent>
        {renderStepContent()}
      </FormContent>

      {/* 底部操作栏 */}
      <ActionBar>
        <div>
          {onCancel && currentStep === 0 && (
            <SecondaryBtn onClick={onCancel}>取消</SecondaryBtn>
          )}
          {currentStep > 0 && (
            <SecondaryBtn onClick={handlePrev}>上一步</SecondaryBtn>
          )}
        </div>
        <div>
          {currentStep < STEPS.length - 1 ? (
            <PrimaryBtn type="primary" onClick={handleNext}>下一步</PrimaryBtn>
          ) : (
            <PrimaryBtn type="primary" onClick={handleSubmit} icon={<SendOutlined />}>
              立即发布
            </PrimaryBtn>
          )}
        </div>
      </ActionBar>
    </WizardContainer>
  );
};

export default OrderCreationWizard;
