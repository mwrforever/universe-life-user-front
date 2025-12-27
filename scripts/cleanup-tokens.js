/**
 * 清理本地存储中的旧Token和过期Token
 * 只保留当前universe-life应用需要的token
 */

// 清理函数
function cleanupLocalStorage() {
  console.log('🧹 开始清理本地存储...\n');

  // 需要保留的token (当前应用使用)
  const tokensToKeep = [
    'universe_access_token',
    'universe_refresh_token',
    'universe_id_token',
    'universe_user_info',
    'universe_token_expires_at'
  ];

  // 需要清理的旧token
  const tokensToClean = [
    'auth_token',
    'oauth_access_token',
    'oauth_device_id',
    'oauth_expires_at',
    'TanstackQueryDevtools.open'
  ];

  console.log('📋 清理前存储状态:');
  const beforeCleanup = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('token') || key.includes('oauth') || key.includes('auth'))) {
      const value = localStorage.getItem(key);
      beforeCleanup[key] = value ? value.substring(0, 50) + '...' : 'null';
    }
  }
  console.table(beforeCleanup);

  // 清理旧token
  let cleanedCount = 0;
  tokensToClean.forEach(key => {
    if (localStorage.getItem(key)) {
      console.log(`🗑️  清理: ${key}`);
      localStorage.removeItem(key);
      cleanedCount++;
    }
  });

  // 清理OAuth2相关的临时数据
  const oauthTempKeys = [
    'oauth2_code_verifier',
    'oauth2_state',
    'oauth2_redirect_url'
  ];

  oauthTempKeys.forEach(key => {
    if (localStorage.getItem(key)) {
      console.log(`🗑️  清理OAuth2临时数据: ${key}`);
      localStorage.removeItem(key);
      cleanedCount++;
    }
  });

  // 检查并清理过期的universe token
  const expiresAt = localStorage.getItem('universe_token_expires_at');
  const currentAccessToken = localStorage.getItem('universe_access_token');

  if (expiresAt && currentAccessToken) {
    const expirationTime = parseInt(expiresAt);
    const currentTime = Date.now();

    if (currentTime >= expirationTime) {
      console.log('⏰ 检测到过期的universe token，清理所有相关数据');
      localStorage.removeItem('universe_access_token');
      localStorage.removeItem('universe_refresh_token');
      localStorage.removeItem('universe_id_token');
      localStorage.removeItem('universe_user_info');
      localStorage.removeItem('universe_token_expires_at');
      cleanedCount += 5;
    }
  }

  console.log('\n📋 清理后存储状态:');
  const afterCleanup = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('token') || key.includes('oauth') || key.includes('auth'))) {
      const value = localStorage.getItem(key);
      afterCleanup[key] = value ? value.substring(0, 50) + '...' : 'null';
    }
  }
  console.table(afterCleanup);

  console.log(`\n✅ 清理完成！共清理了 ${cleanedCount} 个项目`);

  // 验证当前应用token状态
  const hasUniverseTokens = tokensToKeep.some(key => localStorage.getItem(key));
  if (hasUniverseTokens) {
    console.log('✅ 当前应用的token已保留');
  } else {
    console.log('⚠️  当前应用没有任何token，需要重新登录');
  }
}

// Token信息分析函数
function analyzeTokens() {
  console.log('\n🔍 当前Token分析:\n');

  // 分析universe token
  const universeAccessToken = localStorage.getItem('universe_access_token');
  const universeRefreshToken = localStorage.getItem('universe_refresh_token');
  const universeIdToken = localStorage.getItem('universe_id_token');
  const expiresAt = localStorage.getItem('universe_token_expires_at');

  if (universeAccessToken) {
    try {
      // 尝试解析JWT payload (不验证签名)
      const parts = universeAccessToken.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        console.log('🔑 Universe Access Token 信息:');
        console.log(`   用户ID: ${payload.user_id}`);
        console.log(`   用户: ${payload.sub}`);
        console.log(`   权限范围: ${payload.scope?.join(', ')}`);
        console.log(`   过期时间: ${new Date(payload.exp * 1000).toLocaleString()}`);
        console.log(`   剩余时间: ${Math.floor((payload.exp * 1000 - Date.now()) / 1000 / 60)} 分钟`);
      }
    } catch (e) {
      console.log('❌ 无法解析universe access token');
    }
  }

  if (universeRefreshToken) {
    console.log(`🔄 Refresh Token: ${universeRefreshToken.substring(0, 20)}...`);
  }

  if (universeIdToken) {
    try {
      const parts = universeIdToken.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        console.log('👤 ID Token 信息:');
        console.log(`   用户名: ${payload.username}`);
        console.log(`   用户ID: ${payload.sub}`);
        console.log(`   认证时间: ${new Date(payload.auth_time * 1000).toLocaleString()}`);
      }
    } catch (e) {
      console.log('❌ 无法解析ID token');
    }
  }

  if (expiresAt) {
    const expirationTime = parseInt(expiresAt);
    const currentTime = Date.now();
    const remainingMinutes = Math.floor((expirationTime - currentTime) / 1000 / 60);

    if (remainingMinutes > 0) {
      console.log(`⏰ Access Token 剩余: ${remainingMinutes} 分钟`);
    } else {
      console.log(`⚠️  Access Token 已过期 ${Math.abs(remainingMinutes)} 分钟`);
    }
  }
}

// 主函数
function main() {
  console.log('🚀 Universe Life Token 清理工具\n');

  // 显示当前状态
  analyzeTokens();

  // 询问是否清理
  const shouldClean = confirm('\n是否要清理旧的Token和临时数据？\n这将保留当前应用的universe token，清理其他所有token。');

  if (shouldClean) {
    cleanupLocalStorage();
  } else {
    console.log('❌ 取消清理');
  }
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
  // 可以在浏览器控制台中直接运行
  window.cleanupTokens = cleanupLocalStorage;
  window.analyzeTokens = analyzeTokens;
  console.log('💡 已在window中注册函数，可以手动调用:');
  console.log('   cleanupTokens() - 清理token');
  console.log('   analyzeTokens() - 分析token');
}

// 如果直接运行此脚本
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { cleanupLocalStorage, analyzeTokens };
} else {
  main();
}