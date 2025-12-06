<template>
  <div class="p-4">
    <h1 class="text-xl font-bold text-tg-text mb-4">Portfolio</h1>
    <div class="flex items-center justify-between mb-4">
      <p class="text-tg-hint">Стоимость портфеля</p>
      <Button label="More details" />
    </div>

    <div id="chart">
      <apexchart
        type="area"
        height="300"
        :series="series"
        :options="chartOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';

const series = [
  {
    name: 'Portfolio Value',
    data: [1250, 1320, 1280, 1450, 1520, 1480, 1650, 1720, 1680, 1850, 1920, 2100],
  },
];

const chartOptions = {
  chart: {
    type: 'area',
    height: 300,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    background: 'transparent',
  },
  theme: {
    mode: 'dark',
  },
  colors: ['#00E396'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.5,
      opacityTo: 0.1,
      stops: [0, 90, 100],
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  grid: {
    borderColor: '#333',
    strokeDashArray: 3,
  },
  xaxis: {
    type: 'category',
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    labels: {
      style: {
        colors: '#888',
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: '#888',
      },
      formatter: (value: number) => `$${value}`,
    },
  },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: (value: number) => `$${value.toLocaleString()}`,
    },
  },
};
</script>
