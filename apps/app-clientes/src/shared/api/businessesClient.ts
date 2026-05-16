import axios from 'axios'
import { ENV } from '../config/env.config'

export const businessesClient = axios.create({
  baseURL: ENV.BUSINESSES_API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

businessesClient.interceptors.request.use((config) => {
  if (ENV.IS_DEVELOPMENT) {
    console.log(`🚀 BUSINESS ${config.method?.toUpperCase()} ${config.url}`)
  }
  return config
})

businessesClient.interceptors.response.use(
  (response) => {
    if (ENV.IS_DEVELOPMENT) {
      console.log(`✅ BUSINESS ${response.config.method?.toUpperCase()} ${response.config.url}`)
    }
    return response
  },
  (error) => {
    if (ENV.IS_DEVELOPMENT) {
      console.error(`❌ BUSINESS ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.status)
    }
    return Promise.reject(error)
  },
)
