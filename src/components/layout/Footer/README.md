# 万象生活企业级底栏组件库

一个功能完整、性能优化、无障碍友好的React底栏组件库，专为万象生活平台设计。

## ✨ 特性

- 🌍 **国际化支持** - 内置中英文切换，支持自定义语言包
- 🎨 **主题系统** - 支持亮色/暗色主题，高对比度模式，自定义主题
- ⚡ **性能优化** - 延迟加载、代码分割、组件缓存
- ♿ **无障碍支持** - WCAG 2.1 AA标准，键盘导航，屏幕阅读器
- 📱 **响应式设计** - 完美适配PC、Mobile、平板
- 🔧 **配置驱动** - 灵活的配置系统，支持运行时修改
- 📊 **数据埋点** - 内置分析系统，支持Google Analytics、百度统计
- 🎯 **类型安全** - 完整的TypeScript类型定义

## 📦 安装

```bash
# 组件库已集成在项目中，无需额外安装
```

## 🚀 快速开始

### 基础用法

```tsx
import React from 'react';
import { LazyFooter } from '@/components/layout/Footer';

function App() {
  return (
    <div>
      <main>页面内容</main>
      <LazyFooter />
    </div>
  );
}
```

### 高级配置

```tsx
import React from 'react';
import { LazyFooter } from '@/components/layout/Footer';
import type { FooterConfig } from '@/components/layout/Footer';

function App() {
  const customConfig: Partial<FooterConfig> = {
    topBar: {
      logo: {
        icon: "🏠",
        text: "我的应用",
        href: "/",
      },
      navigation: [
        {
          id: "home",
          title: "首页",
          href: "/",
        },
        // ... 更多导航项
      ],
    },
    // ... 更多配置
  };

  return (
    <div>
      <main>页面内容</main>
      <LazyFooter
        config={customConfig}
        theme="dark"
        locale="zh-CN"
        onServiceClick={(service) => {
          console.log('服务点击:', service);
        }}
        onNavigationClick={(nav) => {
          console.log('导航点击:', nav);
        }}
      />
    </div>
  );
}
```

## 📚 API文档

### Footer Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| config | `Partial<FooterConfig>` | - | 自定义配置 |
| className | `string` | - | 自定义CSS类名 |
| loading | `boolean` | `false` | 加载状态 |
| theme | `'light' \| 'dark' \| 'auto'` | `'auto'` | 主题模式 |
| locale | `'zh-CN' \| 'en-US'` | - | 语言设置 |
| onConfigUpdate | `(config: FooterConfig) => void` | - | 配置更新回调 |
| onServiceClick | `(item: ServiceGridItem) => void` | - | 服务点击回调 |
| onNavigationClick | `(item: NavigationItem) => void` | - | 导航点击回调 |
| onUserActionClick | `(item: UserActionItem) => void` | - | 用户操作回调 |
| onSocialClick | `(item: SocialLink) => void` | - | 社交链接回调 |

### 配置结构

```tsx
interface FooterConfig {
  topBar: {
    logo: {
      icon: string;
      text: string;
      href: string;
      external?: boolean;
      alt?: string;
    };
    navigation: NavigationItem[];
    userActions: UserActionItem[];
  };
  mainContent: {
    services: ServiceGridItem[];
    promotion?: PromotionBanner;
  };
  bottomBar: {
    links: FooterLink[];
    legal: LegalLinks;
    social: SocialLink[];
  };
}
```

## 🎨 主题定制

### 使用内置主题

```tsx
import { FooterThemeProvider } from '@/components/layout/Footer';

function App() {
  return (
    <FooterThemeProvider
      options={{
        defaultTheme: 'dark',
        enablePersistence: true,
      }}
    >
      <LazyFooter />
    </FooterThemeProvider>
  );
}
```

### 自定义主题

```tsx
import { FooterThemeProvider } from '@/components/layout/Footer';
import type { FooterTheme } from '@/components/layout/Footer';

const customTheme: Partial<FooterTheme> = {
  token: {
    colorPrimaryFooter: '#ff6b35',
    borderRadiusFooter: 12,
    fontSizeFooter: 16,
  },
  components: {
    ServiceCard: {
      borderRadius: 16,
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    },
  },
};

function App() {
  return (
    <FooterThemeProvider initialTheme={customTheme}>
      <LazyFooter />
    </FooterThemeProvider>
  );
}
```

## 🌍 国际化

### 使用内置语言

```tsx
import { LazyFooter } from '@/components/layout/Footer';

function App() {
  return (
    <>
      <LazyFooter locale="zh-CN" />
      {/* 或 */}
      <LazyFooter locale="en-US" />
    </>
  );
}
```

### 自定义语言包

```tsx
import { useFooterLocale } from '@/components/layout/Footer';

function CustomComponent() {
  const { t, changeLocale } = useFooterLocale();

  return (
    <div>
      <button onClick={() => changeLocale('zh-CN')}>中文</button>
      <button onClick={() => changeLocale('en-US')}>English</button>
      <p>{t('topBar.navigation.home')}</p>
    </div>
  );
}
```

## 📊 数据埋点

### 基础埋点

```tsx
import { useFooterAnalytics } from '@/components/layout/Footer';

function Component() {
  const analytics = useFooterAnalytics({
    enabled: true,
    analyticsService: 'google',
  });

  const handleClick = () => {
    analytics.trackInteraction('button_click', 'footer_cta');
  };

  return <button onClick={handleClick}>点击我</button>;
}
```

### 自定义事件

```tsx
const analytics = useFooterAnalytics();

// 发送自定义事件
analytics.trackEvent({
  category: 'user_interaction',
  action: 'custom_action',
  label: 'footer_area',
  value: 1,
});

// 性能埋点
analytics.trackPerformance('load_time', 1500);

// 错误埋点
analytics.trackError(new Error('Something went wrong'), 'footer_component');
```

## ♿ 无障碍支持

### 使用无障碍Hook

```tsx
import { useFooterA11y } from '@/components/layout/Footer';

function Component() {
  const a11y = useFooterA11y();

  const handleKeyDown = (event: KeyboardEvent) => {
    a11y.handleKeyDown(event);
  };

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0}>
      可访问的内容
    </div>
  );
}
```

### 无障碍配置

```tsx
const a11y = useFooterA11y({
  enableKeyboardNavigation: true,
  enableScreenReaderSupport: true,
  enableHighContrastDetection: true,
});

// 宣告消息到屏幕阅读器
a11y.announceToScreenReader('操作成功', 'polite');

// 检查颜色对比度
const contrast = a11y.checkColorContrast('#ffffff', '#1890ff');
console.log(contrast.wcagAA); // true/false
```

## 🔧 Hook系统

### 配置管理

```tsx
import { useFooterConfig } from '@/components/layout/Footer';

function Component() {
  const { config, updateConfig, resetConfig } = useFooterConfig({
    enableCache: true,
    enableValidation: true,
  });

  const updateLogo = () => {
    updateConfig({
      topBar: {
        logo: {
          text: '新名称',
        },
      },
    });
  };

  return (
    <div>
      <button onClick={updateLogo}>更新Logo</button>
      <button onClick={resetConfig}>重置配置</button>
    </div>
  );
}
```

### 延迟加载

```tsx
import { useFooterLazy } from '@/components/layout/Footer';

function Component() {
  const { isVisible, isLoading, error, retry } = useFooterLazy(
    async () => {
      // 异步加载逻辑
      await loadFooterData();
    },
    {
      rootMargin: '200px',
      delay: 100,
    }
  );

  if (error) {
    return <div>加载失败 <button onClick={retry}>重试</button></div>;
  }

  return <div ref={ref}>{isVisible ? <Footer /> : null}</div>;
}
```

## 🎯 性能优化

### 延迟加载

```tsx
// 自动延迟加载
import { LazyFooter } from '@/components/layout/Footer';

function App() {
  return <LazyFooter />;
}
```

### 代码分割

```tsx
// 组件已配置为自动代码分割
// Footer组件会被打包到独立的chunk中
```

### 缓存策略

```tsx
// 配置缓存
const { config } = useFooterConfig({
  enableCache: true,
  cacheKey: 'my-footer-config',
});

// 配置会自动缓存到localStorage
```

## 📱 响应式设计

组件内置完整的响应式支持：

- **xs**: < 576px - 手机竖屏
- **sm**: ≥ 576px - 手机横屏小平板
- **md**: ≥ 768px - 平板
- **lg**: ≥ 992px - 小屏幕桌面
- **xl**: ≥ 1200px - 桌面
- **xxl**: ≥ 1600px - 大屏幕桌面

## 🛠️ 开发指南

### 类型定义

所有组件都有完整的TypeScript类型定义：

```tsx
import type {
  FooterConfig,
  ServiceGridItem,
  NavigationItem,
  SocialLink,
} from '@/components/layout/Footer';
```

### 自定义组件

```tsx
import { useFooterConfig, useFooterTheme } from '@/components/layout/Footer';

function CustomFooterComponent() {
  const config = useFooterConfig();
  const theme = useFooterTheme();

  return (
    <div style={{ background: theme.currentTheme.token.colorBgFooter }}>
      {/* 自定义内容 */}
    </div>
  );
}
```

## 🔍 故障排除

### 常见问题

**Q: 组件不显示？**
A: 确保使用了`LazyFooter`组件，或检查延迟加载配置。

**Q: 样式不生效？**
A: 确保已正确引入主题Provider，检查CSS变量是否正确设置。

**Q: 国际化不工作？**
A: 检查语言包是否正确加载，确认locale属性设置正确。

**Q: 无障碍功能异常？**
A: 确保启用了相关选项，检查HTML结构是否正确。

### 调试模式

```tsx
// 开启调试模式
const analytics = useFooterAnalytics({
  debug: true,
});

const a11y = useFooterA11y({
  enabled: true,
});
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

---

**万象生活企业级底栏组件库** - 让您的应用底部更加专业、美观、易用！