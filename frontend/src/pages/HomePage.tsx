// 🤖 AI-Generated Home Page Component
// 🏠 主頁面：整合地圖、搜尋和路線顯示功能

import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { searchRoutes } from '@/store/slices/routeSlice'
import { setRouteMarkers, showRouteOnMap } from '@/store/slices/mapSlice'
import { showSuccessNotification, showErrorNotification } from '@/store/slices/uiSlice'

// 🎨 Components
import MapComponent from '@/components/map/MapComponent'
import Sidebar from '@/components/layout/Sidebar'
import SearchForm from '@/components/search/SearchForm'
import RouteList from '@/components/route/RouteList'
import LoadingOverlay from '@/components/ui/LoadingOverlay'

// 🎯 Types
import { RouteSearchRequest, Coordinates } from '@/types'

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { routes, selectedRoute, isSearching } = useAppSelector(state => state.route)
  const { isSidebarOpen } = useAppSelector(state => state.ui)
  const { center, markers, polylines } = useAppSelector(state => state.map)

  // 🎯 Local State
  const [searchRequest, setSearchRequest] = useState<RouteSearchRequest | null>(null)

  // 🔍 Handle Route Search
  const handleSearch = async (request: RouteSearchRequest) => {
    try {
      setSearchRequest(request)
      
      // 設置地圖標記
      dispatch(setRouteMarkers(
        request.origin,
        request.destination,
        '起點',
        '終點'
      ))

      // 執行搜尋
      const result = await dispatch(searchRoutes(request))
      
      if (searchRoutes.fulfilled.match(result)) {
        dispatch(showSuccessNotification(
          `找到 ${result.payload.response.data.routes.length} 條路線`
        ))
      }
    } catch (error: any) {
      dispatch(showErrorNotification(
        error.message || '路線搜尋失敗'
      ))
    }
  }

  // 🎯 Handle Route Selection
  const handleRouteSelect = (route: any) => {
    // 在地圖上顯示選中的路線
    if (route.segments && route.segments.length > 0) {
      const coordinates: Coordinates[] = []
      
      // 收集所有路線段的座標
      route.segments.forEach((segment: any) => {
        if (segment.from?.coordinates) {
          coordinates.push({
            latitude: segment.from.coordinates.latitude,
            longitude: segment.from.coordinates.longitude,
          })
        }
        if (segment.to?.coordinates) {
          coordinates.push({
            latitude: segment.to.coordinates.latitude,
            longitude: segment.to.coordinates.longitude,
          })
        }
      })

      if (coordinates.length > 0) {
        dispatch(showRouteOnMap(coordinates, '#3b82f6'))
      }
    }
  }

  // 🗺️ Handle Map Click
  const handleMapClick = (coordinates: Coordinates) => {
    // 可以在這裡實作點擊地圖設定起終點的功能
    console.log('Map clicked:', coordinates)
  }

  // 📱 Handle Sidebar Toggle
  const handleSidebarToggle = () => {
    // 在小螢幕上可以切換側邊欄顯示
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 🔄 Loading Overlay */}
      {isSearching && (
        <LoadingOverlay message="正在搜尋最佳路線..." />
      )}

      {/* 📱 Sidebar */}
      <div className={`
        ${isSidebarOpen ? 'w-96' : 'w-0'} 
        transition-all duration-300 ease-in-out
        lg:w-96 lg:block
        ${isSidebarOpen ? 'block' : 'hidden lg:block'}
      `}>
        <Sidebar>
          {/* 🔍 Search Section */}
          <div className="border-b border-gray-200 p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              路線搜尋
            </h2>
            <SearchForm
              onSearch={handleSearch}
              isLoading={isSearching}
              className="space-y-4"
            />
          </div>

          {/* 🛣️ Routes Section */}
          <div className="flex-1 overflow-y-auto p-6">
            {routes.length > 0 ? (
              <>
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  搜尋結果 ({routes.length} 條路線)
                </h3>
                <RouteList
                  routes={routes}
                  selectedRoute={selectedRoute}
                  onRouteSelect={handleRouteSelect}
                  className="space-y-3"
                />
              </>
            ) : searchRequest ? (
              <div className="text-center text-gray-500">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 6-3v11.382a1 1 0 01-.553.894L15 17l-6-3z" />
                  </svg>
                </div>
                <p>沒有找到符合條件的路線</p>
                <p className="text-sm">請嘗試調整搜尋條件</p>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p>輸入起點和終點開始搜尋</p>
                <p className="text-sm">找到最適合您的交通路線</p>
              </div>
            )}
          </div>

          {/* 📊 Stats Section (Optional) */}
          {routes.length > 0 && (
            <div className="border-t border-gray-200 p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-primary-600">
                    {Math.min(...routes.map(r => r.totalTime))}
                  </div>
                  <div className="text-xs text-gray-500">最快時間(分)</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-success-600">
                    ${Math.min(...routes.map(r => r.totalCost))}
                  </div>
                  <div className="text-xs text-gray-500">最低費用</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-secondary-600">
                    {Math.min(...routes.map(r => r.transfers))}
                  </div>
                  <div className="text-xs text-gray-500">最少轉乘</div>
                </div>
              </div>
            </div>
          )}
        </Sidebar>
      </div>

      {/* 🗺️ Map Section */}
      <div className="flex-1">
        <MapComponent
          center={center}
          zoom={12}
          markers={markers}
          polylines={polylines}
          onMapClick={handleMapClick}
          className="h-full w-full"
        />
      </div>

      {/* 📱 Mobile Sidebar Toggle (Hidden on Desktop) */}
      <button
        onClick={handleSidebarToggle}
        className="fixed bottom-4 left-4 z-50 rounded-full bg-primary-600 p-3 text-white shadow-lg lg:hidden"
        aria-label="切換側邊欄"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  )
}

export default HomePage