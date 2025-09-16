// 🤖 AI-Generated Sidebar Component
// 📱 響應式側邊欄布局組件

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppSelector, useAppDispatch } from '@/store'
import { toggleSidebar } from '@/store/slices/uiSlice'

interface SidebarProps {
  children: React.ReactNode
  className?: string
}

const Sidebar: React.FC<SidebarProps> = ({ children, className = '' }) => {
  const dispatch = useAppDispatch()
  const { isSidebarOpen } = useAppSelector(state => state.ui)

  const handleClose = () => {
    dispatch(toggleSidebar())
  }

  return (
    <>
      {/* 📱 Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* 📱 Sidebar Container */}
      <motion.div
        initial={false}
        animate={{
          x: isSidebarOpen ? 0 : '-100%'
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30
        }}
        className={`
          fixed left-0 top-0 z-50 h-full w-96 bg-white shadow-xl
          lg:relative lg:z-auto lg:translate-x-0 lg:shadow-none
          ${className}
        `}
      >
        {/* 📱 Mobile Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 lg:hidden">
          <h2 className="text-lg font-semibold text-gray-900">
            交通路線規劃
          </h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="關閉側邊欄"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 🎨 Header Section */}
        <div className="hidden lg:block">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-white bg-opacity-20 p-2">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 6-3v11.382a1 1 0 01-.553.894L15 17l-6-3z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold">交通路線規劃</h1>
                <p className="text-sm opacity-90">找到最適合的交通方式</p>
              </div>
            </div>
          </div>
        </div>

        {/* 📄 Content Area */}
        <div className="flex h-full flex-col lg:h-[calc(100vh-120px)]">
          {children}
        </div>

        {/* 🎨 Footer Section */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>🤖 AI 輔助開發</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default Sidebar