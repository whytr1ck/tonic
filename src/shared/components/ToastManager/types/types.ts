import type { ToastMessageOptions } from 'primevue/toast';
import type { Ref } from 'vue';

export interface IToastMessage extends ToastMessageOptions {
  id?: string | number;
  severity?: 'success' | 'info' | 'warn' | 'error';
  summary?: string;
  detail?: string;
  life?: number;
  displayLife?: number;  // Длительность для CSS-анимации (мс)
}

export interface IToastQueue {
  enqueue: (message: IToastMessage) => void;
  onMessageRemove: (message: IToastMessage) => void;
  pauseAllTimers: () => void;
  resumeAllTimers: () => void;
  cleanup: () => void;
  readonly visibleMessages: Ref<readonly IToastMessage[]>;
  readonly queuedMessages: Ref<readonly IToastMessage[]>;
}
