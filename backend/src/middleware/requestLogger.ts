/**
 * 🤖 AI-Generated Request Logging Middleware
 * 📝 Human-Reviewed and Optimized
 * 
 * 請求日誌記錄中介軟體
 * 展示 Express.js 請求追蹤和監控最佳實踐
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * 請求日誌記錄中介軟體
 * 記錄所有 API 請求的詳細資訊，用於監控和除錯
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  
  // 記錄請求開始
  const requestId = generateRequestId();
  req.headers['x-request-id'] = requestId;
  
  logger.info('Request started', {
    requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    contentType: req.get('Content-Type'),
    contentLength: req.get('Content-Length'),
    timestamp: new Date().toISOString()
  });

  // 攔截回應結束事件
  const originalSend = res.send;
  res.send = function(body: any) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // 記錄請求完成
    logger.info('Request completed', {
      requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      responseSize: Buffer.byteLength(body || '', 'utf8'),
      timestamp: new Date().toISOString()
    });

    // 如果回應時間過長，記錄警告
    if (duration > 5000) { // 5秒
      logger.warn('Slow request detected', {
        requestId,
        method: req.method,
        url: req.originalUrl,
        duration: `${duration}ms`
      });
    }

    // 如果是錯誤狀態碼，記錄額外資訊
    if (res.statusCode >= 400) {
      logger.warn('Request failed', {
        requestId,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip
      });
    }

    return originalSend.call(this, body);
  };

  next();
};

/**
 * 生成唯一的請求 ID
 * 用於追蹤單一請求的完整生命週期
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * API 效能監控中介軟體
 * 收集 API 效能指標用於監控
 */
export const performanceMonitor = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = process.hrtime.bigint();
  
  res.on('finish', () => {
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1000000; // 轉換為毫秒
    
    // 記錄效能指標
    logger.info('Performance metrics', {
      method: req.method,
      route: req.route?.path || req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration.toFixed(2)}ms`,
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString()
    });
  });
  
  next();
};

/**
 * 安全性日誌中介軟體
 * 記錄可疑的請求活動
 */
export const securityLogger = (req: Request, _res: Response, next: NextFunction): void => {
  const suspiciousPatterns = [
    /\.\./,           // 路徑遍歷
    /<script/i,       // XSS 嘗試
    /union.*select/i, // SQL 注入
    /javascript:/i,   // JavaScript 協議
    /vbscript:/i      // VBScript 協議
  ];

  const requestData = JSON.stringify({
    url: req.originalUrl,
    query: req.query,
    body: req.body,
    headers: req.headers
  });

  // 檢查是否包含可疑模式
  const isSuspicious = suspiciousPatterns.some(pattern => 
    pattern.test(requestData)
  );

  if (isSuspicious) {
    logger.warn('Suspicious request detected', {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      query: req.query,
      body: req.body,
      timestamp: new Date().toISOString()
    });
  }

  // 記錄異常大的請求
  const contentLength = parseInt(req.get('Content-Length') || '0', 10);
  if (contentLength > 10 * 1024 * 1024) { // 10MB
    logger.warn('Large request detected', {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      contentLength: `${contentLength} bytes`,
      timestamp: new Date().toISOString()
    });
  }

  next();
};