/**
 * 本地存储清理脚本
 * 清理所有旧的和过期的token，只保留当前应用需要的token
 */

console.log('🧹 开始清理本地存储...');

// 统计清理前状态
const beforeCleanup = {};
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('token') || key.includes('oauth') || key.includes('auth'))) {
        const value = localStorage.getItem(key);
        beforeCleanup[key] = value ? `${value.substring(0, 50)}${value.length > 50 ? '...' : ''}` : 'null';
    }
}

console.log('📋 清理前的Token状态:');
console.table(beforeCleanup);

let cleanedCount = 0;

// 需要清理的旧token和过期数据
const itemsToClean = [
    'auth_token',                           // 旧版认证token (已过期)
    'oauth_access_token',                   // 另一种格式的OAuth2 token (已过期)
    'oauth_device_id',                      // OAuth2设备标识
    'oauth_expires_at',                     // OAuth2过期时间
    'TanstackQueryDevtools.open'            // 开发工具设置
];

// OAuth2临时数据
const oauthTempData = [
    'oauth2_code_verifier',
    'oauth2_state',
    'oauth2_redirect_url'
];

// 清理旧token
itemsToClean.forEach(key => {
    if (localStorage.getItem(key)) {
        console.log(`🗑️  清理旧Token: ${key}`);
        localStorage.removeItem(key);
        cleanedCount++;
    }
});

// 清理OAuth2临时数据
oauthTempData.forEach(key => {
    if (localStorage.getItem(key)) {
        console.log(`🗑️  清理临时数据: ${key}`);
        localStorage.removeItem(key);
        cleanedCount++;
    }
});

// 检查universe token是否过期
const expiresAt = localStorage.getItem('universe_token_expires_at');
const currentAccessToken = localStorage.getItem('universe_access_token');

if (expiresAt && currentAccessToken) {
    const expirationTime = parseInt(expiresAt);
    const currentTime = Date.now();
    const remainingMinutes = Math.floor((expirationTime - currentTime) / 1000 / 60);

    if (currentTime >= expirationTime) {
        console.log('⏰ 检测到过期的universe token，清理相关数据');
        const expiredTokens = [
            'universe_access_token',
            'universe_refresh_token',
            'universe_id_token',
            'universe_user_info',
            'universe_token_expires_at'
        ];

        expiredTokens.forEach(key => {
            if (localStorage.getItem(key)) {
                console.log(`🗑️  清理过期Token: ${key}`);
                localStorage.removeItem(key);
                cleanedCount++;
            }
        });
    } else {
        console.log(`✅ Universe Access Token 仍然有效，剩余 ${remainingMinutes} 分钟`);
    }
}

// 显示清理后状态
console.log('\n📋 清理后的Token状态:');
const afterCleanup = {};
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('token') || key.includes('oauth') || key.includes('auth'))) {
        const value = localStorage.getItem(key);
        afterCleanup[key] = value ? `${value.substring(0, 50)}${value.length > 50 ? '...' : ''}` : 'null';
    }
}

if (Object.keys(afterCleanup).length === 0) {
    console.log('🎉 没有任何认证相关的Token，本地存储已完全清理');
} else {
    console.table(afterCleanup);
}

// 分析当前有效token状态
console.log('\n🔍 当前有效Token分析:');

const universeAccessToken = localStorage.getItem('universe_access_token');
const universeRefreshToken = localStorage.getItem('universe_refresh_token');
const universeIdToken = localStorage.getItem('universe_id_token');

if (universeAccessToken) {
    try {
        const parts = universeAccessToken.split('.');
        if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            const remainingMinutes = Math.floor((payload.exp * 1000 - Date.now()) / 1000 / 60);

            console.log('✅ Universe Access Token:');
            console.log(`   用户: ${payload.sub}`);
            console.log(`   用户ID: ${payload.user_id}`);
            console.log(`   权限: ${payload.scope?.join(', ') || 'N/A'}`);
            console.log(`   状态: ${remainingMinutes > 0 ? `有效 (剩余${remainingMinutes}分钟)` : '已过期'}`);
            console.log(`   过期时间: ${new Date(payload.exp * 1000).toLocaleString()}`);
        }
    } catch (e) {
        console.log('❌ Universe Access Token: 无法解析');
    }
}

if (universeRefreshToken) {
    console.log(`✅ Refresh Token: ${universeRefreshToken.substring(0, 30)}...`);
}

if (universeIdToken) {
    try {
        const parts = universeIdToken.split('.');
        if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            console.log('✅ ID Token:');
            console.log(`   用户名: ${payload.username}`);
            console.log(`   用户ID: ${payload.sub}`);
            console.log(`   认证时间: ${new Date(payload.auth_time * 1000).toLocaleString()}`);
        }
    } catch (e) {
        console.log('❌ ID Token: 无法解析');
    }
}

console.log(`\n🎉 清理完成！共清理了 ${cleanedCount} 个项目`);

// 验证清理结果
const hasValidTokens = universeAccessToken && universeRefreshToken;
if (hasValidTokens) {
    console.log('✅ 当前应用的Token状态良好，可以继续使用');
} else {
    console.log('⚠️  没有有效的Token，可能需要重新登录');
}