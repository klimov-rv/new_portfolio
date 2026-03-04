<script setup lang="ts">
interface Props {
  imageUrl: string;
  childrenClass?: string;
  imageClass?: string;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  childrenClass: undefined,
  imageClass: undefined,
  class: undefined,
});

const containerClass = computed(() => [
  'group/card relative overflow-hidden rounded-lg bg-transparent transition-all duration-300',
  // Mobile first responsive sizing
  'h-48 w-48', // Base mobile size
  'xs:h-56 xs:w-56', // Extra small screens
  'sm:h-64 sm:w-64', // Small screens
  'md:h-80 md:w-80', // Medium screens
  'lg:h-96 lg:w-96', // Large screens
  'xl:h-[28rem] xl:w-[28rem]', // Extra large screens
  // Mobile touch improvements
  'touch-manipulation',
  'active:scale-[0.98]',
  'md:active:scale-100', // Disable scale on desktop
  props.class,
]);

const imageClass = computed(() => [
  'h-full w-full object-cover transition-transform duration-300',
  props.imageClass,
]);
</script>

<template>
  <div ref="divRef" :class="containerClass">
    <div class="relative size-full overflow-hidden">
      <div
        class="relative size-full bg-gray-50 transition-transform duration-300 dark:bg-black"
      >
        <img
          :src="imageUrl"
          alt="image"
          :class="imageClass"
          width="1000"
          height="1000"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Enhanced mobile touch targets */
@media (max-width: 768px) {
  .group\/card {
    min-height: 44px; /* iOS minimum touch target */
    min-width: 44px;
  }
}

/* Smooth transitions for mobile */
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.1s !important;
  }
}
</style>
