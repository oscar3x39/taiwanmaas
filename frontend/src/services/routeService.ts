// 🤖 AI-Generated Route Service
// 🛣️ 路線搜尋和管理的專用服務

import { ApiService, withRetry, RequestCancellation } from './api'
import { 
  RouteSearchRequest, 
  RouteSearchResponse, 
  Route, 
  Location, 
  Coordinates 
} from '@/types'

class RouteService {
  private cancellation = new RequestCancellation()

  // 🔍 搜尋路線
  async searchRoutes(request: RouteSearchRequest): Promise<RouteSearchResponse> {
    return this.cancellation.createCancellableRequest(
      'searchRoutes',
      async (signal) => {
        return withRetry(
          () => ApiService.post<RouteSearchResponse['data']>('/api/routes', request, { signal }),
          3,
          1000
        )
      }
    )
  }

  // 🔍 快速路線搜尋 (簡化參數)
  async quickSearch(
    origin: Coordinates,
    destination: Coordinates,
    prioritize: 'time' | 'cost' | 'comfort' = 'time'
  ): Promise<RouteSearchResponse> {
    const request: RouteSearchRequest = {
      origin,
      destination,
      preferences: {
        prioritize,
        maxWalkingDistance: 800,
      }
    }

    return this.searchRoutes(request)
  }

  // 📍 地點搜尋
  async searchLocations(query: string): Promise<Location[]> {
    if (!query.trim()) return []

    try {
      const response = await ApiService.get<Location[]>(`/api/locations/search`, {
        params: { q: query, limit: 10 }
      })
      return response.data
    } catch (error) {
      console.error('Location search failed:', error)
      return []
    }
  }

  // 📍 根據座標獲取地點資訊
  async reverseGeocode(coordinates: Coordinates): Promise<Location | null> {
    try {
      const response = await ApiService.get<Location>('/api/locations/reverse', {
        params: {
          lat: coordinates.latitude,
          lng: coordinates.longitude
        }
      })
      return response.data
    } catch (error) {
      console.error('Reverse geocoding failed:', error)
      return null
    }
  }

  // 🚇 獲取捷運站點資訊
  async getMRTStations(): Promise<Location[]> {
    try {
      const response = await ApiService.get<Location[]>('/api/mrt/stations')
      return response.data
    } catch (error) {
      console.error('Failed to fetch MRT stations:', error)
      return []
    }
  }

  // 🚇 獲取特定捷運路線的站點
  async getMRTLineStations(lineId: string): Promise<Location[]> {
    try {
      const response = await ApiService.get<Location[]>(`/api/mrt/lines/${lineId}/stations`)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch stations for line ${lineId}:`, error)
      return []
    }
  }

  // 🚌 獲取公車站點資訊
  async getBusStops(query?: string): Promise<Location[]> {
    try {
      const response = await ApiService.get<Location[]>('/api/bus/stops', {
        params: query ? { q: query } : {}
      })
      return response.data
    } catch (error) {
      console.error('Failed to fetch bus stops:', error)
      return []
    }
  }

  // 🎯 獲取路線詳細資訊
  async getRouteDetails(routeId: string): Promise<Route | null> {
    try {
      const response = await ApiService.get<Route>(`/api/routes/${routeId}`)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch route details for ${routeId}:`, error)
      return null
    }
  }

  // 📊 獲取路線統計資訊
  async getRouteStats(routeId: string): Promise<{
    averageTime: number
    reliability: number
    popularity: number
    lastUpdated: string
  } | null> {
    try {
      const response = await ApiService.get(`/api/routes/${routeId}/stats`)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch route stats for ${routeId}:`, error)
      return null
    }
  }

  // 🔄 重新計算路線 (即時更新)
  async recalculateRoute(routeId: string): Promise<Route | null> {
    try {
      const response = await ApiService.post<Route>(`/api/routes/${routeId}/recalculate`)
      return response.data
    } catch (error) {
      console.error(`Failed to recalculate route ${routeId}:`, error)
      return null
    }
  }

  // 📱 獲取即時交通資訊
  async getRealTimeInfo(routeId: string): Promise<{
    delays: Array<{
      segment: number
      delay: number
      reason: string
    }>
    alerts: Array<{
      type: 'warning' | 'info' | 'error'
      message: string
      affectedSegments: number[]
    }>
    lastUpdated: string
  } | null> {
    try {
      const response = await ApiService.get(`/api/routes/${routeId}/realtime`)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch real-time info for ${routeId}:`, error)
      return null
    }
  }

  // 🎯 路線比較
  async compareRoutes(routeIds: string[]): Promise<{
    comparison: Array<{
      routeId: string
      metrics: {
        time: number
        cost: number
        transfers: number
        walking: number
        comfort: number
        reliability: number
      }
    }>
    recommendation: string
  } | null> {
    try {
      const response = await ApiService.post('/api/routes/compare', { routeIds })
      return response.data
    } catch (error) {
      console.error('Failed to compare routes:', error)
      return null
    }
  }

  // 🌱 獲取環保路線建議
  async getEcoFriendlyRoutes(request: RouteSearchRequest): Promise<{
    routes: Route[]
    carbonSavings: number
    ecoScore: number
  } | null> {
    try {
      const response = await ApiService.post('/api/routes/eco', request)
      return response.data
    } catch (error) {
      console.error('Failed to fetch eco-friendly routes:', error)
      return null
    }
  }

  // ♿ 獲取無障礙路線
  async getAccessibleRoutes(request: RouteSearchRequest): Promise<{
    routes: Route[]
    accessibilityFeatures: string[]
  } | null> {
    try {
      const modifiedRequest = {
        ...request,
        preferences: {
          ...request.preferences,
          accessibilityRequired: true
        }
      }
      const response = await ApiService.post('/api/routes/accessible', modifiedRequest)
      return response.data
    } catch (error) {
      console.error('Failed to fetch accessible routes:', error)
      return null
    }
  }

  // 📍 獲取附近的興趣點
  async getNearbyPOIs(coordinates: Coordinates, radius: number = 500): Promise<Location[]> {
    try {
      const response = await ApiService.get<Location[]>('/api/locations/nearby', {
        params: {
          lat: coordinates.latitude,
          lng: coordinates.longitude,
          radius
        }
      })
      return response.data
    } catch (error) {
      console.error('Failed to fetch nearby POIs:', error)
      return []
    }
  }

  // 🎯 路線優化建議
  async getRouteOptimization(routeId: string): Promise<{
    suggestions: Array<{
      type: 'time' | 'cost' | 'comfort'
      description: string
      estimatedImprovement: string
    }>
    alternativeRoutes: Route[]
  } | null> {
    try {
      const response = await ApiService.get(`/api/routes/${routeId}/optimize`)
      return response.data
    } catch (error) {
      console.error(`Failed to get optimization for route ${routeId}:`, error)
      return null
    }
  }

  // 📊 獲取使用統計
  async getUsageStats(): Promise<{
    totalSearches: number
    popularRoutes: Route[]
    averageSearchTime: number
    userSatisfaction: number
  } | null> {
    try {
      const response = await ApiService.get('/api/stats/usage')
      return response.data
    } catch (error) {
      console.error('Failed to fetch usage stats:', error)
      return null
    }
  }

  // 🔄 取消當前搜尋
  cancelCurrentSearch(): void {
    this.cancellation.cancel('searchRoutes')
  }

  // 🧹 清理所有請求
  cleanup(): void {
    this.cancellation.cancelAll()
  }

  // 🎯 工具方法：計算兩點間距離
  calculateDistance(from: Coordinates, to: Coordinates): number {
    const R = 6371 // 地球半徑 (公里)
    const dLat = (to.latitude - from.latitude) * Math.PI / 180
    const dLng = (to.longitude - from.longitude) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(from.latitude * Math.PI / 180) * Math.cos(to.latitude * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // 🎯 工具方法：驗證座標
  isValidCoordinates(coordinates: Coordinates): boolean {
    return (
      coordinates.latitude >= -90 && coordinates.latitude <= 90 &&
      coordinates.longitude >= -180 && coordinates.longitude <= 180
    )
  }

  // 🎯 工具方法：格式化座標
  formatCoordinates(coordinates: Coordinates, precision: number = 6): string {
    return `${coordinates.latitude.toFixed(precision)}, ${coordinates.longitude.toFixed(precision)}`
  }
}

// 🏭 Export Singleton Instance
export const routeService = new RouteService()
export default routeService