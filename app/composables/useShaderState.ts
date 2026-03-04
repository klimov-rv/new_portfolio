export interface ShaderController {
  pause: () => void;
  play: () => void;
  restart: () => void;
  setHue: (h: number) => void;
  setSpeed: (s: number) => void;
  setSaturation: (s: number) => void;
  setBrightness: (b: number) => void;
  getState: () => {
    hue: number;
    speed: number;
    saturation: number;
    brightness: number;
    isPlaying: boolean;
  };
}

export const useShaderState = () => {
  const controller = useState<ShaderController | null>(
    'shader-controller',
    () => null,
  );

  const hue = useState<number>('shader-hue', () => 300);
  const saturation = useState<number>('shader-saturation', () => 1);
  const brightness = useState<number>('shader-brightness', () => 1);
  const speed = useState<number>('shader-speed', () => 1);
  const isPlaying = useState<boolean>('shader-playing', () => true);

  const registerController = (ctrl: ShaderController) => {
    controller.value = ctrl;
    // Cразу синхронизируем hue/saturation/brightness/speed из контроллера
    const state = ctrl.getState();
    hue.value = state.hue;
    saturation.value = state.saturation;
    brightness.value = state.brightness;
    speed.value = state.speed;
  };

  const pause = () => {
    controller.value?.pause();
    isPlaying.value = false;
  };

  const play = () => {
    controller.value?.play();
    isPlaying.value = true;
  };

  const restart = () => controller.value?.restart();

  const setHue = (h: number) => {
    hue.value = h;
    controller.value?.setHue(h);
  };

  const setSpeed = (s: number) => {
    speed.value = s;
    controller.value?.setSpeed(s);
  };

  const setSaturation = (s: number) => {
    saturation.value = s;
    controller.value?.setSaturation(s);
  };

  const setBrightness = (b: number) => {
    brightness.value = b;
    controller.value?.setBrightness(b);
  };

  return {
    hue,
    saturation,
    brightness,
    speed,
    isPlaying,
    registerController,
    pause,
    play,
    restart,
    setHue,
    setSpeed,
    setSaturation,
    setBrightness,
  };
};
