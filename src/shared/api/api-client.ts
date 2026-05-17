import { apiClient } from './axios';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/api.types';

export async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const { data } = await apiClient.get<ApiResponse<T>>(url, { params });
  return data.data;
}

export async function post<T, B = unknown>(url: string, body?: B): Promise<T> {
  // Axios drops Content-Type when body is undefined; send {} so ASP.NET Core (415) accepts it
  const { data } = await apiClient.post<ApiResponse<T>>(url, body ?? {});
  return data.data;
}

export async function put<T, B = unknown>(url: string, body: B): Promise<T> {
  const { data } = await apiClient.put<ApiResponse<T>>(url, body);
  return data.data;
}

export async function patch<T, B = unknown>(url: string, body: B): Promise<T> {
  const { data } = await apiClient.patch<ApiResponse<T>>(url, body);
  return data.data;
}

export async function del<T>(url: string): Promise<T> {
  const { data } = await apiClient.delete<ApiResponse<T>>(url);
  return data.data;
}

export async function getPaginated<T>(
  url: string,
  params?: Record<string, unknown>
): Promise<PaginatedResponse<T>> {
  const { data } = await apiClient.get<PaginatedResponse<T>>(url, { params });
  return data;
}
