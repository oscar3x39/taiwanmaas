// 🤖 AI-Generated TypeScript Type Definitions
// 📝 完整的類型安全定義，展現現代 TypeScript 開發實踐

/**
 * 🌍 地理座標相關類型
 */
export interface Coordinates {
  latitude: number
  longitude: number
}

export interface Location {
  name: string
  coordinates: Coordinates
  address?: string
  type?: 'station' | 'stop' | 'landmark' | 'custom'
}

/**
 * 🚇 交通工具類型
 */
export type TransportMode = 'walking' | 'mrt' | 'bus' | 'taxi' | 'driving'

export interface TransportModeInfo {
  mode: TransportMode
  name: string
  icon: string
  color: string
  description: string
}

/**
 * 🛣️ 路線相關類型
 */
export interface RouteSegment {
  mode: TransportMode
  duration: number // 分鐘
  distance?: number // 公里
  cost?: number // 新台幣
  line?: string // 路線名稱 (如: 淡水信義線, 307公車)
  instructions?: string
  from: Location
  to: Location
  stations?: string[] // 經過的站點
  estimatedFare?: string
  color?: string // 路線顏色
}

export interface Route {
  id: string
  type: string // 路線類型描述
  totalTime: number // 總時間 (分鐘)
  totalCost: number // 總費用 (新台幣)
  totalDistance: number // 總距離 (公里)
  transfers: number // 轉乘次數
  segments: RouteSegment[]
  carbonFootprint?: number // 碳足跡 (kg CO2)
  accessibility?: boolean // 無障礙友善
  reliability?: number // 可靠度評分 (1-5)
}

/**
 * 🔍 路線搜尋相關類型
 */
export interface RouteSearchRequest {
  origin: Coordinates
  destination: Coordinates
  preferences: RoutePreferences
}

export interface RoutePreferences {
  prioritize: 'time' | 'cost' | 'comfort' | 'eco' // 優先考量
  maxWalkingDistance: number // 最大步行距離 (公尺)
  avoidTransfers?: boolean // 避免轉乘
  accessibilityRequired?: boolean // 需要無障礙設施
  departureTime?: string // 出發時間 (ISO string)
  transportModes?: TransportMode[] // 允許的交通工具
}

export interface RouteSearchResponse {
  success: boolean
  data: {
    routes: Route[]
    searchTime: number // 搜尋耗時 (毫秒)
    alternatives: number // 替代路線數量
  }
  error?: string
}

/**
 * 🗺️ 地圖相關類型
 */
export interface MapBounds {
  north: number
  south: number
  east: number
  west: number
}

export interface MapMarker {
  id: string
  position: Coordinates
  type: 'origin' | 'destination' | 'station' | 'stop'
  title: string
  description?: string
  icon?: string
}

export interface MapPolyline {
  id: string
  coordinates: Coordinates[]
  color: string
  weight: number
  opacity: number
  dashArray?: string
  popup?: string
}

/**
 * 🏪 台北捷運相關類型
 */
export interface MRTLine {
  id: string
  name: string
  nameEn: string
  color: string
  stations: MRTStation[]
}

export interface MRTStation {
  id: string
  name: string
  nameEn: string
  coordinates: Coordinates
  lines: string[] // 所屬路線 ID
  exits?: string[] // 出口資訊
  facilities?: string[] // 設施資訊
}

/**
 * 🚌 公車相關類型
 */
export interface BusRoute {
  routeId: string
  routeName: string
  departureStop: string
  destinationStop: string
  stops: BusStop[]
  frequency: number // 班次頻率 (分鐘)
}

export interface BusStop {
  stopId: string
  stopName: string
  coordinates: Coordinates
  routes: string[] // 經過的公車路線
}

/**
 * 🎯 應用程式狀態類型
 */
export interface AppState {
  ui: UIState
  route: RouteState
  map: MapState
  user: UserState
}

export interface UIState {
  isLoading: boolean
  isSidebarOpen: boolean
  activeTab: 'search' | 'routes' | 'settings'
  theme: 'light' | 'dark' | 'system'
  language: 'zh-TW' | 'en-US'
  notifications: Notification[]
}

export interface RouteState {
  searchRequest: RouteSearchRequest | null
  routes: Route[]
  selectedRoute: Route | null
  isSearching: boolean
  searchHistory: RouteSearchRequest[]
  favorites: Route[]
}

export interface MapState {
  center: Coordinates
  zoom: number
  bounds: MapBounds | null
  markers: MapMarker[]
  polylines: MapPolyline[]
  isInteractive: boolean
}

export interface UserState {
  preferences: UserPreferences
  searchHistory: RouteSearchRequest[]
  favorites: Route[]
  settings: UserSettings
}

export interface UserPreferences {
  defaultTransportModes: TransportMode[]
  maxWalkingDistance: number
  prioritize: RoutePreferences['prioritize']
  accessibilityRequired: boolean
  language: 'zh-TW' | 'en-US'
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
  analytics: boolean
  location: boolean
}

/**
 * 📱 通知系統類型
 */
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: number
  read: boolean
  action?: {
    label: string
    handler: () => void
  }
}

/**
 * 🔌 API 相關類型
 */
export interface APIResponse<T = any> {
  success: boolean
  data: T
  message?: string
  error?: string
  timestamp: number
}

export interface APIError {
  code: string
  message: string
  details?: any
  timestamp: number
}

/**
 * 🧪 測試相關類型
 */
export interface TestRoute {
  name: string
  origin: Location
  destination: Location
  expectedDuration: number
  expectedCost: number
}

/**
 * 📊 分析和統計類型
 */
export interface RouteAnalytics {
  searchCount: number
  popularOrigins: Location[]
  popularDestinations: Location[]
  averageSearchTime: number
  preferredTransportModes: TransportMode[]
  peakUsageHours: number[]
}

/**
 * 🎨 UI 組件 Props 類型
 */
export interface RouteCardProps {
  route: Route
  isSelected: boolean
  onSelect: (route: Route) => void
  className?: string
}

export interface MapComponentProps {
  center: Coordinates
  zoom: number
  markers: MapMarker[]
  polylines: MapPolyline[]
  onMapClick?: (coordinates: Coordinates) => void
  onMarkerClick?: (marker: MapMarker) => void
  className?: string
}

export interface SearchFormProps {
  onSearch: (request: RouteSearchRequest) => void
  isLoading: boolean
  initialValues?: Partial<RouteSearchRequest>
  className?: string
}

/**
 * 🔧 工具函數類型
 */
export type CoordinateFormatter = (coord: Coordinates) => string
export type DistanceCalculator = (from: Coordinates, to: Coordinates) => number
export type RouteOptimizer = (routes: Route[], preferences: RoutePreferences) => Route[]

/**
 * 🌐 國際化類型
 */
export interface I18nMessages {
  [key: string]: string | I18nMessages
}

export interface I18nConfig {
  locale: string
  messages: I18nMessages
  fallbackLocale: string
}

/**
 * 📱 PWA 相關類型
 */
export interface PWAInstallPrompt {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * 🎯 性能監控類型
 */
export interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  apiResponseTime: number
  memoryUsage: number
  errorCount: number
}

// 🤖 AI-Generated Type Guards
export const isCoordinates = (obj: any): obj is Coordinates => {
  return obj && typeof obj.latitude === 'number' && typeof obj.longitude === 'number'
}

export const isRoute = (obj: any): obj is Route => {
  return obj && typeof obj.id === 'string' && Array.isArray(obj.segments)
}

export const isLocation = (obj: any): obj is Location => {
  return obj && typeof obj.name === 'string' && isCoordinates(obj.coordinates)
}

// 🎨 Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}