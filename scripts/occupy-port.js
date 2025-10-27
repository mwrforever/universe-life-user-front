#!/usr/bin/env node

/**
 * 临时占用3000端口的测试服务器
 * 用于测试端口清理功能
 */

import http from 'http';

const PORT = 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Port 3000 is occupied by test server');
});

server.listen(PORT, () => {
  console.log(`🎯 测试服务器已占用端口 ${PORT}`);
  console.log('按 Ctrl+C 停止服务器');
});

process.on('SIGINT', () => {
  console.log('\n🛑 停止测试服务器...');
  server.close(() => {
    console.log('✅ 测试服务器已停止');
    process.exit(0);
  });
});