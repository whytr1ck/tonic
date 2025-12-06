import type { App } from 'vue';
import { errorServiceInstance } from '@shared/services/error/errorService.ts';

/**
 * Настраивает глобальные обработчики ошибок
 *
 * Перехватывает:
 * - Vue ошибки (app.config.errorHandler)
 * - Promise rejection (unhandledrejection)
 * - Глобальные JS ошибки (window.error)
 */
export function setupErrorHandler(app: App): void {
  // Vue component errors
  app.config.errorHandler = (err, instance, info) => {
    const componentName = instance?.$options?.name || 'Unknown';

    errorServiceInstance.handleError(err, {
      source: `Vue:${componentName}`,
      info: info,
    });
  };

  // Unhandled Promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();

    errorServiceInstance.handleError(event.reason, {
      source: 'Promise',
      info: 'Unhandled rejection',
    });
  });

  // Global JavaScript errors
  window.addEventListener('error', (event) => {
    if (event.target instanceof HTMLElement) {
      return;
    }

    errorServiceInstance.handleError(event.error, {
      source: 'Global',
      info: `${event.filename}:${event.lineno}:${event.colno}`,
    });
  });
}
