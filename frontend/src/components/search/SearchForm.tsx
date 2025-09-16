// 🤖 AI-Generated Search Form Component
// 🔍 路線搜尋表單組件

import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useAppSelector } from '@/store'
import { RouteSearchRequest, Coordinates, RoutePreferences } from '@/types'

interface SearchFormProps {
  onSearch: (request: RouteSearchRequest) => void
  isLoading: boolean
  initialValues?: Partial<RouteSearchRequest>
  className?: string
}

// 🏠 預設地點
const DEFAULT_LOCATIONS = [
  { name: '台北車站', coordinates: { latitude: 25.0478, longitude: 121.5170 } },
  { name: '台北101', coordinates: { latitude: 25.0340, longitude: 121.5645 } },
  { name: '西門町', coordinates: { latitude: 25.0420, longitude: 121.5080 } },
  { name: '信義區', coordinates: { latitude: 25.0330, longitude: 121.5654 } },
  { name: '南港車站', coordinates: { latitude: 25.0540, longitude: 121.6066 } },
  { name: '淡水', coordinates: { latitude: 25.1677, longitude: 121.4406 } },
  { name: '新店', coordinates: { latitude: 24.9571, longitude: 121.5420 } },
  { name: '板橋', coordinates: { latitude: 25.0138, longitude: 121.4627 } },
]

const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  isLoading,
  initialValues,
  className = '',
}) => {
  const { preferences } = useAppSelector(state => state.user)

  // 🎯 Form State
  const [origin, setOrigin] = useState(initialValues?.origin || null)
  const [destination, setDestination] = useState(initialValues?.destination || null)
  const [originInput, setOriginInput] = useState('')
  const [destinationInput, setDestinationInput] = useState('')
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false)
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false)
  const [routePreferences, setRoutePreferences] = useState<RoutePreferences>({
    prioritize: preferences.prioritize,
    maxWalkingDistance: preferences.maxWalkingDistance,
    accessibilityRequired: preferences.accessibilityRequired,
    transportModes: preferences.defaultTransportModes,
  })

  // 🔍 Filter suggestions based on input
  const getFilteredSuggestions = useCallback((input: string) => {
    if (!input.trim()) return DEFAULT_LOCATIONS
    return DEFAULT_LOCATIONS.filter(location =>
      location.name.toLowerCase().includes(input.toLowerCase())
    )
  }, [])

  // 🎯 Handle location selection
  const handleLocationSelect = (location: typeof DEFAULT_LOCATIONS[0], type: 'origin' | 'destination') => {
    if (type === 'origin') {
      setOrigin(location.coordinates)
      setOriginInput(location.name)
      setShowOriginSuggestions(false)
    } else {
      setDestination(location.coordinates)
      setDestinationInput(location.name)
      setShowDestinationSuggestions(false)
    }
  }

  // 🔄 Swap origin and destination
  const handleSwapLocations = () => {
    const tempOrigin = origin
    const tempOriginInput = originInput
    
    setOrigin(destination)
    setOriginInput(destinationInput)
    setDestination(tempOrigin)
    setDestinationInput(tempOriginInput)
  }

  // 📤 Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!origin || !destination) {
      return
    }

    const request: RouteSearchRequest = {
      origin,
      destination,
      preferences: routePreferences,
    }

    onSearch(request)
  }

  // 🎯 Check if form is valid
  const isFormValid = origin && destination && !isLoading

  return (
    <form onSubmit={handleSubmit} className={`search-form space-y-3 ${className}`}>
      {/* 📍 起點終點水平佈局 */}
      <div className="space-y-2">
        {/* 標籤行 */}
        <div className="flex items-center space-x-2">
          <div className="flex-1 text-sm font-medium text-gray-700">起點</div>
          <div className="w-8"></div> {/* 佔位符給交換按鈕 */}
          <div className="flex-1 text-sm font-medium text-gray-700">終點</div>
        </div>

        {/* 輸入框行 */}
        <div className="origin-destination-container flex items-start space-x-2">
          {/* 📍 Origin Input */}
          <div className="relative flex-1">
            <div className="relative">
              <input
                id="origin"
                type="text"
                value={originInput}
                onChange={(e) => {
                  setOriginInput(e.target.value)
                  setShowOriginSuggestions(true)
                  setOrigin(null)
                }}
                onFocus={() => setShowOriginSuggestions(true)}
                placeholder="起點"
                className="input w-full pl-8"
                autoComplete="off"
              />
              <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <div className="h-2.5 w-2.5 rounded-full bg-success-500"></div>
              </div>
            </div>

            {/* 🎯 Origin Suggestions */}
            {showOriginSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="suggestions-list absolute top-full z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg max-h-48 overflow-y-auto"
              >
                {getFilteredSuggestions(originInput).map((location, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleLocationSelect(location, 'origin')}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg text-sm"
                  >
                    <div className="font-medium text-gray-900">{location.name}</div>
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* 🔄 Swap Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSwapLocations}
              className="swap-button rounded-full bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200 transition-colors"
              title="交換起終點"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>

          {/* 📍 Destination Input */}
          <div className="relative flex-1">
            <div className="relative">
              <input
                id="destination"
                type="text"
                value={destinationInput}
                onChange={(e) => {
                  setDestinationInput(e.target.value)
                  setShowDestinationSuggestions(true)
                  setDestination(null)
                }}
                onFocus={() => setShowDestinationSuggestions(true)}
                placeholder="終點"
                className="input w-full pl-8"
                autoComplete="off"
              />
              <div className="absolute left-2 top-1/2 -translate-y-1/2">
                <div className="h-2.5 w-2.5 rounded-full bg-error-500"></div>
              </div>
            </div>

            {/* 🎯 Destination Suggestions */}
            {showDestinationSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="suggestions-list absolute top-full z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg max-h-48 overflow-y-auto"
              >
                {getFilteredSuggestions(destinationInput).map((location, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleLocationSelect(location, 'destination')}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg text-sm"
                  >
                    <div className="font-medium text-gray-900">{location.name}</div>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ⚙️ Preferences */}
      <div className="space-y-2 border-t border-gray-200 pt-3">
        <h4 className="text-sm font-medium text-gray-700">搜尋偏好</h4>
        
        {/* 🎯 Priority Selection */}
        <div>
          <label className="label mb-1 block text-sm text-gray-600">優先考量</label>
          <select
            value={routePreferences.prioritize}
            onChange={(e) => setRoutePreferences(prev => ({
              ...prev,
              prioritize: e.target.value as RoutePreferences['prioritize']
            }))}
            className="input w-full text-sm"
          >
            <option value="time">最短時間</option>
            <option value="cost">最低費用</option>
            <option value="comfort">最舒適</option>
            <option value="eco">最環保</option>
          </select>
        </div>

        {/* 🚶 Max Walking Distance */}
        <div>
          <label className="label mb-1 block text-sm text-gray-600">
            最大步行距離: {routePreferences.maxWalkingDistance}m
          </label>
          <input
            type="range"
            min="200"
            max="2000"
            step="100"
            value={routePreferences.maxWalkingDistance}
            onChange={(e) => setRoutePreferences(prev => ({
              ...prev,
              maxWalkingDistance: parseInt(e.target.value)
            }))}
            className="w-full"
          />
        </div>

        {/* ♿ Accessibility */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="accessibility"
            checked={routePreferences.accessibilityRequired}
            onChange={(e) => setRoutePreferences(prev => ({
              ...prev,
              accessibilityRequired: e.target.checked
            }))}
            className="mr-2"
          />
          <label htmlFor="accessibility" className="text-sm text-gray-600">
            需要無障礙設施
          </label>
        </div>
      </div>

      {/* 🔍 Search Button */}
      <motion.button
        type="submit"
        disabled={!isFormValid}
        whileHover={{ scale: isFormValid ? 1.02 : 1 }}
        whileTap={{ scale: isFormValid ? 0.98 : 1 }}
        className={`
          btn-primary w-full py-2 text-base font-medium
          ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="loading-spinner mr-2"></div>
            搜尋中...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            搜尋路線
          </div>
        )}
      </motion.button>

      {/* 📊 Quick Actions */}
      <div className="flex space-x-2 text-xs">
        <button
          type="button"
          onClick={() => {
            setOrigin({ latitude: 25.0478, longitude: 121.5170 })
            setOriginInput('台北車站')
            setDestination({ latitude: 25.0340, longitude: 121.5645 })
            setDestinationInput('台北101')
          }}
          className="flex-1 rounded bg-gray-100 px-2 py-1 text-gray-600 hover:bg-gray-200"
        >
          台北車站 → 101
        </button>
        <button
          type="button"
          onClick={() => {
            setOrigin({ latitude: 25.0420, longitude: 121.5080 })
            setOriginInput('西門町')
            setDestination({ latitude: 25.0540, longitude: 121.6066 })
            setDestinationInput('南港車站')
          }}
          className="flex-1 rounded bg-gray-100 px-2 py-1 text-gray-600 hover:bg-gray-200"
        >
          西門町 → 南港
        </button>
      </div>

      {/* 🔍 Click outside to close suggestions */}
      {(showOriginSuggestions || showDestinationSuggestions) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setShowOriginSuggestions(false)
            setShowDestinationSuggestions(false)
          }}
        />
      )}
    </form>
  )
}

export default SearchForm