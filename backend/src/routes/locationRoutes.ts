/**
 * 🤖 AI-Generated Location Routes
 * 📝 Human-Reviewed and Optimized
 * 
 * 地點相關的 API 路由定義
 * 展示 RESTful API 路由設計模式
 */

import { Router } from 'express';
import { LocationController } from '../controllers/LocationController';

const router = Router();
const locationController = new LocationController();

/**
 * 地點相關路由
 */

// POST /api/locations/reverse-geocode - 反向地理編碼
router.post('/reverse-geocode', locationController.reverseGeocode);

// POST /api/locations/geocode - 地理編碼
router.post('/geocode', locationController.geocode);

// GET /api/locations/search - 搜尋地點
router.get('/search', locationController.searchLocations);

// POST /api/locations/nearby-stations - 尋找附近交通站點
router.post('/nearby-stations', locationController.findNearbyStations);

// GET /api/locations/cities - 獲取台灣城市列表
router.get('/cities', locationController.getTaiwanCities);

// GET /api/locations/stations - 獲取交通站點
router.get('/stations', locationController.getStations);

export default router;