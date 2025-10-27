#!/usr/bin/env node

/**
 * 智能端口清理和启动脚本
 * 检查端口3000是否被占用，如果被占用则终止占用进程，然后启动开发服务器
 */

import { exec, spawn } from 'child_process';
import net from 'net';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_PORT = 3000;

// 检查端口是否被占用
function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.listen(port, () => {
      server.once('close', () => {
        resolve(false); // 端口可用
      });
      server.close();
    });

    server.on('error', () => {
      resolve(true); // 端口被占用
    });
  });
}

// 查找占用端口的进程
function findProcessOnPort(port) {
  return new Promise((resolve, reject) => {
    // Windows系统使用netstat查找进程
    exec(`netstat -ano | findstr :${port}`, (error, stdout, stderr) => {
      if (error || !stdout) {
        resolve([]);
        return;
      }

      const lines = stdout.trim().split('\n');
      const processes = [];

      for (const line of lines) {
        const match = line.match(/:(\d+)\s+.*?(\d+)$/);
        if (match && parseInt(match[1]) === port) {
          const pid = parseInt(match[2]);
          if (pid && pid > 0) {
            processes.push(pid);
          }
        }
      }

      resolve([...new Set(processes)]); // 去重
    });
  });
}

// 终止进程
function killProcess(pid) {
  return new Promise((resolve) => {
    exec(`taskkill /F /PID ${pid}`, (error, stdout, stderr) => {
      if (error) {
        console.log(`终止进程 PID ${pid} 失败:`, error.message);
      } else {
        console.log(`✅ 成功终止占用端口${TARGET_PORT}的进程 PID: ${pid}`);
      }
      resolve(!error);
    });
  });
}

// 启动开发服务器
function startDevServer() {
  console.log('🚀 启动开发服务器...');

  // 设置环境变量强制使用3000端口
  const env = { ...process.env };

  const devServer = spawn('npm', ['run', 'dev:raw'], {
    stdio: 'inherit',
    env: env,
    cwd: process.cwd(),
    shell: true
  });

  devServer.on('error', (error) => {
    console.error('启动开发服务器失败:', error);
    process.exit(1);
  });

  // 处理程序退出信号
  process.on('SIGINT', () => {
    console.log('\n🛑 正在关闭开发服务器...');
    devServer.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 正在关闭开发服务器...');
    devServer.kill('SIGTERM');
    process.exit(0);
  });

  return devServer;
}

// 主函数
async function main() {
  console.log(`🔍 检查端口 ${TARGET_PORT} 状态...`);

  try {
    const isPortOccupied = await checkPort(TARGET_PORT);

    if (!isPortOccupied) {
      console.log(`✅ 端口 ${TARGET_PORT} 可用，直接启动开发服务器`);
      startDevServer();
      return;
    }

    console.log(`⚠️  端口 ${TARGET_PORT} 被占用，正在查找占用进程...`);

    const processes = await findProcessOnPort(TARGET_PORT);

    if (processes.length === 0) {
      console.log(`❌ 无法找到占用端口 ${TARGET_PORT} 的进程，尝试直接启动...`);
      startDevServer();
      return;
    }

    console.log(`🎯 找到 ${processes.length} 个占用端口的进程: ${processes.join(', ')}`);

    // 终止所有占用进程
    let killedCount = 0;
    for (const pid of processes) {
      const success = await killProcess(pid);
      if (success) killedCount++;
    }

    if (killedCount > 0) {
      console.log('⏳ 等待端口释放...');
      // 等待2秒让端口完全释放
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // 再次检查端口
    const stillOccupied = await checkPort(TARGET_PORT);
    if (stillOccupied) {
      console.log(`❌ 端口 ${TARGET_PORT} 仍被占用，请手动检查并终止相关进程`);
      process.exit(1);
    }

    console.log(`✅ 端口 ${TARGET_PORT} 已释放，启动开发服务器...`);
    startDevServer();

  } catch (error) {
    console.error('❌ 启动过程中发生错误:', error);
    process.exit(1);
  }
}

// 运行主函数
main();