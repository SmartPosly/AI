// Production-safe logging utility

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  // Always log errors
  error: (...args) => {
    console.error(...args);
  },
  
  // Always log warnings
  warn: (...args) => {
    console.warn(...args);
  },
  
  // Only log info in development
  info: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  // Only log debug in development
  debug: (...args) => {
    if (isDevelopment) {
      console.log('[DEBUG]', ...args);
    }
  }
};