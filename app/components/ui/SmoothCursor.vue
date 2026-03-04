<script lang="ts" setup>
import { useEventListener, useTimeout } from "@vueuse/core";
import { Motion, useSpring } from "motion-v";

interface Position { x: number; y: number }

const springConfig = {
  damping: 45,
  stiffness: 400,
  mass: 1,
  restDelta: 0.005,
}

const lastMousePos = ref<Position>({ x: 0, y: 0 });
const velocity = ref<Position>({ x: 0, y: 0 });
const lastUpdateTime = ref(Date.now());
const previousAngle = ref(0);
const accumulatedRotation = ref(0);

const cursorX = useSpring(0, springConfig);
const cursorY = useSpring(0, springConfig);
const rotation = useSpring(0, { ...springConfig, damping: 60, stiffness: 300 });
const scale = useSpring(1, { ...springConfig, stiffness: 500, damping: 35 });

function updateVelocity(pos: Position) {
  const now = Date.now();
  const dt = now - lastUpdateTime.value;
  if (dt > 0) {
    velocity.value = {
      x: (pos.x - lastMousePos.value.x) / dt,
      y: (pos.y - lastMousePos.value.y) / dt,
    };
  }
  lastUpdateTime.value = now;
  lastMousePos.value = pos;
}

function onMouseMove(e: MouseEvent) {
  const pos = { x: e.clientX, y: e.clientY };
  updateVelocity(pos);
  cursorX.set(pos.x);
  cursorY.set(pos.y);
  const speed = Math.sqrt(velocity.value.x ** 2 + velocity.value.y ** 2);
  if (speed > 0.1) {
    const angle = Math.atan2(velocity.value.y, velocity.value.x) * (180 / Math.PI) + 90;
    let diff = angle - previousAngle.value;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    accumulatedRotation.value += diff;
    rotation.set(accumulatedRotation.value);
    previousAngle.value = angle;
    scale.set(0.95);
    useTimeout(150, { callback: () => scale.set(1) });
  }
}

let rafId = 0;
function throttled(e: MouseEvent) {
  if (rafId) return;
  rafId = requestAnimationFrame(() => { onMouseMove(e); rafId = 0; });
}

if (import.meta.client) {
  document.body.style.cursor = "none";
  useEventListener(window, "mousemove", throttled);
}

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId);
  if (import.meta.client) document.body.style.cursor = "default";
});
</script>

<template>
  <Motion
    as="div"
    :style="{
      position: 'fixed',
      left: cursorX,
      top: cursorY,
      translateX: '-50%',
      translateY: '-50%',
      rotate: rotation,
      scale,
      zIndex: 9999,
      pointerEvents: 'none',
      willChange: 'transform',
    }"
    :initial="{ scale: 0 }"
    :animate="{ scale: 1 }"
    :transition="{ type: 'spring', stiffness: 400, damping: 30 }"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 32 32">
      <path fill="white" d="M9.391 2.32C8.42 1.56 7 2.253 7 3.486V28.41c0 1.538 1.966 2.18 2.874.938l6.225-8.523a2 2 0 0 1 1.615-.82h9.69c1.512 0 2.17-1.912.978-2.844z" />
    </svg>
  </Motion>
</template>
