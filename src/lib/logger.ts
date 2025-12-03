// Logger wrapper - can be extended with Sentry later
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDev = process.env.NODE_ENV === 'development';

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  debug(message: string, context?: LogContext) {
    if (this.isDev) {
      console.log(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: LogContext) {
    console.log(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: LogContext) {
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, error?: Error | unknown, context?: LogContext) {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : error,
    };
    console.error(this.formatMessage('error', message, errorContext));

    // TODO: Send to Sentry in production
    // if (!this.isDev && typeof Sentry !== 'undefined') {
    //   Sentry.captureException(error, { extra: context });
    // }
  }

  // Audit log for important business events
  audit(event: string, context: LogContext) {
    console.log(this.formatMessage('info', `[AUDIT] ${event}`, context));
  }
}

export const logger = new Logger();
