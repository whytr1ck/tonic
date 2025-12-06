<template>
  <div class="app min-h-screen bg-tg-bg text-tg-text">
    <RouterView />
    <ToastManager />
  </div>
</template>

<script setup lang="ts">
import ToastManager from '@shared/components/ToastManager/ToastManager.vue';
</script>
