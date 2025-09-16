# 台灣智慧交通路線規劃 API 文件

## 🤖 AI-Assisted Development Showcase

這是一個展示現代 Node.js 後端開發技能和 AI 輔助開發能力的專案。

## 📚 文件結構

```
backend/docs/
├── README.md                 # 本文件 - API 文件總覽
├── api-examples.md          # 詳細的 API 使用範例
├── openapi.yaml             # OpenAPI 3.0 規格檔案
└── postman-collection.json  # Postman 測試集合
```

## 🚀 快速開始

### 1. 啟動 API 服務

```bash
# 開發環境
npm run dev

# 生產環境
npm run build
npm start

# Docker 環境
docker-compose up -d
```

### 2. 訪問 API 文件

- **Swagger UI**: http://localhost:3000/api-docs
- **健康檢查**: http://localhost:3000/health
- **API 資訊**: http://localhost:3000/api

### 3. 基本使用範例

```bash
# 計算台北車站到台北101的路線
curl -X POST http://localhost:3000/api/routes \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {"latitude": 25.0478, "longitude": 121.5170},
    "destination": {"latitude": 25.0340, "longitude": 121.5645}
  }'
```

## 📖 API 概覽

### 核心功能

| 功能分類 | 端點 | 說明 |
|---------|------|------|
| **路線計算** | `POST /api/routes` | 計算最佳路線組合 |
| **地點服務** | `GET /api/locations/search` | 搜尋地點 |
| **地理編碼** | `POST /api/locations/geocode` | 地址轉座標 |
| **反向地理編碼** | `POST /api/locations/reverse-geocode` | 座標轉地址 |
| **交通站點** | `GET /api/locations/stations` | 獲取交通站點 |
| **系統監控** | `GET /health` | 健康檢查 |

### 主要特色

- ✅ **RESTful API 設計** - 符合 REST 架構原則
- ✅ **完整的 Swagger 文件** - 自動生成的 API 文件
- ✅ **TypeScript 型別安全** - 完整的型別定義
- ✅ **錯誤處理機制** - 統一的錯誤回應格式
- ✅ **請求驗證** - Joi 驗證所有輸入參數
- ✅ **效能優化** - 快取機制和壓縮
- ✅ **安全性** - Helmet、CORS、Rate Limiting

## 🛠️ 開發工具

### 1. Swagger UI

訪問 http://localhost:3000/api-docs 可以：
- 瀏覽完整的 API 文件
- 直接在瀏覽器中測試 API
- 查看請求/回應範例
- 下載 OpenAPI 規格檔案

### 2. Postman Collection

匯入 `postman-collection.json` 檔案到 Postman：
- 包含所有 API 端點的測試請求
- 預設的測試腳本
- 環境變數設定
- 錯誤測試案例

### 3. OpenAPI 規格

`openapi.yaml` 檔案可用於：
- 程式碼生成（客戶端 SDK）
- API 測試工具整合
- 文件生成
- 契約測試

## 📊 API 設計原則

### 1. 統一回應格式

**成功回應**:
```json
{
  "success": true,
  "data": { /* 實際資料 */ },
  "message": "操作成功",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "count": 10  // 適用於列表回應
}
```

**錯誤回應**:
```json
{
  "error": "錯誤類型",
  "message": "詳細錯誤訊息",
  "code": "錯誤代碼",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "path": "/api/routes",
  "method": "POST"
}
```

### 2. HTTP 狀態碼

| 狀態碼 | 說明 | 使用情境 |
|--------|------|----------|
| 200 | OK | 請求成功 |
| 400 | Bad Request | 請求參數錯誤 |
| 404 | Not Found | 資源不存在 |
| 429 | Too Many Requests | 請求頻率過高 |
| 500 | Internal Server Error | 伺服器內部錯誤 |

### 3. 錯誤代碼

| 錯誤代碼 | 說明 |
|---------|------|
| `INVALID_COORDINATES` | 座標格式錯誤 |
| `NO_ROUTES_FOUND` | 找不到路線 |
| `RATE_LIMIT_EXCEEDED` | 請求頻率過高 |
| `VALIDATION_ERROR` | 參數驗證失敗 |
| `INTERNAL_ERROR` | 伺服器內部錯誤 |

## 🔧 技術架構

### 後端技術棧

- **Node.js 18+** - JavaScript 執行環境
- **Express.js** - Web 框架
- **TypeScript** - 型別安全的 JavaScript
- **Swagger/OpenAPI 3.0** - API 文件
- **Joi** - 資料驗證
- **Winston** - 日誌記錄
- **Helmet** - 安全性中介軟體
- **CORS** - 跨域資源共享

### 專案結構

```
backend/src/
├── app.ts                 # 應用程式進入點
├── controllers/           # API 控制器
│   ├── RouteController.ts
│   └── LocationController.ts
├── services/              # 業務邏輯層
│   ├── RouteService.ts
│   ├── LocationService.ts
│   └── MockDataService.ts
├── middleware/            # 中介軟體
│   ├── errorHandler.ts
│   └── requestLogger.ts
├── types/                 # TypeScript 型別定義
│   └── index.ts
├── utils/                 # 工具函數
│   └── logger.ts
└── routes/                # 路由定義
    ├── routeRoutes.ts
    └── locationRoutes.ts
```

## 🧪 測試

### 單元測試

```bash
# 執行所有測試
npm test

# 監視模式
npm run test:watch

# 測試覆蓋率
npm run test:coverage
```

### API 測試

使用 Postman Collection 進行完整的 API 測試：

1. 匯入 `postman-collection.json`
2. 設定環境變數 `baseUrl` 為 `http://localhost:3000`
3. 執行測試集合

### 手動測試

```bash
# 健康檢查
curl http://localhost:3000/health

# API 資訊
curl http://localhost:3000/api

# 路線計算
curl -X POST http://localhost:3000/api/routes \
  -H "Content-Type: application/json" \
  -d '{"origin":{"latitude":25.0478,"longitude":121.5170},"destination":{"latitude":25.0340,"longitude":121.5645}}'
```

## 📈 效能考量

### 快取策略

- **路線計算結果**: 1小時快取
- **地點搜尋結果**: 30分鐘快取
- **靜態資料**: 24小時快取

### 限流設定

- **全域限制**: 每 IP 每 15 分鐘 100 個請求
- **路線計算**: 每 IP 每分鐘 10 個請求
- **搜尋 API**: 每 IP 每分鐘 30 個請求

### 效能優化

- **回應壓縮**: Gzip 壓縮
- **請求大小限制**: 10MB
- **連線池**: 資料庫連線池
- **非同步處理**: Promise-based API

## 🔒 安全性

### 安全措施

- **Helmet.js**: 設定安全性 HTTP 標頭
- **CORS**: 跨域資源共享控制
- **Rate Limiting**: 防止 API 濫用
- **Input Validation**: Joi 驗證所有輸入
- **Error Handling**: 避免敏感資訊洩露

### 環境變數

```bash
# .env 檔案範例
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:8080
API_BASE_URL=http://localhost:3000
GOOGLE_MAPS_API_KEY=your_api_key_here
```

## 🚀 部署

### Docker 部署

```bash
# 建立映像檔
docker build -t taiwan-transport-api .

# 執行容器
docker run -p 3000:3000 taiwan-transport-api

# 使用 Docker Compose
docker-compose up -d
```

### 生產環境

```bash
# 建立生產版本
npm run build

# 啟動生產伺服器
npm start
```

## 📝 AI 輔助開發展示

這個專案展示了 AI 輔助開發的多個面向：

### 1. 程式碼生成
- 使用 Claude 生成 API 控制器和服務層
- AI 輔助的 TypeScript 型別定義
- 自動生成的 Swagger 註解

### 2. 文件生成
- AI 輔助撰寫的 API 文件
- 自動生成的使用範例
- 完整的 OpenAPI 規格

### 3. 測試案例
- AI 生成的 Postman 測試集合
- 自動化的錯誤測試案例
- 效能測試腳本

### 4. 最佳實踐
- AI 建議的架構設計
- 安全性最佳實踐
- 效能優化建議

## 📞 聯絡資訊

- **開發團隊**: AI-Assisted Development Team
- **Email**: dev@example.com
- **專案文件**: [GitHub Repository]
- **API 文件**: http://localhost:3000/api-docs

## 📄 授權

MIT License - 詳見 LICENSE 檔案