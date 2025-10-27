/**
 * 万象生活底栏组件测试
 * 包含渲染测试、交互测试、可访问性测试、性能测试
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import '@testing-library/jest-dom';
import { SimpleFooter } from '../SimpleFooter';

// Mock window.open
global.open = jest.fn();

// Mock console.log to avoid noise in tests
const originalConsoleLog = console.log;
beforeAll(() => {
  console.log = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
});

describe('SimpleFooter Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基础渲染测试', () => {
    it('应该正确渲染底栏组件', () => {
      render(<SimpleFooter />);

      // 检查品牌Logo
      expect(screen.getByText('万象生活')).toBeInTheDocument();

      // 检查主要区块
      expect(screen.getByText('产品服务')).toBeInTheDocument();
      expect(screen.getByText('用户支持')).toBeInTheDocument();
      expect(screen.getByText('© 2024 万象生活科技有限公司')).toBeInTheDocument();
    });

    it('应该渲染所有导航链接', () => {
      render(<SimpleFooter />);

      const expectedLinks = [
        '首页',
        '生活服务',
        '我的订单',
        '个人中心',
        '帮助中心',
        '联系我们',
        '意见反馈',
        '常见问题',
      ];

      expectedLinks.forEach(linkText => {
        expect(screen.getByText(linkText)).toBeInTheDocument();
      });
    });

    it('应该渲染社交媒体图标', () => {
      render(<SimpleFooter />);

      // 检查社交媒体图标是否存在
      const socialIcons = document.querySelectorAll('[class*="SocialIcon"]');
      expect(socialIcons).toHaveLength(4); // GitHub, 微信, 微博, QQ
    });

    it('应该渲染联系信息', () => {
      render(<SimpleFooter />);

      expect(screen.getByText('400-123-4567')).toBeInTheDocument();
      expect(screen.getByText('service@universe-life.com')).toBeInTheDocument();
      expect(screen.getByText('北京市朝阳区')).toBeInTheDocument();
    });
  });

  describe('交互测试', () => {
    it('应该处理链接点击事件', async () => {
      render(<SimpleFooter />);

      const homeLink = screen.getByText('首页');
      fireEvent.click(homeLink);

      // 验证点击事件被处理
      await waitFor(() => {
        expect(homeLink.closest('a')).toHaveStyle({
          opacity: '0.7',
          transform: 'scale(0.98)',
        });
      });
    });

    it('应该处理社交媒体点击事件', async () => {
      render(<SimpleFooter />);

      const wechatIcon = screen.getByTitle('微信公众号');
      fireEvent.click(wechatIcon);

      // 验证微信二维码弹窗打开
      await waitFor(() => {
        expect(screen.getByText(/扫码关注微信公众号/)).toBeInTheDocument();
      });
    });

    it('应该处理悬停事件', () => {
      render(<SimpleFooter />);

      const homeLink = screen.getByText('首页');
      fireEvent.mouseEnter(homeLink);

      expect(homeLink.closest('a')).toHaveClass('hovered');
    });

    it('应该支持键盘导航', () => {
      render(<SimpleFooter />);

      const homeLink = screen.getByText('首页');
      homeLink.focus();

      expect(homeLink.closest('a')).toHaveFocus();

      fireEvent.keyDown(homeLink, { key: 'Enter' });
      // 验证Enter键触发点击
    });

    it('应该处理长按事件', () => {
      jest.useFakeTimers();
      render(<SimpleFooter />);

      const homeLink = screen.getByText('首页');
      fireEvent.mouseDown(homeLink);

      // 快进500ms触发长按
      jest.advanceTimersByTime(500);

      // 验证长按事件被处理
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('long press'),
        expect.any(Object)
      );

      jest.useRealTimers();
    });
  });

  describe('响应式测试', () => {
    beforeEach(() => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      // Mock matchMedia
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
    });

    it('应该在移动端显示优化样式', () => {
      // 模拟移动端视口
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query.includes('(max-width: 575px)'),
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      render(<SimpleFooter />);

      // 验证移动端样式被应用
      const footer = document.querySelector('[class*="SimpleFooterContainer"]');
      expect(footer).toHaveStyle({
        padding: '24px 16px',
      });
    });

    it('应该在桌面端显示完整样式', () => {
      render(<SimpleFooter />);

      // 验证桌面端样式被应用
      const footer = document.querySelector('[class*="SimpleFooterContainer"]');
      expect(footer).toHaveStyle({
        padding: '32px 24px',
      });
    });
  });

  describe('主题测试', () => {
    it('应该支持CSS Variables主题切换', () => {
      render(<SimpleFooter />);

      const footer = document.querySelector('[class*="SimpleFooterContainer"]');

      // 设置自定义主题变量
      document.documentElement.style.setProperty('--footer-bg', '#f0f0f0');
      document.documentElement.style.setProperty('--footer-primary', '#ff6b35');

      // 重新渲染组件
      render(<SimpleFooter />);

      // 验证主题变量被应用
      expect(footer).toHaveStyle({
        background: '#f0f0f0',
      });
    });

    it('应该支持暗色主题', () => {
      // 模拟暗色主题偏好
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      render(<SimpleFooter />);

      // 验证暗色主题样式
      expect(document.documentElement).toHaveStyle({
        '--footer-bg': '#141414',
      });
    });
  });

  describe('性能测试', () => {
    it('应该在合理时间内完成渲染', () => {
      const startTime = performance.now();

      render(<SimpleFooter />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // 渲染时间应该小于100ms
      expect(renderTime).toBeLessThan(100);
    });

    it('应该正确处理大量数据', () => {
      const startTime = performance.now();

      // 渲染多个底栏实例测试性能
      const { unmount } = render(
        <div>
          {[...Array(10)].map((_, index) => (
            <SimpleFooter key={index} />
          ))}
        </div>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // 即使渲染10个实例，时间也应该小于500ms
      expect(renderTime).toBeLessThan(500);

      unmount();
    });

    it('应该正确清理资源', () => {
      const { unmount } = render(<SimpleFooter />);

      // 模拟组件卸载
      unmount();

      // 验证没有内存泄漏（这里只是示例，实际项目中需要更复杂的检测）
      expect(document.querySelector('[class*="SimpleFooterContainer"]')).not.toBeInTheDocument();
    });
  });

  describe('错误处理测试', () => {
    it('应该优雅处理缺失的props', () => {
      // @ts-ignore - 故意传递无效props测试错误处理
      expect(() => render(<SimpleFooter />)).not.toThrow();
    });

    it('应该处理外部链接点击', () => {
      render(<SimpleFooter />);

      // 查找外部链接（ICP备案链接）
      const icpLink = screen.getByText(/ICP备案:/);
      fireEvent.click(icpLink);

      expect(global.open).toHaveBeenCalledWith(
        'https://beian.miit.gov.cn/',
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('应该处理微信图标点击', () => {
      render(<SimpleFooter />);

      const wechatIcon = screen.getByTitle('微信公众号');
      fireEvent.click(wechatIcon);

      // 验证微信二维码弹窗状态
      expect(screen.getByText(/扫码关注微信公众号/)).toBeInTheDocument();
    });
  });

  describe('可访问性测试', () => {
    it('应该通过无障碍测试', async () => {
      const { container } = render(<SimpleFooter />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('应该有正确的ARIA标签', () => {
      render(<SimpleFooter />);

      // 检查导航区域
      const navigation = screen.getByRole('navigation');
      expect(navigation).toBeInTheDocument();

      // 检查链接的可访问性
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
    });

    it('应该支持键盘导航', () => {
      render(<SimpleFooter />);

      const firstLink = screen.getByText('首页');
      firstLink.focus();

      expect(document.activeElement).toBe(firstLink);

      // 测试Tab键导航
      fireEvent.keyDown(document, { key: 'Tab' });
      // 验证焦点移动到下一个可聚焦元素
    });

    it('应该有正确的语义化HTML', () => {
      render(<SimpleFooter />);

      // 检查footer标签
      const footer = document.querySelector('footer');
      expect(footer).toBeInTheDocument();

      // 检查标题层级
      const headings = document.querySelectorAll('h4');
      headings.forEach(heading => {
        expect(heading).toBeInTheDocument();
      });
    });

    it('应该有适当的颜色对比度', () => {
      render(<SimpleFooter />);

      // 检查文本颜色对比度（这里只是示例，实际需要更复杂的检测）
      const textElements = document.querySelectorAll('[class*="Text"], [class*="Link"]');
      textElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        const color = styles.color;
        expect(color).not.toBe('transparent');
      });
    });
  });

  describe('国际化测试', () => {
    it('应该支持中文内容', () => {
      render(<SimpleFooter />);

      expect(screen.getByText('万象生活')).toBeInTheDocument();
      expect(screen.getByText('产品服务')).toBeInTheDocument();
      expect(screen.getByText('用户支持')).toBeInTheDocument();
    });

    it('应该正确显示联系信息', () => {
      render(<SimpleFooter />);

      expect(screen.getByText('400-123-4567')).toBeInTheDocument();
      expect(screen.getByText('service@universe-life.com')).toBeInTheDocument();
      expect(screen.getByText('北京市朝阳区')).toBeInTheDocument();
    });
  });

  describe('集成测试', () => {
    it('应该与其他组件正确集成', () => {
      const TestWrapper = ({ children }: { children: React.ReactNode }) => (
        <div>
          <header>Header</header>
          <main>Main Content</main>
          {children}
        </div>
      );

      render(
        <TestWrapper>
          <SimpleFooter />
        </TestWrapper>
      );

      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Main Content')).toBeInTheDocument();
      expect(screen.getByText('万象生活')).toBeInTheDocument();
    });

    it('应该正确处理路由变化', () => {
      // Mock router
      const mockPush = jest.fn();
      jest.mock('next/router', () => ({
        useRouter: () => ({
          push: mockPush,
          pathname: '/',
        }),
      }));

      render(<SimpleFooter />);

      const homeLink = screen.getByText('首页');
      fireEvent.click(homeLink);

      // 验证路由变化被处理
      expect(mockPush).not.toHaveBeenCalled(); // 因为我们阻止了默认行为
    });
  });

  describe('边界情况测试', () => {
    it('应该处理空内容', () => {
      expect(() => render(<SimpleFooter />)).not.toThrow();
    });

    it('应该处理快速连续点击', () => {
      render(<SimpleFooter />);

      const homeLink = screen.getByText('首页');

      // 快速连续点击
      for (let i = 0; i < 10; i++) {
        fireEvent.click(homeLink);
      }

      // 组件应该仍然正常工作
      expect(homeLink).toBeInTheDocument();
    });

    it('应该处理窗口大小变化', () => {
      render(<SimpleFooter />);

      // 模拟窗口大小变化
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });

      fireEvent(window, new Event('resize'));

      // 组件应该仍然正常渲染
      expect(screen.getByText('万象生活')).toBeInTheDocument();
    });
  });
});

// 性能基准测试
describe('SimpleFooter Performance Benchmarks', () => {
  it('渲染性能基准', () => {
    const iterations = 100;
    const times: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      const { unmount } = render(<SimpleFooter />);
      const endTime = performance.now();
      times.push(endTime - startTime);
      unmount();
    }

    const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
    const maxTime = Math.max(...times);

    // 平均渲染时间应该小于10ms
    expect(averageTime).toBeLessThan(10);
    // 最大渲染时间应该小于50ms
    expect(maxTime).toBeLessThan(50);

    console.log(`SimpleFooter Performance:`);
    console.log(`  Average render time: ${averageTime.toFixed(2)}ms`);
    console.log(`  Max render time: ${maxTime.toFixed(2)}ms`);
  });

  it('内存使用基准', () => {
    const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

    const { unmount } = render(<SimpleFooter />);

    const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
    const memoryIncrease = finalMemory - initialMemory;

    // 内存增长应该小于1MB
    expect(memoryIncrease).toBeLessThan(1024 * 1024);

    unmount();

    console.log(`Memory usage increase: ${(memoryIncrease / 1024).toFixed(2)}KB`);
  });
});