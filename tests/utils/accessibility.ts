import { render, RenderOptions } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ReactElement } from 'react';
import { cleanup } from '@testing-library/react';

// 可访问性测试配置
interface AccessibilityConfig {
  rules?: any;
  tags?: string[];
  reporter?: string;
}

// 默认可访问性规则
const defaultAxeConfig: AccessibilityConfig = {
  tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
  rules: {
    // 自定义规则
    'color-contrast': { enabled: true },
    'keyboard-navigation': { enabled: true },
    'aria-labels': { enabled: true },
    'focus-management': { enabled: true },
    'link-name': { enabled: true },
    'button-name': { enabled: true },
    'image-alt': { enabled: true },
    'form-field-multiple-labels': { enabled: true },
    'input-button-name': { enabled: true },
  },
};

// 扩展Jest匹配器
expect.extend(toHaveNoViolations);

// 渲染组件并运行可访问性测试
export const renderWithAccessibility = (
  ui: ReactElement,
  options: RenderOptions = {},
  config: AccessibilityConfig = {}
) => {
  const configToUse = { ...defaultAxeConfig, ...config };

  const view = render(ui, options);

  // 使用axe检查可访问性
  if (view.container) {
    axe(view.container, configToUse).catch(error => {
      console.error('Accessibility violations found:', error);
      throw error;
    });
  }

  return view;
};

// 创建可访问性测试套件
export const createAccessibilityTestSuite = (description: string) => {
  return {
    describe,
    it: (name: string, testFn: () => Promise<void>) => {
      it(name, async () => {
        await testFn();
      });
    },
  };
};

// 检查颜色对比度
export const checkColorContrast = async (element: HTMLElement, config?: AccessibilityConfig) => {
  const results = await axe(element, {
    ...defaultAxeConfig,
    ...config,
    rules: {
      'color-contrast': { enabled: true },
    },
  });

  return results;
};

// 检查键盘导航
export const checkKeyboardNavigation = async (element: HTMLElement) => {
  // 模拟键盘导航
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const violations: string[] = [];

  for (let i = 0; i < focusableElements.length; i++) {
    const el = focusableElements[i] as HTMLElement;

    // 检查是否可以获得焦点
    el.focus();
    if (document.activeElement !== el) {
      violations.push(`Element ${el.tagName} cannot be focused`);
    }

    // 检查是否有aria标签
    if (el.tagName === 'BUTTON' && !el.getAttribute('aria-label') && !el.textContent.trim()) {
      violations.push(`Button element has no accessible name`);
    }

    // 检查输入框是否有标签
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      const id = el.getAttribute('id');
      if (id) {
        const label = document.querySelector(`label[for="${id}"]`);
        if (!label) {
          violations.push(`Input element has no associated label`);
        }
      }
    }
  }

  return violations;
};

// 检查ARIA标签
export const checkARIALabels = async (element: HTMLElement) => {
  const results = await axe(element, {
    ...defaultAxeConfig,
    rules: {
      'aria-labels': { enabled: true },
      'aria-valid-attr': { enabled: true },
      'aria-required-attr': { enabled: true },
      'aria-roles': { enabled: true },
    },
  });

  return results;
};

// 检查焦点管理
export const checkFocusManagement = async (element: HTMLElement) => {
  const results = await axe(element, {
    ...defaultAxeConfig,
    rules: {
      'focus-order-semantics': { enabled: true },
      'tabindex': { enabled: true },
      'focus-management': { enabled: true },
    },
  });

  return results;
};

// 检查链接可访问性
export const checkLinkAccessibility = async (element: HTMLElement) => {
  const links = element.querySelectorAll('a[href]');
  const violations: string[] = [];

  links.forEach((link, index) => {
    const href = link.getAttribute('href');
    const text = link.textContent?.trim();

    // 检查链接是否有文本或aria-label
    if (!text && !link.getAttribute('aria-label')) {
      violations.push(`Link ${index + 1} has no accessible text`);
    }

    // 检查外部链接是否设置了rel="noopener"
    if (href && href.startsWith('http') && !link.getAttribute('rel')) {
      violations.push(`External link should have rel="noopener"`);
    }
  });

  return violations;
};

// 检查表单可访问性
export const checkFormAccessibility = async (element: HTMLElement) => {
  const results = await axe(element, {
    ...defaultAxeConfig,
    rules: {
      'label': { enabled: true },
      'form-field-multiple-labels': { enabled: true },
      'input-button-name': { enabled: true },
      'fieldset': { enabled: true },
      'legend': { enabled: true },
    },
  });

  return results;
};

// 检查图像可访问性
export const checkImageAccessibility = async (element: HTMLElement) => {
  const images = element.querySelectorAll('img');
  const violations: string[] = [];

  images.forEach((img, index) => {
    const alt = img.getAttribute('alt');

    // 检查图片是否有alt属性
    if (alt === null) {
      violations.push(`Image ${index + 1} is missing alt attribute`);
    }

    // 检查alt文本是否为装饰性图片的空字符串
    if (alt === '' && !img.getAttribute('role')) {
      violations.push(`Decorative image ${index + 1} should have role="presentation" or empty alt=""`);
    }
  });

  return violations;
};

// 生成可访问性报告
export const generateAccessibilityReport = async (
  element: HTMLElement,
  config: AccessibilityConfig = {}
) => {
  const reports = [];

  // 基础axe测试
  const axeResults = await axe(element, { ...defaultAxeConfig, ...config });
  reports.push({
    test: 'axe-core',
    violations: axeResults.violations,
    passes: axeResults.passes,
    incomplete: axeResults.incomplete,
  });

  // 颜色对比度测试
  const colorContrastResults = await checkColorContrast(element, config);
  reports.push({
    test: 'color-contrast',
    violations: colorContrastResults.violations,
    passes: colorContrastResults.passes,
    incomplete: colorContrastResults.incomplete,
  });

  // 键盘导航测试
  const keyboardViolations = await checkKeyboardNavigation(element);
  if (keyboardViolations.length > 0) {
    reports.push({
      test: 'keyboard-navigation',
      violations: keyboardViolations.map(violation => ({
        id: 'keyboard-nav-error',
        description: violation,
        impact: 'serious',
        nodes: [],
      })),
      passes: [],
      incomplete: [],
    });
  }

  // ARIA标签测试
  const ariaResults = await checkARIALabels(element);
  reports.push({
    test: 'aria-labels',
    violations: ariaResults.violations,
    passes: ariaResults.passes,
    incomplete: ariaResults.incomplete,
  });

  // 表单可访问性测试
  const formResults = await checkFormAccessibility(element);
  reports.push({
    test: 'form-accessibility',
    violations: formResults.violations,
    passes: formResults.passes,
    incomplete: formResults.incomplete,
  });

  // 图像可访问性测试
  const imageViolations = await checkImageAccessibility(element);
  if (imageViolations.length > 0) {
    reports.push({
      test: 'image-accessibility',
      violations: imageViolations.map(violation => ({
        id: 'image-a11y-error',
        description: violation,
        impact: 'serious',
        nodes: [],
      })),
      passes: [],
      incomplete: [],
    });
  }

  return {
    timestamp: Date.now(),
    url: window.location.href,
    reports,
    summary: {
      totalViolations: reports.reduce((sum, report) => sum + report.violations.length, 0),
      totalPasses: reports.reduce((sum, report) => sum + report.passes.length, 0),
      totalIncomplete: reports.reduce((sum, report) => sum + report.incomplete.length, 0),
    },
  };
};

// 可访问性测试断言匹配器
export const toBeAccessible = () => {
  return {
    name: 'toBeAccessible',
    async fn(received: HTMLElement) {
      const results = await axe(received, defaultAxeConfig);
      if (results.violations.length > 0) {
        return {
          message: `Found ${results.violations.length} accessibility violations`,
          pass: false,
        };
      }
      return {
        message: 'Component is accessible',
        pass: true,
      };
    },
  };
};

// 扩展expect
expect.extend({
  toBeAccessible,
});

export * from '@testing-library/react';
export { axe, toHaveNoViolations };