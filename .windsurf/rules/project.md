---
trigger: manual
---

# universe-life-user-front Development Guidelines

Auto-generated from project analysis. Last updated: 2025-12-04

## 项目概述
Universe Life 用户前端应用 - 基于 React 19+ 的现代化单页应用，提供用户认证、任务管理、数据展示等核心功能。专注于本地生活服务平台，采用淘宝/天猫风格设计。

## Tech Stack & Design System

### 核心技术栈
- **前端框架**: React 19.1.1 + TypeScript 5.9.3
- **状态管理**: Redux Toolkit 2.2.5 + React Redux 9.1.2 + @tanstack/react-query 5.90.5
- **路由**: React Router DOM 7.9.4
- **UI组件库**: Ant Design 5.27.5 + @ant-design/icons 6.1.0
- **HTTP客户端**: Axios 1.7.7
- **样式方案**: Emotion 11.14.0 + styled-components 6.1.8 + CSS-in-JS
- **构建工具**: Vite 7.1.7
- **测试框架**: Vitest 3.2.4 + Testing Library 16.3.0 + Playwright 1.57.0
- **代码质量**: ESLint 9.36.0 + Prettier 3.6.2
- **安全工具**: @axe-core/react 4.10.2 + axe-core 4.11.0
- **开发工具**: @tanstack/react-query-devtools 5.90.2
- **认证安全**: pkce-challenge 5.0.1 + crypto-js + jwt-decode
- **Mock服务**: MSW 2.12.3
- **工具库**: Moment.js 2.30.1 + Lodash 4.17.20
- **类型检查**: TypeScript 5.9.3

### 设计系统配置
- **主题方案**: Modern Bright (淘宝风格) + Custom ConfigProvider
- **设计风格**: 淘宝/天猫风格，简洁明亮，电商级体验
- **样式架构**: Emotion styled-components + CSS-in-JS
- **组件库定制**: 深度定制Ant Design，淘宝橙色主题 (#ff6000)
- **字体系统**: Inter + -apple-system + BlinkMacSystemFont + Segoe UI

### 业务领域
- **游戏平台**: Gaming 相关功能和界面
- **企业服务**: Enterprise 级别应用特性
- **校园生态**: Campus 社区和功能集成
- **设计工具**: Design 创作和管理工具

## 项目结构
```
src/
├── components/          # 通用组件
│   ├── Auth/           # 认证相关组件
│   ├── Background/     # 背景组件
│   ├── Legal/          # 法律相关组件
│   └── layout/         # 布局组件
├── pages/              # 页面组件
│   ├── home/           # 首页相关
│   ├── auth/           # 认证页面
│   ├── dashboard/      # 仪表板
│   └── error/          # 错误页面
├── services/           # 服务层
│   ├── api/           # API服务
│   ├── http/          # HTTP客户端
│   ├── oauth2/        # OAuth2认证服务
│   └── types/         # 服务类型定义
├── store/              # Redux状态管理
├── utils/              # 工具函数
├── hooks/              # 自定义Hooks
├── types/              # TypeScript类型定义
├── styles/             # 样式文件
├── data/               # 数据文件
└── config/             # 配置文件
```

## 开发命令

### 启动开发服务器
- `npm run dev` - 智能启动开发服务器（自动清理3000端口）
- `npm run dev:raw` - 直接启动Vite开发服务器
- `npm run dev:port` - 端口管理启动

### 代码质量与测试
- `npm run lint` - 运行ESLint代码检查
- `npm run lint:fix` - 自动修复ESLint问题
- `npm run type-check` - TypeScript类型检查
- `npm run test` - 运行单元测试
- `npm run test:ui` - 测试UI界面
- `npm run test:coverage` - 测试覆盖率报告
- `npm run test:e2e` - 端到端测试
- `npm run test:accessibility` - 可访问性测试

### 构建与部署
- `npm run build` - 构建生产版本
- `npm run preview` - 预览构建结果
- `npm run analyze` - 分析构建包大小
- `npm run lighthouse` - Lighthouse 性能分析

### 代码格式化
- `npm run format` - 格式化代码
- `npm run format:check` - 检查代码格式

### 性能与安全
- `npm run perf:audit` - 性能审计（构建 + Lighthouse）
- `npm run security:audit` - 安全审计
- `npm run accessibility:audit` - 可访问性审计（axe-core爬虫）

## 端口管理配置

### 强制3000端口策略
项目配置为强制使用3000端口进行开发，包含以下特性：

1. **智能端口清理**:
   - 启动时自动检测3000端口占用状态
   - 如被占用，自动终止占用进程
   - 确保端口完全释放后再启动服务

2. **端口配置**:
   - Vite配置中设置 `strictPort: true`
   - 开发服务器强制绑定3000端口
   - 支持外部访问 (`host: true`)

3. **自动化脚本**:
   - `scripts/start-dev.js` - 智能启动脚本
   - 跨平台端口检测和进程管理
   - 优雅的错误处理和日志输出

### 使用方式
```bash
# 推荐使用 - 自动管理端口
npm run dev

# 直接启动 - 需要手动确保3000端口可用
npm run dev:raw
```

## 开发规范

### 代码风格
- 严格遵循 TypeScript 5.x 最佳实践
- 使用 ESLint + Prettier 保证代码质量
- 组件采用函数式组件 + Hooks 模式
- 优先使用现代 ES6+ 语法特性

### 文件命名规范
- 组件文件: PascalCase (如 `UserProfile.tsx`)
- 工具文件: camelCase (如 `formatDate.ts`)
- 类型文件: camelCase (如 `userTypes.ts`)
- 样式文件: kebab-case (如 `user-profile.module.css`)

### 认证系统
- 集成 OAuth2 + PKCE 认证流程
- 支持多种第三方登录提供商
- 安全的Token存储和管理
- 自动刷新Token机制
- **Token有效期配置**:
  - Access Token: 2小时 (7200秒)
  - Refresh Token: 7天 (604800秒)
  - 自动刷新阈值: 10分钟前触发刷新

### API集成
- 统一的HTTP客户端配置
- 请求/响应拦截器
- 错误处理和重试机制
- API类型安全保证

## Recent Changes
- **2025-12-04**: 🧹 项目清理 - 移除开发过程中的调试文件和截图，保持项目结构整洁
- **2025-12-03**: 🎉 完成Order Feed订单广场模块 - 淘宝风格商品信息流，像素级还原"猜你喜欢"体验
- **2025-12-03**: 实现OrderCard组件 - 无边框阴影设计，悬停上升8px+橙色光晕，电商标准价格显示
- **2025-12-03**: 实现OrderFeed响应式网格 - 4-5列自适应布局，1400px+五列，480px-单列
- **2025-12-03**: 集成OrderFilterBar粘性过滤栏 - 综合/价格/最新排序，淘宝风格Tab设计
- **2025-12-03**: 实现骨架屏加载状态 - Shimmer微光动画效果，优雅的加载体验
- **2025-12-03**: 创建12个真实模拟数据 - 涵盖游戏/企业服务/校园/设计四大分类
- **2025-12-03**: 完善TypeScript类型系统 - OrderCardProps、OrderFeedProps等完整接口定义
- **2025-12-03**: 修复Hero Section关键bug - 移除多余CategoryTooltip小弹窗，恢复MegaPanel悬浮保持显示功能，实现滚动锁定机制
- **2025-12-03**: 实现完整的Hero Section交互体验 - 淘宝风格分类导航，MegaPanel悬浮交互，完善的用户体验
- **2025-12-03**: 更新技术栈文档 - 集成@tanstack/react-query、styled-components、MSW Mock服务等最新依赖
- **2025-12-03**: 完善开发工具链 - 添加axe-core可访问性工具、Lighthouse性能分析、pkce-challenge认证安全
- **2025-12-02**: 实现HeaderMain组件 - Brand & Search Header模块，应用"门面"设计，支持图片Logo（280×96px，4:3比例）
- **2025-12-02**: 优化HeaderMain容器 - 增加容器高度至124px，提供更充足的Logo展示空间
- **2025-12-02**: 集成Pill Shape搜索栏 - 完整椭圆设计，橙色边框，内置阴影效果，分类筛选+搜索按钮+热门标签
- **2025-12-02**: 添加Logo图片支持 - 替换文本Logo为src/assets/logo.png，支持自定义尺寸和宽高比
- **2025-12-02**: 实现循环placeholder功能 - 每3秒自动切换搜索提示文本（LOL代练、游戏攻略、代码审查等）
- **2025-12-02**: 重构TopNavBar组件 - 采用淘宝/天猫风格设计，Modern Bright主题，完美用户体验
- **2025-12-02**: 更新设计系统 - 淘宝橙色主题 (#ff6000)，36px紧凑高度，明亮清新设计风格
- **2025-12-02**: 优化组件架构 - 精简组件接口，专注核心功能，Emotion styled-components重构
- **2025-11-30**: 调整Token有效期配置 - Access Token 2小时，Refresh Token 7天，刷新阈值10分钟
- **2025-11-30**: 添加智能端口管理系统，强制3000端口运行策略
- **2025-11-30**: 集成完整OAuth2认证系统，支持PKCE流程
- **2025-11-30**: 升级到React 19+和最新依赖包
- **2025-11-30**: 完善测试覆盖率和代码质量工具链
- **2025-10-18**: 初始化React 18+ + TypeScript 5.x + Redux Toolkit技术栈

## 核心组件特性

### HeaderMain - Brand & Search Header模块
- **设计定位**: 应用"门面"组件，位于TopNavBar下方，作为页面的视觉焦点
- **容器尺寸**: 总高度124px（20px上下padding + 84px内容高度），提供充足的展示空间
- **Logo支持**:
  - 图片Logo（280×96px，4:3比例）
  - 支持src/assets/logo.png图片导入
  - 可自定义宽度、高度和alt文本
  - 悬停透明度效果，点击导航功能
- **搜索栏设计**:
  - **Pill Shape椭圆**: 完整圆形边框设计，border-radius: 999px
  - **橙色边框**: #ff5000主色调，聚焦时高亮为#ff6000
  - **内置阴影**: `box-shadow: 0 4px 12px rgba(255, 80, 0, 0.15)`
  - **内部结构**: 分类下拉菜单 + 搜索输入框 + 内置搜索按钮
- **搜索分类**: 全部/游戏/企业服务/校园/设计，支持自定义扩展
- **动态placeholder**: 每3秒自动循环切换（LOL代练、游戏攻略、代码审查、UI设计、校园兼职）
- **热门搜索标签**: 搜索栏下方灰色链接行，悬停变色效果
- **右侧操作按钮**:
  - "发布需求"按钮：Ghost风格，橙色边框
  - "任务单"按钮：带数量徽章（3），支持购物车图标
- **响应式设计**: 完美适配桌面端/平板端/移动端，保持功能完整性

### TopNavBar 2.0 - 淘宝/天猫风格
- **设计风格**: 36px紧凑高度，纯白背景，细边框分隔线
- **主题配置**: Modern Bright主题，淘宝橙色 (#ff6000) 主色调
- **左侧功能**: 地区选择器（北京/上海/广州/深圳/杭州）+ 商家中心（高亮）
- **右侧功能**: 用户信息 + 我的订单 + 消息中心（徽章）+ 帮助中心
- **交互效果**: 悬停变色 (#fff5f0背景)，流畅过渡动画
- **响应式**: 桌面/移动端完美适配，保持所有功能可用性

### Order Feed - 订单广场模块 ⭐ NEW
- **设计定位**: 淘宝"猜你喜欢"风格的信息流展示，像素级还原电商体验
- **核心特性**:
  - **OrderCard组件**: 无边框阴影设计，悬停时上升8px+橙色光晕效果
  - **电商标准价格**: ¥符号小，整数巨大（28px），小数标准（14px），DIN字体
  - **视觉锚点**: 分类图标+渐变背景+Shimmer微光动画
  - **标签系统**: 药丸形状，柔和色彩，分类化展示
- **响应式网格**:
  - 1400px+: 5列布局
  - 1024-1399px: 4列布局
  - 768-1023px: 3列布局
  - 480-767px: 2列布局
  - <480px: 单列布局
- **交互功能**:
  - **粘性过滤栏**: 综合/价格/最新排序，淘宝风格Tab设计
  - **悬停效果**: 卡片上升+发光+抢单按钮显现
  - **骨架屏**: Shimmer微光动画，优雅加载状态
  - **数据分类**: 游戏/企业服务/校园/设计四大业务分类
- **数据系统**:
  - 12个真实模拟订单，覆盖所有业务分类
  - 完整的TypeScript类型定义
  - 支持排序、筛选、分页功能
- **技术实现**: Emotion styled-components + TypeScript + 响应式设计

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
