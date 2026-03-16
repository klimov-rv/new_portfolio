export function useSpeedController(initialSpeed: number = 1) {
  const targetSpeed = ref(initialSpeed);
  const currentSpeed = ref(initialSpeed);
  const isAnimating = ref(false);

  // Параметры анимации
  const step = 0.1; // минимальный шаг
  const throttleDelay = 900; // минимальная задержка между обновлениями в ms

  let animationFrame: number | null = null;
  let lastUpdateTime = 0;

  // Нелинейная функция изменения скорости
  const calculateNextSpeed = (current: number, target: number): number => {
    const diff = target - current;
    const direction = diff > 0 ? 1 : -1;
    const absDiff = Math.abs(diff);

    // Нелинейное изменение: большой шаг при большом diff, маленький при малом
    let stepSize: number;

    if (absDiff > 1.5) {
      // Быстрое приближение
      stepSize = Math.min(step * 3, absDiff * 0.3);
    } else if (absDiff > 0.5) {
      // Средняя скорость
      stepSize = Math.min(step * 1.5, absDiff * 0.2);
    } else {
      // Медленное доползание до цели
      stepSize = Math.max(step, absDiff * 0.1);
    }

    // Округляем до шага 0.1
    const newSpeed = current + direction * Math.min(stepSize, absDiff);
    return Math.round(newSpeed * 10) / 10;
  };

  const updateSpeed = () => {
    const now = Date.now();

    // Throttling: проверяем минимальную задержку
    if (now - lastUpdateTime < throttleDelay) {
      animationFrame = requestAnimationFrame(updateSpeed);
      return;
    }

    if (Math.abs(currentSpeed.value - targetSpeed.value) > 0.01) {
      currentSpeed.value = calculateNextSpeed(
        currentSpeed.value,
        targetSpeed.value,
      );
      lastUpdateTime = now;
      animationFrame = requestAnimationFrame(updateSpeed);
    } else {
      // Достигли цели
      currentSpeed.value = targetSpeed.value;
      isAnimating.value = false;
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    }
  };

  const setTargetSpeed = (newSpeed: number) => {
    targetSpeed.value = Math.max(0, Math.min(5, newSpeed)); // ограничиваем 0-5

    if (!isAnimating.value) {
      isAnimating.value = true;
      lastUpdateTime = Date.now() - throttleDelay; // чтобы сразу начать
      updateSpeed();
    }
  };

  // Наблюдаем за изменением targetSpeed извне
  const startAnimation = (speed: number) => {
    setTargetSpeed(speed);
  };

  return {
    currentSpeed, // текущее значение для localSpeed
    targetSpeed, // целевое значение
    isAnimating,
    setTargetSpeed,
    startAnimation,
  };
}
