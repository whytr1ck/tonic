import { ref, type Ref } from 'vue';
import type { IToastMessage, IToastQueue } from '../types/types';
import { useToast } from 'primevue/usetoast';

interface ITimerState {
  timerId: ReturnType<typeof setTimeout> | null;
  startTime: number;
  remainingTime: number;
  isPaused: boolean;
}

const MAX_VISIBLE_TOASTS = 3;
const MAX_QUEUE_SIZE = 10;
const QUEUE_DELAY = 100;


function generateToastId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function useToastQueue(): IToastQueue {
  const toast = useToast();

  const visibleMessages: Ref<IToastMessage[]> = ref([]);
  const queuedMessages: Ref<IToastMessage[]> = ref([]);

  const timers = new Map<string | number, ITimerState>();
  const processingRemovals = new Set<string | number>();

  /**
   * Запускает таймер автозакрытия для toast-сообщения
   *
   * @param message - Toast-сообщение с параметром displayLife (длительность)
   */
  const startTimer = (message: IToastMessage): void => {
    if (!message.id || !message.displayLife) {
      return;
    }

    const timerId = setTimeout(() => {
      onMessageRemove(message);
    }, message.displayLife);

    timers.set(message.id, {
      timerId,
      startTime: Date.now(),
      remainingTime: message.displayLife,
      isPaused: false
    });
  };

  const clearTimer = (id: string | number): void => {
    const timerState = timers.get(id);

    if (timerState?.timerId) {
      clearTimeout(timerState.timerId);
    }

    timers.delete(id);
  };

  const pauseTimer = (id: string | number): void => {
    const timerState = timers.get(id);
    if (!timerState || timerState.isPaused) {
      return;
    }

    const elapsed = Date.now() - timerState.startTime;
    const remainingTime = Math.max(0, timerState.remainingTime - elapsed);

    if (timerState.timerId) {
      clearTimeout(timerState.timerId);
    }

    timers.set(id, {
      timerId: null,
      startTime: timerState.startTime,
      remainingTime,
      isPaused: true
    });
  };

  const resumeTimer = (id: string | number): void => {
    const timerState = timers.get(id);
    if (!timerState || !timerState.isPaused) {
      return;
    }

    const message = visibleMessages.value.find((m) => m.id === id);
    if (!message) {
      return;
    }

    const timerId = setTimeout(() => {
      onMessageRemove(message);
    }, timerState.remainingTime);

    timers.set(id, {
      timerId,
      startTime: Date.now(),
      remainingTime: timerState.remainingTime,
      isPaused: false
    });
  };

  const enqueue = (message: IToastMessage): void => {
    if (message.id === null || message.id === undefined) {
      message.id = generateToastId();
    }

    message.displayLife = message.life || 3000;
    message.life = 0;

    if (visibleMessages.value.length < MAX_VISIBLE_TOASTS) {
      visibleMessages.value.push(message);
      toast.add(message);
      startTimer(message);
    } else {
      if (queuedMessages.value.length >= MAX_QUEUE_SIZE) {
        const removed = queuedMessages.value.shift();
        console.warn(
          'ToastQueue: Превышен максимальный размер очереди. Удалено самое старое сообщение:',
          removed
        );
      }

      queuedMessages.value.push(message);
    }
  };

  const onMessageRemove = (message: IToastMessage): void => {
    const id = message.id;
    if (!id) {
      return;
    }

    if (processingRemovals.has(id)) {
      return;
    }


    processingRemovals.add(id);
    toast.remove(message);
    clearTimer(id);

    const index = visibleMessages.value.findIndex((m) => m.id === id);
    if (index !== -1) {
      visibleMessages.value.splice(index, 1);
    }

    processingRemovals.delete(id);

    if (queuedMessages.value.length > 0) {
      const nextMessage = queuedMessages.value.shift();
      if (nextMessage) {
        // Небольшая задержка для плавности анимации
        setTimeout(() => {
          visibleMessages.value.push(nextMessage);
          toast.add(nextMessage);
          startTimer(nextMessage);
        }, QUEUE_DELAY);
      }
    }
  };

  const pauseAllTimers = (): void => {
    visibleMessages.value.forEach((message) => {
      pauseTimer(message.id!);
    });
  };

  const resumeAllTimers = (): void => {
    visibleMessages.value.forEach((message) => {
      resumeTimer(message.id!);
    });
  };

  const cleanup = (): void => {
    timers.forEach((timerState) => {
      if (timerState.timerId) {
        clearTimeout(timerState.timerId);
      }
    });

    timers.clear();
    processingRemovals.clear();
    visibleMessages.value = [];
    queuedMessages.value = [];
  };

  return {
    enqueue,
    onMessageRemove,
    pauseAllTimers,
    resumeAllTimers,
    cleanup,
    visibleMessages,
    queuedMessages
  };
}
