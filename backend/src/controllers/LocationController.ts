/**
 * 🤖 AI-Generated Location Controller
 * 📝 Human-Reviewed and Optimized
 * 
 * 地點 API 控制器
 * 展示地理資料處理和搜尋功能的 API 設計
 */

import { Request, Response, NextFunction } from 'express';
import { LocationService } from '../services/LocationService';
import { MockDataService } from '../services/MockDataService';
import { Coordinates, LocationSearchRequest } from '../types';
import { logger } from '../utils/logger';
import { errors } from '../middleware/errorHandler';
import Joi from 'joi';

export class LocationController {
  private locationService: LocationService;
  private mockDataService: MockDataService;

  constructor() {
    this.locationService = new LocationService();
    this.mockDataService = MockDataService.getInstance();
  }

  /**
   * @swagger
   * /api/locations/reverse-geocode:
   *   post:
   *     summary: 反向地理編碼
   *     description: 將座標轉換為地址資訊
   *     tags: [Locations]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Coordinates'
   *           example:
   *             latitude: 25.0478
   *             longitude: 121.5170
   *     responses:
   *       200:
   *         description: 地址資訊
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/Location'
   *       400:
   *         description: 座標格式錯誤
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/APIError'
   */
  public reverseGeocode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const coordinates = this.validateCoordinates(req.body);
      
      logger.info('Reverse geocoding request', { coordinates });

      const location = await this.locationService.reverseGeocode(coordinates);

      res.status(200).json({
        success: true,
        data: location,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /api/locations/geocode:
   *   post:
   *     summary: 地理編碼
   *     description: 將地址轉換為座標資訊
   *     tags: [Locations]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - address
   *             properties:
   *               address:
   *                 type: string
   *                 example: "台北車站"
   *     responses:
   *       200:
   *         description: 座標資訊列表
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Location'
   */
  public geocode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { address } = this.validateGeocodeRequest(req.body);
      
      logger.info('Geocoding request', { address });

      const locations = await this.locationService.geocode(address);

      res.status(200).json({
        success: true,
        data: locations,
        count: locations.length,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /api/locations/search:
   *   get:
   *     summary: 搜尋地點
   *     description: 根據關鍵字搜尋地點
   *     tags: [Locations]
   *     parameters:
   *       - in: query
   *         name: q
   *         required: true
   *         schema:
   *           type: string
   *         description: 搜尋關鍵字
   *         example: "台北"
   *       - in: query
   *         name: lat
   *         schema:
   *           type: number
   *         description: 搜尋中心緯度
   *       - in: query
   *         name: lng
   *         schema:
   *           type: number
   *         description: 搜尋中心經度
   *       - in: query
   *         name: radius
   *         schema:
   *           type: number
   *           default: 5000
   *         description: 搜尋半徑（公尺）
   *       - in: query
   *         name: limit
   *         schema:
   *           type: number
   *           default: 20
   *         description: 結果數量限制
   *     responses:
   *       200:
   *         description: 搜尋結果
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   properties:
   *                     locations:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Location'
   *                     query:
   *                       type: string
   *                     total:
   *                       type: number
   */
  public searchLocations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const searchRequest = this.validateSearchRequest(req.query);
      
      logger.info('Location search request', { searchRequest });

      const result = await this.locationService.searchLocations(searchRequest);

      res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /api/locations/nearby-stations:
   *   post:
   *     summary: 尋找附近交通站點
   *     description: 根據座標尋找附近的交通站點
   *     tags: [Locations]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - coordinates
   *             properties:
   *               coordinates:
   *                 $ref: '#/components/schemas/Coordinates'
   *               maxDistance:
   *                 type: number
   *                 default: 1000
   *                 description: 最大距離（公尺）
   *               limit:
   *                 type: number
   *                 default: 10
   *                 description: 結果數量限制
   *     responses:
   *       200:
   *         description: 附近的交通站點
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                       name:
   *                         type: string
   *                       coordinates:
   *                         $ref: '#/components/schemas/Coordinates'
   *                       type:
   *                         type: string
   *                       lines:
   *                         type: array
   *                         items:
   *                           type: string
   */
  public findNearbyStations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { coordinates, maxDistance = 1000, limit = 10 } = this.validateNearbyStationsRequest(req.body);
      
      logger.info('Nearby stations request', { coordinates, maxDistance, limit });

      const stations = await this.locationService.findNearbyStations(coordinates, maxDistance, limit);

      res.status(200).json({
        success: true,
        data: stations,
        count: stations.length,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /api/locations/cities:
   *   get:
   *     summary: 獲取台灣城市列表
   *     description: 獲取台灣主要城市和熱門景點資訊
   *     tags: [Locations]
   *     responses:
   *       200:
   *         description: 城市列表
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                       name:
   *                         type: string
   *                       englishName:
   *                         type: string
   *                       coordinates:
   *                         $ref: '#/components/schemas/Coordinates'
   *                       popularDestinations:
   *                         type: array
   *                         items:
   *                           $ref: '#/components/schemas/Location'
   */
  public getTaiwanCities = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      logger.info('Taiwan cities request');

      const cities = this.mockDataService.getTaiwanCities();

      res.status(200).json({
        success: true,
        data: cities,
        count: cities.length,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /api/locations/stations:
   *   get:
   *     summary: 獲取交通站點
   *     description: 根據交通工具類型獲取站點列表
   *     tags: [Locations]
   *     parameters:
   *       - in: query
   *         name: mode
   *         schema:
   *           type: string
   *           enum: [mrt, bus, hsr, train]
   *         description: 交通工具類型
   *     responses:
   *       200:
   *         description: 交通站點列表
   */
  public getStations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { mode } = req.query;
      
      logger.info('Stations request', { mode });

      let stations;
      if (mode) {
        stations = this.mockDataService.getStationsByMode(mode as any);
      } else {
        stations = this.mockDataService.getAllStations();
      }

      res.status(200).json({
        success: true,
        data: stations,
        count: stations.length,
        mode: mode || 'all',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      next(error);
    }
  };

  /**
   * 驗證座標資料
   */
  private validateCoordinates(body: any): Coordinates {
    const schema = Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required()
    });

    const { error, value } = schema.validate(body);
    
    if (error) {
      throw errors.badRequest(`Invalid coordinates: ${error.details[0]?.message}`);
    }

    return value as Coordinates;
  }

  /**
   * 驗證地理編碼請求
   */
  private validateGeocodeRequest(body: any): { address: string } {
    const schema = Joi.object({
      address: Joi.string().min(1).max(200).required()
    });

    const { error, value } = schema.validate(body);
    
    if (error) {
      throw errors.badRequest(`Invalid geocode request: ${error.details[0]?.message}`);
    }

    return value;
  }

  /**
   * 驗證搜尋請求
   */
  private validateSearchRequest(query: any): LocationSearchRequest {
    const schema = Joi.object({
      q: Joi.string().min(1).max(100).required(),
      lat: Joi.number().min(-90).max(90),
      lng: Joi.number().min(-180).max(180),
      radius: Joi.number().min(100).max(50000).default(5000),
      limit: Joi.number().min(1).max(100).default(20)
    });

    const { error, value } = schema.validate(query);
    
    if (error) {
      throw errors.badRequest(`Invalid search request: ${error.details[0]?.message}`);
    }

    const searchRequest: LocationSearchRequest = {
      query: value.q,
      radius: value.radius,
      limit: value.limit
    };

    if (value.lat && value.lng) {
      searchRequest.coordinates = {
        latitude: value.lat,
        longitude: value.lng
      };
    }

    return searchRequest;
  }

  /**
   * 驗證附近站點請求
   */
  private validateNearbyStationsRequest(body: any): {
    coordinates: Coordinates;
    maxDistance: number;
    limit: number;
  } {
    const schema = Joi.object({
      coordinates: Joi.object({
        latitude: Joi.number().min(-90).max(90).required(),
        longitude: Joi.number().min(-180).max(180).required()
      }).required(),
      maxDistance: Joi.number().min(100).max(10000).default(1000),
      limit: Joi.number().min(1).max(50).default(10)
    });

    const { error, value } = schema.validate(body);
    
    if (error) {
      throw errors.badRequest(`Invalid nearby stations request: ${error.details[0]?.message}`);
    }

    return value;
  }
}