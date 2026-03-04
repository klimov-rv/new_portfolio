<script setup lang="ts">
import type { ShaderControls } from '~/types/shader';

interface Props extends ShaderControls {}

const props = defineProps<Props>();

import shaderCode from 'shaders/silk.glsl?raw';
</script>

<template>
  <UiShaderToy :shader-code="shaderCode" v-bind="props" />
</template>
