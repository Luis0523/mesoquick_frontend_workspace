import axios from 'axios';
import type { AxiosRequestTransformer } from 'axios';
import { ENV } from '../config/env.config';
import { getAuthToken } from '@/features/auth/model/useAuthStore';

export const businessApiClient = axios.create({
  baseURL: ENV.BUSINESS_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Agregar transformRequest de logging DESPUÉS del por defecto
const originalTransform = businessApiClient.defaults.transformRequest;
const logTransformer: AxiosRequestTransformer = (data) => {
  if (ENV.IS_DEVELOPMENT && typeof data === 'string') {
    if (data.length < 10000) {
      console.log(`[businessApiClient] JSON body (${data.length} bytes):`, data);
    } else {
      console.log(`[businessApiClient] JSON body (${data.length} bytes, muy largo)`);
    }
  }
  return data;
};
businessApiClient.defaults.transformRequest = Array.isArray(originalTransform)
  ? [...originalTransform, logTransformer]
  : [logTransformer];

businessApiClient.interceptors.request.use((config) => {
  if (ENV.IS_DEVELOPMENT) {
    console.log(`🚀 BUSINESS ${config.method?.toUpperCase()} ${config.url}`);
  }

  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

businessApiClient.interceptors.response.use((response) => {
  if (ENV.IS_DEVELOPMENT) {
    console.log(`✅ BUSINESS ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
  }

  return response;
});
