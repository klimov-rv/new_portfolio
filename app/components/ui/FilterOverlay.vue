<script setup lang="ts">
import { useEventListener } from '@vueuse/core';
const route = useRoute();

const isHomePage = computed(() => route.fullPath === '/');
const isMouseDown = ref(false);
const justDisableColours = ref(true);

// Sideeffects
const { speed } = useMouseVelocity();
const { currentSpeed: targetSpeed, setTargetSpeed } = useSpeedController(1);
const shaderState = useShaderState();

const isHideColours = computed(
  () => !isHomePage.value || isMouseDown.value || justDisableColours.value,
);

// Sideeffect 2: Speed sync
watch(targetSpeed, (val) => {
  shaderState.setSpeed(val);
});

// Lifecycle
onMounted(() => {
  useEventListener(window, 'mousemove', onMouseMove);
  useEventListener(window, 'mousedown', onMouseDown);
  useEventListener(window, 'mouseup', onMouseUp);
});

// Mouse handlers
const onMouseMove = (e: MouseEvent) => {
  const pos = { x: e.clientX, y: e.clientY };

  if (isMouseDown.value) {
    shaderState?.updateShaderMouse(pos);
  }

  if (speed.value > 0.1) {
    setTargetSpeed(speed.value);
  }
};

const onMouseDown = (e: MouseEvent) => {
  isMouseDown.value = true;
  shaderState?.setMouseDown(true);
  shaderState?.updateShaderMouse({ x: e.clientX, y: e.clientY });
};

const onMouseUp = (e: MouseEvent) => {
  isMouseDown.value = false;
  shaderState?.setMouseDown(false);
  shaderState?.updateShaderMouse({ x: e.clientX, y: e.clientY });
};
</script>

<template>
  <div
    :class="[
      isHideColours ? 'hide-smooth' : 'show',
      'filter-overlay fixed inset-0 z-0 pointer-events-none',
    ]"
  ></div>
</template>

<style lang="scss">
.filter-overlay {
  background: linear-gradient(25deg, #ee7752, #e73c7e, #23a6d5, #23d5ab) 0 0 /
    500% 1500%;
  /* background: black; */
  animation: 35s infinite gradientBG;
  opacity: 0.5;
  filter: contrast(5) brightness(0.9);
  transition: opacity 0.3s;
  &.hide-smooth {
    opacity: 0;
  }
}

@keyframes gradientBG {
  0% {
    background-position: 0%;
  }

  50% {
    background-position: 100%;
  }

  to {
    background-position: 0%;
  }
}
</style>
