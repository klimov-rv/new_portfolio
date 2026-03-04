import { InspiraShaderToy } from '~/components/ui/InspiraShaderToy';
import { useShaderState } from './useShaderState';
import type { UseShaderToyOptions } from '~/types/shader';
import isWebGLSupported from '~/utils/webgl';

export function useShaderToy(
  containerRef: Ref<HTMLElement | null>,
  options: UseShaderToyOptions,
) {
  const shaderState = useShaderState();
  let shader: InspiraShaderToy | undefined;

  onMounted(() => {
    if (!containerRef.value || !isWebGLSupported()) return;

    try {
      shader = new InspiraShaderToy(containerRef.value, options.mouseMode);

      if (!shader.setShader({ source: options.shaderCode })) {
        throw new Error('Shader compilation failed');
      }

      // Применяем начальные параметры (приоритет у переданных options)
      shader.setHSV({
        hue: shaderState.hue.value ?? options.hue,
        saturation: options.saturation ?? 1,
        brightness: options.brightness ?? 1,
      });
      shader.setSpeed(shaderState.speed.value ?? options.speed);

      // Регистрируем контроллер
      shaderState.registerController({
        pause: () => shader?.pause(),
        play: () => shader?.play(),
        restart: () => shader?.reset(),
        setHue: (h) => shader?.setHue(h),
        setSaturation: (s) => shader?.setSaturation(s),
        setBrightness: (b) => shader?.setBrightness(b),
        setSpeed: (s) => shader?.setSpeed(s),
        getState: () => ({
          hue: shader?.getHSV().hue ?? 0,
          saturation: shader?.getHSV().saturation ?? 1,
          brightness: shader?.getHSV().brightness ?? 1,
          speed: shader?.getSpeed() ?? 1,
          isPlaying: shader?.isPlayingState() ?? false,
        }),
      });

      // Запускаем анимацию
      shader.play();
      shaderState.isPlaying.value = true;
    } catch (e) {
      console.warn('ShaderToy error:', e);
    }
  });

  onUnmounted(() => {
    shader?.dispose();
  });

  return {
    pause: () => shader?.pause(),
    play: () => shader?.play(),
    getShader: () => shader,
  };
}
