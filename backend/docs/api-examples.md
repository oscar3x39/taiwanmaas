# 台灣智慧交通 API 使用範例

## 🤖 AI-Assisted Development Showcase

這份文件展示了如何使用台灣智慧交通路線規劃 API，包含完整的請求範例和回應格式。

## 基本資訊

- **Base URL**: `http://localhost:3000` (開發環境)
- **API 文件**: `http://localhost:3000/api-docs`
- **Content-Type**: `application/json`

## 認證

目前 API 不需要認證，但在生產環境中會加入 API Key 驗證。

## 錯誤處理

所有 API 錯誤都會返回統一格式：

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

## API 端點範例

### 1. 路線計算 API

#### 基本路線查詢

```bash
curl -X POST http://localhost:3000/api/routes \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {
      "latitude": 25.0478,
      "longitude": 121.5170
    },
    "destination": {
      "latitude": 25.0340,
      "longitude": 121.5645
    }
  }'
```

#### 帶偏好設定的路線查詢

```bash
curl -X POST http://localhost:3000/api/routes \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {
      "latitude": 25.0478,
      "longitude": 121.5170
    },
    "destination": {
      "latitude": 25.0340,
      "longitude": 121.5645
    },
    "preferences": {
      "prioritize": "time",
      "maxWalkingDistance": 800,
      "avoidModes": ["bus"],
      "departureTime": "2024-01-01T09:00:00.000Z"
    }
  }'
```

#### 回應範例

```json
{
  "success": true,
  "data": {
    "routes": [
      {
        "id": "route-fastest-001",
        "type": "最快路線",
        "totalTime": 25,
        "totalCost": 25,
        "totalDistance": 5.2,
        "transfers": 0,
        "segments": [
          {
            "mode": "mrt",
            "from": {
              "id": "mrt-taipei-main-station",
              "name": "台北車站",
              "coordinates": {
                "latitude": 25.0478,
                "longitude": 121.5170
              },
              "type": "mrt",
              "lines": ["淡水信義線", "板南線"]
            },
            "to": {
              "id": "mrt-taipei-101",
              "name": "台北101/世貿站",
              "coordinates": {
                "latitude": 25.0340,
                "longitude": 121.5645
              },
              "type": "mrt",
              "lines": ["淡水信義線"]
            },
            "duration": 20,
            "cost": 25,
            "instructions": [
              "搭乘淡水信義線",
              "往淡水方向",
              "在台北101/世貿站下車"
            ],
            "line": "淡水信義線",
            "distance": 5.2
          },
          {
            "mode": "walk",
            "from": {
              "id": "mrt-taipei-101",
              "name": "台北101/世貿站",
              "coordinates": {
                "latitude": 25.0340,
                "longitude": 121.5645
              },
              "type": "walk"
            },
            "to": {
              "id": "destination",
              "name": "目的地",
              "coordinates": {
                "latitude": 25.0340,
                "longitude": 121.5645
              },
              "type": "walk"
            },
            "duration": 5,
            "cost": 0,
            "instructions": ["步行至目的地"],
            "distance": 0.3
          }
        ],
        "carbonFootprint": 850
      }
    ],
    "origin": {
      "coordinates": {
        "latitude": 25.0478,
        "longitude": 121.5170
      },
      "address": "台北市中正區北平西路3號",
      "name": "台北車站"
    },
    "destination": {
      "coordinates": {
        "latitude": 25.0340,
        "longitude": 121.5645
      },
      "address": "台北市信義區信義路五段7號",
      "name": "台北101"
    },
    "searchTime": "2024-01-01T12:00:00.000Z",
    "alternatives": 3
  },
  "message": "找到 3 條路線",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 2. 地點搜尋 API

#### 搜尋地點

```bash
curl "http://localhost:3000/api/locations/search?q=台北車站&limit=5"
```

#### 帶座標的地點搜尋

```bash
curl "http://localhost:3000/api/locations/search?q=咖啡廳&lat=25.0478&lng=121.5170&radius=1000&limit=10"
```

#### 回應範例

```json
{
  "success": true,
  "data": {
    "locations": [
      {
        "coordinates": {
          "latitude": 25.0478,
          "longitude": 121.5170
        },
        "address": "台北市中正區北平西路3號",
        "name": "台北車站"
      }
    ],
    "query": "台北車站",
    "total": 1
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 3. 地理編碼 API

#### 反向地理編碼（座標轉地址）

```bash
curl -X POST http://localhost:3000/api/locations/reverse-geocode \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 25.0478,
    "longitude": 121.5170
  }'
```

#### 地理編碼（地址轉座標）

```bash
curl -X POST http://localhost:3000/api/locations/geocode \
  -H "Content-Type: application/json" \
  -d '{
    "address": "台北車站"
  }'
```

### 4. 附近站點查詢

```bash
curl -X POST http://localhost:3000/api/locations/nearby-stations \
  -H "Content-Type: application/json" \
  -d '{
    "coordinates": {
      "latitude": 25.0478,
      "longitude": 121.5170
    },
    "maxDistance": 1000,
    "limit": 10
  }'
```

### 5. 台灣城市列表

```bash
curl "http://localhost:3000/api/locations/cities"
```

### 6. 交通站點列表

```bash
# 所有站點
curl "http://localhost:3000/api/locations/stations"

# 特定交通工具站點
curl "http://localhost:3000/api/locations/stations?mode=mrt"
```

### 7. 系統監控 API

#### 健康檢查

```bash
curl "http://localhost:3000/health"
```

#### API 資訊

```bash
curl "http://localhost:3000/api"
```

#### 路線服務統計

```bash
curl "http://localhost:3000/api/routes/stats"
```

## JavaScript/TypeScript 範例

### 使用 Fetch API

```javascript
// 路線計算
async function calculateRoute(origin, destination) {
  try {
    const response = await fetch('http://localhost:3000/api/routes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        origin,
        destination,
        preferences: {
          prioritize: 'time',
          maxWalkingDistance: 800
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('路線計算失敗:', error);
    throw error;
  }
}

// 使用範例
const origin = { latitude: 25.0478, longitude: 121.5170 };
const destination = { latitude: 25.0340, longitude: 121.5645 };

calculateRoute(origin, destination)
  .then(result => {
    console.log('找到路線:', result.data.routes);
  })
  .catch(error => {
    console.error('錯誤:', error);
  });
```

### 使用 Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 搜尋地點
async function searchLocations(query, coordinates = null) {
  try {
    const params = { q: query, limit: 20 };
    if (coordinates) {
      params.lat = coordinates.latitude;
      params.lng = coordinates.longitude;
      params.radius = 5000;
    }

    const response = await api.get('/api/locations/search', { params });
    return response.data;
  } catch (error) {
    console.error('地點搜尋失敗:', error.response?.data || error.message);
    throw error;
  }
}
```

## 錯誤代碼說明

| 錯誤代碼 | 說明 | HTTP 狀態碼 |
|---------|------|-------------|
| `INVALID_COORDINATES` | 座標格式錯誤 | 400 |
| `NO_ROUTES_FOUND` | 找不到路線 | 404 |
| `RATE_LIMIT_EXCEEDED` | 請求頻率過高 | 429 |
| `INTERNAL_ERROR` | 伺服器內部錯誤 | 500 |
| `VALIDATION_ERROR` | 請求參數驗證失敗 | 400 |

## 效能建議

1. **快取策略**: API 會自動快取路線計算結果，相同的查詢在 1 小時內會直接返回快取結果
2. **批次請求**: 避免在短時間內發送大量請求，建議使用防抖動（debounce）機制
3. **錯誤重試**: 網路錯誤時建議使用指數退避策略重試
4. **座標精度**: 座標精度建議保持在小數點後 4-6 位，過高精度不會提升準確性

## 開發工具

- **Swagger UI**: `http://localhost:3000/api-docs` - 互動式 API 文件
- **Postman Collection**: 可匯入 Swagger 規格檔案
- **TypeScript 型別**: 參考 `src/types/index.ts` 檔案

## 聯絡資訊

如有問題或建議，請聯絡開發團隊：
- Email: dev@example.com
- GitHub: [專案連結]
- 文件: [文件連結]