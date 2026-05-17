import type { AxiosInstance } from 'axios';

let counter = 0;

function generateCorrelationId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 7);
  const seq = (++counter).toString(36);
  return `${timestamp}-${random}-${seq}`;
}

export function attachCorrelationInterceptor(client: AxiosInstance): void {
  client.interceptors.request.use((config) => {
    if (config.headers) {
      config.headers['X-Correlation-Id'] = generateCorrelationId();
      config.headers['X-Client'] = 'lingoura-web';
    }
    return config;
  });
}
