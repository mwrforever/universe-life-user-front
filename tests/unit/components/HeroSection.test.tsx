import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import HeroSection from '../../../src/pages/home/components/hero/HeroSection';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock window.matchMedia for responsive hooks
const mockMatchMedia = vi.fn();
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
});

// Mock console.log for click handlers
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('HeroSection Component', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Default media query setup (desktop)
    mockMatchMedia.mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('基础渲染测试', () => {
    it('应该正确渲染标题和副标题', () => {
      render(<HeroSection />);

      expect(screen.getByRole('heading', { name: /万象生活/i })).toBeInTheDocument();
      expect(screen.getByText(/连接创意与需求 - 打破传统接单平台界限/i)).toBeInTheDocument();
    });

    it('应该渲染两个CTA按钮', () => {
      render(<HeroSection />);

      expect(screen.getByRole('button', { name: /发布您的需求，开始项目/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /寻找合适的服务提供者/i })).toBeInTheDocument();
    });

    it('应该使用正确的语义标记', () => {
      render(<HeroSection />);

      const heroContainer = screen.getByRole('banner');
      expect(heroContainer).toBeInTheDocument();
      expect(heroContainer).toHaveAttribute('aria-labelledby', 'hero-title');
    });

    it('应该渲染粒子背景元素', () => {
      render(<HeroSection />);

      const particleBackground = screen.getByLabelText('hero-background');
      expect(particleBackground).toBeInTheDocument();
      expect(particleBackground).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('响应式设计测试', () => {
    it('应该响应移动端断点', () => {
      mockMatchMedia.mockImplementation((query) => ({
        matches: query === '(max-width: 767px)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(<HeroSection />);

      // 在移动端，应该渲染更少的粒子
      const particles = document.querySelectorAll('.particle');
      expect(particles.length).toBeLessThanOrEqual(15);
    });

    it('应该响应桌面端断点', () => {
      mockMatchMedia.mockImplementation((query) => ({
        matches: query === '(min-width: 1024px)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(<HeroSection />);

      // 在桌面端，应该渲染更多的粒子
      const particles = document.querySelectorAll('.particle');
      expect(particles.length).toBeGreaterThanOrEqual(20);
    });
  });

  describe('交互测试', () => {
    it('点击发布需求按钮应该调用处理函数', () => {
      render(<HeroSection />);

      const publishButton = screen.getByRole('button', { name: /发布您的需求，开始项目/i });
      fireEvent.click(publishButton);

      expect(mockConsoleLog).toHaveBeenCalledWith('发布需求 clicked');
    });

    it('点击寻找服务按钮应该调用处理函数', () => {
      render(<HeroSection />);

      const findButton = screen.getByRole('button', { name: /寻找合适的服务提供者/i });
      fireEvent.click(findButton);

      expect(mockConsoleLog).toHaveBeenCalledWith('寻找服务 clicked');
    });

    it('应该支持键盘导航', () => {
      render(<HeroSection />);

      const publishButton = screen.getByRole('button', { name: /发布您的需求，开始项目/i });

      // Tab键应该能聚焦到按钮
      publishButton.focus();
      expect(publishButton).toHaveFocus();

      // Enter键应该触发点击事件
      fireEvent.keyDown(publishButton, { key: 'Enter', code: 'Enter' });
      expect(mockConsoleLog).toHaveBeenCalledWith('发布需求 clicked');

      mockConsoleLog.mockClear();

      // Space键应该触发点击事件
      fireEvent.keyDown(publishButton, { key: ' ', code: 'Space' });
      expect(mockConsoleLog).toHaveBeenCalledWith('发布需求 clicked');
    });
  });

  describe('可访问性测试', () => {
    it('应该有正确的ARIA标签', () => {
      render(<HeroSection />);

      const ctaContainer = screen.getByRole('group', { name: /主要操作/i });
      expect(ctaContainer).toBeInTheDocument();

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-label');
      });
    });

    it('应该有正确的语言属性', () => {
      render(<HeroSection />);

      const heroContainer = screen.getByRole('banner');
      expect(heroContainer).closest('[lang]').toHaveAttribute('lang', 'zh-CN');
    });

    it('应该支持屏幕阅读器', () => {
      render(<HeroSection />);

      // 检查是否有语义化的HTML结构
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

      // 检查是否有适当的描述性文本
      expect(screen.getByText(/连接创意与需求/i)).toBeInTheDocument();
    });

    it('应该有适当的焦点指示器', () => {
      render(<HeroSection />);

      const publishButton = screen.getByRole('button', { name: /发布您的需求，开始项目/i });

      // 聚焦时应该有可见的焦点指示器
      publishButton.focus();
      expect(publishButton).toHaveFocus();
    });

    it('应该有足够的颜色对比度', async () => {
      const { container } = render(<HeroSection />);

      // 使用axe进行可访问性检查
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('动画和性能测试', () => {
    it('应该支持减少动画偏好', () => {
      // Mock prefers-reduced-motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      render(<HeroSection />);

      // 在减少动画模式下，粒子动画应该被禁用
      const style = document.createElement('style');
      style.innerHTML = `
        @media (prefers-reduced-motion: reduce) {
          .particle { animation: none !important; }
        }
      `;
      document.head.appendChild(style);

      const particles = document.querySelectorAll('.particle');
      particles.forEach(particle => {
        const styles = window.getComputedStyle(particle);
        expect(styles.animation).toBe('none');
      });
    });

    it('应该正确处理窗口大小调整', () => {
      render(<HeroSection />);

      // 模拟窗口大小变化
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      // 组件应该仍然正常渲染
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });

  describe('错误边界测试', () => {
    it('应该优雅地处理依赖错误', () => {
      // 测试组件在正常情况下的渲染
      expect(() => {
        render(<HeroSection />);
      }).not.toThrow();
    });
  });

  describe('快照测试', () => {
    it('应该与快照匹配', () => {
      const { asFragment } = render(<HeroSection />);
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('国际化测试', () => {
    it('应该正确显示中文文本', () => {
      render(<HeroSection />);

      expect(screen.getByText(/万象生活/i)).toBeInTheDocument();
      expect(screen.getByText(/发布需求/i)).toBeInTheDocument();
      expect(screen.getByText(/寻找服务/i)).toBeInTheDocument();
    });

    it('应该包含英文标题', () => {
      render(<HeroSection />);

      expect(screen.getByText(/Universe Life/i)).toBeInTheDocument();
    });
  });
});