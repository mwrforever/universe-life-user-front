import { render, RenderOptions } from '@testing-library/react';
import { configureAxe } from '@axe-core/react';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';

// 配置axe-core
configureAxe({
  rules: {
    // 自定义规则配置
    'color-contrast': { enabled: true },
    'keyboard-navigation': { enabled: true },
    'aria-labels': { enabled: true },
    'heading-order': { enabled: true },
    'landmark-one-main': { enabled: true },
    'page-has-title': { enabled: true },
    'region': { enabled: true }
  }
});

// 无障碍测试工具函数
export const testAccessibility = async (container: HTMLElement) => {
  const results = await (global as any).axe(container);
  expect(results).toHaveNoViolations();
};

// 增强的渲染函数，包含无障碍测试
export const renderWithAccessibility = async (
  ui: React.ReactElement,
  options?: RenderOptions
) => {
  const renderResult = render(ui, options);

  // 自动运行无障碍检查
  await testAccessibility(renderResult.container);

  return renderResult;
};

// 常见无障碍测试用例
export const accessibilityTests = {
  // 测试键盘导航
  testKeyboardNavigation: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    focusableElements.forEach((element, index) => {
      const htmlElement = element as HTMLElement;
      htmlElement.focus();
      expect(document.activeElement).toBe(htmlElement);
    });
  },

  // 测试ARIA标签
  testAriaLabels: (container: HTMLElement) => {
    const interactiveElements = container.querySelectorAll(
      'button, [role="button"], a, input, select, textarea'
    );

    interactiveElements.forEach(element => {
      const hasLabel =
        element.getAttribute('aria-label') ||
        element.getAttribute('aria-labelledby') ||
        element.getAttribute('title') ||
        (element as HTMLInputElement).placeholder ||
        element.textContent?.trim();

      if (element.tagName !== 'INPUT' || (element as HTMLInputElement).type !== 'hidden') {
        expect(hasLabel, `Element ${element.tagName} should have an accessible label`).toBeTruthy();
      }
    });
  },

  // 测试标题层次
  testHeadingOrder: (container: HTMLElement) => {
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;

    headings.forEach(heading => {
      const currentLevel = parseInt(heading.tagName.substring(1));
      expect(
        currentLevel <= previousLevel + 1,
        `Heading level should not skip levels (found h${currentLevel} after h${previousLevel})`
      ).toBeTruthy();
      previousLevel = currentLevel;
    });
  },

  // 测试表单标签
  testFormLabels: (container: HTMLElement) => {
    const formInputs = container.querySelectorAll('input, select, textarea');

    formInputs.forEach(input => {
      const hasLabel =
        input.getAttribute('aria-label') ||
        input.getAttribute('aria-labelledby') ||
        container.querySelector(`label[for="${input.id}"]`);

      if ((input as HTMLInputElement).type !== 'hidden') {
        expect(hasLabel, `Form input should have an associated label`).toBeTruthy();
      }
    });
  },

  // 测试图像alt文本
  testImageAltText: (container: HTMLElement) => {
    const images = container.querySelectorAll('img');

    images.forEach(img => {
      const alt = img.getAttribute('alt');
      expect(alt, `Image should have alt text`).toBeDefined();
    });
  },

  // 测试链接文本
  testLinkText: (container: HTMLElement) => {
    const links = container.querySelectorAll('a');

    links.forEach(link => {
      const text = link.textContent?.trim();
      const hasAccessibleName =
        text ||
        link.getAttribute('aria-label') ||
        link.getAttribute('title');

      expect(hasAccessibleName, `Link should have accessible text`).toBeTruthy();
    });
  }
};

// 创建无障碍测试套件
export const createAccessibilityTestSuite = (componentName: string) => {
  describe(`${componentName} Accessibility Tests`, () => {
    let container: HTMLElement;

    afterEach(() => {
      container?.remove();
    });

    it('should have no accessibility violations', async () => {
      await testAccessibility(container);
    });

    it('should support keyboard navigation', () => {
      accessibilityTests.testKeyboardNavigation(container);
    });

    it('should have proper ARIA labels', () => {
      accessibilityTests.testAriaLabels(container);
    });

    it('should have proper heading order', () => {
      accessibilityTests.testHeadingOrder(container);
    });

    it('should have proper form labels', () => {
      accessibilityTests.testFormLabels(container);
    });

    it('should have proper image alt text', () => {
      accessibilityTests.testImageAltText(container);
    });

    it('should have proper link text', () => {
      accessibilityTests.testLinkText(container);
    });
  });
};

// 声明全局axe
declare global {
  var axe: (container: HTMLElement, options?: any) => Promise<any>;
}