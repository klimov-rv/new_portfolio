<script setup lang="ts">
import type { ShaderProps } from '~/types/shader';
import { useShaderToy } from '~/composables/useShaderToy';

const props = defineProps<ShaderProps>();

const containerRef = useTemplateRef('containerRef');

// Вся логика в композабле
useShaderToy(containerRef, { ...props });
</script>

<template>
  <div ref="containerRef" class="shadertoy-container" :class="class"></div>
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
