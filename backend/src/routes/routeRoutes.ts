/**
 * 🤖 AI-Generated Route Routes
 * 📝 Human-Reviewed and Optimized
 * 
 * 路線相關的 API 路由定義
 * 展示 Express.js 路由組織和中介軟體應用
 */

import { Router } from 'express';
import { RouteController } from '../controllers/RouteController';

const router = Router();
const routeController = new RouteController();

/**
 * 路線計算相關路由
 */

// POST /api/routes - 計算路線
router.post('/', routeController.calculateRoutes);

// GET /api/routes/stats - 獲取路線服務統計
router.get('/stats', routeController.getRouteStats);

export default router;