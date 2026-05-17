import { post, get } from '@/shared/api/api-client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import type { AuthResponse, User } from '@/shared/types/auth.types';
import type { LoginInput, RegisterInput } from '../schemas/auth.schemas';

export const authApi = {
  login: (credentials: LoginInput): Promise<AuthResponse> =>
    post<AuthResponse>(API_ENDPOINTS.auth.login, credentials),

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  register: ({ confirmPassword: _cp, ...payload }: RegisterInput): Promise<AuthResponse> =>
    post<AuthResponse>(API_ENDPOINTS.auth.register, payload),

  refresh: (refreshToken: string): Promise<AuthResponse> =>
    post<AuthResponse>(API_ENDPOINTS.auth.refresh, { refreshToken }),

  logout: (refreshToken: string): Promise<void> =>
    post<void>(API_ENDPOINTS.auth.logout, { refreshToken }),

  me: (): Promise<User> =>
    get<User>(API_ENDPOINTS.auth.me),

  forgotPassword: (email: string): Promise<void> =>
    post<void>(API_ENDPOINTS.auth.forgotPassword, { email }),

  resetPassword: (token: string, password: string): Promise<void> =>
    post<void>(API_ENDPOINTS.auth.resetPassword, { token, password }),

  googleLogin: (idToken: string): Promise<AuthResponse> =>
    post<AuthResponse>(API_ENDPOINTS.auth.google, { idToken }),
};
