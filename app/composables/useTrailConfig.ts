export const useTrailConfig = (props) => {
  return computed(() => ({
    friction: props.friction,
    trails: props.trails,
    size: props.size,
    dampening: props.dampening,
    tension: props.tension,
  }));
};
