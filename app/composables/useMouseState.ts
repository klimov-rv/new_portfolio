export interface UseMouseStateReturn {
  isMouseEntered: Readonly<Ref<boolean>>;
  setMouseEntered: (value: boolean) => void;
}

export function useMouseState(): UseMouseStateReturn {
  const isMouseEntered = ref(false);

  function setMouseEntered(value: boolean) {
    isMouseEntered.value = value;
  }

  return {
    isMouseEntered: readonly(isMouseEntered),
    setMouseEntered,
  };
}
