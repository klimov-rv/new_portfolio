export interface TrailConfigProps {
  friction: number;
  trails: number;
  size: number;
  dampening: number;
  tension: number;
}

export interface TrailConfig {
  friction: number;
  trails: number;
  size: number;
  dampening: number;
  tension: number;
}

export interface UseTrailConfigReturn {
  config: ComputedRef<TrailConfig>;
}

export const useTrailConfig = (
  props: TrailConfigProps,
): UseTrailConfigReturn => {
  const config = computed(() => ({
    friction: props.friction,
    trails: props.trails,
    size: props.size,
    dampening: props.dampening,
    tension: props.tension,
  }));

  return { config };
};
