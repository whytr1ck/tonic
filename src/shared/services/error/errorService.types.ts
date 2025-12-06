/**
 * Контекст ошибки для логирования и отображения
 */
export interface IErrorContext {
  source?: string;
  info?: string;
  showToast?: boolean;
}

/**
 * Типизация API ошибки
 */
export interface IApiError {
  status?: number;
  message: string;
  endpoint?: string;
}


export const HTTP_ERROR_MESSAGES: Record<number, string> = {
  400: 'Некорректный запрос',
  401: 'Требуется авторизация',
  403: 'Доступ запрещён',
  404: 'Ресурс не найден',
  408: 'Превышено время ожидания',
  429: 'Слишком много запросов',
  500: 'Ошибка сервера',
  502: 'Сервер недоступен',
  503: 'Сервис временно недоступен',
  504: 'Сервер не отвечает',
};
