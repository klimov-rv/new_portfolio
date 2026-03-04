<script setup lang="ts">
import type { ShaderProps } from '~/types/shader';
import { InspiraShaderToy } from './InspiraShaderToy';
import isWebGLSupported from '~/utils/webgl';

const props = defineProps<ShaderProps>();

const containerRef = useTemplateRef('containerRef');
let shader: InspiraShaderToy | undefined;

// Размер фона для шума
const bgSize = computed(() => `${(props.noise?.scale || 8) * 100}%`);

onMounted(() => {
  if (!containerRef.value || !isWebGLSupported()) return;

  try {
    shader = new InspiraShaderToy(containerRef.value, props.mouseMode);

    // Единый вызов setShader
    if (!shader.setShader({ source: props.shaderCode })) {
      throw new Error('Shader compilation failed');
    }

    // Применяем все параметры одной функцией
    updateShaderParams();
    shader.play();
  } catch (e) {
    console.warn('ShaderToy error:', e);
  }
});

// Обновление всех параметров шейдера
const updateShaderParams = () => {
  if (!shader) return;

  shader.setHSV({
    hue: props.hue,
    saturation: props.saturation,
    brightness: props.brightness,
  });

  if (props.speed !== undefined) shader.setSpeed(props.speed);
  if (props.mouseSensitivity !== undefined)
    shader.setMouseSensitivity(props.mouseSensitivity);
  if (props.damping !== undefined) shader.setMouseDamping(props.damping);
};

// Один watcher на все пропсы
watch(
  [
    () => props.hue,
    () => props.saturation,
    () => props.brightness,
    () => props.speed,
    () => props.mouseSensitivity,
    () => props.damping,
  ],
  updateShaderParams,
);

onUnmounted(() => shader?.dispose());
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
