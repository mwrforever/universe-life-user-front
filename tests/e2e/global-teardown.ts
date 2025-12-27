async function globalTeardown() {
  console.log('🧹 开始E2E测试全局清理...');

  // 清理测试数据，关闭连接等
  // 这里可以添加清理逻辑，比如清除测试数据库等

  console.log('✅ E2E测试全局清理完成');
}

export default globalTeardown;