# universe-life-user-front Development Guidelines

Auto-generated from project analysis. Last updated: 2025-11-30

## 项目概述
Universe Life 用户前端应用 - 基于 React 19+ 的现代化单页应用，提供用户认证、任务管理、数据展示等核心功能。

## Active Technologies
- **前端框架**: React 19.1+ + TypeScript 5.9+
- **状态管理**: Redux Toolkit 2.2+ + React Redux 9.1+
- **路由**: React Router DOM 7.9+
- **UI组件库**: Ant Design 5.27+ + @ant-design/icons 6.1+
- **HTTP客户端**: Axios 1.7+
- **实时通信**: Socket.IO Client 4.8+
- **样式方案**: Styled Components 6.1+ + Emotion 11.14+
- **数据可视化**: ECharts/Recharts 集成支持
- **构建工具**: Vite 7.1+
- **测试框架**: Vitest 3.2+ + Testing Library 16.3+
- **E2E测试**: Playwright
- **代码质量**: ESLint 9.36+ + Prettier 3.6+
- **类型检查**: TypeScript 5.9+

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

### 代码格式化
- `npm run format` - 格式化代码
- `npm run format:check` - 检查代码格式

### 性能与安全
- `npm run perf:audit` - 性能审计
- `npm run security:audit` - 安全审计
- `npm run accessibility:audit` - 可访问性审计

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
- **2025-11-30**: 调整Token有效期配置 - Access Token 2小时，Refresh Token 7天，刷新阈值10分钟
- **2025-11-30**: 添加智能端口管理系统，强制3000端口运行策略
- **2025-11-30**: 集成完整OAuth2认证系统，支持PKCE流程
- **2025-11-30**: 升级到React 19+和最新依赖包
- **2025-11-30**: 完善测试覆盖率和代码质量工具链
- **2025-10-18**: 初始化React 18+ + TypeScript 5.x + Redux Toolkit技术栈

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
