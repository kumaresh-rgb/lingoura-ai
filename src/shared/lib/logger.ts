type LogContext = Record<string, unknown>;

const isDev = process.env.NODE_ENV !== 'production';

export const logger = {
  info(message: string, ctx?: LogContext): void {
    if (isDev) {
      console.log(`[INFO] ${message}`, ctx ?? '');
    }
  },

  warn(message: string, ctx?: LogContext): void {
    console.warn(`[WARN] ${message}`, ctx ?? '');
  },

  error(message: string, error?: unknown, ctx?: LogContext): void {
    console.error(`[ERROR] ${message}`, error ?? '', ctx ?? '');
    // TODO: send to Sentry/Datadog in production
  },

  debug(message: string, ctx?: LogContext): void {
    if (isDev) {
      console.debug(`[DEBUG] ${message}`, ctx ?? '');
    }
  },
};
