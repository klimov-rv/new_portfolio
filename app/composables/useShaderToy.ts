import type { Ref } from 'vue';
import { onMounted, onUnmounted, watch } from 'vue';
import { InspiraShaderToy, type MouseMode } from '~/components/ui/InspiraShaderToy';
import { isWebGLSupported } from '~/utils/webgl';

// Опции для инициализации шейдера
export interface ShaderToyOptions {
  mouseMode?: MouseMode;
  shaderCode: string; // Обязательный GLSL код
  hue?: number;
  saturation?: number;
  brightness?: number;
  speed?: number;
  mouseSensitivity?: number;
  damping?: number;
}

/**
 * Composable для использования ShaderToy в других компонентах
 * Альтернатива компоненту <ShaderToy /> - используйте если нужна более гибкая интеграция
 *
 * @example
 * const containerRef = ref<HTMLElement>(null)
 * const { pause, play, restart } = useShaderToy(containerRef, {
 *   shaderCode: myGLSL,
 *   hue: 220
 * })
 */
export function useShaderToy(
  containerRef: Ref<HTMLElement | null>,
  options: ShaderToyOptions
) {
  let shader: InspiraShaderToy | undefined;

  onMounted(() => {
    if (!containerRef.value || !isWebGLSupported()) {
      console.warn('ShaderToy: cannot initialize');
      return;
    }

    try {
      shader = new InspiraShaderToy(containerRef.value, options.mouseMode);
    } catch (e) {
      console.warn('ShaderToy: init failed', e);
      return;
    }

    // Загружаем шейдер
    const success = shader.setShader({ source: options.shaderCode });
    if (!success) {
      console.error('ShaderToy: shader compilation failed');
      shader.dispose();
      shader = undefined;
      return;
    }

    // Применяем параметры
    shader.setHSV({
      hue: options.hue ?? 0,
      saturation: options.saturation ?? 1,
      brightness: options.brightness ?? 1,
    });
    if (options.speed !== undefined) shader.setSpeed(options.speed);
    if (options.mouseSensitivity !== undefined) shader.setMouseSensitivity(options.mouseSensitivity);
    if (options.damping !== undefined) shader.setMouseDamping(options.damping);

    shader.play();
  });

  onUnmounted(() => {
    shader?.dispose();
  });

  // Реактивное обновление при изменении options
  watch(() => options.hue, (val) => val !== undefined && shader?.setHue(val));
  watch(() => options.saturation, (val) => val !== undefined && shader?.setSaturation(val));
  watch(() => options.brightness, (val) => val !== undefined && shader?.setBrightness(val));
  watch(() => options.speed, (val) => val !== undefined && shader?.setSpeed(val));
  watch(() => options.mouseSensitivity, (val) => val !== undefined && shader?.setMouseSensitivity(val));
  watch(() => options.damping, (val) => val !== undefined && shader?.setMouseDamping(val));

  return {
    pause: () => shader?.pause(),
    play: () => shader?.play(),
    restart: () => shader?.reset(),
    getShader: () => shader,
  };
}