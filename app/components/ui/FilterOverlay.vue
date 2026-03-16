<script setup lang="ts">
const route = useRoute();
const isHomePage = computed(() => route.fullPath === '/');
</script>

<template>
  <div
    :class="[
      isHomePage ? 'show' : 'hide-smooth',
      'filter-overlay fixed inset-0 z-0 pointer-events-none',
    ]"
  />
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
