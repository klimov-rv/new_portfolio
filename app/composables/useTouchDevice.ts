export interface UseTouchDeviceReturn {
  isTouchDevice: ComputedRef<boolean>;
}

export const useTouchDevice = (): UseTouchDeviceReturn => {
  const isTouchDevice = computed(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  });

  return { isTouchDevice };
};
