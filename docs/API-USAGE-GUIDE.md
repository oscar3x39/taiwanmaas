# 🚀 API 使用指南

> **台灣智慧交通系統 API 完整使用手冊** - 展示現代 RESTful API 設計和文件最佳實踐

## 📋 目錄

- [快速開始](#快速開始)
- [認證與授權](#認證與授權)
- [API 端點](#api-端點)
- [資料格式](#資料格式)
- [錯誤處理](#錯誤處理)
- [速率限制](#速率限制)
- [範例程式碼](#範例程式碼)
- [SDK 和工具](#sdk-和工具)

## 🚀 快速開始

### Base URL
```
開發環境: http://localhost:3000
生產環境: https://your-domain.com
```

### 基本請求格式
```http
GET /api/endpoint HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Accept: application/json
```

### 快速測試
```bash
# 健康檢查
curl -X GET http://localhost:3000/health

# 獲取 API 資訊
curl -X GET http://localhost:3000/api
```

## 🔐 認證與授權

目前版本為展示用途，暫不需要認證。未來版本將支援：

```http
Authorization: Bearer your-jwt-token
```

## 📡 API 端點

### 🏥 健康檢查

#### GET /health
檢查系統健康狀態

**回應範例:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "development"
}
```

### 🗺️ 路線規劃

#### POST /api/routes
計算兩點間的最佳路線

**請求參數:**
```json
{
  "origin": {
    "latitude": 25.0478,
    "longitude": 121.5170,
    "name": "台北車站"
  },
  "destination": {
    "latitude": 25.0340,
    "longitude": 121.5645,
    "name": "台北101"
  },
  "preferences": {
    "prioritize": "time",
    "transportModes": ["mrt", "bus", "walk"],
    "maxWalkingDistance": 1000
  }
}
```

**回應範例:**
```json
{
  "success": true,
  "data": {
    "routes": [
      {
        "id": "route-fastest",
        "type": "最快路線",
        "totalTime": 25,
        "totalCost": 25,
        "totalDistance": 5.2,
        "transfers": 1,
        "carbonFootprint": 0.8,
        "segments": [
          {
            "mode": "walk",
            "duration": 3,
            "distance": 200,
            "instructions": "步行至台北車站捷運站",
            "from": {
              "name": "起點",
              "coordinates": [25.0478, 121.5170]
            },
            "to": {
              "name": "台北車站",
              "coordinates": [25.0478, 121.5171]
            }
          },
          {
            "mode": "mrt",
            "duration": 20,
            "cost": 25,
            "line": "淡水信義線",
            "color": "#E3002C",
            "stations": ["台北車站", "台大醫院", "中正紀念堂", "東門", "大安森林公園", "大安", "信義安和", "台北101/世貿"],
            "from": {
              "name": "台北車站",
              "coordinates": [25.0478, 121.5171]
            },
            "to": {
              "name": "台北101/世貿站",
              "coordinates": [25.0340, 121.5644]
            }
          },
          {
            "mode": "walk",
            "duration": 2,
            "distance": 100,
            "instructions": "步行至台北101",
            "from": {
              "name": "台北101/世貿站",
              "coordinates": [25.0340, 121.5644]
            },
            "to": {
              "name": "台北101",
              "coordinates": [25.0340, 121.5645]
            }
          }
        ]
      },
      {
        "id": "route-cheapest",
        "type": "最便宜路線",
        "totalTime": 45,
        "totalCost": 15,
        "totalDistance": 6.8,
        "transfers": 2,
        "carbonFootprint": 0.6,
        "segments": [
          {
            "mode": "walk",
            "duration": 5,
            "distance": 300,
            "instructions": "步行至公車站"
          },
          {
            "mode": "bus",
            "duration": 35,
            "cost": 15,
            "route": "299",
            "color": "#0066CC",
            "stops": ["台北車站", "忠孝西路", "忠孝復興", "市政府", "台北101"]
          },
          {
            "mode": "walk",
            "duration": 5,
            "distance": 200,
            "instructions": "步行至目的地"
          }
        ]
      }
    ],
    "summary": {
      "totalRoutes": 2,
      "fastestTime": 25,
      "cheapestCost": 15,
      "averageCost": 20,
      "recommendedRoute": "route-fastest"
    }
  },
  "metadata": {
    "requestId": "req-123456",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "processingTime": 150,
    "dataSource": "mock",
    "version": "1.0.0"
  }
}
```

### 📍 地點服務

#### GET /api/locations/search
搜尋地點和地址

**查詢參數:**
- `q` (string, required): 搜尋關鍵字
- `limit` (number, optional): 結果數量限制 (預設: 10)
- `type` (string, optional): 地點類型篩選

**範例請求:**
```http
GET /api/locations/search?q=台北車站&limit=5&type=station
```

**回應範例:**
```json
{
  "success": true,
  "data": {
    "locations": [
      {
        "id": "loc-taipei-main-station",
        "name": "台北車站",
        "address": "台北市中正區北平西路3號",
        "coordinates": {
          "latitude": 25.0478,
          "longitude": 121.5170
        },
        "type": "station",
        "category": "transport_hub",
        "services": ["mrt", "train", "hsr", "bus"],
        "lines": {
          "mrt": ["淡水信義線", "板南線"],
          "train": ["西部幹線", "東部幹線"],
          "hsr": ["台灣高鐵"]
        },
        "facilities": ["parking", "shopping", "restaurant", "atm"],
        "rating": 4.5,
        "distance": 0
      }
    ],
    "total": 1,
    "hasMore": false
  },
  "metadata": {
    "requestId": "req-789012",
    "timestamp": "2024-01-15T10:35:00.000Z",
    "processingTime": 50
  }
}
```

#### GET /api/locations/nearby
查找附近的交通站點

**查詢參數:**
- `lat` (number, required): 緯度
- `lng` (number, required): 經度
- `radius` (number, optional): 搜尋半徑 (公尺，預設: 1000)
- `type` (string, optional): 站點類型

**範例請求:**
```http
GET /api/locations/nearby?lat=25.0478&lng=121.5170&radius=500&type=mrt
```

#### POST /api/locations/reverse-geocode
反向地理編碼 (座標轉地址)

**請求參數:**
```json
{
  "coordinates": {
    "latitude": 25.0478,
    "longitude": 121.5170
  }
}
```

**回應範例:**
```json
{
  "success": true,
  "data": {
    "address": {
      "formatted": "台北市中正區北平西路3號",
      "components": {
        "country": "台灣",
        "city": "台北市",
        "district": "中正區",
        "street": "北平西路",
        "number": "3號"
      },
      "coordinates": {
        "latitude": 25.0478,
        "longitude": 121.5170
      }
    }
  }
}
```

## 📊 資料格式

### 座標格式
```typescript
interface Coordinates {
  latitude: number;   // 緯度 (-90 到 90)
  longitude: number;  // 經度 (-180 到 180)
}
```

### 地點格式
```typescript
interface Location {
  id: string;
  name: string;
  address?: string;
  coordinates: Coordinates;
  type: 'station' | 'stop' | 'landmark' | 'address';
  category?: string;
}
```

### 路線格式
```typescript
interface Route {
  id: string;
  type: '最快路線' | '最便宜路線' | '最少轉乘路線';
  totalTime: number;      // 總時間 (分鐘)
  totalCost: number;      // 總費用 (新台幣)
  totalDistance: number;  // 總距離 (公里)
  transfers: number;      // 轉乘次數
  carbonFootprint: number; // 碳足跡 (公斤 CO2)
  segments: RouteSegment[];
}
```

### 路線段格式
```typescript
interface RouteSegment {
  mode: 'walk' | 'bus' | 'mrt' | 'train' | 'hsr' | 'youbike';
  duration: number;       // 時間 (分鐘)
  distance?: number;      // 距離 (公尺)
  cost?: number;          // 費用 (新台幣)
  instructions: string;   // 指示說明
  from: Location;
  to: Location;
  line?: string;          // 路線名稱
  color?: string;         // 路線顏色
  stations?: string[];    // 經過站點
  stops?: string[];       // 經過站牌
}
```

## ❌ 錯誤處理

### 錯誤回應格式
```json
{
  "success": false,
  "error": {
    "code": "INVALID_COORDINATES",
    "message": "提供的座標格式不正確",
    "details": {
      "field": "origin.latitude",
      "value": "invalid",
      "expected": "number between -90 and 90"
    }
  },
  "metadata": {
    "requestId": "req-error-123",
    "timestamp": "2024-01-15T10:40:00.000Z"
  }
}
```

### 常見錯誤代碼

| 錯誤代碼 | HTTP 狀態 | 說明 |
|---------|-----------|------|
| `INVALID_COORDINATES` | 400 | 座標格式錯誤 |
| `LOCATION_NOT_FOUND` | 404 | 找不到指定地點 |
| `NO_ROUTES_FOUND` | 404 | 無法找到路線 |
| `INVALID_TRANSPORT_MODE` | 400 | 不支援的交通工具 |
| `DISTANCE_TOO_LONG` | 400 | 距離超過限制 |
| `RATE_LIMIT_EXCEEDED` | 429 | 超過速率限制 |
| `INTERNAL_SERVER_ERROR` | 500 | 伺服器內部錯誤 |

## 🚦 速率限制

- **一般請求**: 100 requests/minute per IP
- **路線計算**: 20 requests/minute per IP
- **地點搜尋**: 50 requests/minute per IP

### 速率限制標頭
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
```

## 💻 範例程式碼

### JavaScript/TypeScript
```typescript
// 🤖 AI-Generated API Client Example
class TaiwanTransportAPI {
  private baseURL = 'http://localhost:3000';
  
  async calculateRoute(origin: Coordinates, destination: Coordinates) {
    const response = await fetch(`${this.baseURL}/api/routes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        origin,
        destination,
        preferences: {
          prioritize: 'time'
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  }
  
  async searchLocations(query: string, limit = 10) {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString()
    });
    
    const response = await fetch(`${this.baseURL}/api/locations/search?${params}`);
    return await response.json();
  }
}

// 使用範例
const api = new TaiwanTransportAPI();

// 計算路線
const routes = await api.calculateRoute(
  { latitude: 25.0478, longitude: 121.5170 }, // 台北車站
  { latitude: 25.0340, longitude: 121.5645 }  // 台北101
);

console.log('找到', routes.data.routes.length, '條路線');
console.log('最快路線需時', routes.data.routes[0].totalTime, '分鐘');
```

### Python
```python
# 🤖 AI-Generated Python Client Example
import requests
from typing import Dict, List, Optional

class TaiwanTransportAPI:
    def __init__(self, base_url: str = "http://localhost:3000"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
    
    def calculate_route(self, origin: Dict, destination: Dict, 
                       preferences: Optional[Dict] = None) -> Dict:
        """計算兩點間路線"""
        payload = {
            'origin': origin,
            'destination': destination,
            'preferences': preferences or {'prioritize': 'time'}
        }
        
        response = self.session.post(f"{self.base_url}/api/routes", json=payload)
        response.raise_for_status()
        return response.json()
    
    def search_locations(self, query: str, limit: int = 10) -> Dict:
        """搜尋地點"""
        params = {'q': query, 'limit': limit}
        response = self.session.get(f"{self.base_url}/api/locations/search", 
                                  params=params)
        response.raise_for_status()
        return response.json()

# 使用範例
api = TaiwanTransportAPI()

# 計算路線
routes = api.calculate_route(
    origin={'latitude': 25.0478, 'longitude': 121.5170},
    destination={'latitude': 25.0340, 'longitude': 121.5645}
)

print(f"找到 {len(routes['data']['routes'])} 條路線")
for route in routes['data']['routes']:
    print(f"{route['type']}: {route['totalTime']}分鐘, ${route['totalCost']}元")
```

### cURL
```bash
# 🤖 AI-Generated cURL Examples

# 計算路線
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
      "prioritize": "time"
    }
  }'

# 搜尋地點
curl -X GET "http://localhost:3000/api/locations/search?q=台北車站&limit=5"

# 查找附近站點
curl -X GET "http://localhost:3000/api/locations/nearby?lat=25.0478&lng=121.5170&radius=500"

# 健康檢查
curl -X GET http://localhost:3000/health
```

## 🛠️ SDK 和工具

### Postman Collection
匯入我們的 Postman Collection 來快速測試 API：
```bash
# 下載 Collection
curl -O http://localhost:3000/docs/postman-collection.json

# 或直接匯入
https://www.postman.com/collections/taiwan-transport-api
```

### OpenAPI/Swagger
- **Swagger UI**: http://localhost:3000/api-docs
- **OpenAPI 規格**: http://localhost:3000/docs/openapi.yaml

### 官方 SDK (規劃中)
```bash
# JavaScript/TypeScript
npm install @taiwan-transport/api-client

# Python
pip install taiwan-transport-api

# Go
go get github.com/taiwan-transport/go-client
```

## 📈 效能最佳化

### 快取策略
- 路線計算結果快取 1 小時
- 地點搜尋結果快取 24 小時
- 使用 Redis 進行分散式快取

### 請求最佳化
```typescript
// 批次請求多個路線
const batchRoutes = await Promise.all([
  api.calculateRoute(origin1, destination1),
  api.calculateRoute(origin2, destination2),
  api.calculateRoute(origin3, destination3)
]);

// 使用快取標頭
const response = await fetch('/api/routes', {
  headers: {
    'If-None-Match': 'etag-value',
    'Cache-Control': 'max-age=3600'
  }
});
```

## 🔍 除錯和監控

### 請求追蹤
每個 API 回應都包含 `requestId`，用於問題追蹤：
```json
{
  "metadata": {
    "requestId": "req-123456789",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "processingTime": 150
  }
}
```

### 日誌格式
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "requestId": "req-123456789",
  "method": "POST",
  "url": "/api/routes",
  "statusCode": 200,
  "responseTime": 150,
  "userAgent": "Mozilla/5.0...",
  "ip": "127.0.0.1"
}
```

## 📞 支援和回饋

### 技術支援
- **GitHub Issues**: https://github.com/your-username/taiwan-transport-demo/issues
- **API 狀態頁面**: http://status.your-domain.com
- **開發者論壇**: https://forum.your-domain.com

### API 更新通知
- **變更日誌**: https://github.com/your-username/taiwan-transport-demo/CHANGELOG.md
- **版本資訊**: 透過 `/api` 端點查看
- **重大變更通知**: 提前 30 天通知

---

**🤖 本 API 文件由 AI 輔助生成，展現了現代 API 設計和文件最佳實踐。**

**需要協助？請查看我們的 [GitHub Issues](https://github.com/your-username/taiwan-transport-demo/issues) 或聯絡開發團隊！**