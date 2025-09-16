// 🤖 AI-Generated Route Card Component
// 🎫 單一路線卡片顯示組件

import React from 'react'
import { motion } from 'framer-motion'
import { Route, RouteSegment } from '@/types'

interface RouteCardProps {
  route: Route
  isSelected: boolean
  onSelect: (route: Route) => void
  showBadge?: boolean
  badgeText?: string
  className?: string
}

const RouteCard: React.FC<RouteCardProps> = ({
  route,
  isSelected,
  onSelect,
  showBadge = false,
  badgeText = '',
  className = '',
}) => {
  // 🎨 Get transport mode icon and color
  const getTransportIcon = (mode: string): string => {
    const icons = {
      walking: '🚶',
      mrt: '🚇',
      bus: '🚌',
      taxi: '🚕',
      driving: '🚗',
    }
    return icons[mode as keyof typeof icons] || '📍'
  }

  const getTransportColor = (mode: string): string => {
    const colors = {
      walking: 'bg-success-500',
      mrt: 'bg-primary-500',
      bus: 'bg-warning-500',
      taxi: 'bg-error-500',
      driving: 'bg-gray-500',
    }
    return colors[mode as keyof typeof colors] || 'bg-gray-500'
  }

  // 🎯 Format time display
  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}分`
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}時${mins > 0 ? `${mins}分` : ''}`
  }

  // 🎯 Format cost display
  const formatCost = (cost: number): string => {
    return `$${cost}`
  }

  // 🎯 Get route type description
  const getRouteTypeDescription = (segments: RouteSegment[]): string => {
    const modes = segments.map(s => s.mode)
    const uniqueModes = [...new Set(modes)]
    
    if (uniqueModes.length === 1) {
      if (uniqueModes[0] === 'walking') return '步行'
      if (uniqueModes[0] === 'mrt') return '捷運'
      if (uniqueModes[0] === 'bus') return '公車'
      if (uniqueModes[0] === 'taxi') return '計程車'
    }
    
    const modeNames = uniqueModes.map(mode => {
      switch (mode) {
        case 'walking': return '步行'
        case 'mrt': return '捷運'
        case 'bus': return '公車'
        case 'taxi': return '計程車'
        default: return mode
      }
    })
    
    return modeNames.join(' + ')
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(route)}
      className={`
        route-card relative cursor-pointer
        ${isSelected ? 'selected' : ''}
        ${className}
      `}
    >
      {/* 🏆 Badge */}
      {showBadge && badgeText && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="rounded-full bg-primary-500 px-2 py-1 text-xs font-medium text-white shadow-md">
            {badgeText}
          </div>
        </div>
      )}

      {/* 📊 Route Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-gray-900">
            {route.type || getRouteTypeDescription(route.segments)}
          </h3>
          {route.accessibility && (
            <span className="text-blue-500" title="無障礙友善">
              ♿
            </span>
          )}
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-primary-600">
            {formatTime(route.totalTime)}
          </div>
          <div className="text-xs text-gray-500">總時間</div>
        </div>
      </div>

      {/* 📊 Route Stats */}
      <div className="mb-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-sm font-semibold text-success-600">
            {formatCost(route.totalCost)}
          </div>
          <div className="text-xs text-gray-500">費用</div>
        </div>
        <div>
          <div className="text-sm font-semibold text-secondary-600">
            {route.transfers}次
          </div>
          <div className="text-xs text-gray-500">轉乘</div>
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-600">
            {route.totalDistance ? route.totalDistance.toFixed(1) : '0'}km
          </div>
          <div className="text-xs text-gray-500">距離</div>
        </div>
      </div>

      {/* 🛣️ Route Segments */}
      <div className="space-y-3">
        {route.segments.map((segment, index) => (
          <div key={index} className="route-segment">
            <div className={`segment-icon ${segment.mode} ${getTransportColor(segment.mode)}`}>
              {getTransportIcon(segment.mode)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="font-medium text-gray-900">
                  {segment.line && (
                    <span className="mr-2 text-sm font-bold">
                      {segment.line}
                    </span>
                  )}
                  <span className="text-sm">
                    {formatTime(segment.duration)}
                  </span>
                  {segment.distance && (
                    <span className="ml-2 text-xs text-gray-500">
                      {segment.distance.toFixed(1)}km
                    </span>
                  )}
                </div>
                {segment.cost && (
                  <div className="text-sm font-medium text-gray-600">
                    {formatCost(segment.cost)}
                  </div>
                )}
              </div>
              
              {/* 📍 Segment Details */}
              <div className="mt-2 text-sm text-gray-600">
                {segment.instructions && (
                  <div className="mb-1">{segment.instructions}</div>
                )}
                
                {/* 🚇 MRT Stations */}
                {segment.mode === 'mrt' && segment.stations && segment.stations.length > 2 && (
                  <div className="text-gray-500">
                    {segment.stations[0]} → {segment.stations[segment.stations.length - 1]}
                    <span className="ml-1">
                      (經過 {segment.stations.length - 1} 站)
                    </span>
                  </div>
                )}
                
                {/* 🚌 Bus Info */}
                {segment.mode === 'bus' && segment.line && (
                  <div className="text-gray-500">
                    {segment.line} 號公車
                  </div>
                )}
                
                {/* 🚕 Taxi Info */}
                {segment.mode === 'taxi' && segment.estimatedFare && (
                  <div className="text-gray-500">
                    預估車資: {segment.estimatedFare}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🌱 Environmental Info */}
      {route.carbonFootprint && (
        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center text-xs text-gray-500">
            <span className="mr-1">🌱</span>
            碳足跡: {route.carbonFootprint.toFixed(2)} kg CO₂
          </div>
          {route.reliability && (
            <div className="flex items-center text-xs text-gray-500">
              <span className="mr-1">⭐</span>
              可靠度: {route.reliability}/5
            </div>
          )}
        </div>
      )}

      {/* 🎯 Selection Indicator */}
      {isSelected && (
        <div className="absolute inset-0 rounded-lg border-2 border-primary-500 pointer-events-none">
          <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary-500"></div>
        </div>
      )}
    </motion.div>
  )
}

export default RouteCard