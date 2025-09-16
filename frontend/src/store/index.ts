// 🤖 AI-Generated Redux Store Configuration
// 📝 使用 Redux Toolkit 的現代狀態管理實踐

import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import uiReducer from './slices/uiSlice'
import routeReducer from './slices/routeSlice'
import mapReducer from './slices/mapSlice'
import userReducer from './slices/userSlice'

// 🏪 Configure Store
export const store = configureStore({
  reducer: {
    ui: uiReducer,
    route: routeReducer,
    map: mapReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略這些 action types 的序列化檢查
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // 忽略這些 paths 的序列化檢查
        ignoredPaths: ['map.mapInstance'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

// 🎯 Type Definitions
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// 🔧 Typed Hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// 🎨 Selector Helpers
export const selectUI = (state: RootState) => state.ui
export const selectRoute = (state: RootState) => state.route
export const selectMap = (state: RootState) => state.map
export const selectUser = (state: RootState) => state.user

// 🚀 Performance Selectors (memoized)
export const selectIsLoading = (state: RootState) => 
  state.ui.isLoading || state.route.isSearching

export const selectHasRoutes = (state: RootState) => 
  state.route.routes.length > 0

export const selectSelectedRouteId = (state: RootState) => 
  state.route.selectedRoute?.id

export const selectMapCenter = (state: RootState) => 
  state.map.center

export const selectUserPreferences = (state: RootState) => 
  state.user.preferences