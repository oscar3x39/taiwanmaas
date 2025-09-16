// 🤖 AI-Generated User State Management
// 👤 管理使用者偏好設定和個人化功能

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { UserState, UserPreferences, UserSettings, RouteSearchRequest, Route } from '@/types'

const initialState: UserState = {
  preferences: {
    defaultTransportModes: ['mrt', 'bus', 'walking'],
    maxWalkingDistance: 800,
    prioritize: 'time',
    accessibilityRequired: false,
    language: 'zh-TW',
  },
  searchHistory: [],
  favorites: [],
  settings: {
    theme: 'light',
    notifications: true,
    analytics: true,
    location: false,
  },
}

// 💾 Async Thunk for Loading User Data
export const loadUserData = createAsyncThunk(
  'user/loadUserData',
  async () => {
    if (typeof window !== 'undefined') {
      const preferences = localStorage.getItem('userPreferences')
      const settings = localStorage.getItem('userSettings')
      const searchHistory = localStorage.getItem('userSearchHistory')
      const favorites = localStorage.getItem('userFavorites')

      return {
        preferences: preferences ? JSON.parse(preferences) : initialState.preferences,
        settings: settings ? JSON.parse(settings) : initialState.settings,
        searchHistory: searchHistory ? JSON.parse(searchHistory) : [],
        favorites: favorites ? JSON.parse(favorites) : [],
      }
    }
    return initialState
  }
)

// 💾 Async Thunk for Saving User Data
export const saveUserData = createAsyncThunk(
  'user/saveUserData',
  async (userData: Partial<UserState>) => {
    if (typeof window !== 'undefined') {
      if (userData.preferences) {
        localStorage.setItem('userPreferences', JSON.stringify(userData.preferences))
      }
      if (userData.settings) {
        localStorage.setItem('userSettings', JSON.stringify(userData.settings))
      }
      if (userData.searchHistory) {
        localStorage.setItem('userSearchHistory', JSON.stringify(userData.searchHistory))
      }
      if (userData.favorites) {
        localStorage.setItem('userFavorites', JSON.stringify(userData.favorites))
      }
    }
    return userData
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 🎯 Preferences Management
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload }
      // 自動保存到 localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(state.preferences))
      }
    },

    setDefaultTransportModes: (state, action: PayloadAction<UserPreferences['defaultTransportModes']>) => {
      state.preferences.defaultTransportModes = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(state.preferences))
      }
    },

    setMaxWalkingDistance: (state, action: PayloadAction<number>) => {
      state.preferences.maxWalkingDistance = Math.max(100, Math.min(2000, action.payload))
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(state.preferences))
      }
    },

    setPrioritize: (state, action: PayloadAction<UserPreferences['prioritize']>) => {
      state.preferences.prioritize = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(state.preferences))
      }
    },

    toggleAccessibilityRequired: (state) => {
      state.preferences.accessibilityRequired = !state.preferences.accessibilityRequired
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(state.preferences))
      }
    },

    setLanguage: (state, action: PayloadAction<UserPreferences['language']>) => {
      state.preferences.language = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(state.preferences))
      }
    },

    // ⚙️ Settings Management
    updateSettings: (state, action: PayloadAction<Partial<UserSettings>>) => {
      state.settings = { ...state.settings, ...action.payload }
      if (typeof window !== 'undefined') {
        localStorage.setItem('userSettings', JSON.stringify(state.settings))
      }
    },

    toggleNotifications: (state) => {
      state.settings.notifications = !state.settings.notifications
      if (typeof window !== 'undefined') {
        localStorage.setItem('userSettings', JSON.stringify(state.settings))
      }
    },

    toggleAnalytics: (state) => {
      state.settings.analytics = !state.settings.analytics
      if (typeof window !== 'undefined') {
        localStorage.setItem('userSettings', JSON.stringify(state.settings))
      }
    },

    toggleLocation: (state) => {
      state.settings.location = !state.settings.location
      if (typeof window !== 'undefined') {
        localStorage.setItem('userSettings', JSON.stringify(state.settings))
      }
    },

    setTheme: (state, action: PayloadAction<UserSettings['theme']>) => {
      state.settings.theme = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('userSettings', JSON.stringify(state.settings))
      }
    },

    // 📚 Search History Management
    addToUserSearchHistory: (state, action: PayloadAction<RouteSearchRequest>) => {
      // 避免重複項目
      const existingIndex = state.searchHistory.findIndex(
        item => 
          item.origin.latitude === action.payload.origin.latitude &&
          item.origin.longitude === action.payload.origin.longitude &&
          item.destination.latitude === action.payload.destination.latitude &&
          item.destination.longitude === action.payload.destination.longitude
      )

      if (existingIndex !== -1) {
        state.searchHistory.splice(existingIndex, 1)
      }

      state.searchHistory.unshift(action.payload)

      // 限制歷史記錄數量
      if (state.searchHistory.length > 50) {
        state.searchHistory = state.searchHistory.slice(0, 50)
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('userSearchHistory', JSON.stringify(state.searchHistory))
      }
    },

    removeFromUserSearchHistory: (state, action: PayloadAction<number>) => {
      state.searchHistory.splice(action.payload, 1)
      if (typeof window !== 'undefined') {
        localStorage.setItem('userSearchHistory', JSON.stringify(state.searchHistory))
      }
    },

    clearUserSearchHistory: (state) => {
      state.searchHistory = []
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userSearchHistory')
      }
    },

    // ⭐ Favorites Management
    addToUserFavorites: (state, action: PayloadAction<Route>) => {
      const exists = state.favorites.some(route => route.id === action.payload.id)
      if (!exists) {
        state.favorites.unshift(action.payload)
        
        // 限制收藏數量
        if (state.favorites.length > 100) {
          state.favorites = state.favorites.slice(0, 100)
        }

        if (typeof window !== 'undefined') {
          localStorage.setItem('userFavorites', JSON.stringify(state.favorites))
        }
      }
    },

    removeFromUserFavorites: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(route => route.id !== action.payload)
      if (typeof window !== 'undefined') {
        localStorage.setItem('userFavorites', JSON.stringify(state.favorites))
      }
    },

    clearUserFavorites: (state) => {
      state.favorites = []
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userFavorites')
      }
    },

    // 🔄 Batch Updates
    updateUserState: (state, action: PayloadAction<Partial<UserState>>) => {
      Object.assign(state, action.payload)
    },

    // 🔄 Reset User State
    resetUserState: () => initialState,

    // 🎯 Quick Actions
    resetToDefaults: (state) => {
      state.preferences = initialState.preferences
      state.settings = initialState.settings
      if (typeof window !== 'undefined') {
        localStorage.setItem('userPreferences', JSON.stringify(state.preferences))
        localStorage.setItem('userSettings', JSON.stringify(state.settings))
      }
    },

    // 📊 Analytics Helpers
    incrementSearchCount: (state) => {
      // 這裡可以添加搜尋次數統計
      // 目前只是示例，實際實作可能需要更複雜的統計邏輯
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserData.fulfilled, (state, action) => {
        Object.assign(state, action.payload)
      })
      .addCase(saveUserData.fulfilled, (state, action) => {
        // 保存成功後的處理
        console.log('User data saved successfully')
      })
  },
})

// 🚀 Export Actions
export const {
  updatePreferences,
  setDefaultTransportModes,
  setMaxWalkingDistance,
  setPrioritize,
  toggleAccessibilityRequired,
  setLanguage,
  updateSettings,
  toggleNotifications,
  toggleAnalytics,
  toggleLocation,
  setTheme,
  addToUserSearchHistory,
  removeFromUserSearchHistory,
  clearUserSearchHistory,
  addToUserFavorites,
  removeFromUserFavorites,
  clearUserFavorites,
  updateUserState,
  resetUserState,
  resetToDefaults,
  incrementSearchCount,
} = userSlice.actions

// 🎨 Thunk Actions for Complex Logic
export const initializeUserPreferences = () => (dispatch: any) => {
  dispatch(loadUserData())
}

export const updateUserPreferences = (preferences: Partial<UserPreferences>) => (dispatch: any) => {
  dispatch(updatePreferences(preferences))
  dispatch(saveUserData({ preferences }))
}

export const updateUserSettings = (settings: Partial<UserSettings>) => (dispatch: any) => {
  dispatch(updateSettings(settings))
  dispatch(saveUserData({ settings }))
}

// 🔧 Utility Functions
export const getDefaultRoutePreferences = (userPreferences: UserPreferences) => ({
  prioritize: userPreferences.prioritize,
  maxWalkingDistance: userPreferences.maxWalkingDistance,
  accessibilityRequired: userPreferences.accessibilityRequired,
  transportModes: userPreferences.defaultTransportModes,
})

export const isRouteInFavorites = (favorites: Route[], routeId: string): boolean => {
  return favorites.some(route => route.id === routeId)
}

export default userSlice.reducer