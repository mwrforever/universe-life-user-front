/**
 * 性能测试工具
 * 用于验证无限滚动功能的性能表现
 */

export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  scrollFPS: number;
  itemsCount: number;
}

export class PerformanceTest {
  private static instance: PerformanceTest;
  private startTime: number = 0;
  private frameCount: number = 0;

  static getInstance(): PerformanceTest {
    if (!PerformanceTest.instance) {
      PerformanceTest.instance = new PerformanceTest();
    }
    return PerformanceTest.instance;
  }

  /**
   * 开始性能测试
   */
  startTest(): void {
    this.startTime = performance.now();
    this.frameCount = 0;
  }

  /**
   * 记录帧渲染
   */
  recordFrame(): void {
    this.frameCount++;
  }

  /**
   * 计算FPS
   */
  calculateFPS(): number {
    const currentTime = performance.now();
    const elapsedSeconds = (currentTime - this.startTime) / 1000;
    return this.frameCount / elapsedSeconds;
  }

  /**
   * 获取内存使用情况
   */
  getMemoryUsage(): number {
    if ('memory' in performance) {
      const memory = (performance as Performance & {
        memory?: {
          usedJSHeapSize: number;
          totalJSHeapSize: number;
          jsHeapSizeLimit: number;
        };
      }).memory;
      return memory ? memory.usedJSHeapSize / 1024 / 1024 : 0; // MB
    }
    return 0;
  }

  /**
   * 测试渲染性能
   * @param itemCount 项目数量
   * @param renderFunction 渲染函数
   */
  async testRenderPerformance(
    itemCount: number,
    renderFunction: () => void
  ): Promise<PerformanceMetrics> {
    // 清理内存
    if (window.gc) {
      window.gc();
    }

    const startTime = performance.now();
    renderFunction();
    const renderTime = performance.now() - startTime;

    const memoryUsage = this.getMemoryUsage();

    return {
      renderTime,
      memoryUsage,
      scrollFPS: 0, // 在实际滚动中计算
      itemsCount: itemCount
    };
  }

  /**
   * 测试滚动性能
   * @param container 滚动容器
   * @param duration 测试时长（毫秒）
   */
  async testScrollPerformance(
    container: HTMLElement,
    duration: number = 5000
  ): Promise<number> {
    return new Promise((resolve) => {
      let frameCount = 0;
      const startTime = performance.now();

      const measureFPS = () => {
        frameCount++;
        const currentTime = performance.now();

        if (currentTime - startTime >= duration) {
          const fps = frameCount / (duration / 1000);
          resolve(fps);
          return;
        }

        requestAnimationFrame(measureFPS);
      };

      // 开始滚动
      const scrollStep = container.scrollHeight / (duration / 16); // 60fps
      let scrollPosition = 0;

      const scroll = () => {
        scrollPosition += scrollStep;
        if (scrollPosition < container.scrollHeight - container.clientHeight) {
          container.scrollTop = scrollPosition;
          requestAnimationFrame(scroll);
        }
      };

      measureFPS();
      scroll();
    });
  }

  /**
   * 验证无限滚动性能标准
   * @param metrics 性能指标
   */
  validateInfiniteScrollPerformance(metrics: PerformanceMetrics): {
    passed: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let passed = true;

    // 检查渲染时间
    if (metrics.renderTime > 16.67) { // 60fps = 16.67ms per frame
      issues.push(`渲染时间过长: ${metrics.renderTime.toFixed(2)}ms (应小于16.67ms)`);
      recommendations.push('考虑使用React.memo优化组件渲染');
      passed = false;
    }

    // 检查内存使用
    if (metrics.memoryUsage > 100) { // 100MB
      issues.push(`内存使用过高: ${metrics.memoryUsage.toFixed(2)}MB`);
      recommendations.push('优化组件生命周期管理，避免内存泄漏');
      passed = false;
    }

    // 检查项目数量
    if (metrics.itemsCount > 50 && metrics.renderTime > 10) {
      issues.push('大量项目时渲染性能下降');
      recommendations.push('使用虚拟滚动技术优化长列表');
      passed = false;
    }

    return {
      passed,
      issues,
      recommendations
    };
  }

  /**
   * 生成性能报告
   * @param metrics 性能指标
   */
  generateReport(metrics: PerformanceMetrics): string {
    const validation = this.validateInfiniteScrollPerformance(metrics);

    return `
=== 无限滚动性能报告 ===

基础指标:
- 渲染时间: ${metrics.renderTime.toFixed(2)}ms
- 内存使用: ${metrics.memoryUsage.toFixed(2)}MB
- 项目数量: ${metrics.itemsCount}
- 滚动FPS: ${metrics.scrollFPS.toFixed(1)}

性能评估: ${validation.passed ? '✅ 通过' : '❌ 未通过'}

${validation.issues.length > 0 ? `
发现问题:
${validation.issues.map(issue => `- ${issue}`).join('\n')}
` : ''}

${validation.recommendations.length > 0 ? `
优化建议:
${validation.recommendations.map(rec => `- ${rec}`).join('\n')}
` : ''}

========================
    `.trim();
  }
}

export default PerformanceTest;