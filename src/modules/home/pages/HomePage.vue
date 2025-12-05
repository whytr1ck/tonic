<template>
  <div class="p-4">
    <header class="mb-6">
      <h1 class="text-2xl font-bold text-tg-text">Tonic</h1>
      <p class="text-tg-hint">TON Portfolio Tracker</p>
    </header>

    <nav class="grid grid-cols-2 gap-4">
      <RouterLink
        to="/portfolio"
        class="p-4 bg-tg-secondary rounded-xl text-center hover:opacity-80 transition-opacity"
      >
        <div class="text-2xl mb-2">💼</div>
        <div class="font-medium text-tg-text">Portfolio</div>
        <div class="text-sm text-tg-hint">Track your assets</div>
      </RouterLink>

      <RouterLink
        to="/alerts"
        class="p-4 bg-tg-secondary rounded-xl text-center hover:opacity-80 transition-opacity"
      >
        <div class="text-2xl mb-2">🔔</div>
        <div class="font-medium text-tg-text">Alerts</div>
        <div class="text-sm text-tg-hint">Price notifications</div>
      </RouterLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
</script>
