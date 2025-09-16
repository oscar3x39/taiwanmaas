// 🤖 AI-Generated UI State Management
// 🎨 管理應用程式的 UI 狀態和使用者介面互動

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UIState, Notification } from '@/types'

const initialState: UIState = {
  isLoading: false,
  isSidebarOpen: true,
  activeTab: 'search',
  theme: 'light',
  language: 'zh-TW',
  notifications: [],
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // 🔄 Loading State
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    // 📱 Sidebar Control
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload
    },

    // 📑 Tab Navigation
    setActiveTab: (state, action: PayloadAction<UIState['activeTab']>) => {
      state.activeTab = action.payload
    },

    // 🎨 Theme Control
    setTheme: (state, action: PayloadAction<UIState['theme']>) => {
      state.theme = action.payload
      // 同步到 localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload)
      }
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.theme)
      }
    },

    // 🌐 Language Control
    setLanguage: (state, action: PayloadAction<UIState['language']>) => {
      state.language = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', action.payload)
      }
    },

    // 🔔 Notification Management
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
        read: false,
      }
      state.notifications.unshift(notification)
      
      // 限制通知數量
      if (state.notifications.length > 10) {
        state.notifications = state.notifications.slice(0, 10)
      }
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      )
    },

    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },

    clearAllNotifications: (state) => {
      state.notifications = []
    },

    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true
      })
    },

    // 🎯 Batch UI Updates
    updateUIState: (state, action: PayloadAction<Partial<UIState>>) => {
      Object.assign(state, action.payload)
    },

    // 🔄 Reset UI State
    resetUIState: () => initialState,
  },
})

// 🚀 Export Actions
export const {
  setLoading,
  toggleSidebar,
  setSidebarOpen,
  setActiveTab,
  setTheme,
  toggleTheme,
  setLanguage,
  addNotification,
  removeNotification,
  markNotificationAsRead,
  clearAllNotifications,
  markAllNotificationsAsRead,
  updateUIState,
  resetUIState,
} = uiSlice.actions

// 🎨 Thunk Actions for Complex Logic
export const initializeTheme = () => (dispatch: any) => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme') as UIState['theme']
    if (savedTheme) {
      dispatch(setTheme(savedTheme))
    } else {
      // 檢測系統主題偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      dispatch(setTheme(prefersDark ? 'dark' : 'light'))
    }
  }
}

export const initializeLanguage = () => (dispatch: any) => {
  if (typeof window !== 'undefined') {
    const savedLanguage = localStorage.getItem('language') as UIState['language']
    if (savedLanguage) {
      dispatch(setLanguage(savedLanguage))
    } else {
      // 檢測瀏覽器語言偏好
      const browserLanguage = navigator.language
      const language = browserLanguage.startsWith('zh') ? 'zh-TW' : 'en-US'
      dispatch(setLanguage(language))
    }
  }
}

// 🔔 Notification Helper Actions
export const showSuccessNotification = (message: string, title = '成功') => (dispatch: any) => {
  dispatch(addNotification({
    type: 'success',
    title,
    message,
  }))
}

export const showErrorNotification = (message: string, title = '錯誤') => (dispatch: any) => {
  dispatch(addNotification({
    type: 'error',
    title,
    message,
  }))
}

export const showWarningNotification = (message: string, title = '警告') => (dispatch: any) => {
  dispatch(addNotification({
    type: 'warning',
    title,
    message,
  }))
}

export const showInfoNotification = (message: string, title = '資訊') => (dispatch: any) => {
  dispatch(addNotification({
    type: 'info',
    title,
    message,
  }))
}

export default uiSlice.reducer