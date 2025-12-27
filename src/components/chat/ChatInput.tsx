/**
 * 聊天输入组件
 * 支持表情、图片、文件上传、拖拽、粘贴
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  Input,
  Popover,
  Progress,
  Tooltip,
  Modal,
} from 'antd';
import {
  SmileOutlined,
  PictureOutlined,
  FolderOutlined,
  SendOutlined,
  CloseOutlined,
  FileOutlined,
  FileImageOutlined,
  FileZipOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FilePptOutlined,
  FileTextOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';

// 文件大小限制
const FILE_SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  FILE: 10 * 1024 * 1024, // 10MB (单个文件)
  ARCHIVE: 1024 * 1024 * 1024, // 1GB
};

// 支持的压缩包格式
const ARCHIVE_EXTENSIONS = ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz', '.tar.gz', '.tar.bz2'];

// 支持的图片格式
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];

// 常用表情列表
const EMOJI_LIST = [
  // 表情
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😊',
  '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋',
  '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐',
  '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌',
  '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧',
  '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓',
  '🧐', '😕', '😟', '🙁', '😮', '😯', '😲', '😳', '🥺', '😦',
  '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞',
  // 手势
  '👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙',
  '👈', '👉', '👆', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖',
  '👏', '🙌', '🤲', '🤝', '🙏', '✍️', '💪', '🦾', '🦿', '🦵',
  // 心形
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
  '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️',
  // 其他
  '🔥', '✨', '🎉', '🎊', '🎁', '🏆', '⭐', '🌟', '💯', '✅',
  '❌', '⚠️', '🚀', '💡', '💰', '📱', '💻', '📧', '📞', '🕐',
];

// 表情分类
const EMOJI_CATEGORIES = [
  { name: '常用', emojis: EMOJI_LIST.slice(0, 30) },
  { name: '表情', emojis: EMOJI_LIST.slice(0, 80) },
  { name: '手势', emojis: EMOJI_LIST.slice(80, 110) },
  { name: '心形', emojis: EMOJI_LIST.slice(110, 130) },
  { name: '其他', emojis: EMOJI_LIST.slice(130) },
];

// 附件类型
interface Attachment {
  id: string;
  file: File;
  name: string;
  size: number;
  type: 'image' | 'archive' | 'file';
  preview?: string;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
}

interface ChatInputProps {
  onSend: (content: string, attachments: Attachment[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

// 输入区域容器
const InputAreaContainer = styled.div`
  border-top: 1px solid #f2f2f2;
  background: #fff;
`;

// 附件预览区
const AttachmentPreview = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #e0e0e0;
    border-radius: 2px;
  }
`;

// 附件项
const AttachmentItem = styled.div<{ isError?: boolean }>`
  position: relative;
  background: ${(p) => (p.isError ? '#fff2f0' : '#fafafa')};
  border: 1px solid ${(p) => (p.isError ? '#ffccc7' : '#f0f0f0')};
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 200px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(p) => (p.isError ? '#ff7875' : '#ff6000')};
    
    .delete-btn {
      opacity: 1;
    }
  }
`;

// 图片预览项
const ImagePreviewItem = styled.div<{ isError?: boolean }>`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${(p) => (p.isError ? '#ffccc7' : '#f0f0f0')};
  background: #fafafa;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    border-color: ${(p) => (p.isError ? '#ff7875' : '#ff6000')};
    
    .overlay {
      opacity: 1;
    }
  }
`;

// 图片遮罩
const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;

  .btn {
    width: 28px;
    height: 28px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #333;

    &:hover {
      background: #fff;
      color: #ff6000;
    }

    &.delete:hover {
      color: #ff4d4f;
    }
  }
`;

// 文件图标
const FileIcon = styled.div<{ color?: string }>`
  width: 32px;
  height: 32px;
  background: ${(p) => p.color || '#f5f5f5'};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .anticon {
    font-size: 16px;
    color: #fff;
  }
`;

// 文件信息
const FileInfo = styled.div`
  flex: 1;
  min-width: 0;

  .name {
    font-size: 13px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .size {
    font-size: 11px;
    color: #999;
  }

  .error {
    font-size: 11px;
    color: #ff4d4f;
  }
`;

// 删除按钮
const DeleteBtn = styled.button`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  background: #ff4d4f;
  border: 2px solid #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
  padding: 0;

  .anticon {
    font-size: 10px;
    color: #fff;
  }
`;

// 工具栏
const InputToolbar = styled.div`
  display: flex;
  gap: 4px;
  padding: 10px 16px;
  border-bottom: 1px solid #f5f5f5;
`;

// 工具按钮
const ToolButton = styled.button<{ active?: boolean }>`
  width: 36px;
  height: 36px;
  border: none;
  background: ${(p) => (p.active ? '#fff5f0' : 'transparent')};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${(p) => (p.active ? '#ff6000' : '#666')};
  transition: all 0.2s ease;
  font-size: 18px;

  &:hover {
    background: #fff5f0;
    color: #ff6000;
  }
`;

// 输入框容器
const InputContainer = styled.div<{ isDragOver?: boolean }>`
  display: flex;
  gap: 10px;
  align-items: flex-end;
  padding: 12px 16px;
  background: ${(p) => (p.isDragOver ? '#fff5f0' : '#fff')};
  border: 2px dashed ${(p) => (p.isDragOver ? '#ff6000' : 'transparent')};
  transition: all 0.2s ease;
`;

// 拖拽提示
const DragOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 96, 0, 0.05);
  border: 2px dashed #ff6000;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 10;

  .icon {
    font-size: 48px;
    color: #ff6000;
    margin-bottom: 12px;
  }

  .text {
    font-size: 14px;
    color: #ff6000;
    font-weight: 500;
  }

  .hint {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
  }
`;

// 文本输入框
const TextInput = styled(Input.TextArea)`
  flex: 1;
  border-radius: 12px;
  resize: none;
  border: 1px solid #e8e8e8;
  font-size: 14px;

  &:hover,
  &:focus {
    border-color: #ff6000;
  }
`;

// 发送按钮
const SendButton = styled.button<{ disabled?: boolean }>`
  width: 48px;
  height: 48px;
  border: none;
  background: ${(p) => (p.disabled ? '#f5f5f5' : '#ff6000')};
  color: ${(p) => (p.disabled ? '#ccc' : '#fff')};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;
  font-size: 18px;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: #e85500;
    transform: scale(1.02);
  }
`;

// 表情面板
const EmojiPanel = styled.div`
  width: 360px;
  max-height: 300px;
`;

// 表情分类标签
const EmojiTabs = styled.div`
  display: flex;
  gap: 4px;
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

// 分类标签
const EmojiTab = styled.button<{ active?: boolean }>`
  padding: 4px 10px;
  border: none;
  border-radius: 12px;
  background: ${(p) => (p.active ? '#ff6000' : '#f5f5f5')};
  color: ${(p) => (p.active ? '#fff' : '#666')};
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    background: ${(p) => (p.active ? '#e85500' : '#f0f0f0')};
  }
`;

// 表情网格
const EmojiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 4px;
  padding: 12px;
  max-height: 220px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #e0e0e0;
    border-radius: 2px;
  }
`;

// 表情项
const EmojiItem = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover {
    background: #fff5f0;
    transform: scale(1.2);
  }
`;

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 获取文件扩展名
const getFileExtension = (filename: string): string => {
  const parts = filename.toLowerCase().split('.');
  if (parts.length < 2) return '';
  // 处理 .tar.gz 等双扩展名
  if (parts.length >= 3 && parts[parts.length - 2] === 'tar') {
    return '.' + parts.slice(-2).join('.');
  }
  return '.' + parts[parts.length - 1];
};

// 判断是否为图片
const isImageFile = (filename: string): boolean => {
  const ext = getFileExtension(filename);
  return IMAGE_EXTENSIONS.includes(ext);
};

// 判断是否为压缩包
const isArchiveFile = (filename: string): boolean => {
  const ext = getFileExtension(filename);
  return ARCHIVE_EXTENSIONS.includes(ext);
};

// 获取文件图标配置
const getFileIconConfig = (filename: string): { icon: React.ReactNode; color: string } => {
  const ext = getFileExtension(filename);

  if (IMAGE_EXTENSIONS.includes(ext)) {
    return { icon: <FileImageOutlined />, color: '#52c41a' };
  }
  if (ARCHIVE_EXTENSIONS.includes(ext)) {
    return { icon: <FileZipOutlined />, color: '#722ed1' };
  }
  if (ext === '.pdf') {
    return { icon: <FilePdfOutlined />, color: '#ff4d4f' };
  }
  if (['.doc', '.docx'].includes(ext)) {
    return { icon: <FileWordOutlined />, color: '#1890ff' };
  }
  if (['.xls', '.xlsx'].includes(ext)) {
    return { icon: <FileExcelOutlined />, color: '#52c41a' };
  }
  if (['.ppt', '.pptx'].includes(ext)) {
    return { icon: <FilePptOutlined />, color: '#fa8c16' };
  }
  if (['.txt', '.md', '.json', '.xml', '.csv'].includes(ext)) {
    return { icon: <FileTextOutlined />, color: '#8c8c8c' };
  }
  return { icon: <FileOutlined />, color: '#8c8c8c' };
};

// 验证文件
const validateFile = (file: File): { valid: boolean; error?: string; type: 'image' | 'archive' | 'file' } => {
  const isImage = isImageFile(file.name);
  const isArchive = isArchiveFile(file.name);

  if (isImage) {
    if (file.size > FILE_SIZE_LIMITS.IMAGE) {
      return { valid: false, error: `图片大小不能超过 ${formatFileSize(FILE_SIZE_LIMITS.IMAGE)}`, type: 'image' };
    }
    return { valid: true, type: 'image' };
  }

  if (isArchive) {
    if (file.size > FILE_SIZE_LIMITS.ARCHIVE) {
      return { valid: false, error: `压缩包大小不能超过 ${formatFileSize(FILE_SIZE_LIMITS.ARCHIVE)}`, type: 'archive' };
    }
    return { valid: true, type: 'archive' };
  }

  if (file.size > FILE_SIZE_LIMITS.FILE) {
    return { valid: false, error: `文件大小不能超过 ${formatFileSize(FILE_SIZE_LIMITS.FILE)}`, type: 'file' };
  }
  return { valid: true, type: 'file' };
};

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
  placeholder = '输入消息...',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [emojiCategory, setEmojiCategory] = useState(0);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 生成唯一ID
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // 添加文件
  const addFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newAttachments: Attachment[] = [];

    for (const file of fileArray) {
      const validation = validateFile(file);
      

      const attachment: Attachment = {
        id: generateId(),
        file,
        name: file.name,
        size: file.size,
        type: validation.type,
        progress: 0,
        status: validation.valid ? 'pending' : 'error',
        error: validation.error,
      };

      // 生成图片预览
      if (validation.type === 'image' && validation.valid) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setAttachments((prev) =>
            prev.map((a) => (a.id === attachment.id ? { ...a, preview: e.target?.result as string } : a))
          );
        };
        reader.readAsDataURL(file);
      }

      newAttachments.push(attachment);
    }

    if (newAttachments.length > 0) {
      setAttachments((prev) => [...prev, ...newAttachments]);
    }
  }, []);

  // 删除附件
  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // 选择表情
  const handleEmojiSelect = (emoji: string) => {
    setInputValue((prev) => prev + emoji);
    setEmojiOpen(false);
    inputRef.current?.focus();
  };

  // 处理图片上传
  const handleImageUpload = () => {
    imageInputRef.current?.click();
  };

  // 处理文件上传
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  // 文件选择变化
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      addFiles(files);
    }
    e.target.value = '';
  };

  // 拖拽进入
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  // 拖拽离开
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // 检查是否真的离开了容器
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  // 拖拽悬停
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // 拖拽放下
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      addFiles(files);
    }
  };

  // 粘贴处理
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    const files: File[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }

    if (files.length > 0) {
      e.preventDefault();
      addFiles(files);
    }
  };

  // 发送消息
  const handleSend = () => {
    const validAttachments = attachments.filter((a) => a.status !== 'error');
    
    if (!inputValue.trim() && validAttachments.length === 0) {
      return;
    }

    onSend(inputValue.trim(), validAttachments);
    setInputValue('');
    setAttachments([]);
  };

  // 按键处理
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 渲染表情面板
  const renderEmojiPanel = () => (
    <EmojiPanel>
      <EmojiTabs>
        {EMOJI_CATEGORIES.map((cat, index) => (
          <EmojiTab
            key={cat.name}
            active={emojiCategory === index}
            onClick={() => setEmojiCategory(index)}
          >
            {cat.name}
          </EmojiTab>
        ))}
      </EmojiTabs>
      <EmojiGrid>
        {EMOJI_CATEGORIES[emojiCategory].emojis.map((emoji, index) => (
          <EmojiItem key={index} onClick={() => handleEmojiSelect(emoji)}>
            {emoji}
          </EmojiItem>
        ))}
      </EmojiGrid>
    </EmojiPanel>
  );

  // 渲染附件预览
  const renderAttachments = () => {
    if (attachments.length === 0) return null;

    return (
      <AttachmentPreview>
        {attachments.map((attachment) => {
          if (attachment.type === 'image' && attachment.preview) {
            return (
              <ImagePreviewItem key={attachment.id} isError={attachment.status === 'error'}>
                <img src={attachment.preview} alt={attachment.name} />
                <ImageOverlay className="overlay">
                  <div className="btn" onClick={() => setPreviewImage(attachment.preview!)}>
                    <EyeOutlined />
                  </div>
                  <div className="btn delete" onClick={() => removeAttachment(attachment.id)}>
                    <DeleteOutlined />
                  </div>
                </ImageOverlay>
                {attachment.status === 'uploading' && (
                  <Progress
                    percent={attachment.progress}
                    size="small"
                    showInfo={false}
                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
                  />
                )}
              </ImagePreviewItem>
            );
          }

          const iconConfig = getFileIconConfig(attachment.name);
          return (
            <AttachmentItem key={attachment.id} isError={attachment.status === 'error'}>
              <FileIcon color={iconConfig.color}>{iconConfig.icon}</FileIcon>
              <FileInfo>
                <div className="name" title={attachment.name}>
                  {attachment.name}
                </div>
                {attachment.status === 'error' ? (
                  <div className="error">{attachment.error}</div>
                ) : (
                  <div className="size">{formatFileSize(attachment.size)}</div>
                )}
              </FileInfo>
              <DeleteBtn className="delete-btn" onClick={() => removeAttachment(attachment.id)}>
                <CloseOutlined />
              </DeleteBtn>
              {attachment.status === 'uploading' && (
                <Progress
                  percent={attachment.progress}
                  size="small"
                  showInfo={false}
                  style={{ position: 'absolute', bottom: 0, left: 8, right: 8 }}
                />
              )}
            </AttachmentItem>
          );
        })}
      </AttachmentPreview>
    );
  };

  const hasContent = inputValue.trim() || attachments.filter((a) => a.status !== 'error').length > 0;

  return (
    <InputAreaContainer
      ref={containerRef}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ position: 'relative' }}
    >
      {/* 拖拽遮罩 */}
      {isDragOver && (
        <DragOverlay>
          <FolderOutlined className="icon" />
          <div className="text">拖放文件到这里上传</div>
          <div className="hint">支持图片、文件和压缩包</div>
        </DragOverlay>
      )}

      {/* 附件预览 */}
      {renderAttachments()}

      {/* 工具栏 */}
      <InputToolbar>
        <Popover
          content={renderEmojiPanel()}
          trigger="click"
          open={emojiOpen}
          onOpenChange={setEmojiOpen}
          placement="topLeft"
        >
          <Tooltip title="表情">
            <ToolButton active={emojiOpen}>
              <SmileOutlined />
            </ToolButton>
          </Tooltip>
        </Popover>

        <Tooltip title="图片 (最大5MB)">
          <ToolButton onClick={handleImageUpload}>
            <PictureOutlined />
          </ToolButton>
        </Tooltip>

        <Tooltip title="文件/文件夹 (单个文件最大10MB，压缩包最大1GB)">
          <ToolButton onClick={handleFileUpload}>
            <FolderOutlined />
          </ToolButton>
        </Tooltip>
      </InputToolbar>

      {/* 输入区域 */}
      <InputContainer isDragOver={isDragOver}>
        <TextInput
          ref={inputRef as React.RefObject<typeof Input.TextArea>}
          rows={2}
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          disabled={disabled}
        />
        <SendButton disabled={disabled || !hasContent} onClick={handleSend}>
          <SendOutlined />
        </SendButton>
      </InputContainer>

      {/* 隐藏的文件输入 */}
      <input
        ref={imageInputRef}
        type="file"
        accept={IMAGE_EXTENSIONS.join(',')}
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFileChange(e)}
      />
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFileChange(e)}
      />

      {/* 图片预览弹窗 */}
      <Modal
        open={!!previewImage}
        footer={null}
        onCancel={() => setPreviewImage(null)}
        width="auto"
        centered
        styles={{ body: { padding: 0 } }}
      >
        {previewImage && (
          <img
            src={previewImage}
            alt="预览"
            style={{ maxWidth: '90vw', maxHeight: '80vh', display: 'block' }}
          />
        )}
      </Modal>
    </InputAreaContainer>
  );
};

export default ChatInput;
