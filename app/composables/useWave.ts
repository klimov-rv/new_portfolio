export const useWave = () => {
  const phase = ref(Math.random() * 2 * Math.PI);
  const offset = 285;
  const frequency = 0.0015;
  const amplitude = 85;

  const update = () => {
    phase.value += frequency;
    return offset + Math.sin(phase.value) * amplitude;
  };

  return { update };
};
