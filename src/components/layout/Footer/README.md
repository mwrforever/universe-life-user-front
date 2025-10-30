# Footer 组件库

> 简化版底栏组件库 - 基于Ant Design的响应式Footer

## 📦 使用方式

```tsx
import { SimpleFooter } from '@/components/layout/Footer';

function App() {
  return (
    <div>
      <main>页面内容</main>
      <SimpleFooter />
    </div>
  );
}
```

## 🎯 特性

- ✅ 响应式设计 (xs | sm | md | lg | xl | xxl)
- ✅ TypeScript类型安全
- ✅ Ant Design主题兼容
- ✅ 移动端优先

## 📁 组件结构

```
src/components/layout/Footer/
├── README.md              # 本文档
├── SimpleFooter.tsx       # 主组件 - 简版Footer
├── index.ts              # 导出文件
└── constants/            # 常量定义
    └── index.ts
```

## 🛠️ 开发说明

> 注意：复杂的Footer系统已简化，现在只导出 `SimpleFooter` 组件。

如需扩展功能，请参考 `SimpleFooter.tsx` 的实现方式。