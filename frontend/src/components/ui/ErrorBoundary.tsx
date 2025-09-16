// 🤖 AI-Generated Error Boundary Component
// 🛡️ React 錯誤邊界組件

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // 更新 state 以顯示錯誤 UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 記錄錯誤到錯誤報告服務
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo,
    })

    // 這裡可以添加錯誤報告邏輯
    // 例如發送到 Sentry, LogRocket 等服務
  }

  handleReload = () => {
    window.location.reload()
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      // 自定義錯誤 UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-md text-center">
            {/* 🎨 Error Icon */}
            <div className="mb-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>

            {/* 📝 Error Message */}
            <h1 className="mb-4 text-2xl font-bold text-gray-900">
              糟糕！出現了錯誤
            </h1>
            <p className="mb-6 text-gray-600">
              應用程式遇到了意外錯誤。我們已經記錄了這個問題，請稍後再試。
            </p>

            {/* 🔧 Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 rounded-lg bg-gray-100 p-4 text-left">
                <h3 className="mb-2 font-semibold text-gray-900">錯誤詳情：</h3>
                <pre className="text-xs text-red-600 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>
            )}

            {/* 🎯 Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full rounded-lg bg-primary-600 px-4 py-2 text-white font-medium hover:bg-primary-700 transition-colors"
              >
                重試
              </button>
              <button
                onClick={this.handleReload}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                重新載入頁面
              </button>
            </div>

            {/* 📞 Support Info */}
            <div className="mt-6 text-sm text-gray-500">
              <p>如果問題持續發生，請聯繫技術支援</p>
              <p className="mt-1">
                錯誤 ID: {Date.now().toString(36)}
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary