<script setup lang="ts">
const { isLoading, registerComponent, markComponentLoaded } = useAppLoading();

// Ждём загрузки корневого компонента
if (process.client) {
  registerComponent('AppRoot');
  onMounted(() => {
    // Даем время на загрузку дочерних компонентов
    setTimeout(() => {
      markComponentLoaded('AppRoot');
    }, 1100);
  });
}

const appLoadClass = computed(() => [
  isLoading.value ? 'is-app-loading' : 'is-app-not-loading',
]);
</script>
<template>
  <NuxtLayout :class="appLoadClass">
    <NuxtLoadingIndicator />
    <div v-if="isLoading" class="global-loader">
      <!-- Logo with TextGlitch effect (effect 2) -->
      <UiTextGlitch
        text="klimovproject_"
        class="!text-xl !font-bold !font-mono !text-white"
      />
    </div>

    <NuxtPage />
  </NuxtLayout>
</template>
<style>
.global-loader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: black;
  z-index: 9999;
}

.loader-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
</style>
