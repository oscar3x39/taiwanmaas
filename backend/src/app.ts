/**
 * 🤖 AI-Generated Express.js Application
 * 📝 Human-Reviewed and Optimized
 * 
 * 台灣智慧交通路線規劃系統 - 主要應用程式進入點
 * 展示現代 Node.js 後端架構設計和安全性最佳實踐
 */

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import routeRoutes from './routes/routeRoutes';
import locationRoutes from './routes/locationRoutes';

// Load environment variables
dotenv.config();

class APIGateway {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env['PORT'] || process.env['BACKEND_PORT'] || '18080', 10);
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupSwagger();
    this.setupErrorHandling();
  }

  /**
   * 設定安全性和基礎中介軟體
   * 展示 Express.js 安全性最佳實踐
   */
  private setupMiddleware(): void {
    // 安全性中介軟體
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS 設定 - 支援前端跨域請求
    const corsOptions = {
      origin: process.env['NODE_ENV'] === 'production' 
        ? process.env['FRONTEND_URL'] 
        : ['http://localhost:8080', 'http://localhost:3000'],
      credentials: true,
      optionsSuccessStatus: 200,
    };
    this.app.use(cors(corsOptions));

    // 請求壓縮
    this.app.use(compression());

    // 請求大小限制
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // 速率限制 - 防止 API 濫用
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 分鐘
      max: 100, // 每個 IP 最多 100 個請求
      message: {
        error: 'Too many requests from this IP, please try again later.',
        code: 'RATE_LIMIT_EXCEEDED'
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api/', limiter);

    // 請求日誌記錄
    this.app.use(requestLogger);
  }

  /**
   * 設定 API 路由結構
   * 展示 RESTful API 設計模式
   */
  private setupRoutes(): void {
    /**
     * @swagger
     * /health:
     *   get:
     *     summary: 系統健康檢查
     *     description: 檢查 API 服務狀態和系統資訊
     *     tags: [System]
     *     responses:
     *       200:
     *         description: 系統正常運行
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: "OK"
     *                 timestamp:
     *                   type: string
     *                   format: date-time
     *                 uptime:
     *                   type: number
     *                   description: 系統運行時間（秒）
     *                   example: 3600
     *                 environment:
     *                   type: string
     *                   example: "development"
     *             example:
     *               status: "OK"
     *               timestamp: "2024-01-01T12:00:00.000Z"
     *               uptime: 3600
     *               environment: "development"
     */
    this.app.get('/health', (_req: Request, res: Response) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env['NODE_ENV'] || 'development'
      });
    });

    /**
     * @swagger
     * /api:
     *   get:
     *     summary: API 資訊
     *     description: 獲取 API 版本資訊和可用端點列表
     *     tags: [System]
     *     responses:
     *       200:
     *         description: API 資訊
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 name:
     *                   type: string
     *                   example: "台灣智慧交通路線規劃 API"
     *                 version:
     *                   type: string
     *                   example: "1.0.0"
     *                 description:
     *                   type: string
     *                   example: "AI-Assisted Development Showcase"
     *                 endpoints:
     *                   type: object
     *                   properties:
     *                     routes:
     *                       type: string
     *                       example: "/api/routes"
     *                     locations:
     *                       type: string
     *                       example: "/api/locations"
     *                     health:
     *                       type: string
     *                       example: "/health"
     *                     docs:
     *                       type: string
     *                       example: "/api-docs"
     */
    this.app.get('/api', (_req: Request, res: Response) => {
      res.json({
        name: '台灣智慧交通路線規劃 API',
        version: '1.0.0',
        description: 'AI-Assisted Development Showcase',
        endpoints: {
          routes: '/api/routes',
          locations: '/api/locations',
          health: '/health',
          docs: '/api-docs'
        }
      });
    });

    // API 路由
    this.app.use('/api/routes', routeRoutes);
    this.app.use('/api/locations', locationRoutes);

    // 404 處理
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({
        error: 'Endpoint not found',
        message: `Cannot ${req.method} ${req.originalUrl}`,
        availableEndpoints: ['/health', '/api', '/api/routes', '/api/locations', '/api-docs']
      });
    });
  }

  /**
   * 設定 Swagger API 文件
   * 展示 API 文件自動生成能力
   */
  private setupSwagger(): void {
    const swaggerOptions = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: '台灣智慧交通路線規劃 API',
          version: '1.0.0',
          description: `
            🤖 AI-Assisted Development Showcase
            
            這是一個展示現代 Node.js 後端開發技能的專案，
            整合了 AI 輔助開發流程和台灣交通數據處理能力。
            
            ## 主要功能
            - 🗺️ 地點座標處理和驗證
            - 🚇 多種交通工具路線計算
            - 💰 時間與費用成本分析
            - 📊 即時交通數據整合
            
            ## AI 輔助開發特色
            - 智慧型 API 設計
            - 自動化程式碼生成
            - 最佳實踐建議
            
            ## 使用範例
            
            ### 1. 計算路線
            \`\`\`bash
            curl -X POST http://localhost:3000/api/routes \\
              -H "Content-Type: application/json" \\
              -d '{
                "origin": {"latitude": 25.0478, "longitude": 121.5170},
                "destination": {"latitude": 25.0340, "longitude": 121.5645}
              }'
            \`\`\`
            
            ### 2. 搜尋地點
            \`\`\`bash
            curl "http://localhost:3000/api/locations/search?q=台北車站"
            \`\`\`
          `,
          contact: {
            name: 'AI-Assisted Development Team',
            email: 'dev@example.com'
          },
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          }
        },
        servers: [
          {
            url: process.env['NODE_ENV'] === 'production' 
              ? process.env['API_BASE_URL'] || 'https://api.example.com'
              : 'http://localhost:3000',
            description: process.env['NODE_ENV'] === 'production' ? 'Production server' : 'Development server'
          }
        ],
        tags: [
          {
            name: 'Routes',
            description: '路線計算相關 API - 展示演算法設計和效能優化'
          },
          {
            name: 'Locations',
            description: '地點處理相關 API - 展示地理資料處理和搜尋功能'
          },
          {
            name: 'System',
            description: '系統監控相關 API - 展示系統設計和監控能力'
          }
        ],
        components: {
          schemas: {
            Coordinates: {
              type: 'object',
              required: ['latitude', 'longitude'],
              description: '地理座標 - 使用 WGS84 座標系統',
              properties: {
                latitude: {
                  type: 'number',
                  minimum: -90,
                  maximum: 90,
                  description: '緯度',
                  example: 25.0478
                },
                longitude: {
                  type: 'number',
                  minimum: -180,
                  maximum: 180,
                  description: '經度',
                  example: 121.5170
                }
              }
            },
            Location: {
              type: 'object',
              required: ['coordinates'],
              description: '地點資訊',
              properties: {
                coordinates: { 
                  $ref: '#/components/schemas/Coordinates',
                  description: '地點座標'
                },
                address: {
                  type: 'string',
                  description: '地址',
                  example: '台北市中正區北平西路3號'
                },
                name: {
                  type: 'string',
                  description: '地點名稱',
                  example: '台北車站'
                }
              }
            },
            Station: {
              type: 'object',
              required: ['id', 'name', 'coordinates', 'type'],
              description: '交通站點資訊',
              properties: {
                id: {
                  type: 'string',
                  description: '站點 ID',
                  example: 'mrt-taipei-main-station'
                },
                name: {
                  type: 'string',
                  description: '站點名稱',
                  example: '台北車站'
                },
                coordinates: {
                  $ref: '#/components/schemas/Coordinates'
                },
                type: {
                  type: 'string',
                  enum: ['walk', 'bus', 'mrt', 'train', 'hsr', 'youbike', 'taxi'],
                  description: '交通工具類型',
                  example: 'mrt'
                },
                lines: {
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  description: '路線名稱',
                  example: ['淡水信義線', '板南線']
                },
                address: {
                  type: 'string',
                  description: '站點地址',
                  example: '台北市中正區北平西路3號'
                }
              }
            },
            RouteSegment: {
              type: 'object',
              required: ['mode', 'from', 'to', 'duration', 'cost', 'instructions'],
              description: '路線段落',
              properties: {
                mode: {
                  type: 'string',
                  enum: ['walk', 'bus', 'mrt', 'train', 'hsr', 'youbike', 'taxi'],
                  description: '交通工具',
                  example: 'mrt'
                },
                from: {
                  $ref: '#/components/schemas/Station'
                },
                to: {
                  $ref: '#/components/schemas/Station'
                },
                duration: {
                  type: 'number',
                  description: '時間（分鐘）',
                  example: 25
                },
                cost: {
                  type: 'number',
                  description: '費用（新台幣）',
                  example: 25
                },
                instructions: {
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  description: '指示說明',
                  example: ['搭乘淡水信義線', '往淡水方向', '在台北101/世貿站下車']
                },
                line: {
                  type: 'string',
                  description: '路線名稱',
                  example: '淡水信義線'
                },
                distance: {
                  type: 'number',
                  description: '距離（公里）',
                  example: 5.2
                }
              }
            },
            Route: {
              type: 'object',
              required: ['id', 'type', 'totalTime', 'totalCost', 'transfers', 'segments'],
              description: '完整路線資訊',
              properties: {
                id: {
                  type: 'string',
                  description: '路線 ID',
                  example: 'route-fastest-001'
                },
                type: {
                  type: 'string',
                  description: '路線類型',
                  example: '最快路線'
                },
                totalTime: {
                  type: 'number',
                  description: '總時間（分鐘）',
                  example: 45
                },
                totalCost: {
                  type: 'number',
                  description: '總費用（新台幣）',
                  example: 65
                },
                totalDistance: {
                  type: 'number',
                  description: '總距離（公里）',
                  example: 12.5
                },
                transfers: {
                  type: 'number',
                  description: '轉乘次數',
                  example: 2
                },
                segments: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/RouteSegment'
                  },
                  description: '路線段落'
                },
                carbonFootprint: {
                  type: 'number',
                  description: '碳足跡（公克 CO2）',
                  example: 850
                }
              }
            },
            RouteResponse: {
              type: 'object',
              required: ['routes', 'origin', 'destination', 'searchTime', 'alternatives'],
              description: '路線查詢回應',
              properties: {
                routes: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Route'
                  },
                  description: '路線選項'
                },
                origin: {
                  $ref: '#/components/schemas/Location'
                },
                destination: {
                  $ref: '#/components/schemas/Location'
                },
                searchTime: {
                  type: 'string',
                  format: 'date-time',
                  description: '搜尋時間'
                },
                alternatives: {
                  type: 'number',
                  description: '替代路線數量',
                  example: 3
                }
              }
            },
            TaiwanCity: {
              type: 'object',
              required: ['id', 'name', 'englishName', 'coordinates'],
              description: '台灣城市資訊',
              properties: {
                id: {
                  type: 'string',
                  example: 'taipei'
                },
                name: {
                  type: 'string',
                  example: '台北市'
                },
                englishName: {
                  type: 'string',
                  example: 'Taipei City'
                },
                coordinates: {
                  $ref: '#/components/schemas/Coordinates'
                },
                popularDestinations: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Location'
                  },
                  description: '熱門景點'
                },
                transportHubs: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Station'
                  },
                  description: '交通樞紐'
                }
              }
            },
            APIError: {
              type: 'object',
              required: ['error', 'message', 'timestamp'],
              description: 'API 錯誤回應',
              properties: {
                error: {
                  type: 'string',
                  description: '錯誤類型',
                  example: 'Invalid coordinates'
                },
                message: {
                  type: 'string',
                  description: '錯誤訊息',
                  example: 'Latitude must be between -90 and 90'
                },
                code: {
                  type: 'string',
                  description: '錯誤代碼',
                  example: 'INVALID_COORDINATES'
                },
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                  description: '錯誤時間'
                },
                path: {
                  type: 'string',
                  description: 'API 路徑',
                  example: '/api/routes'
                },
                method: {
                  type: 'string',
                  description: 'HTTP 方法',
                  example: 'POST'
                },
                details: {
                  type: 'object',
                  description: '詳細錯誤資訊'
                }
              }
            },
            SuccessResponse: {
              type: 'object',
              required: ['success', 'data', 'timestamp'],
              description: 'API 成功回應格式',
              properties: {
                success: {
                  type: 'boolean',
                  example: true
                },
                data: {
                  type: 'object',
                  description: '回應資料'
                },
                message: {
                  type: 'string',
                  description: '成功訊息',
                  example: '操作成功'
                },
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                  description: '回應時間'
                },
                count: {
                  type: 'number',
                  description: '資料筆數（適用於列表回應）'
                }
              }
            }
          },
          responses: {
            BadRequest: {
              description: '請求參數錯誤',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/APIError'
                  },
                  example: {
                    error: 'Validation Error',
                    message: 'Invalid coordinates format',
                    code: 'INVALID_REQUEST',
                    timestamp: '2024-01-01T12:00:00.000Z',
                    path: '/api/routes',
                    method: 'POST'
                  }
                }
              }
            },
            NotFound: {
              description: '資源不存在',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/APIError'
                  },
                  example: {
                    error: 'Not Found',
                    message: 'No routes found for the given coordinates',
                    code: 'NO_ROUTES_FOUND',
                    timestamp: '2024-01-01T12:00:00.000Z'
                  }
                }
              }
            },
            InternalServerError: {
              description: '伺服器內部錯誤',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/APIError'
                  },
                  example: {
                    error: 'Internal Server Error',
                    message: 'An unexpected error occurred',
                    code: 'INTERNAL_ERROR',
                    timestamp: '2024-01-01T12:00:00.000Z'
                  }
                }
              }
            },
            TooManyRequests: {
              description: '請求過於頻繁',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/APIError'
                  },
                  example: {
                    error: 'Too Many Requests',
                    message: 'Rate limit exceeded. Please try again later.',
                    code: 'RATE_LIMIT_EXCEEDED',
                    timestamp: '2024-01-01T12:00:00.000Z'
                  }
                }
              }
            }
          }
        }
      },
      apis: ['./src/controllers/*.ts', './src/app.ts'], // 掃描 API 註解的檔案路徑
    };

    const specs = swaggerJsdoc(swaggerOptions);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
      customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .info { margin: 50px 0; }
        .swagger-ui .info .title { color: #3b82f6; }
        .swagger-ui .scheme-container { background: #f8fafc; padding: 20px; border-radius: 8px; }
      `,
      customSiteTitle: '台灣智慧交通 API 文件',
      customfavIcon: '/favicon.ico',
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'list',
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        tryItOutEnabled: true
      }
    }));
  }

  /**
   * 設定錯誤處理中介軟體
   * 展示統一錯誤處理策略
   */
  private setupErrorHandling(): void {
    this.app.use(errorHandler);
  }

  /**
   * 啟動伺服器
   * 展示優雅的伺服器啟動和關閉處理
   */
  public start(): void {
    const server = this.app.listen(this.port, () => {
      logger.info(`🚀 台灣智慧交通 API 伺服器已啟動`);
      logger.info(`📍 Port: ${this.port}`);
      logger.info(`🌍 Environment: ${process.env['NODE_ENV'] || 'development'}`);
      logger.info(`📚 API 文件: http://localhost:${this.port}/api-docs`);
      logger.info(`🔍 健康檢查: http://localhost:${this.port}/health`);
    });

    // 優雅關閉處理
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received, shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });
  }

  public getApp(): Application {
    return this.app;
  }
}

// 如果直接執行此檔案，啟動伺服器
if (require.main === module) {
  const apiGateway = new APIGateway();
  apiGateway.start();
}

export default APIGateway;