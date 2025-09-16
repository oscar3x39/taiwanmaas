// 🤖 AI-Generated Loading Overlay Component
// 🔄 全屏載入遮罩組件

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingSpinner from './LoadingSpinner'

interface LoadingOverlayProps {
  isVisible?: boolean
  message?: string
  className?: string
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible = true,
  message = '載入中...',
  className = '',
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`
            fixed inset-0 z-50 flex items-center justify-center
            bg-black bg-opacity-50 backdrop-blur-sm
            ${className}
          `}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg bg-white p-6 shadow-xl"
          >
            <div className="flex flex-col items-center space-y-4">
              <LoadingSpinner size="lg" color="primary" />
              <p className="text-gray-700 font-medium">{message}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoadingOverlay