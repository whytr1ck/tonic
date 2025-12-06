import { toastServiceInstance } from '@shared/components/ToastManager/services/toastService.ts';
import type { IErrorContext, IApiError } from './errorService.types.ts';
import { HTTP_ERROR_MESSAGES } from './errorService.types.ts';

/**
 * Централизованный сервис обработки ошибок
 *
 * Обрабатывает все типы ошибок:
 * - Vue ошибки (через app.config.errorHandler)
 * - Promise rejection (unhandledrejection)
 * - Глобальные JS ошибки (window.error)
 * - API ошибки (HTTP)
 */
class ErrorService {
  handleError(error: Error | unknown, context?: IErrorContext | string): void {
    const normalizedContext = this.normalizeContext(context);
    const errorObj = this.normalizeError(error);

    this.logError(errorObj, normalizedContext);

    if (normalizedContext.showToast !== false) {
      const message = this.getErrorMessage(errorObj);
      toastServiceInstance.error(message);
    }
  }

  handleApiError(error: unknown, endpoint?: string): void {
    const apiError = this.parseApiError(error, endpoint);

    this.logApiError(apiError);

    const message = this.getApiErrorMessage(apiError);
    toastServiceInstance.error(message);
  }

  private normalizeContext(context?: IErrorContext | string): IErrorContext {
    if (typeof context === 'string') {
      return { info: context, showToast: true };
    }
    return context ?? { showToast: true };
  }

  private normalizeError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }

    if (typeof error === 'string') {
      return new Error(error);
    }

    return new Error('Неизвестная ошибка');
  }

  private parseApiError(error: unknown, endpoint?: string): IApiError {
    if (error instanceof Response) {
      return {
        status: error.status,
        message: error.statusText || 'Ошибка запроса',
        endpoint,
      };
    }

    if (error instanceof Error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return {
          message: 'Нет соединения с сервером',
          endpoint,
        };
      }

      return {
        message: error.message,
        endpoint,
      };
    }

    return {
      message: 'Ошибка запроса',
      endpoint,
    };
  }

  private getErrorMessage(error: Error): string {
    // Фильтруем технические сообщения
    const technicalPatterns = [
      /cannot read prop/i,
      /undefined is not/i,
      /null is not/i,
      /is not a function/i,
      /unexpected token/i,
    ];

    const isTechnical = technicalPatterns.some((pattern) =>
      pattern.test(error.message)
    );

    if (isTechnical) {
      return 'Произошла ошибка. Попробуйте обновить страницу';
    }

    return error.message || 'Произошла непредвиденная ошибка';
  }

  private getApiErrorMessage(apiError: IApiError): string {
    if (apiError.status) {
      const httpMessage = HTTP_ERROR_MESSAGES[apiError.status];
      if (httpMessage) {
        return httpMessage;
      }
    }

    return apiError.message || 'Ошибка при выполнении запроса';
  }

  private logError(error: Error, context: IErrorContext): void {
    const logData: Record<string, unknown> = {
      message: error.message,
      stack: error.stack,
    };

    if (context.source) {
      logData.source = context.source;
    }

    if (context.info) {
      logData.info = context.info;
    }

    console.error('[ErrorService]', logData);
  }

  private logApiError(apiError: IApiError): void {
    console.error('[ErrorService:API]', {
      status: apiError.status,
      message: apiError.message,
      endpoint: apiError.endpoint,
    });
  }
}

export const errorServiceInstance = new ErrorService();
