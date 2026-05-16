import axios from 'axios'
import { ENV } from '../config/env.config'

export const apiClient = axios.create({
  baseURL: ENV.RESTAURANTS_API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  if (ENV.IS_DEVELOPMENT) {
    console.log(`🚀 RESTAURANT ${config.method?.toUpperCase()} ${config.url}`)
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => {
    if (ENV.IS_DEVELOPMENT) {
      console.log(`✅ RESTAURANT ${response.config.method?.toUpperCase()} ${response.config.url}`)
    }
    return response
  },
  (error) => {
    if (ENV.IS_DEVELOPMENT) {
      console.error(`❌ RESTAURANT ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.status)
    }
    return Promise.reject(error)
  },
)
