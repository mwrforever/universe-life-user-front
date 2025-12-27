/**
 * 专业日志记录系统
 * 提供统一的日志记录接口，支持不同级别的日志输出
 * 在生产环境中可以配置输出级别和格式
 */

export const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
} as const;

export type LogLevel = typeof LogLevel[keyof typeof LogLevel];

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableTimestamp: boolean;
  prefix?: string;
}

class Logger {
  private config: LoggerConfig;
  private isDevelopment = process.env.NODE_ENV === 'development';

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO,
      enableConsole: true,
      enableTimestamp: this.isDevelopment,
      ...config,
    };
  }

  private formatMessage(level: string, message: string, ...args: unknown[]): string[] {
    const timestamp = this.config.enableTimestamp ? `[new Date().toISOString()] ` : '';
    const prefix = this.config.prefix ? `[${this.config.prefix}] ` : '';
    const levelStr = `[${level}]`.padEnd(5);

    const formattedMessage = `${timestamp}${prefix}${levelStr} ${message}`;
    return [formattedMessage, ...args.map(arg => String(arg))];
  }

  private shouldLog(level: LogLevel): boolean {
    return this.config.enableConsole && level >= this.config.level;
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(...this.formatMessage('DEBUG', message, ...args));
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(...this.formatMessage('INFO', message, ...args));
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(...this.formatMessage('WARN', message, ...args));
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(...this.formatMessage('ERROR', message, ...args));
    }
  }

  // 创建带有特定前缀的子logger
  createChild(prefix: string, additionalConfig: Partial<LoggerConfig> = {}): Logger {
    const childPrefix = this.config.prefix ? `${this.config.prefix}:${prefix}` : prefix;
    return new Logger({
      ...this.config,
      prefix: childPrefix,
      ...additionalConfig,
    });
  }
}

// 默认导出全局logger实例
export const logger = new Logger();

// 创建特定模块的logger
export const authLogger = logger.createChild('AUTH');
export const apiLogger = logger.createChild('API');
export const uiLogger = logger.createChild('UI');
export const perfLogger = logger.createChild('PERF');

export default logger;