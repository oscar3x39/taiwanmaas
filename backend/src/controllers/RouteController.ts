/**
 * 🤖 AI-Generated Route Controller
 * 📝 Human-Reviewed and Optimized
 * 
 * 路線 API 控制器
 * 展示 RESTful API 設計和 Express.js 控制器模式
 */

import { Request, Response, NextFunction } from 'express';
import { RouteService } from '../services/RouteService';
// import { LocationService } from '../services/LocationService';
import { RouteRequest } from '../types';
import { logger } from '../utils/logger';
import { errors } from '../middleware/errorHandler';
import Joi from 'joi';

export class RouteController {
  private routeService: RouteService;
  constructor() {
    this.routeService = new RouteService();
  }

  /**
   * @swagger
   * /api/routes:
   *   post:
   *     summary: 計算路線
   *     description: 根據起終點座標計算最佳路線組合
   *     tags: [Routes]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - origin
   *               - destination
   *             properties:
   *               origin:
   *                 $ref: '#/components/schemas/Coordinates'
   *               destination:
   *                 $ref: '#/components/schemas/Coordinates'
   *               preferences:
   *                 type: object
   *                 properties:
   *                   prioritize:
   *                     type: string
   *                     enum: [time, cost, transfers, eco]
   *                     description: 優先考量因素
   *                   maxWalkingDistance:
   *                     type: number
   *                     description: 最大步行距離（公尺）
   *                   avoidModes:
   *                     type: array
   *                     items:
   *                       type: string
   *                     description: 避免的交通工具
   *                   departureTime:
   *                     type: string
   *                     format: date-time
   *                     description: 出發時間
   *           examples:
   *             taipei_example:
   *               summary: 台北市內路線
   *               value:
   *                 origin:
   *                   latitude: 25.0478
   *                   longitude: 121.5170
   *                 destination:
   *                   latitude: 25.0340
   *                   longitude: 121.5645
   *                 preferences:
   *                   prioritize: "time"
   *                   maxWalkingDistance: 800
   *     responses:
   *       200:
   *         description: 路線計算成功
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 routes:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                       type:
   *                         type: string
   *                         example: "最快路線"
   *                       totalTime:
   *                         type: number
   *                         description: 總時間（分鐘）
   *                       totalCost:
   *                         type: number
   *                         description: 總費用（新台幣）
   *                       transfers:
   *                         type: number
   *                         description: 轉乘次數
   *                       segments:
   *                         type: array
   *                         items:
   *                           type: object
   *                 origin:
   *                   $ref: '#/components/schemas/Location'
   *                 destination:
   *                   $ref: '#/components/schemas/Location'
   *                 searchTime:
   *                   type: string
   *                   format: date-time
   *                 alternatives:
   *                   type: number
   *       400:
   *         description: 請求參數錯誤
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/APIError'
   *       404:
   *         description: 找不到路線
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/APIError'
   */
  public calculateRoutes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      logger.info('Route calculation request received', {
        body: req.body,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      // 驗證請求資料
      const validatedRequest = this.validateRouteRequest(req.body);

      // 計算路線
      const result = await this.routeService.calculateRoutes(validatedRequest);

      logger.info('Route calculation completed', {
        routesFound: result.routes.length,
        origin: result.origin?.address || 'Unknown',
        destination: result.destination?.address || 'Unknown'
      });

      res.status(200).json({
        success: true,
        data: result,
        message: `找到 ${result.routes.length} 條路線`,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /api/routes/stats:
   *   get:
   *     summary: 獲取路線服務統計
   *     description: 獲取路線計算服務的統計資訊
   *     tags: [Routes]
   *     responses:
   *       200:
   *         description: 統計資訊
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 cacheSize:
   *                   type: number
   *                 cacheHitRate:
   *                   type: number
   *                 totalCalculations:
   *                   type: number
   */
  public getRouteStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = this.routeService.getRouteStats();
      
      res.status(200).json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      next(error);
    }
  };

  /**
   * 驗證路線請求資料
   */
  private validateRouteRequest(body: any): RouteRequest {
    const schema = Joi.object({
      origin: Joi.object({
        latitude: Joi.number().min(-90).max(90).required(),
        longitude: Joi.number().min(-180).max(180).required()
      }).required(),
      destination: Joi.object({
        latitude: Joi.number().min(-90).max(90).required(),
        longitude: Joi.number().min(-180).max(180).required()
      }).required(),
      preferences: Joi.object({
        prioritize: Joi.string().valid('time', 'cost', 'transfers', 'eco'),
        maxWalkingDistance: Joi.number().min(0).max(5000),
        avoidModes: Joi.array().items(Joi.string()),
        departureTime: Joi.string().isoDate()
      }).optional()
    });

    const { error, value } = schema.validate(body);
    
    if (error) {
      throw errors.badRequest(`Validation error: ${error.details[0]?.message}`, {
        field: error.details[0]?.path.join('.'),
        value: error.details[0]?.context?.value
      });
    }

    return value as RouteRequest;
  }
}