// 🤖 AI-Generated Route List Component
// 🛣️ 路線結果列表顯示組件

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Route } from '@/types'
import RouteCard from './RouteCard'

interface RouteListProps {
  routes: Route[]
  selectedRoute: Route | null
  onRouteSelect: (route: Route) => void
  className?: string
}

const RouteList: React.FC<RouteListProps> = ({
  routes,
  selectedRoute,
  onRouteSelect,
  className = '',
}) => {
  if (routes.length === 0) {
    return (
      <div className={`text-center text-gray-500 ${className}`}>
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 6-3v11.382a1 1 0 01-.553.894L15 17l-6-3z" />
          </svg>
        </div>
        <p>沒有找到路線</p>
        <p className="text-sm">請嘗試不同的起終點</p>
      </div>
    )
  }

  // 🎯 Sort routes by priority
  const sortedRoutes = [...routes].sort((a, b) => {
    // 優先顯示最快路線
    if (a.totalTime !== b.totalTime) {
      return a.totalTime - b.totalTime
    }
    // 其次是最便宜路線
    if (a.totalCost !== b.totalCost) {
      return a.totalCost - b.totalCost
    }
    // 最後是最少轉乘
    return a.transfers - b.transfers
  })

  return (
    <div className={className}>
      <AnimatePresence>
        {sortedRoutes.map((route, index) => (
          <motion.div
            key={route.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.3,
              delay: index * 0.1 
            }}
            className="mb-3"
          >
            <RouteCard
              route={route}
              isSelected={selectedRoute?.id === route.id}
              onSelect={onRouteSelect}
              showBadge={index === 0}
              badgeText={getBadgeText(route, sortedRoutes)}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 📊 Summary Statistics */}
      {routes.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="summary-stats mt-6 rounded-lg bg-gray-50 p-4"
        >
          <h4 className="mb-3 text-sm font-medium text-gray-700">路線比較</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-primary-600">
                {Math.min(...routes.map(r => r.totalTime))}分
              </div>
              <div className="text-xs text-gray-500">最快時間</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-success-600">
                ${Math.min(...routes.map(r => r.totalCost))}
              </div>
              <div className="text-xs text-gray-500">最低費用</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-secondary-600">
                {Math.min(...routes.map(r => r.transfers))}次
              </div>
              <div className="text-xs text-gray-500">最少轉乘</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 🎯 Route Recommendations */}
      {routes.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-4 rounded-lg bg-blue-50 p-4"
        >
          <div className="flex items-start">
            <div className="mr-3 mt-0.5">
              <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-900">💡 建議</h4>
              <p className="mt-1 text-sm text-blue-700">
                {getRecommendationText(sortedRoutes)}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// 🏆 Get badge text for the best route
const getBadgeText = (route: Route, allRoutes: Route[]): string => {
  const fastestTime = Math.min(...allRoutes.map(r => r.totalTime))
  const cheapestCost = Math.min(...allRoutes.map(r => r.totalCost))
  const leastTransfers = Math.min(...allRoutes.map(r => r.transfers))

  if (route.totalTime === fastestTime) return '最快'
  if (route.totalCost === cheapestCost) return '最便宜'
  if (route.transfers === leastTransfers) return '最少轉乘'
  return '推薦'
}

// 💡 Get recommendation text
const getRecommendationText = (routes: Route[]): string => {
  if (routes.length === 0) return ''

  const bestRoute = routes[0]
  const recommendations = []

  // 時間建議
  if (bestRoute.totalTime <= 30) {
    recommendations.push('路程時間短')
  } else if (bestRoute.totalTime <= 60) {
    recommendations.push('路程時間適中')
  }

  // 費用建議
  if (bestRoute.totalCost <= 50) {
    recommendations.push('費用經濟')
  }

  // 轉乘建議
  if (bestRoute.transfers === 0) {
    recommendations.push('直達無需轉乘')
  } else if (bestRoute.transfers <= 1) {
    recommendations.push('轉乘次數少')
  }

  // 環保建議
  const hasEcoTransport = bestRoute.segments.some(segment => 
    ['mrt', 'bus'].includes(segment.mode)
  )
  if (hasEcoTransport) {
    recommendations.push('環保出行')
  }

  if (recommendations.length === 0) {
    return '根據您的偏好，推薦使用第一條路線。'
  }

  return `推薦第一條路線：${recommendations.join('、')}。`
}

export default RouteList