export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  correlationId?: string;
  // FluentValidation returns an array of "FieldName: 'Display' message." strings
  errors?: string[];
}

export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';
