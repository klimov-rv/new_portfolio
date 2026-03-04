<script setup lang="ts">
import type { ShaderProps } from '~/types/shader';
import { useShaderToy } from '~/composables/useShaderToy';

const props = defineProps<ShaderProps>();

const containerRef = useTemplateRef('containerRef');

// Вся логика в композабле
const { pause, play } = useShaderToy(containerRef, {
  shaderCode: props.shaderCode,
  mouseMode: props.mouseMode,
  hue: props.hue,
  saturation: props.saturation,
  brightness: props.brightness,
  speed: props.speed,
  mouseSensitivity: props.mouseSensitivity,
  damping: props.damping,
});

// Размер для noise слоя
const bgSize = computed(() => `${(props.noise?.scale || 8) * 100}%`);
const pauseClick = () => {
  console.log('sadasdsad');
  pause();
};
</script>

<template>
  <div ref="containerRef" class="shadertoy-container" :class="class">
    <div
      v-if="props.noise?.opacity"
      class="noise-overlay"
      :style="{
        backgroundSize: bgSize,
        backgroundImage:
          'url(https://framerusercontent.com/images/g0QcWrxr87K0ufOxIUFBakwYA8.png)',
        opacity: props.noise.opacity,
      }"
    />
    <div style="position: absolute; z-index: 9999; top: 50%; right: 50%;">
      <button @click="pauseClick">Пауза</button>
      <button @click="play">Старт</button>
    </div>
  </div>
</template>

<style scoped>
.shadertoy-container {
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
.shadertoy-container canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.noise-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  background-repeat: repeat;
  background-position: center;
}
</style>
