import type { App } from 'vue'
import { setupTelegram } from '@app/providers/telegram.ts'
import { setupApexCharts } from '@app/providers/apexcharts.ts'
import { setupEruda } from '@app/providers/eruda.ts'
import { setupPrimeVue } from '@app/providers/primevue.ts'

export function setupAdditionalPlugins(app: App): void {
  setupTelegram(app);
  setupApexCharts(app);
  setupPrimeVue(app);
  setupEruda();
}
