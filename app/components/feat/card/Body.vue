<script setup lang="ts">
import { cn } from '@inspira-ui/plugins';
interface Props {
  class?: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div
    style="transform-style: preserve-3d;"
    :class="cn(`w-96`, props.class)"
  >
    <slot />
  </div>
</template>
