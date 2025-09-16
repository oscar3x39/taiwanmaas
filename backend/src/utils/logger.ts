/**
 * 🤖 AI-Generated Winston Logger Configuration
 * 📝 Human-Reviewed and Optimized
 * 
 * 統一日誌記錄系統
 * 展示 Node.js 應用程式日誌管理最佳實踐
 */

import winston from 'winston';
import path from 'path';

// 日誌等級定義
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// 日誌顏色配置
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue'
};

winston.addColors(logColors);

// 自定義日誌格式
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;
    
    // 如果有額外的 metadata，格式化輸出
    const metaStr = Object.keys(meta).length > 0 
      ? `\n${JSON.stringify(meta, null, 2)}` 
      : '';
    
    return `${timestamp} [${level.toUpperCase()}]: ${message}${metaStr}`;
  })
);

// 控制台輸出格式（開發環境用）
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;
    
    // 簡化的控制台輸出
    let output = `${timestamp} ${level}: ${message}`;
    
    // 如果有錯誤堆疊，顯示它
    if (info['stack']) {
      output += `\n${info['stack']}`;
    }
    
    // 如果有其他 metadata，簡化顯示
    if (Object.keys(meta).length > 0) {
      const importantMeta: Record<string, any> = {};
      if (meta['requestId']) importantMeta['requestId'] = meta['requestId'];
      if (meta['method']) importantMeta['method'] = meta['method'];
      if (meta['url']) importantMeta['url'] = meta['url'];
      if (meta['statusCode']) importantMeta['statusCode'] = meta['statusCode'];
      if (meta['duration']) importantMeta['duration'] = meta['duration'];
      
      if (Object.keys(importantMeta).length > 0) {
        output += ` ${JSON.stringify(importantMeta)}`;
      }
    }
    
    return output;
  })
);

// 建立 Winston logger 實例
const logger = winston.createLogger({
  level: process.env['LOG_LEVEL'] || (process.env['NODE_ENV'] === 'production' ? 'info' : 'debug'),
  levels: logLevels,
  format: logFormat,
  defaultMeta: {
    service: 'taiwan-transport-api',
    version: '1.0.0'
  },
  transports: [
    // 錯誤日誌檔案
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
    
    // 組合日誌檔案
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ],
  
  // 異常處理
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'exceptions.log')
    })
  ],
  
  // 未捕獲的 Promise rejection 處理
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'rejections.log')
    })
  ]
});

// 在非生產環境中添加控制台輸出
if (process.env['NODE_ENV'] !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

// 在生產環境中，也可以選擇性地添加控制台輸出
if (process.env['NODE_ENV'] === 'production' && process.env['ENABLE_CONSOLE_LOG'] === 'true') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.simple()
    )
  }));
}

/**
 * 建立子 logger，用於特定模組
 */
export const createChildLogger = (module: string) => {
  return logger.child({ module });
};

/**
 * 效能監控日誌輔助函數
 */
export const logPerformance = (operation: string, startTime: number, metadata?: any) => {
  const duration = Date.now() - startTime;
  logger.info(`Performance: ${operation}`, {
    operation,
    duration: `${duration}ms`,
    ...metadata
  });
  
  // 如果操作時間過長，記錄警告
  if (duration > 1000) {
    logger.warn(`Slow operation detected: ${operation}`, {
      operation,
      duration: `${duration}ms`,
      ...metadata
    });
  }
};

/**
 * API 請求日誌輔助函數
 */
export const logApiRequest = (method: string, url: string, statusCode: number, duration: number, metadata?: any) => {
  const level = statusCode >= 400 ? 'warn' : 'info';
  logger.log(level, `API ${method} ${url}`, {
    method,
    url,
    statusCode,
    duration: `${duration}ms`,
    ...metadata
  });
};

/**
 * 錯誤日誌輔助函數
 */
export const logError = (error: Error, context?: any) => {
  logger.error('Application Error', {
    message: error.message,
    stack: error.stack,
    name: error.name,
    ...context
  });
};

/**
 * 安全事件日誌輔助函數
 */
export const logSecurityEvent = (event: string, details: any) => {
  logger.warn(`Security Event: ${event}`, {
    event,
    timestamp: new Date().toISOString(),
    ...details
  });
};

export { logger };