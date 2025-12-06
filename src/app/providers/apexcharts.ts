import type { App } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

export function setupApexCharts(app: App): void {
  app.use(VueApexCharts);
}
