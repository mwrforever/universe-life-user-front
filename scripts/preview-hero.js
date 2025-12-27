/**
 * HeroSection 组件预览启动脚本
 * 用于快速查看HeroSection组件效果
 */

import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { extname } from 'path';

const PORT = 3001;
const PREVIEW_FILE = 'preview.html';

// MIME类型映射
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // 处理根路径
  if (req.url === '/' || req.url === '/index.html') {
    try {
      if (!existsSync(PREVIEW_FILE)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('HeroSection 预览文件不存在！');
        return;
      }

      const content = readFileSync(PREVIEW_FILE, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(content);
    } catch (error) {
      console.error('读取预览文件失败:', error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('服务器错误');
    }
    return;
  }

  // 处理静态资源
  try {
    const filePath = req.url.startsWith('/') ? req.url.slice(1) : req.url;

    if (existsSync(filePath)) {
      const ext = extname(filePath);
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      const content = readFileSync(filePath);

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('文件未找到');
    }
  } catch (error) {
    console.error('处理请求失败:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('服务器错误');
  }
});

server.listen(PORT, () => {
  console.log('\n🎨 HeroSection 组件预览服务已启动！');
  console.log(`📍 预览地址: http://localhost:${PORT}`);
  console.log(`📱 请在不同设备/窗口大小下测试响应式效果`);
  console.log(`⌨️  请使用Tab键测试可访问性功能`);
  console.log(`🎯 按Ctrl+C停止服务\n`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ 端口 ${PORT} 已被占用！`);
    console.log(`💡 请尝试以下解决方案：`);
    console.log(`   1. 关闭占用端口的程序`);
    console.log(`   2. 修改脚本中的端口号`);
    console.log(`   3. 使用 npm run dev 启动完整开发环境`);
  } else {
    console.error('❌ 服务器启动失败:', error);
  }
  process.exit(1);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n👋 正在关闭预览服务...');
  server.close(() => {
    console.log('✅ 预览服务已关闭');
    process.exit(0);
  });
});