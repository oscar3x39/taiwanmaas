// 🤖 AI-Generated 404 Not Found Page
// 🔍 友善的 404 錯誤頁面

import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 🎨 404 Illustration */}
          <div className="mb-8">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="mx-auto mb-6 h-32 w-32 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center"
            >
              <span className="text-4xl">🗺️</span>
            </motion.div>
            
            <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
            <h2 className="mb-4 text-2xl font-semibold text-gray-700">
              找不到頁面
            </h2>
            <p className="mb-8 text-gray-600 max-w-md mx-auto">
              抱歉，您要找的頁面似乎迷路了。就像在台北街頭找路一樣，
              有時候我們也會走錯方向。
            </p>
          </div>

          {/* 🎯 Action Buttons */}
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-white font-medium hover:bg-primary-700 transition-colors"
            >
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              回到首頁
            </Link>
            
            <div className="text-center">
              <button
                onClick={() => window.history.back()}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                ← 返回上一頁
              </button>
            </div>
          </div>

          {/* 🎨 Decorative Elements */}
          <div className="mt-12 flex justify-center space-x-8 text-gray-400">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            >
              🚇
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              🚌
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              🚶
            </motion.div>
          </div>

          {/* 📊 Fun Facts */}
          <div className="mt-8 text-sm text-gray-500">
            <p>💡 小知識：台北捷運有 131 個車站，但這個頁面不在其中！</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFoundPage