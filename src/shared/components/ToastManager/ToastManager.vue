<template>
  <Toast
      position="top-right"
      :pt="{
        root: {
          class: { 'toasts-paused': isPaused }
        },
        message: ({ props }) => ({
          style: { '--toast-life': `${(props.message as IToastMessage)?.displayLife || 3000}ms` },
          onMouseenter: handleMouseEnter,
          onMouseleave: handleMouseLeave
        })
      }"
      @close="handleClose"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Toast, {type ToastEvent} from 'primevue/toast';
import { useToastQueue } from './composables/useToastQueue';
import type { IToastMessage } from './types/types';
import { toastServiceInstance } from '@/shared/components/ToastManager/services/toastService';

const toastQueue = useToastQueue();
const isPaused = ref(false);

function handleClose(event: ToastEvent): void {
  toastQueue.onMessageRemove(event.message as IToastMessage);
}

function handleMouseEnter(): void {
  isPaused.value = true;
  toastQueue.pauseAllTimers();
}

function handleMouseLeave(): void {
  isPaused.value = false;
  toastQueue.resumeAllTimers();
}

defineExpose({
  toastQueue
});

onMounted(() => {
  toastServiceInstance.init(toastQueue);
});

onUnmounted(() => {
  toastQueue.cleanup();
});
</script>
