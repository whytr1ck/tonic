import { ref, readonly, computed, onMounted } from 'vue';
import WebApp from '@twa-dev/sdk';
import type { TelegramUser, ThemeParams } from '../types';

export function useTelegram() {
  const user = ref<TelegramUser | null>(null);
  const themeParams = ref<ThemeParams | null>(null);
  const isReady = ref(false);

  const isDarkTheme = computed(() =>
    themeParams.value?.bg_color?.startsWith('#1') ??
    themeParams.value?.bg_color?.startsWith('#0') ??
    false
  );

  const hapticFeedback = (type: 'light' | 'medium' | 'heavy') => {
    WebApp.HapticFeedback.impactOccurred(type);
  };

  const hapticNotification = (type: 'error' | 'success' | 'warning') => {
    WebApp.HapticFeedback.notificationOccurred(type);
  };

  const hapticSelection = () => {
    WebApp.HapticFeedback.selectionChanged();
  };

  const showAlert = (message: string) => {
    WebApp.showAlert(message);
  };

  const showConfirm = (message: string, callback: (confirmed: boolean) => void) => {
    WebApp.showConfirm(message, callback);
  };

  const close = () => {
    WebApp.close();
  };

  const expand = () => {
    WebApp.expand();
  };

  onMounted(() => {
    WebApp.ready();
    WebApp.expand();

    user.value = WebApp.initDataUnsafe.user ?? null;
    themeParams.value = WebApp.themeParams;
    isReady.value = true;
  });

  return {
    user: readonly(user),
    themeParams: readonly(themeParams),
    isReady: readonly(isReady),
    isDarkTheme,
    hapticFeedback,
    hapticNotification,
    hapticSelection,
    showAlert,
    showConfirm,
    close,
    expand,
    webApp: WebApp,
  };
}
