// 🤖 AI-Generated API Service Layer
// 🌐 統一的 API 請求處理和錯誤管理

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { APIResponse, APIError } from '@/types'

// 🔧 API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const API_TIMEOUT = 30000 // 30 seconds

// 🚀 Create Axios Instance
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  })

  // 📤 Request Interceptor
  instance.interceptors.request.use(
    (config) => {
      // 添加請求時間戳
      config.metadata = { startTime: Date.now() }
      
      // 添加認證 token (如果有的話)
      const token = localStorage.getItem('authToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      // 添加語言標頭
      const language = localStorage.getItem('language') || 'zh-TW'
      config.headers['Accept-Language'] = language

      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
      return config
    },
    (error) => {
      console.error('❌ Request Error:', error)
      return Promise.reject(error)
    }
  )

  // 📥 Response Interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // 計算請求時間
      const duration = Date.now() - response.config.metadata?.startTime
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`)
      
      return response
    },
    (error) => {
      const duration = error.config?.metadata ? Date.now() - error.config.metadata.startTime : 0
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} (${duration}ms)`, error)
      
      // 統一錯誤處理
      return Promise.reject(transformError(error))
    }
  )

  return instance
}

// 🔄 Transform Error to Standard Format
const transformError = (error: any): APIError => {
  if (error.response) {
    // 伺服器回應錯誤
    return {
      code: error.response.status.toString(),
      message: error.response.data?.message || error.response.statusText || '伺服器錯誤',
      details: error.response.data,
      timestamp: Date.now(),
    }
  } else if (error.request) {
    // 網路錯誤
    return {
      code: 'NETWORK_ERROR',
      message: '網路連線失敗，請檢查您的網路連線',
      details: error.request,
      timestamp: Date.now(),
    }
  } else {
    // 其他錯誤
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || '未知錯誤',
      details: error,
      timestamp: Date.now(),
    }
  }
}

// 🏭 API Instance
export const api = createApiInstance()

// 🎯 Generic API Methods
export class ApiService {
  // 📤 GET Request
  static async get<T = any>(
    url: string, 
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    const response = await api.get<APIResponse<T>>(url, config)
    return response.data
  }

  // 📤 POST Request
  static async post<T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    const response = await api.post<APIResponse<T>>(url, data, config)
    return response.data
  }

  // 📤 PUT Request
  static async put<T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    const response = await api.put<APIResponse<T>>(url, data, config)
    return response.data
  }

  // 📤 PATCH Request
  static async patch<T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    const response = await api.patch<APIResponse<T>>(url, data, config)
    return response.data
  }

  // 📤 DELETE Request
  static async delete<T = any>(
    url: string, 
    config?: AxiosRequestConfig
  ): Promise<APIResponse<T>> {
    const response = await api.delete<APIResponse<T>>(url, config)
    return response.data
  }

  // 🔍 Health Check
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await api.get('/health')
      return response.status === 200
    } catch (error) {
      return false
    }
  }

  // 📊 Get API Status
  static async getApiStatus(): Promise<{
    status: 'healthy' | 'unhealthy'
    version: string
    uptime: number
    timestamp: number
  }> {
    const response = await this.get('/health')
    return response.data
  }
}

// 🔧 Request Configuration Helpers
export const createRequestConfig = (options: {
  timeout?: number
  retries?: number
  cache?: boolean
  signal?: AbortSignal
}): AxiosRequestConfig => {
  return {
    timeout: options.timeout || API_TIMEOUT,
    signal: options.signal,
    // 可以添加更多配置選項
  }
}

// 🎯 Retry Logic
export const withRetry = async <T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall()
    } catch (error) {
      lastError = error
      
      if (attempt === maxRetries) {
        break
      }

      // 指數退避延遲
      const waitTime = delay * Math.pow(2, attempt - 1)
      console.log(`🔄 Retry attempt ${attempt}/${maxRetries} after ${waitTime}ms`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }

  throw lastError
}

// 🎯 Concurrent Requests
export const concurrent = {
  // 並行請求
  all: <T extends readonly unknown[] | []>(
    requests: T
  ): Promise<{ -readonly [P in keyof T]: Awaited<T[P]> }> => {
    return Promise.all(requests)
  },

  // 並行請求 (部分失敗不影響其他)
  allSettled: <T extends readonly unknown[] | []>(
    requests: T
  ): Promise<{ -readonly [P in keyof T]: PromiseSettledResult<Awaited<T[P]>> }> => {
    return Promise.allSettled(requests)
  },

  // 競速請求 (第一個完成的)
  race: <T extends readonly unknown[] | []>(
    requests: T
  ): Promise<Awaited<T[number]>> => {
    return Promise.race(requests)
  },
}

// 🎯 Request Cancellation
export class RequestCancellation {
  private controllers: Map<string, AbortController> = new Map()

  // 創建可取消的請求
  createCancellableRequest<T>(
    key: string,
    requestFn: (signal: AbortSignal) => Promise<T>
  ): Promise<T> {
    // 取消之前的請求
    this.cancel(key)

    // 創建新的控制器
    const controller = new AbortController()
    this.controllers.set(key, controller)

    return requestFn(controller.signal).finally(() => {
      this.controllers.delete(key)
    })
  }

  // 取消特定請求
  cancel(key: string): void {
    const controller = this.controllers.get(key)
    if (controller) {
      controller.abort()
      this.controllers.delete(key)
    }
  }

  // 取消所有請求
  cancelAll(): void {
    this.controllers.forEach(controller => controller.abort())
    this.controllers.clear()
  }
}

// 🌐 Export Default Instance
export default api

// 🎯 Type Declarations
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      startTime: number
    }
  }
}