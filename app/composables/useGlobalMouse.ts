export const useGlobalMouse = () => {
  const mouseX = ref(0);
  const mouseY = ref(0);
  const mouseClickX = ref(0);
  const mouseClickY = ref(0);
  const isMouseDown = ref(false);

  // Обработчики на уровне window
  const handleMouseMove = (e: MouseEvent) => {
    mouseX.value = e.clientX;
    mouseY.value = e.clientY;
  };

  const handleMouseDown = (e: MouseEvent) => {
    isMouseDown.value = true;
    mouseClickX.value = e.clientX;
    mouseClickY.value = e.clientY;
  };

  const handleMouseUp = () => {
    isMouseDown.value = false;
  };

  // Для touch-устройств
  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches[0]) {
      mouseX.value = e.touches[0].clientX;
      mouseY.value = e.touches[0].clientY;
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches[0]) {
      isMouseDown.value = true;
      mouseClickX.value = e.touches[0].clientX;
      mouseClickY.value = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = () => {
    isMouseDown.value = false;
  };

  // Установка/очистка слушателей
  const init = () => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
  };

  const cleanup = () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mousedown', handleMouseDown);
    window.removeEventListener('mouseup', handleMouseUp);
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchstart', handleTouchStart);
    window.removeEventListener('touchend', handleTouchEnd);
  };

  return {
    mouseX,
    mouseY,
    mouseClickX,
    mouseClickY,
    isMouseDown,
    init,
    cleanup,
  };
};
