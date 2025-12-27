import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 开始E2E测试全局设置...');

  // 设置浏览器全局配置
  const browser = await chromium.launch();
  await browser.newContext();

  // 可以在这里设置一些全局状态，比如认证token等

  await browser.close();
  console.log('✅ E2E测试全局设置完成');

  return config;
}

export default globalSetup;