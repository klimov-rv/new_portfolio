<script setup lang="ts">
import type { ShaderControls } from '~/types/shader';
import shaderCode from 'shaders/silk.glsl?raw';

interface Props extends ShaderControls {}

const props = defineProps<Props>();
</script>

<template>
  <UiShaderToy :shader-code="shaderCode" v-bind="props" />
</template>
