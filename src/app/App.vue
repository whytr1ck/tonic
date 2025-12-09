<template>
  <div class="app min-h-screen bg-tg-bg text-tg-text">
    <RouterView />
    <ToastManager />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import ToastManager from '@shared/components/ToastManager/ToastManager.vue';
import { toastServiceInstance } from '@shared/components/ToastManager/services/toastService.ts';

onMounted(() => {
  toastServiceInstance.warn('test', 'test', 3000);
});
</script>
