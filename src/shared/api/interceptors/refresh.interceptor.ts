import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { storageService } from '@/shared/services/storage.service';
import { STORAGE_KEYS, COOKIE_KEYS } from '@/shared/constants/app.constants';
import { ROUTES } from '@/shared/constants/routes';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import type { AuthResponse } from '@/shared/types/auth.types';

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

function processQueue(error: unknown, token: string | null = null): void {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : token ? resolve(token) : reject(new Error('No token'));
  });
  failedQueue = [];
}

function clearSessionAndRedirect() {
  storageService.remove(STORAGE_KEYS.ACCESS_TOKEN);
  storageService.remove(STORAGE_KEYS.REFRESH_TOKEN);
  if (typeof window !== 'undefined') {
    document.cookie = `${COOKIE_KEYS.SESSION}=; Max-Age=0; path=/`;
    window.location.href = ROUTES.LOGIN;
  }
}

export function attachRefreshInterceptor(client: AxiosInstance): void {
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableConfig | undefined;

      if (
        !originalRequest ||
        error.response?.status !== 401 ||
        originalRequest._retry ||
        originalRequest.url === API_ENDPOINTS.auth.refresh
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return client(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storedRefreshToken = storageService.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
        if (!storedRefreshToken) {
          processQueue(new Error('No refresh token'), null);
          clearSessionAndRedirect();
          return Promise.reject(error);
        }

        const { data } = await client.post<{ data: AuthResponse }>(
          API_ENDPOINTS.auth.refresh,
          { refreshToken: storedRefreshToken },
          { withCredentials: true }
        );

        const newAccessToken = data.data.accessToken;
        const newRefreshToken = data.data.refreshToken; // Backend rotates on every refresh

        storageService.set(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
        storageService.set(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return client(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearSessionAndRedirect();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );
}
