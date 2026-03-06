<script lang="ts" setup>
import { useEventListener, useTimeoutFn } from '@vueuse/core';
import { Motion, useSpring } from 'motion-v';
import type { Position } from '~/types/shader';

const shaderState = useShaderState();

const springConfig = {
  damping: 45,
  stiffness: 400,
  mass: 1,
  restDelta: 0.005,
};

const isMouseDown = ref(false);

// Конфигурации пружин для разных режимов
const springConfigNormal = springConfig;

const lastMousePos = ref<Position>({ x: 0, y: 0 });
const velocity = ref<Position>({ x: 0, y: 0 });
const lastUpdateTime = ref(Date.now());
const previousAngle = ref(0);
const accumulatedRotation = ref(0);

// Пружины - НЕ ПЕРЕНАЗНАЧАЕМ!
const cursorX = useSpring(0, springConfig);
const cursorY = useSpring(0, springConfig);
const defaultCursorX = ref(0);
const defaultCursorY = ref(0);
const rotation = useSpring(0, {
  ...springConfig,
  damping: 60,
  stiffness: 300,
});
const scale = useSpring(1, {
  ...springConfig,
  damping: 35,
  stiffness: 500,
});

const isSpringMode = ref(true);

function setSpringMode(isSpring: boolean) {
  isSpringMode.value = isSpring;
}

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
  const pos: Position = { x: e.clientX, y: e.clientY };
  updateVelocity(pos);

  // Обновляем позицию курсора (либо плавного либо стандартного)
  if (isSpringMode.value) {
    cursorX.set(pos.x);
    cursorY.set(pos.y);
  } else {
    defaultCursorX.value = e.clientX;
    defaultCursorY.value = e.clientY;
  }

  // Обновляем шейдер с текущим состоянием клика
  if (isMouseDown.value) {
    shaderState?.updateShaderMouse(pos);
  }

  // Вращение и масштаб только при движении
  const speed = Math.sqrt(velocity.value.x ** 2 + velocity.value.y ** 2);
  if (speed > 0.1) {
    const angle =
      Math.atan2(velocity.value.y, velocity.value.x) * (180 / Math.PI) + 90;
    let diff = angle - previousAngle.value;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    accumulatedRotation.value += diff;
    rotation.set(accumulatedRotation.value);
    previousAngle.value = angle;
  }
}

function onMouseDown(e: Event) {
  isMouseDown.value = true;
  startDeformation(isMouseDown.value);
  cursorX.jump(e.clientX);
  cursorY.jump(e.clientY);
}

function onMouseUp(e: Event) {
  isMouseDown.value = false;
  startDeformation(isMouseDown.value);
  cursorX.jump(e.clientX);
  cursorY.jump(e.clientY);
}
function startDeformation(isAcrive) {
  scale.set(isAcrive ? 0.75 : 1);
  shaderState?.setMouseDown(isAcrive);
  setSpringMode(!isAcrive);
}
let rafId = 0;
function throttled(e: MouseEvent) {
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    onMouseMove(e);
    rafId = 0;
  });
}

if (import.meta.client) {
  document.body.style.cursor = 'none';
  useEventListener(window, 'mousemove', throttled);
  useEventListener(window, 'mousedown', onMouseDown);
  useEventListener(window, 'mouseup', onMouseUp);
}

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId);
  if (import.meta.client) document.body.style.cursor = 'default';
});
</script>

<template>
  <Motion
    v-if="isSpringMode"
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
    <UiSvgSmoothCursor />
  </Motion>
  <div
    v-else
    class="default-cursor"
    :style.attr="`left: ${defaultCursorX}px; top: ${defaultCursorY}px; transform: rotate(${rotation.current}deg) scale(${scale.current});`"
  >
    <UiSvgDefaultCursor />
  </div>
</template>
<style>
.default-cursor {
  position: absolute;
  z-index: 9999;
}
</style>
