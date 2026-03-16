<script lang="ts" setup>
import gsap from 'gsap';
import { useEventListener, useTimeout } from '@vueuse/core';
import { useSpring, useMotionValueEvent } from 'motion-v';
import { useSpeedController } from '~/composables/useSpeedController';
import { useCursorTail } from '~/composables/useCursorTail';
import { useCursorAnimation } from '~/composables/useCursorAnimation';
import { useMouseVelocity } from '~/composables/useMouseVelocity';
import { useTargetObserver } from '~/composables/useTargetObserver';
import type { Position } from '~/types/shader';

interface Props {
  enlargeTargetSelector?: string;
  fullCursorSize?: number;
  observerRoot?: HTMLElement | string;
}

const props = withDefaults(defineProps<Props>(), {
  enlargeTargetSelector: '.card-3d',
  fullCursorSize: 35,
  observerRoot: 'body',
});

const springConfig = {
  damping: 10,
  stiffness: 150,
  restDelta: 0.005,
};

const velocity = ref<Position>({ x: 0, y: 0 });
const previousAngle = ref(0);
const accumulatedRotation = ref(0);

const cursorX = useSpring(0, springConfig);
const cursorY = useSpring(0, springConfig);
const rotation = useSpring(0, { ...springConfig, damping: 60, stiffness: 300 });
const scale = useSpring(1, { ...springConfig, stiffness: 500, damping: 35 });

// State
const showFilter = ref(true);
const isMouseDown = ref(false);
const clientPos = reactive({ x: 0, y: 0 });
const mousePos = reactive<Position>({ x: 0, y: 0 });

// Refs
const cursorWrapper = ref<HTMLElement | null>(null);
const innerCursor = ref<HTMLElement | null>(null);
const outerCursor = ref<HTMLElement | null>(null);
const cursorTail = ref<SVGElement | null>(null);

// Composables
const shaderState = useShaderState();
const { currentSpeed, setTargetSpeed } = useSpeedController(1);
const { speed, update: updateVelocity } = useMouseVelocity();
const {
  liquidGlassSize,
  createAnimations,
  onEnter,
  onLeave,
  destroy: destroyAnimations,
} = useCursorAnimation(innerCursor, outerCursor);
const { init: initTail, destroy: destroyTail } = useCursorTail(
  cursorTail,
  mousePos,
  {
    totalLines: 110,
    ease: 0.97,
    lineColor: '#ccc',
    lineWidth: 5,
    startOffset: 15,
  },
);

useMotionValueEvent(cursorX, 'change', (value) => {
  mousePos.x = value;
});

useMotionValueEvent(cursorY, 'change', (value) => {
  mousePos.y = value;
});

// Mouse handlers
const onMouseMove = (e: MouseEvent) => {
  const pos = { x: e.clientX, y: e.clientY };

  cursorX.set(pos.x);
  cursorY.set(pos.y);

  Object.assign(clientPos, pos);

  const vel = updateVelocity(pos);

  if (isMouseDown.value) {
    shaderState?.updateShaderMouse(pos);
  }

  if (vel.x ** 2 + vel.y ** 2 > 0.01) {
    setTargetSpeed(speed.value);
    const angle =
      Math.atan2(velocity.value.y, velocity.value.x) * (180 / Math.PI) + 90;
    let diff = angle - previousAngle.value;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    accumulatedRotation.value += diff;
    rotation.set(accumulatedRotation.value);
    previousAngle.value = angle;
    scale.set(0.95);
    useTimeout(150, { callback: () => scale.set(1) });
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

// Position loop
const updatePosition = () => {
  if (cursorWrapper.value) {
    gsap.set(cursorWrapper.value, { x: clientPos.x, y: clientPos.y });
  }
  requestAnimationFrame(updatePosition);
};

// Target observer
const rootElement = computed(() =>
  typeof props.observerRoot === 'string'
    ? document.querySelector(props.observerRoot)
    : props.observerRoot || document.body,
);

const targetObserver = useTargetObserver(
  props.enlargeTargetSelector,
  rootElement.value as HTMLElement | null,
  onEnter,
  onLeave,
);

// Route change handler
const route = useRoute();
watch(
  () => route.fullPath,
  async () => {
    onLeave();
    await nextTick();
    targetObserver.refresh();
  },
);

// Speed sync
watch(currentSpeed, (val) => {
  shaderState.setSpeed(val);
});

// Lifecycle
onMounted(() => {
  if (!cursorWrapper.value || !innerCursor.value || !outerCursor.value) return;

  // Initial position
  mousePos.x = window.innerWidth / 2;
  mousePos.y = window.innerHeight / 2;

  // Setup
  initTail();
  createAnimations(props.fullCursorSize, gsap.parseEase('back.inOut(1.7)'));
  targetObserver.init();

  // Event listeners
  useEventListener(window, 'mousemove', onMouseMove);
  useEventListener(window, 'mousedown', onMouseDown);
  useEventListener(window, 'mouseup', onMouseUp);

  // Start loop
  requestAnimationFrame(updatePosition);
});

onUnmounted(() => {
  targetObserver.destroy();
  destroyAnimations();
  destroyTail();
});
</script>

<template>
  <div class="default-cursor-tooltip">VIEW</div>
  <div ref="cursorWrapper" class="cursor-wrapper">
    <div
      ref="innerCursor"
      class="custom-cursor custom-cursor__inner backdrop-blur-sm"
    />
    <div ref="outerCursor" class="custom-cursor custom-cursor__outer" />
    <UiCursorLiquidGlass v-if="showFilter" :size="liquidGlassSize" />
  </div>
  <svg ref="cursorTail" class="cursor-tail"></svg>
</template>

<style lang="scss">
@media (any-pointer: fine) {
  .cursor-tail {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 9999;
  }
  .cursor-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 9999;
    transform: translate(0, 0);
    will-change: transform;
  }

  .custom-cursor {
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 50%;
    pointer-events: none;
    will-change: transform, width, height, background-color, opacity;
  }

  .custom-cursor__inner {
    width: 6px;
    height: 6px;
    background-color: #fff;
    transform: translate(-50%, -50%);
    z-index: 2;
  }

  .custom-cursor__outer {
    width: 1px;
    height: 1px;
    border: 2px solid white;
    background-color: transparent;
    transform: translate(-50%, -50%);
    transition: background-color 0.3s, opacity 0.3s, transform 0.2s;
    z-index: 1;
  }

  .cursor-wrapper.has-blend-mode {
    mix-blend-mode: difference;
  }

  .cursor-wrapper.is-outside {
    opacity: 0;
  }

  .default-cursor-tooltip {
    display: none;
  }
}
</style>
