import type { Position } from '~/types/shader';

export function useMouseVelocity() {
  const velocity = ref<Position>({ x: 0, y: 0 });
  const lastPos = ref<Position>({ x: 0, y: 0 });
  const lastTime = ref(Date.now());

  const update = (pos: Position) => {
    const now = Date.now();
    const dt = now - lastTime.value;

    if (dt > 0) {
      velocity.value = {
        x: (pos.x - lastPos.value.x) / dt,
        y: (pos.y - lastPos.value.y) / dt,
      };
    }

    lastTime.value = now;
    lastPos.value = pos;

    return velocity.value;
  };

  const speed = computed(() =>
    Math.sqrt(velocity.value.x ** 2 + velocity.value.y ** 2),
  );

  return { velocity, speed, update };
}
