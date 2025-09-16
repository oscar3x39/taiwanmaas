// 🤖 AI-Generated Map State Management
// 🗺️ 管理地圖狀態、標記和路線顯示

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MapState, Coordinates, MapMarker, MapPolyline, MapBounds } from '@/types'

// 🏠 台北市中心作為預設中心點
const TAIPEI_CENTER: Coordinates = {
  latitude: 25.0478,
  longitude: 121.5170,
}

const initialState: MapState = {
  center: TAIPEI_CENTER,
  zoom: 12,
  bounds: null,
  markers: [],
  polylines: [],
  isInteractive: true,
}

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    // 🎯 Map View Control
    setCenter: (state, action: PayloadAction<Coordinates>) => {
      state.center = action.payload
    },

    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = Math.max(1, Math.min(18, action.payload)) // 限制縮放範圍
    },

    setBounds: (state, action: PayloadAction<MapBounds | null>) => {
      state.bounds = action.payload
    },

    setView: (state, action: PayloadAction<{ center: Coordinates; zoom: number }>) => {
      state.center = action.payload.center
      state.zoom = Math.max(1, Math.min(18, action.payload.zoom))
    },

    // 🎯 Fit to Bounds
    fitToBounds: (state, action: PayloadAction<Coordinates[]>) => {
      if (action.payload.length === 0) return

      // 計算邊界
      const lats = action.payload.map(coord => coord.latitude)
      const lngs = action.payload.map(coord => coord.longitude)
      
      const bounds: MapBounds = {
        north: Math.max(...lats),
        south: Math.min(...lats),
        east: Math.max(...lngs),
        west: Math.min(...lngs),
      }

      state.bounds = bounds

      // 計算中心點
      state.center = {
        latitude: (bounds.north + bounds.south) / 2,
        longitude: (bounds.east + bounds.west) / 2,
      }

      // 根據邊界調整縮放級別
      const latDiff = bounds.north - bounds.south
      const lngDiff = bounds.east - bounds.west
      const maxDiff = Math.max(latDiff, lngDiff)
      
      let zoom = 12
      if (maxDiff > 0.1) zoom = 10
      else if (maxDiff > 0.05) zoom = 11
      else if (maxDiff > 0.02) zoom = 12
      else if (maxDiff > 0.01) zoom = 13
      else if (maxDiff > 0.005) zoom = 14
      else zoom = 15

      state.zoom = zoom
    },

    // 📍 Marker Management
    addMarker: (state, action: PayloadAction<MapMarker>) => {
      // 檢查是否已存在相同 ID 的標記
      const existingIndex = state.markers.findIndex(marker => marker.id === action.payload.id)
      if (existingIndex !== -1) {
        state.markers[existingIndex] = action.payload
      } else {
        state.markers.push(action.payload)
      }
    },

    removeMarker: (state, action: PayloadAction<string>) => {
      state.markers = state.markers.filter(marker => marker.id !== action.payload)
    },

    updateMarker: (state, action: PayloadAction<{ id: string; updates: Partial<MapMarker> }>) => {
      const marker = state.markers.find(m => m.id === action.payload.id)
      if (marker) {
        Object.assign(marker, action.payload.updates)
      }
    },

    clearMarkers: (state) => {
      state.markers = []
    },

    setMarkers: (state, action: PayloadAction<MapMarker[]>) => {
      state.markers = action.payload
    },

    // 📍 Marker Type Helpers
    addOriginMarker: (state, action: PayloadAction<{ position: Coordinates; title: string }>) => {
      const marker: MapMarker = {
        id: 'origin',
        position: action.payload.position,
        type: 'origin',
        title: action.payload.title,
        description: '起點',
      }
      mapSlice.caseReducers.addMarker(state, { type: 'map/addMarker', payload: marker })
    },

    addDestinationMarker: (state, action: PayloadAction<{ position: Coordinates; title: string }>) => {
      const marker: MapMarker = {
        id: 'destination',
        position: action.payload.position,
        type: 'destination',
        title: action.payload.title,
        description: '終點',
      }
      mapSlice.caseReducers.addMarker(state, { type: 'map/addMarker', payload: marker })
    },

    // 🛣️ Polyline Management
    addPolyline: (state, action: PayloadAction<MapPolyline>) => {
      const existingIndex = state.polylines.findIndex(line => line.id === action.payload.id)
      if (existingIndex !== -1) {
        state.polylines[existingIndex] = action.payload
      } else {
        state.polylines.push(action.payload)
      }
    },

    removePolyline: (state, action: PayloadAction<string>) => {
      state.polylines = state.polylines.filter(line => line.id !== action.payload)
    },

    updatePolyline: (state, action: PayloadAction<{ id: string; updates: Partial<MapPolyline> }>) => {
      const polyline = state.polylines.find(p => p.id === action.payload.id)
      if (polyline) {
        Object.assign(polyline, action.payload.updates)
      }
    },

    clearPolylines: (state) => {
      state.polylines = []
    },

    setPolylines: (state, action: PayloadAction<MapPolyline[]>) => {
      state.polylines = action.payload
    },

    // 🎮 Interaction Control
    setInteractive: (state, action: PayloadAction<boolean>) => {
      state.isInteractive = action.payload
    },

    // 🔄 Batch Updates
    updateMapState: (state, action: PayloadAction<Partial<MapState>>) => {
      Object.assign(state, action.payload)
    },

    // 🧹 Clear All Map Elements
    clearMapElements: (state) => {
      state.markers = []
      state.polylines = []
    },

    // 🔄 Reset Map State
    resetMapState: () => initialState,

    // 🎯 Preset Views
    setTaipeiView: (state) => {
      state.center = TAIPEI_CENTER
      state.zoom = 12
    },

    setTaiwanView: (state) => {
      state.center = { latitude: 23.8, longitude: 121.0 }
      state.zoom = 8
    },
  },
})

// 🚀 Export Actions
export const {
  setCenter,
  setZoom,
  setBounds,
  setView,
  fitToBounds,
  addMarker,
  removeMarker,
  updateMarker,
  clearMarkers,
  setMarkers,
  addOriginMarker,
  addDestinationMarker,
  addPolyline,
  removePolyline,
  updatePolyline,
  clearPolylines,
  setPolylines,
  setInteractive,
  updateMapState,
  clearMapElements,
  resetMapState,
  setTaipeiView,
  setTaiwanView,
} = mapSlice.actions

// 🎨 Complex Actions
export const setRouteMarkers = (origin: Coordinates, destination: Coordinates, originName: string, destinationName: string) => 
  (dispatch: any) => {
    dispatch(clearMarkers())
    dispatch(addOriginMarker({ position: origin, title: originName }))
    dispatch(addDestinationMarker({ position: destination, title: destinationName }))
    dispatch(fitToBounds([origin, destination]))
  }

export const showRouteOnMap = (coordinates: Coordinates[], color = '#3b82f6') => 
  (dispatch: any) => {
    const polyline: MapPolyline = {
      id: 'route',
      coordinates,
      color,
      weight: 5,
      opacity: 0.8,
      popup: '路線',
    }
    dispatch(addPolyline(polyline))
    dispatch(fitToBounds(coordinates))
  }

export const clearRoute = () => (dispatch: any) => {
  dispatch(removePolyline('route'))
  dispatch(clearMarkers())
}

// 🧮 Utility Functions
export const calculateDistance = (from: Coordinates, to: Coordinates): number => {
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

export const isValidCoordinates = (coords: Coordinates): boolean => {
  return (
    coords.latitude >= -90 && coords.latitude <= 90 &&
    coords.longitude >= -180 && coords.longitude <= 180
  )
}

export default mapSlice.reducer