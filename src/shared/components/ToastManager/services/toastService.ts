import type { IToastQueue } from '@/shared/components/ToastManager/types/types';

export type TNotificationType = 'success' | 'error' | 'warn' | 'info';


const DEFAULT_TOAST_DURATION = 3000;

enum NotificationTitles {
  success = 'Успешно',
  error = 'Ошибка',
  info = 'Информация',
  warn = 'Предупреждение',
}

class ToastService {
  private toastQueue: IToastQueue | null = null;

  init(queueManager: IToastQueue): void {
    if (this.toastQueue !== null) {
      console.warn('ToastService: Попытка повторной инициализации. ToastService уже инициализирован.');
      return;
    }

    this.toastQueue = queueManager;
  }

  /**
   * Показать уведомление
   * @param text - Текст уведомления
   * @param type - Тип уведомления (success, error, warn, info)
   * @param title - Заголовок (опционально, по умолчанию зависит от типа)
   * @param duration - Длительность показа в миллисекундах (по умолчанию DEFAULT_TOAST_DURATION)
   */
  show(
    text: string,
    type: TNotificationType = 'success',
    title?: string,
    duration: number = DEFAULT_TOAST_DURATION
  ): void {
    if (!this.toastQueue) {
      console.warn('ToastManager: Toast не инициализирован. Вызовите toastServiceInstance.init() из App.vue');
      return;
    }

    const defaultTitles: Record<TNotificationType, NotificationTitles> = {
      success: NotificationTitles.success,
      error: NotificationTitles.error,
      info: NotificationTitles.info,
      warn: NotificationTitles.warn,
    };

    this.toastQueue.enqueue({
      severity: type,
      summary: title || defaultTitles[type],
      detail: text,
      life: duration,
    });
  }

  success(text: string, title?: string, duration?: number): void {
    this.show(text, 'success', title, duration);
  }

  error(text: string, title?: string, duration?: number): void {
    this.show(text, 'error', title, duration);
  }

  warn(text: string, title?: string, duration?: number): void {
    this.show(text, 'warn', title, duration);
  }

  info(text: string, title?: string, duration?: number): void {
    this.show(text, 'info', title, duration);
  }
}

export const toastServiceInstance = new ToastService();
