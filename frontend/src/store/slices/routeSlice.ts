// 🤖 AI-Generated Route State Management
// 🛣️ 管理路線搜尋、結果和使用者選擇

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { RouteState, Route, RouteSearchRequest, RouteSearchResponse } from '@/types'
import { routeService } from '@/services/routeService'

const initialState: RouteState = {
  searchRequest: null,
  routes: [],
  selectedRoute: null,
  isSearching: false,
  searchHistory: [],
  favorites: [],
}

// 🔍 Async Thunk for Route Search
export const searchRoutes = createAsyncThunk(
  'route/searchRoutes',
  async (request: RouteSearchRequest, { rejectWithValue }) => {
    try {
      const response = await routeService.searchRoutes(request)
      return { request, response }
    } catch (error: any) {
      return rejectWithValue(error.message || '路線搜尋失敗')
    }
  }
)

// 💾 Async Thunk for Loading Search History
export const loadSearchHistory = createAsyncThunk(
  'route/loadSearchHistory',
  async () => {
    if (typeof window !== 'undefined') {
      const history = localStorage.getItem('searchHistory')
      return history ? JSON.parse(history) : []
    }
    return []
  }
)

// ⭐ Async Thunk for Loading Favorites
export const loadFavorites = createAsyncThunk(
  'route/loadFavorites',
  async () => {
    if (typeof window !== 'undefined') {
      const favorites = localStorage.getItem('favorites')
      return favorites ? JSON.parse(favorites) : []
    }
    return []
  }
)

const routeSlice = createSlice({
  name: 'route',
  initialState,
  reducers: {
    // 🎯 Route Selection
    selectRoute: (state, action: PayloadAction<Route | null>) => {
      state.selectedRoute = action.payload
    },

    // 🔄 Clear Routes
    clearRoutes: (state) => {
      state.routes = []
      state.selectedRoute = null
    },

    // 📝 Update Search Request
    setSearchRequest: (state, action: PayloadAction<RouteSearchRequest | null>) => {
      state.searchRequest = action.payload
    },

    // 📚 Search History Management
    addToSearchHistory: (state, action: PayloadAction<RouteSearchRequest>) => {
      // 避免重複項目
      const existingIndex = state.searchHistory.findIndex(
        item => 
          item.origin.latitude === action.payload.origin.latitude &&
          item.origin.longitude === action.payload.origin.longitude &&
          item.destination.latitude === action.payload.destination.latitude &&
          item.destination.longitude === action.payload.destination.longitude
      )

      if (existingIndex !== -1) {
        // 移除舊項目
        state.searchHistory.splice(existingIndex, 1)
      }

      // 添加到開頭
      state.searchHistory.unshift(action.payload)

      // 限制歷史記錄數量
      if (state.searchHistory.length > 20) {
        state.searchHistory = state.searchHistory.slice(0, 20)
      }

      // 同步到 localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('searchHistory', JSON.stringify(state.searchHistory))
      }
    },

    clearSearchHistory: (state) => {
      state.searchHistory = []
      if (typeof window !== 'undefined') {
        localStorage.removeItem('searchHistory')
      }
    },

    removeFromSearchHistory: (state, action: PayloadAction<number>) => {
      state.searchHistory.splice(action.payload, 1)
      if (typeof window !== 'undefined') {
        localStorage.setItem('searchHistory', JSON.stringify(state.searchHistory))
      }
    },

    // ⭐ Favorites Management
    addToFavorites: (state, action: PayloadAction<Route>) => {
      // 檢查是否已存在
      const exists = state.favorites.some(route => route.id === action.payload.id)
      if (!exists) {
        state.favorites.unshift(action.payload)
        
        // 限制收藏數量
        if (state.favorites.length > 50) {
          state.favorites = state.favorites.slice(0, 50)
        }

        // 同步到 localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('favorites', JSON.stringify(state.favorites))
        }
      }
    },

    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(route => route.id !== action.payload)
      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify(state.favorites))
      }
    },

    clearFavorites: (state) => {
      state.favorites = []
      if (typeof window !== 'undefined') {
        localStorage.removeItem('favorites')
      }
    },

    // 🔄 Batch Updates
    updateRouteState: (state, action: PayloadAction<Partial<RouteState>>) => {
      Object.assign(state, action.payload)
    },

    // 🔄 Reset State
    resetRouteState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // 🔍 Search Routes
      .addCase(searchRoutes.pending, (state) => {
        state.isSearching = true
      })
      .addCase(searchRoutes.fulfilled, (state, action) => {
        state.isSearching = false
        state.routes = action.payload.response.data.routes
        state.searchRequest = action.payload.request
        state.selectedRoute = null

        // 自動選擇第一個路線
        if (state.routes.length > 0) {
          state.selectedRoute = state.routes[0]
        }

        // 添加到搜尋歷史
        routeSlice.caseReducers.addToSearchHistory(state, {
          type: 'route/addToSearchHistory',
          payload: action.payload.request,
        })
      })
      .addCase(searchRoutes.rejected, (state, action) => {
        state.isSearching = false
        state.routes = []
        state.selectedRoute = null
        console.error('Route search failed:', action.payload)
      })

      // 📚 Load Search History
      .addCase(loadSearchHistory.fulfilled, (state, action) => {
        state.searchHistory = action.payload
      })

      // ⭐ Load Favorites
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload
      })
  },
})

// 🚀 Export Actions
export const {
  selectRoute,
  clearRoutes,
  setSearchRequest,
  addToSearchHistory,
  clearSearchHistory,
  removeFromSearchHistory,
  addToFavorites,
  removeFromFavorites,
  clearFavorites,
  updateRouteState,
  resetRouteState,
} = routeSlice.actions

// 🎨 Selector Helpers
export const selectRouteById = (routes: Route[], id: string) =>
  routes.find(route => route.id === id)

export const selectFastestRoute = (routes: Route[]) =>
  routes.reduce((fastest, current) => 
    current.totalTime < fastest.totalTime ? current : fastest
  )

export const selectCheapestRoute = (routes: Route[]) =>
  routes.reduce((cheapest, current) => 
    current.totalCost < cheapest.totalCost ? current : cheapest
  )

export const selectRouteWithLeastTransfers = (routes: Route[]) =>
  routes.reduce((least, current) => 
    current.transfers < least.transfers ? current : least
  )

export default routeSlice.reducer