/**
 * 🤖 AI-Generated Error Handling Middleware
 * 📝 Human-Reviewed and Optimized
 * 
 * 統一錯誤處理中介軟體
 * 展示 Express.js 錯誤處理最佳實踐
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface APIError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

/**
 * 統一錯誤處理中介軟體
 * 將所有錯誤轉換為標準化的 JSON 回應
 */
export const errorHandler = (
  error: APIError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // 記錄錯誤詳情
  logger.error('API Error:', {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // 預設錯誤狀態碼
  const statusCode = error.statusCode || 500;
  
  // 預設錯誤訊息
  const message = error.message || 'Internal Server Error';
  
  // 錯誤代碼
  const code = error.code || 'INTERNAL_ERROR';

  // 建立標準化錯誤回應
  const errorResponse: any = {
    error: message,
    code,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  };

  // 在開發環境中包含更多錯誤詳情
  if (process.env['NODE_ENV'] === 'development') {
    errorResponse.stack = error.stack;
    errorResponse.details = error.details;
  }

  // 根據錯誤類型提供不同的處理
  switch (statusCode) {
    case 400:
      errorResponse.message = '請求參數錯誤，請檢查輸入資料';
      break;
    case 401:
      errorResponse.message = '未授權訪問，請提供有效的認證資訊';
      break;
    case 403:
      errorResponse.message = '禁止訪問，您沒有權限執行此操作';
      break;
    case 404:
      errorResponse.message = '找不到請求的資源';
      break;
    case 429:
      errorResponse.message = '請求過於頻繁，請稍後再試';
      break;
    case 500:
      errorResponse.message = '伺服器內部錯誤，請聯繫系統管理員';
      break;
    default:
      errorResponse.message = message;
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * 建立自定義錯誤的輔助函數
 */
export const createError = (
  message: string,
  statusCode: number = 500,
  code?: string,
  details?: any
): APIError => {
  const error = new Error(message) as APIError;
  error.statusCode = statusCode;
  if (code) error.code = code;
  error.details = details;
  return error;
};

/**
 * 常用錯誤建立函數
 */
export const errors = {
  badRequest: (message: string, details?: any) => 
    createError(message, 400, 'BAD_REQUEST', details),
  
  unauthorized: (message: string = 'Unauthorized') => 
    createError(message, 401, 'UNAUTHORIZED'),
  
  forbidden: (message: string = 'Forbidden') => 
    createError(message, 403, 'FORBIDDEN'),
  
  notFound: (message: string = 'Not Found') => 
    createError(message, 404, 'NOT_FOUND'),
  
  conflict: (message: string, details?: any) => 
    createError(message, 409, 'CONFLICT', details),
  
  tooManyRequests: (message: string = 'Too Many Requests') => 
    createError(message, 429, 'TOO_MANY_REQUESTS'),
  
  internalServer: (message: string = 'Internal Server Error', details?: any) => 
    createError(message, 500, 'INTERNAL_SERVER_ERROR', details),
  
  serviceUnavailable: (message: string = 'Service Unavailable') => 
    createError(message, 503, 'SERVICE_UNAVAILABLE'),

  // 專案特定錯誤
  invalidCoordinates: (message: string = 'Invalid coordinates provided') => 
    createError(message, 400, 'INVALID_COORDINATES'),
  
  routeNotFound: (message: string = 'No routes found for the given locations') => 
    createError(message, 404, 'ROUTE_NOT_FOUND'),
  
  locationNotFound: (message: string = 'Location not found') => 
    createError(message, 404, 'LOCATION_NOT_FOUND'),
  
  externalApiError: (message: string = 'External API service error') => 
    createError(message, 502, 'EXTERNAL_API_ERROR')
};