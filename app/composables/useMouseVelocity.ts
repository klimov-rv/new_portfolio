import type { Position } from '~/types/shader';

export function useMouseVelocity() {
  const velocity = ref<Position>({ x: 0, y: 0 });
  const lastPos = ref<Position>({ x: 0, y: 0 });
  const lastTime = ref(Date.now());
  const speed = useState<number>('velocity-speed', () => 1);

  const update = (e: MouseEvent | TouchEvent) => {
    const pos: Position = { x: 0, y: 0 };
    if ('touches' in e) {
      pos.x = e.touches[0].pageX;
      pos.y = e.touches[0].pageY;
    } else {
      pos.x = e.clientX;
      pos.y = e.clientY;
    }
    const now = Date.now();
    const dt = now - lastTime.value;

    if (dt > 3) {
      velocity.value = {
        x: (pos.x - lastPos.value.x) / dt,
        y: (pos.y - lastPos.value.y) / dt,
      };
    }

    lastTime.value = now;
    lastPos.value = pos;

    return velocity.value;
  };

  const getSpeed = computed(() =>
    Math.sqrt(velocity.value.x ** 2 + velocity.value.y ** 2),
  );

  watch(getSpeed, (s) => {
    if (s > 0.5) {
      speed.value = s;
    }
  });

  return { velocity, speed, update };
}
