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

// Состояние нажатия мыши
const isMouseDown = ref(false);

// Конфигурации пружин для разных режимов
const springConfigNormal = springConfig;
const springConfigPressed = {
  damping: 200, // Очень высокое демпфирование - почти без пружины
  stiffness: 1000, // Очень жестко - мгновенно
  mass: 1,
  restDelta: 0.005,
};

const lastMousePos = ref<Position>({ x: 0, y: 0 });
const velocity = ref<Position>({ x: 0, y: 0 });
const lastUpdateTime = ref(Date.now());
const previousAngle = ref(0);
const accumulatedRotation = ref(0);

// Пружины, которые могут менять конфигурацию
let cursorX = useSpring(0, springConfigNormal);
let cursorY = useSpring(0, springConfigNormal);
const rotation = useSpring(0, {
  ...springConfigNormal,
  damping: 60,
  stiffness: 300,
});
const scale = useSpring(1, {
  ...springConfigNormal,
  damping: 35,
  stiffness: 500,
});
console.log('setSpringMode do', cursorX);
// Функция для обновления конфигурации пружин
function setSpringMode(normal: boolean) {
  const config = normal ? springConfigNormal : springConfigPressed;

  // Обновляем конфигурацию пружин позиции
  cursorX = useSpring(0, config);
  cursorY = useSpring(0, config);
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

  // Обновляем позицию курсора (всегда плавно)
  cursorX.set(pos.x);
  cursorY.set(pos.y);

  // Обновляем шейдер с текущим состоянием клика
  // Обновляем шейдер с текущим состоянием клика
  if (isMouseDown.value) {
    console.log('onMouseMove in 111', pos);
    // Если кнопка нажата - передаем координаты клика

    console.log('updateMouse DOWN', pos);

    shaderState?.updateMouse(pos);
  } else {
    shaderState?.setMouseDown(false);
    // Если не нажата - только позицию
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

    // Масштаб только если не нажата кнопка
    if (!isMouseDown.value) {
      scale.set(0.95);
      useTimeoutFn(() => {
        scale.set(1);
      }, 150);
    }
  }
}

function onMouseDown(e: MouseEvent) {
  isMouseDown.value = true;
  // Активируем эффект шейдера
  shaderState?.setMouseDown(true);
  console.log('onMouseDown in isMouseDown.value', isMouseDown.value);
  // Отключаем пружинистость позиции
  // setSpringMode(false);

  console.log('onMouseDown 2222 isMouseDown.value', isMouseDown.value);
  // // Мгновенно перемещаем курсор на позицию клика
  // cursorX.jump(e.clientX);
  // cursorY.jump(e.clientY);

  // // Убираем эффект масштаба
  // scale.set(1);
}

function onMouseUp(e: MouseEvent) {
  isMouseDown.value = false;

  console.log('onMouseUp 1  value', isMouseDown.value);
  // Деактивируем эффект шейдера
  shaderState?.setMouseDown(false);
  // Возвращаем нормальную пружинистость
  // setSpringMode(true);
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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 32 32"
    >
      <path
        fill="white"
        d="M9.391 2.32C8.42 1.56 7 2.253 7 3.486V28.41c0 1.538 1.966 2.18 2.874.938l6.225-8.523a2 2 0 0 1 1.615-.82h9.69c1.512 0 2.17-1.912.978-2.844z"
      />
    </svg>
  </Motion>
</template>
