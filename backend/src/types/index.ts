/**
 * 🤖 AI-Generated TypeScript Type Definitions
 * 📝 Human-Reviewed and Optimized
 * 
 * 台灣智慧交通系統的核心資料型別定義
 * 展示 TypeScript 型別安全設計能力
 */

// 基礎地理座標型別
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// 地點資訊型別
export interface Location {
  coordinates: Coordinates;
  address: string;
  name?: string | undefined;
}

// 交通工具類型枚舉
export enum TransportMode {
  WALK = 'walk',
  BUS = 'bus',
  MRT = 'mrt',
  TRAIN = 'train',
  HSR = 'hsr',
  YOUBIKE = 'youbike',
  TAXI = 'taxi'
}

// 交通站點型別
export interface Station {
  id: string;
  name: string;
  coordinates: Coordinates;
  type: TransportMode;
  lines?: string[]; // 路線名稱（如捷運線、公車路線）
  address?: string;
}

// 路線段落型別
export interface RouteSegment {
  mode: TransportMode;
  from: Station;
  to: Station;
  duration: number; // 分鐘
  cost: number; // 新台幣
  instructions: string[];
  line?: string | undefined; // 路線名稱
  distance?: number | undefined; // 公里
}

// 完整路線型別
export interface Route {
  id: string;
  type: string; // '最快路線', '最便宜路線', '最少轉乘'
  totalTime: number; // 總時間（分鐘）
  totalCost: number; // 總費用（新台幣）
  totalDistance?: number; // 總距離（公里）
  transfers: number; // 轉乘次數
  segments: RouteSegment[];
  carbonFootprint?: number; // 碳足跡（公克 CO2）
}

// 路線查詢請求型別
export interface RouteRequest {
  origin: Coordinates;
  destination: Coordinates;
  preferences?: {
    prioritize?: 'time' | 'cost' | 'transfers' | 'eco'; // 優先考量
    maxWalkingDistance?: number; // 最大步行距離（公尺）
    avoidModes?: TransportMode[]; // 避免的交通工具
    departureTime?: string; // 出發時間 ISO string
  };
}

// 路線查詢回應型別
export interface RouteResponse {
  routes: Route[];
  origin: Location;
  destination: Location;
  searchTime: string;
  alternatives: number;
}

// 台灣城市型別
export interface TaiwanCity {
  id: string;
  name: string;
  englishName: string;
  coordinates: Coordinates;
  popularDestinations: Location[];
  transportHubs: Station[];
}

// 交通工具資訊型別
export interface TransportInfo {
  mode: TransportMode;
  name: string;
  avgSpeed: number; // 平均速度 km/h
  costPerKm: number; // 每公里費用
  carbonPerKm: number; // 每公里碳排放 g CO2
  availability: {
    startTime: string; // 營運開始時間
    endTime: string; // 營運結束時間
    frequency: number; // 班次頻率（分鐘）
  };
}

// API 錯誤回應型別
export interface APIErrorResponse {
  error: string;
  message: string;
  code?: string;
  timestamp: string;
  path?: string;
  method?: string;
  details?: any;
}

// 健康檢查回應型別
export interface HealthCheckResponse {
  status: 'OK' | 'ERROR';
  timestamp: string;
  uptime: number;
  environment: string;
  services?: {
    database?: 'connected' | 'disconnected';
    cache?: 'connected' | 'disconnected';
    externalApi?: 'available' | 'unavailable';
  };
}

// API 資訊回應型別
export interface APIInfoResponse {
  name: string;
  version: string;
  description: string;
  endpoints: Record<string, string>;
}

// 地點搜尋請求型別
export interface LocationSearchRequest {
  query: string;
  coordinates?: Coordinates; // 搜尋中心點
  radius?: number; // 搜尋半徑（公尺）
  limit?: number; // 結果數量限制
}

// 地點搜尋回應型別
export interface LocationSearchResponse {
  locations: Location[];
  query: string;
  total: number;
}

// 即時交通資訊型別
export interface RealTimeInfo {
  stationId: string;
  mode: TransportMode;
  line?: string | undefined;
  arrivals: {
    destination: string;
    estimatedTime: number; // 預估到達時間（分鐘）
    delay?: number; // 延誤時間（分鐘）
    status: 'on-time' | 'delayed' | 'cancelled';
  }[];
  lastUpdated: string;
}

// 票價資訊型別
export interface FareInfo {
  from: string;
  to: string;
  mode: TransportMode;
  line?: string;
  adultFare: number;
  childFare?: number;
  seniorFare?: number;
  currency: 'TWD';
}

// 路線統計型別
export interface RouteStats {
  routeId: string;
  popularity: number; // 使用頻率
  averageRating: number; // 平均評分
  averageDuration: number; // 平均時間
  averageCost: number; // 平均費用
  peakHours: string[]; // 尖峰時段
  reliability: number; // 可靠性評分 (0-1)
}