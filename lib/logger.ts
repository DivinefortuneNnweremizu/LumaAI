export const logger = {
  info: (message: string, context?: Record<string, unknown>) => {
    console.log(`[INFO] ${message}`, context ? JSON.stringify(context) : "");
  },
  warn: (message: string, context?: Record<string, unknown>) => {
    console.warn(`[WARN] ${message}`, context ? JSON.stringify(context) : "");
  },
  error: (message: string, error?: unknown, context?: Record<string, unknown>) => {
    console.error(`[ERROR] ${message}`, error, context ? JSON.stringify(context) : "");
  },
};
