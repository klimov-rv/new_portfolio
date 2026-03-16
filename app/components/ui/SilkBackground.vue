<script setup lang="ts">
import shaderCode from 'shaders/silk.glsl?raw';
import type { ShaderControls, ShaderProps } from '~/types/shader';

const props = defineProps<ShaderControls>();
const shaderProps: ShaderProps = { ...props, shaderCode, mouseMode: 'click' };
const containerRef = useTemplateRef('containerRef');
useShaderToy(containerRef, { ...shaderProps });
</script>

<template>
  <div ref="containerRef" class="shadertoy-container"></div>
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
</style>
