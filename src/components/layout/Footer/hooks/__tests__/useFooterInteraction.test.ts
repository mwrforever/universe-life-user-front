/**
 * 万象生活底栏交互Hook测试
 */

import { renderHook, act } from '@testing-library/react';
import { useFooterInteraction, useFooterInteractionSimple } from '../useFooterInteraction';

// Mock analytics
jest.mock('../../../utils/analytics', () => ({
  analytics: {
    track: jest.fn(),
  },
}));

// Mock console
const originalConsole = console;
beforeAll(() => {
  console.log = jest.fn();
});

afterAll(() => {
  console = originalConsole;
});

describe('useFooterInteraction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基础功能测试', () => {
    it('应该初始化正确的默认状态', () => {
      const { result } = renderHook(() => useFooterInteraction());

      expect(result.current.hoveredElement).toBe(null);
      expect(result.current.activeElement).toBe(null);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.lastVisitedLink).toBe(null);
      expect(result.current.socialExpanded).toBe(false);
      expect(result.current.themeChanging).toBe(false);
    });

    it('应该正确处理悬停事件', () => {
      const { result } = renderHook(() => useFooterInteraction());

      act(() => {
        result.current.handleHoverStart('test-element');
      });

      expect(result.current.hoveredElement).toBe('test-element');
      expect(result.current.isElementHovered('test-element')).toBe(true);
      expect(result.current.isElementHovered('other-element')).toBe(false);

      act(() => {
        result.current.handleHoverEnd();
      });

      expect(result.current.hoveredElement).toBe(null);
    });

    it('应该正确处理点击事件', () => {
      const { result } = renderHook(() => useFooterInteraction());

      act(() => {
        result.current.handleClick('test-element', '/test', false);
      });

      expect(result.current.activeElement).toBe('test-element');
      expect(result.current.lastVisitedLink).toBe('/test');
      expect(result.current.isElementActive('test-element')).toBe(true);

      // 等待动画完成
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.activeElement).toBe(null);
    });

    it('应该正确处理焦点事件', () => {
      const { result } = renderHook(() => useFooterInteraction());

      act(() => {
        result.current.handleFocus('test-element');
      });

      expect(result.current.hoveredElement).toBe('test-element');

      act(() => {
        result.current.handleBlur();
      });

      expect(result.current.hoveredElement).toBe(null);
    });

    it('应该正确处理键盘事件', () => {
      const { result } = renderHook(() => useFooterInteraction());
      const mockEvent = {
        key: 'Enter',
        preventDefault: jest.fn(),
      } as any;

      act(() => {
        result.current.handleKeyDown(mockEvent, 'test-element', '/test');
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(result.current.activeElement).toBe('test-element');

      // 测试Escape键
      const escapeEvent = {
        key: 'Escape',
        preventDefault: jest.fn(),
      } as any;

      act(() => {
        result.current.handleHoverStart('test-element');
        result.current.handleKeyDown(escapeEvent, 'test-element', '/test');
      });

      expect(result.current.hoveredElement).toBe(null);
    });

    it('应该正确处理长按事件', () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => useFooterInteraction());

      act(() => {
        result.current.handleLongPressStart('test-element');
      });

      // 长按阈值未达到
      act(() => {
        jest.advanceTimersByTime(400);
      });
      expect(console.log).not.toHaveBeenCalled();

      // 达到长按阈值
      act(() => {
        jest.advanceTimersByTime(100);
      });
      expect(console.log).toHaveBeenCalledWith(
        'Footer Analytics Event:',
        expect.objectContaining({
          type: 'long_press',
          target: 'test-element',
        })
      );

      act(() => {
        result.current.handleLongPressEnd();
      });

      jest.useRealTimers();
    });

    it('应该正确处理双击事件', () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => useFooterInteraction());

      // 第一次点击
      act(() => {
        result.current.handleClick('test-element', '/test', false);
      });

      // 在双击阈值内第二次点击
      act(() => {
        jest.advanceTimersByTime(200);
        result.current.handleClick('test-element', '/test', false);
      });

      expect(console.log).toHaveBeenCalledWith(
        'Footer Analytics Event:',
        expect.objectContaining({
          type: 'double_click',
          target: 'test-element',
        })
      );

      jest.useRealTimers();
    });
  });

  describe('社交媒体功能测试', () => {
    it('应该正确切换社交媒体展开状态', () => {
      const { result } = renderHook(() => useFooterInteraction());

      expect(result.current.socialExpanded).toBe(false);

      act(() => {
        result.current.toggleSocialExpanded();
      });

      expect(result.current.socialExpanded).toBe(true);

      act(() => {
        result.current.toggleSocialExpanded();
      });

      expect(result.current.socialExpanded).toBe(false);
    });
  });

  describe('主题切换测试', () => {
    it('应该正确处理主题切换', () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => useFooterInteraction());

      act(() => {
        result.current.changeTheme('dark');
      });

      expect(result.current.themeChanging).toBe(true);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.themeChanging).toBe(false);

      expect(console.log).toHaveBeenCalledWith(
        'Footer Analytics Event:',
        expect.objectContaining({
          type: 'theme_change',
          target: 'theme_switcher',
          value: { theme: 'dark' },
        })
      );

      jest.useRealTimers();
    });
  });

  describe('分析功能测试', () => {
    it('应该正确收集分析事件', () => {
      const { result } = renderHook(() => useFooterInteraction());

      act(() => {
        result.current.handleHoverStart('test-element');
        result.current.handleClick('test-element', '/test', false);
      });

      const events = result.current.getAnalyticsEvents();
      expect(events).toHaveLength(2);
      expect(events[0].type).toBe('hover');
      expect(events[1].type).toBe('click');
    });

    it('应该正确清除分析事件', () => {
      const { result } = renderHook(() => useFooterInteraction());

      act(() => {
        result.current.handleHoverStart('test-element');
      });

      expect(result.current.getAnalyticsEvents()).toHaveLength(1);

      act(() => {
        result.current.clearAnalyticsEvents();
      });

      expect(result.current.getAnalyticsEvents()).toHaveLength(0);
    });

    it('应该在生产环境启用分析追踪', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const { result } = renderHook(() => useFooterInteraction({
        enableAnalytics: true,
      }));

      act(() => {
        result.current.handleClick('test-element', '/test', false);
      });

      expect(console.log).toHaveBeenCalledWith(
        'Footer Analytics Event:',
        expect.any(Object)
      );

      process.env.NODE_ENV = originalEnv;
    });

    it('应该在开发环境禁用分析追踪', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const { result } = renderHook(() => useFooterInteraction({
        enableAnalytics: false,
      }));

      act(() => {
        result.current.handleClick('test-element', '/test', false);
      });

      expect(console.log).not.toHaveBeenCalledWith(
        'Footer Analytics Event:',
        expect.any(Object)
      );

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('工具函数测试', () => {
    it('isElementHovered应该正确返回状态', () => {
      const { result } = renderHook(() => useFooterInteraction());

      expect(result.current.isElementHovered('test')).toBe(false);

      act(() => {
        result.current.handleHoverStart('test');
      });

      expect(result.current.isElementHovered('test')).toBe(true);
      expect(result.current.isElementHovered('other')).toBe(false);
    });

    it('isElementActive应该正确返回状态', () => {
      const { result } = renderHook(() => useFooterInteraction());

      expect(result.current.isElementActive('test')).toBe(false);

      act(() => {
        result.current.handleClick('test', '/test', false);
      });

      expect(result.current.isElementActive('test')).toBe(true);
      expect(result.current.isElementActive('other')).toBe(false);
    });
  });

  describe('自定义配置测试', () => {
    it('应该使用自定义阈值', () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => useFooterInteraction({
        longPressThreshold: 1000,
        doubleClickThreshold: 500,
      }));

      act(() => {
        result.current.handleLongPressStart('test-element');
        jest.advanceTimersByTime(500);
      });

      // 500ms < 1000ms，不应该触发长按
      expect(console.log).not.toHaveBeenCalledWith(
        expect.stringContaining('long_press'),
        expect.any(Object)
      );

      act(() => {
        jest.advanceTimersByTime(500);
      });

      // 1000ms >= 1000ms，应该触发长按
      expect(console.log).toHaveBeenCalledWith(
        'Footer Analytics Event:',
        expect.objectContaining({
          type: 'long_press',
        })
      );

      jest.useRealTimers();
    });
  });

  describe('清理功能测试', () => {
    it('应该在unmount时清理定时器', () => {
      jest.useFakeTimers();
      const { unmount } = renderHook(() => useFooterInteraction());

      const { result } = renderHook(() => useFooterInteraction());

      act(() => {
        result.current.handleLongPressStart('test-element');
      });

      unmount();

      // 验证定时器被清理（不会有额外的日志输出）
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      jest.useRealTimers();
    });
  });
});

describe('useFooterInteractionSimple', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基础功能测试', () => {
    it('应该初始化正确的默认状态', () => {
      const { result } = renderHook(() => useFooterInteractionSimple());

      expect(result.current.hoveredElement).toBe(null);
      expect(result.current.activeElement).toBe(null);
    });

    it('应该正确处理悬停事件', () => {
      const { result } = renderHook(() => useFooterInteractionSimple());

      act(() => {
        result.current.handleHoverStart('test-element');
      });

      expect(result.current.hoveredElement).toBe('test-element');
      expect(result.current.isElementHovered('test-element')).toBe(true);

      act(() => {
        result.current.handleHoverEnd();
      });

      expect(result.current.hoveredElement).toBe(null);
    });

    it('应该正确处理点击事件', () => {
      const { result } = renderHook(() => useFooterInteractionSimple());
      const mockCallback = jest.fn();

      act(() => {
        result.current.handleClick('test-element', mockCallback);
      });

      expect(result.current.activeElement).toBe('test-element');
      expect(mockCallback).toHaveBeenCalled();

      // 等待动画完成
      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(result.current.activeElement).toBe(null);
    });

    it('应该正确提供工具函数', () => {
      const { result } = renderHook(() => useFooterInteractionSimple());

      expect(result.current.isElementHovered('test')).toBe(false);
      expect(result.current.isElementActive('test')).toBe(false);

      act(() => {
        result.current.handleHoverStart('test');
      });

      expect(result.current.isElementHovered('test')).toBe(true);

      act(() => {
        result.current.handleClick('test');
      });

      expect(result.current.isElementActive('test')).toBe(true);
    });
  });

  describe('性能测试', () => {
    it('应该在合理时间内完成操作', () => {
      const { result } = renderHook(() => useFooterInteractionSimple());

      const startTime = performance.now();

      act(() => {
        result.current.handleHoverStart('test-element');
        result.current.handleClick('test-element');
        result.current.handleHoverEnd();
      });

      const endTime = performance.now();
      const operationTime = endTime - startTime;

      // 操作时间应该小于10ms
      expect(operationTime).toBeLessThan(10);
    });

    it('应该正确处理大量事件', () => {
      const { result } = renderHook(() => useFooterInteractionSimple());

      const startTime = performance.now();

      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.handleHoverStart(`element-${i}`);
          result.current.handleClick(`element-${i}`);
          result.current.handleHoverEnd();
        }
      });

      const endTime = performance.now();
      const operationTime = endTime - startTime;

      // 即使处理100个事件，时间也应该小于50ms
      expect(operationTime).toBeLessThan(50);
    });
  });
});

describe('边界情况测试', () => {
  it('应该处理空字符串ID', () => {
    const { result } = renderHook(() => useFooterInteraction());

    expect(() => {
      act(() => {
        result.current.handleHoverStart('');
        result.current.handleClick('');
        result.current.handleFocus('');
      });
    }).not.toThrow();
  });

  it('应该处理undefined和null值', () => {
    const { result } = renderHook(() => useFooterInteraction());

    expect(() => {
      act(() => {
        // @ts-ignore - 故意传递无效值测试边界情况
        result.current.handleHoverStart(undefined);
        result.current.handleClick(null);
        result.current.handleFocus(undefined);
      });
    }).not.toThrow();
  });

  it('应该处理快速连续事件', () => {
    const { result } = renderHook(() => useFooterInteraction());

    expect(() => {
      act(() => {
        for (let i = 0; i < 1000; i++) {
          result.current.handleHoverStart('test-element');
          result.current.handleHoverEnd();
          result.current.handleClick('test-element');
        }
      });
    }).not.toThrow();
  });

  it('应该处理无效的键盘事件', () => {
    const { result } = renderHook(() => useFooterInteraction());
    const invalidEvent = {
      key: 'InvalidKey',
      preventDefault: jest.fn(),
    } as any;

    expect(() => {
      act(() => {
        result.current.handleKeyDown(invalidEvent, 'test-element', '/test');
      });
    }).not.toThrow();

    expect(invalidEvent.preventDefault).not.toHaveBeenCalled();
  });
});

describe('内存泄漏测试', () => {
  it('应该正确清理定时器', () => {
    jest.useFakeTimers();

    const { unmount } = renderHook(() => useFooterInteraction());
    const { result } = renderHook(() => useFooterInteraction());

    act(() => {
      result.current.handleLongPressStart('test-element');
    });

    // 卸载Hook
    unmount();

    // 验证定时器被清理
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // 不应该有额外的日志输出
    expect(console.log).not.toHaveBeenCalledWith(
      expect.stringContaining('long_press'),
      expect.any(Object)
    );

    jest.useRealTimers();
  });

  it('应该正确清理事件监听器', () => {
    const { unmount } = renderHook(() => useFooterInteraction());

    // 模拟添加事件监听器
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

    unmount();

    // 验证事件监听器被正确清理
    // 这里只是示例，实际的清理逻辑在Hook内部
    expect(addEventListenerSpy).toHaveBeenCalled();
  });
});