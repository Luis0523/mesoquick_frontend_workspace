import axios from 'axios';
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

businessApiClient.interceptors.request.use((config) => {
  if (ENV.IS_DEVELOPMENT) {
    console.log(`🚀 BUSINESS ${config.method?.toUpperCase()} ${config.url}`, config.data);
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
