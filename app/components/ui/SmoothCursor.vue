<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@inspira-ui/plugins';
import { useEventListener } from '@vueuse/core';

interface Props {
  friction?: number;
  trails?: number;
  size?: number;
  dampening?: number;
  tension?: number;
  class?: HTMLAttributes['class'];
}

const props = withDefaults(defineProps<Props>(), {
  friction: 0.5,
  trails: 20,
  size: 50,
  dampening: 0.25,
  tension: 0.98,
});

const canvasRef = ref<HTMLCanvasElement | null>(null);

// Инициализация композаблов
const config = useTrailConfig(props);
const wave = useWave();
const lines = useLines(config);
const canvas = useCanvas(canvasRef, lines, wave);

// Сетап слушателей событий через useEventListener
onMounted(() => {
  canvas.init();

  // Автоматическая очистка при размонтировании
  useEventListener(document, 'mousemove', canvas.start, { once: true });
  useEventListener(document, 'touchstart', canvas.start, { once: true });
  useEventListener(document, 'mousemove', lines.updatePosition);
  useEventListener(document, 'touchmove', lines.updatePosition);
  useEventListener(document.body, 'orientationchange', canvas.resizeCanvas);
  useEventListener(window, 'resize', canvas.resizeCanvas);
  useEventListener(window, 'focus', () => {
    if (canvas.ctx) canvas.ctx.running = true;
    canvas.init();
  });
  useEventListener(window, 'blur', () => {
    if (canvas.ctx) canvas.ctx.running = false;
  });
});

onUnmounted(() => {
  canvas.cleanup();
});
</script>

<template>
  <canvas
    id="canvas"
    ref="canvasRef"
    :class="cn('pointer-events-none fixed inset-0 z-50', props.class)"
  />
</template>

<style scoped>
#canvas {
  z-index: 0;
}
</style>
