<script setup lang="ts">
interface Props {
  text?: string;
}

const props = withDefaults(defineProps<Props>(), {
  text: 'Скачать',
});

const items = ref([
  { label: 'RU', downloadUrl: '/cv/klimovrv_ru.pdf' },
  { label: 'EN', downloadUrl: '/cv/klimovrv_en.pdf' },
]);
</script>

<template>
  <div class="download-cv">
    <UPopover
      mode="hover"
      :ui="{ content: 'download-cv__dropdown' }"
      :content="{
        align: 'center',
        sideOffset: 6,
      }"
    >
      <button class="download-cv__button">
        <div class="download-cv__inner">
          <svg
            class="download-cv__icon download-cv__icon-svg icon-svg__arrow-down-tray"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <div class="download-cv__dot"></div>
          <span class="download-cv__text">
            {{ text }}
          </span>
        </div>

        <div class="download-cv__hover-layer">
          <span class="download-cv__hover-text">Варианты</span>
          <UiSvgArrow />
        </div>
      </button>

      <template #content>
        <FeatDownloadDropdown :items="items" />
      </template>
    </UPopover>
  </div>
</template>

<style lang="scss">
/* Блок */
.download-cv {
  position: fixed;
  bottom: -30rem;
  left: 50%;
  opacity: 0;
  transform: translateX(-50%);
  transition: 0.5s all;
  transition-delay: 2s;
  backdrop-filter: blur(12px);
  border-radius: 50px;
  overflow: hidden;
  z-index: 50;
  .bg-default {
    background-color: aqua;
  }
}

.is-app-not-loading {
  .download-cv {
    opacity: 1;
    bottom: 1.5rem;
  }
}

/* Элемент: кнопка */
.download-cv__button {
  position: relative;
  width: auto;
  cursor: pointer;
  overflow: hidden;
  border: 1px solid transparent;
  padding: 0.5rem 1.5rem;
  font-weight: 600;
  text-align: center;
  transition: all 300ms;
  background-color: transparent;
  color: white;
}

// .download-cv__button:hover {
//   background-color: #f9fafb;
//   color: #374151;
// }

.download-cv__inner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 300ms;
}

.download-cv__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 0.5rem;
  background-color: rgb(197, 197, 197);
  opacity: 0.5;
  scale: 0.1;
  transition: all 300ms;
  position: absolute;
  left: 10px;
}

.download-cv__button:hover .download-cv__dot {
  background-color: rgb(228, 228, 228);
  opacity: 0.1;
  scale: 100.9;
}

/* Элемент: иконка */
.download-cv__icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  margin-left: auto;
  &-svg {
    opacity: 1;
    transform: rotate(0deg);
    transition: transform 0.2s ease-in, opacity 0.3s ease-out;
  }
}

.download-cv__button:hover .download-cv__icon-svg {
  opacity: 0;
  transform: rotate(-90deg);
}

/* Элемент: текст */
.download-cv__text {
  display: inline-block;
  white-space: nowrap;
  transition: all 300ms;
}

.download-cv__button:hover .download-cv__inner {
  transform: translateX(3rem);
}

.download-cv__button:hover .download-cv__text {
  opacity: 0;
}

/* Элемент: ховер слой */
.download-cv__hover-layer {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transform: translateX(-3rem);
  opacity: 0;
  transition: all 300ms;
}

.download-cv__button:hover .download-cv__hover-layer {
  transform: translateX(0);
  opacity: 1;
}

/* Элемент: текст в ховере */
.download-cv__hover-text {
  white-space: nowrap;
  color: white;
}

/* Элемент: стрелка */
.download-cv__arrow {
  transition: transform 0.3s;
  transition-delay: 0.1s;
}

.download-cv__button:hover .download-cv__arrow {
  transform: rotate(-90deg);
}
</style>
