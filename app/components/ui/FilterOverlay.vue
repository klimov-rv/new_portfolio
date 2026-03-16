<script setup lang="ts">
const route = useRoute();

const isHomePage = computed(() => route.fullPath === '/');

// Sideeffects
const lastTime = ref(Date.now());
const { speed } = useMouseVelocity();
const { currentSpeed: targetSpeed, setTargetSpeed } = useSpeedController(1);
const shaderState = useShaderState();

const isMovedSlow = computed(() => targetSpeed.value < 0.8);
const isHideColours = computed(() => !isHomePage.value);

// Sideeffect 1
watch(speed, (val) => {
  if (speed.value > 0.1) {
    // isHideColours.value = true;
    const now = Date.now();
    setTargetSpeed(val);
    const timerId = setTimeout(() => {
      const dt = now - lastTime.value;

      if (dt > 2900) {
        setTargetSpeed(0.5);
        removeTimer();
      }
    }, 1000);
    function removeTimer() {
      // isHideColours.value = false;
      clearTimeout(timerId);
    }
  }
});

// Sideeffect 2: Speed sync
watch(targetSpeed, (val) => {
  console.log('currentSpeed', val);
  shaderState.setSpeed(val);
});
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
