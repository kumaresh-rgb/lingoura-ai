import type { AxiosError } from 'axios';
import type { ApiError } from '@/shared/types/api.types';

function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as Record<string, unknown>).isAxiosError === true
  );
}

export function parseApiError(error: unknown): ApiError {
  if (isAxiosError(error) && error.response) {
    const { status, headers } = error.response;
    const data = error.response.data as Record<string, unknown> | undefined;

    return {
      message:
        typeof data?.message === 'string'
          ? data.message
          : getDefaultMessage(status),
      code: typeof data?.code === 'string' ? data.code : 'UNKNOWN_ERROR',
      status,
      correlationId:
        typeof headers['x-correlation-id'] === 'string'
          ? headers['x-correlation-id']
          : undefined,
      errors: Array.isArray(data?.errors) ? (data.errors as string[]) : undefined,
    };
  }

  if (isAxiosError(error) && error.request) {
    return {
      message: 'Unable to reach the server. Please check your connection.',
      code: 'NETWORK_ERROR',
      status: 0,
    };
  }

  return {
    message: 'An unexpected error occurred. Please try again.',
    code: 'UNKNOWN_ERROR',
    status: 0,
  };
}

function getDefaultMessage(status: number): string {
  switch (status) {
    case 400: return 'Please check your input and try again.';
    case 401: return 'Invalid email or password.';
    case 403: return 'You do not have permission to perform this action.';
    case 404: return 'The requested resource was not found.';
    case 409: return 'An account with this email already exists.';
    case 422: return 'Please check your input and try again.';
    case 429: return 'Too many attempts. Please wait a moment and try again.';
    case 500: return 'Something went wrong on our end. Please try again shortly.';
    default:  return 'An unexpected error occurred. Please try again.';
  }
}

// ─── Field error extraction ──────────────────────────────────────────────────

// Maps FluentValidation backend property names to frontend form field names
const BACKEND_TO_FIELD: Record<string, string> = {
  FirstName: 'firstName',
  LastName: 'lastName',
  Email: 'email',
  Password: 'password',
  ConfirmPassword: 'confirmPassword',
  DisplayName: 'displayName',
  Username: 'email',
};

// Keyword → friendly message per field
const FIELD_MESSAGES: Record<string, Array<{ keyword: string; message: string }>> = {
  firstName: [
    { keyword: 'empty',   message: 'Please enter your first name.' },
    { keyword: 'length',  message: 'First name must be at least 2 characters.' },
    { keyword: 'maximum', message: 'First name cannot exceed 50 characters.' },
  ],
  lastName: [
    { keyword: 'empty',   message: 'Please enter your last name.' },
    { keyword: 'length',  message: 'Last name must be at least 2 characters.' },
    { keyword: 'maximum', message: 'Last name cannot exceed 50 characters.' },
  ],
  email: [
    { keyword: 'empty',     message: 'Email address is required.' },
    { keyword: 'valid',     message: 'Please enter a valid email address.' },
    { keyword: 'already',   message: 'An account with this email already exists.' },
    { keyword: 'exist',     message: 'An account with this email already exists.' },
    { keyword: 'in use',    message: 'An account with this email already exists.' },
    { keyword: 'taken',     message: 'An account with this email already exists.' },
  ],
  password: [
    { keyword: 'empty',     message: 'Password is required.' },
    { keyword: 'minimum',   message: 'Password must be at least 8 characters.' },
    { keyword: 'at least',  message: 'Password must be at least 8 characters.' },
    { keyword: 'uppercase', message: 'Password must contain an uppercase letter.' },
    { keyword: 'digit',     message: 'Password must contain at least one number.' },
    { keyword: 'number',    message: 'Password must contain at least one number.' },
    { keyword: 'special',   message: 'Password must contain a special character.' },
  ],
  displayName: [
    { keyword: 'empty',  message: 'Please enter your name.' },
    { keyword: 'length', message: 'Name must be at least 2 characters.' },
  ],
};

function humanizeFieldMessage(field: string, rawMessage: string): string {
  const rules = FIELD_MESSAGES[field];
  if (rules) {
    const lower = rawMessage.toLowerCase();
    for (const { keyword, message } of rules) {
      if (lower.includes(keyword)) return message;
    }
  }
  // Fallback: strip the 'FieldName' prefix from FluentValidation messages
  return rawMessage.replace(/'[^']+'\s*/g, '').replace(/\s+/g, ' ').trim() || rawMessage;
}

/**
 * Converts backend FluentValidation error strings into a field → message map.
 *
 * Input:  ["FirstName: 'First Name' must not be empty.", "Email: 'Email' is not valid."]
 * Output: { firstName: "Please enter your first name.", email: "Please enter a valid email address." }
 */
export function extractFieldErrors(errors: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const err of errors) {
    const colonIdx = err.indexOf(':');
    if (colonIdx === -1) continue;
    const backendField = err.substring(0, colonIdx).trim();
    const rawMsg = err.substring(colonIdx + 1).trim();
    const field = BACKEND_TO_FIELD[backendField];
    if (field && !result[field]) {
      // Keep first error per field only
      result[field] = humanizeFieldMessage(field, rawMsg);
    }
  }
  return result;
}
