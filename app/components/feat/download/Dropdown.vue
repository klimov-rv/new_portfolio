<script setup lang="ts">
interface DownloadItem {
  label: string;
  downloadUrl: string;
}

interface Props {
  items?: Array<DownloadItem>;
}

const props = defineProps<Props>();
</script>
<template>
  <div class="download-cv__dropdown">
    <a
      v-for="value in items"
      :key="value.label"
      :href="value.downloadUrl"
      download
      target="_blank"
      class="download-cv__option"
    >
      <span class="download-cv__option-text">
        {{ value.label === 'RU' ? 'Русский' : 'English' }}
      </span>
      <span class="download-cv__option-badge">.PDF</span>
    </a>
  </div>
</template>
<style lang="scss">
/* Блок */
/* Dropdown контейнер */
.download-cv__dropdown {
  background-color: unset;
  border: 0px solid;
  border-radius: 19px;
  overflow: hidden;
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.02);
  animation: dropdownFadeIn 0.2s ease-out;
  color: white;
}

/* Опция дропдауна */
.download-cv__option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1rem;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  padding: 10px 28px;
  &:first-child {
    padding-top: 15px;
  }
  &:last-child {
    padding-bottom: 15px;
  }
}

.download-cv__option:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: translateX(2px);
}

/* Иконка PDF */
.download-cv__pdf-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  color: #ef4444;
}

.download-cv__option:hover .download-cv__pdf-icon {
  transform: scale(1.1);
}

/* Текст опции */
.download-cv__option-text {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
}

/* Бейдж PDF */
.download-cv__option-badge {
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  letter-spacing: 0.02em;
  transition: all 0.2s ease;
}

.download-cv__option:hover .download-cv__option-badge {
  background: rgba(239, 68, 68, 0.2);
  transform: scale(0.95);
}

/* Анимация появления */
@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
