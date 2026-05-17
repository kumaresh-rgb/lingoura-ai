import type { AxiosInstance } from 'axios';
import { storageService } from '@/shared/services/storage.service';
import { STORAGE_KEYS } from '@/shared/constants/app.constants';

export function attachAuthInterceptor(client: AxiosInstance): void {
  client.interceptors.request.use(
    (config) => {
      const token = storageService.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: unknown) => Promise.reject(error)
  );
}
