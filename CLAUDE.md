# Universe Life 用户前端应用开发指南

本地生活服务平台用户前端 - 基于 React 19+ 的现代化单页应用，淘宝/天猫风格设计。

## 核心技术栈

**框架与语言**: React 19.1.1 + TypeScript 5.9.3
**路由与状态**: React Router DOM 7.9.4 + Redux Toolkit 2.2.5 + @tanstack/react-query 5.90.5
**UI组件**: Ant Design 5.27.5 + Emotion 11.14.0 + styled-components 6.1.8
**构建工具**: Vite 7.1.7 + ESLint 9.36.0 + Prettier 3.6.2
**测试框架**: Vitest 3.2.4 + Playwright 1.57.0
**认证安全**: pkce-challenge + crypto-js + OAuth2 + PKCE

## 项目结构

```
src/
├── components/          # 通用组件
│   ├── Auth/           # 认证组件
│   ├── chat/           # 聊天组件
│   ├── common/         # 公共组件
│   ├── home/           # 首页组件
│   └── layout/         # 布局组件 (HeaderMain, TopNavBar, Footer)
├── pages/              # 页面组件
│   ├── auth/           # 认证页面
│   ├── home/           # 首页 (HeroSection, Banner, Categories)
│   ├── market/         # 订单广场 (OrderFeed, OrderCard)
│   ├── order/          # 订单管理
│   ├── profile/        # 用户资料
│   ├── tasks/          # 任务管理
│   ├── messages/       # 消息中心
│   ├── settings/       # 设置
│   ├── services/       # 服务
│   ├── help/           # 帮助中心
│   └── user/           # 用户中心
├── services/           # API服务层 (http, oauth2, upload, tasks)
├── hooks/              # 自定义Hooks (useAuth)
├── types/              # TypeScript类型定义
├── data/               # Mock数据 (category, order, carousel)
├── utils/              # 工具函数
├── routes/             # 路由配置
└── theme/              # 主题配置
```

## 常用命令

### 开发
```bash
npm run dev              # 智能启动（自动清理3000端口）
npm run dev:raw          # 直接启动
npm run type-check       # 类型检查
npm run lint            # 代码检查
npm run lint:fix        # 自动修复
```

### 测试与构建
```bash
npm run test            # 单元测试
npm run test:e2e        # 端到端测试
npm run build           # 生产构建
npm run preview         # 预览构建结果
npm run analyze         # 包大小分析
```

### 格式化与审计
```bash
npm run format          # 格式化代码
npm run security:audit  # 安全审计
npm run perf:audit      # 性能审计
```

## 开发规范

### 代码风格
- 函数式组件 + Hooks 模式
- TypeScript严格模式
- ESLint + Prettier自动格式化
- Emotion styled-components样式

### 文件命名
- 组件: `PascalCase.tsx` (如 `UserProfile.tsx`)
- 工具: `camelCase.ts` (如 `formatDate.ts`)
- 样式: `kebab-case.css` (如 `user-profile.css`)

### 认证系统
- OAuth2 + PKCE 流程
- Access Token: 2小时
- Refresh Token: 7天
- 自动刷新阈值: 10分钟

## 核心组件

### 布局组件
- **TopNavBar**: 36px紧凑高度，淘宝橙色主题，地区选择 + 用户中心
- **HeaderMain**: 124px总高，图片Logo(280×96px)，Pill Shape搜索栏
- **Footer**: 淘宝风格底栏，粘性布局

### 首页组件
- **HeroSection**: 分类导航 + MegaMenu悬浮面板，滚动锁定
- **BannerCarousel**: 简化轮播图，自动播放
- **CategoryBentoGrid**: 分类网格展示

### 订单广场 (OrderFeed)
- **OrderCard**: 无边框阴影，悬停上升8px+橙色光晕，电商价格显示
- **OrderFilterBar**: 粘性过滤栏，综合/价格/最新排序
- **响应式网格**: 1400px+五列，480px-单列
- **骨架屏**: Shimmer微光加载动画

## 最近更新
- **2025-12-04**: 项目清理，移除调试文件
- **2025-12-03**: Order Feed订单广场模块，OrderCard组件
- **2025-12-02**: HeaderMain搜索栏，TopNavBar重构
- **2025-11-30**: OAuth2认证系统，智能端口管理

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
