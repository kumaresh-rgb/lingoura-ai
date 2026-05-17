import axios from 'axios';
import { env } from '@/env';
import { attachCorrelationInterceptor } from './interceptors/correlation.interceptor';
import { attachAuthInterceptor } from './interceptors/auth.interceptor';
import { attachRefreshInterceptor } from './interceptors/refresh.interceptor';
import { API_TIMEOUT_MS } from '@/shared/constants/app.constants';

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// Applied in order: correlation ID first, then auth token, then refresh on 401
attachCorrelationInterceptor(apiClient);
attachAuthInterceptor(apiClient);
attachRefreshInterceptor(apiClient);
