// Hero Section 分类颜色主题配置

import {
  AndroidOutlined,
  TrophyOutlined,
  GiftOutlined,
  PlayCircleOutlined,
  BankOutlined,
  FileProtectOutlined,
  DollarOutlined,
  BookOutlined,
  ReadOutlined,
  UserOutlined,
  BgColorsOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';

export const CategoryColorThemes = {
  gaming: {
    primary: '#00D4FF',    // 霓虹蓝
    accent: '#0099CC',     // 深蓝色
    gradient: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
    hover: 'rgba(0, 212, 255, 0.1)',
    glow: '0 0 20px rgba(0, 212, 255, 0.3)'
  },
  enterprise: {
    primary: '#1890FF',    // 商务蓝
    accent: '#40A9FF',     // 亮蓝色
    gradient: 'linear-gradient(135deg, #1890FF 0%, #40A9FF 100%)',
    hover: 'rgba(24, 144, 255, 0.1)',
    glow: '0 0 20px rgba(24, 144, 255, 0.3)'
  },
  campus: {
    primary: '#52C41A',    // 青春绿
    accent: '#73D13D',     // 亮绿色
    gradient: 'linear-gradient(135deg, #52C41A 0%, #73D13D 100%)',
    hover: 'rgba(82, 196, 26, 0.1)',
    glow: '0 0 20px rgba(82, 196, 26, 0.3)'
  },
  design: {
    primary: '#722ED1',    // 创意紫
    accent: '#9254DE',     // 亮紫色
    gradient: 'linear-gradient(135deg, #722ED1 0%, #9254DE 100%)',
    hover: 'rgba(114, 46, 209, 0.1)',
    glow: '0 0 20px rgba(114, 46, 209, 0.3)'
  }
} as const;

export const GamingIcon = <AndroidOutlined style={{ color: '#666' }} />;
export const TrophyIcon = <TrophyOutlined style={{ color: '#999' }} />;
export const GiftIcon = <GiftOutlined style={{ color: '#999' }} />;
export const PlayCircleIcon = <PlayCircleOutlined style={{ color: '#999' }} />;
export const BankIcon = <BankOutlined style={{ color: '#666' }} />;
export const FileProtectIcon = <FileProtectOutlined style={{ color: '#999' }} />;
export const DollarIcon = <DollarOutlined style={{ color: '#999' }} />;
export const BookIcon = <BookOutlined style={{ color: '#666' }} />;
export const ReadIcon = <ReadOutlined style={{ color: '#999' }} />;
export const UserIcon = <UserOutlined style={{ color: '#999' }} />;
export const BgColorsIcon = <BgColorsOutlined style={{ color: '#666' }} />;
export const VideoCameraIcon = <VideoCameraOutlined style={{ color: '#999' }} />;