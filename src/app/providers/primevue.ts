import type { App } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

export function setupPrimeVue(app: App): void {
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: '.dark',
      },
    },
  });
}
