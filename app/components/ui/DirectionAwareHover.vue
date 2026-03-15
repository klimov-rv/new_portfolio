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

const isLoadingImg = ref(true);
const isErr = ref(false);
const onErr = () => {
  isErr.value = true;
  isLoadingImg.value = false;
};
const containerClass = computed(() => [
  'img__wrapper',
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
  isErr.value ? 'err-bg' : '',
  'img-show-smooth h-full w-full object-cover',
  props.imageClass,
]);
</script>

<template>
  <div :class="containerClass">
    <NuxtImg
      :class="imageClass"
      :src="imageUrl"
      :preload="{ fetchPriority: 'high' }"
      alt="portfolio project image"
      @error="onErr"
      placeholder
      placeholder-class="skeleton-bg"
    />
    <span class="err-msg">Ошибка загрузки изображения</span>
  </div>
</template>

<style scoped lang="scss">
.img__wrapper {
  .img-show-smooth {
    opacity: 1;
    transition: 0.3s all;
  }
  img.skeleton-bg {
    background: linear-gradient(
        70deg,
        #cecece31,
        #cecece31,
        #cecece31,
        #ffffff,
        #cecece,
        #c2c2c2,
        #7c7c7c,
        #7c7c7c,
        #ffffff,
        #ffffff,
        #ffffff,
        #ffffff,
        #cecece31,
        #cecece31,
        #cecece31,
        #cecece31,
        #cecece31
      )
      0 0 / 1100% 300%;
    animation: 3s infinite skeletBG ease-out;

    opacity: 0.3;
    filter: contrast(1);
    height: 100%;
  }

  @keyframes skeletBG {
    0% {
      background-position: 0%;
    }

    100% {
      background-position: 100%;
    }
  }

  .err-bg {
    display: none;
  }

  .err-msg {
    display: none;
  }

  .err-bg + .err-msg {
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    color: white;
    text-transform: uppercase;
    border: 1px solid white;
    opacity: 0.3;
  }
}

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
