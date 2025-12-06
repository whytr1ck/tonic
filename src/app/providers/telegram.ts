import type { App } from 'vue';
import { VueTelegramPlugin } from 'vue-tg';

export function setupTelegram(app: App): void {
  app.use(VueTelegramPlugin);
}
