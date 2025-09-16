// 🤖 AI-Generated React App Component
// 🏠 主應用程式組件，整合所有功能模組

import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './store'
import { initializeTheme, initializeLanguage } from './store/slices/uiSlice'
import { loadUserData } from './store/slices/userSlice'

// 📱 Pages
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

// 🎨 Components
import LoadingSpinner from './components/ui/LoadingSpinner'
import ErrorBoundary from './components/ui/ErrorBoundary'

// 🎯 Hooks
import { useTheme } from './hooks/useTheme'

const App: React.FC = () => {
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector(state => state.ui)
  const { theme } = useTheme()

  // 🚀 Initialize App
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 初始化主題和語言
        dispatch(initializeTheme())
        dispatch(initializeLanguage())
        
        // 載入使用者資料
        await dispatch(loadUserData())
        
        console.log('🚀 App initialized successfully')
      } catch (error) {
        console.error('❌ App initialization failed:', error)
      }
    }

    initializeApp()
  }, [dispatch])

  // 🎨 Apply Theme to Document
  useEffect(() => {
    document.documentElement.className = theme
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // 🔄 Global Loading State
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">載入中...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="App min-h-screen bg-gray-50">
        <Routes>
          {/* 🏠 主頁面 */}
          <Route path="/" element={<HomePage />} />
          
          {/* 🔍 路線搜尋頁面 (未來擴展) */}
          <Route path="/search" element={<HomePage />} />
          
          {/* ⭐ 收藏頁面 (未來擴展) */}
          <Route path="/favorites" element={<HomePage />} />
          
          {/* 📚 歷史記錄頁面 (未來擴展) */}
          <Route path="/history" element={<HomePage />} />
          
          {/* ⚙️ 設定頁面 (未來擴展) */}
          <Route path="/settings" element={<HomePage />} />
          
          {/* 📖 關於頁面 (未來擴展) */}
          <Route path="/about" element={<HomePage />} />
          
          {/* 🤖 AI 開發展示頁面 (未來擴展) */}
          <Route path="/ai-development" element={<HomePage />} />
          
          {/* 404 頁面 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </ErrorBoundary>
  )
}

export default App