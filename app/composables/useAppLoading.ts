export interface UseAppLoadingReturn {
  isLoading: Readonly<Ref<boolean>>;
  registerComponent: (componentName: string) => void;
  finishLoading: () => void;
  resetLoading: () => void;
}

export const useAppLoading = (): UseAppLoadingReturn => {
  const isLoading = useState<boolean>('app:loading', () => true);
  const componentsLoaded = useState<Set<string>>(
    'app:components-loaded',
    () => new Set(),
  );

  const registerComponent = (componentName: string) => {
    if (process.client) {
      componentsLoaded.value.add(componentName);
      checkAllComponentsLoaded();
    }

    // Для SSR - сразу показываем контент
    if (process.server) {
      isLoading.value = false;
    }
  };

  const checkAllComponentsLoaded = () => {
    if (process.client && componentsLoaded.value.size === 0) {
      // Даем время на гидратацию
      setTimeout(() => {
        isLoading.value = false;
      }, 0);
    }
  };

  const resetLoading = () => {
    isLoading.value = true;
    componentsLoaded.value = new Set();
  };

  const finishLoading = () => {
    isLoading.value = false;
    componentsLoaded.value = new Set();
  };

  return {
    isLoading: readonly(isLoading),
    registerComponent,
    finishLoading,
    resetLoading,
  };
};
