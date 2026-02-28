<script setup lang="ts">
// ============ ИМПОРТЫ И ТИПЫ ============
import type { HTMLAttributes } from "vue";
import type { MouseMode } from "~/components/ui/InspiraShaderToy";
import { InspiraShaderToy } from "~/components/ui/InspiraShaderToy";

// Интерфейс для настройки шума поверх шейдера
interface NoiseConfig {
  opacity: number;    // Прозрачность шума (0-1)
  scale: number;      // Масштаб текстуры шума
}

// ============ ПРОПСЫ КОМПОНЕНТА ============
interface Props {
  mouseMode?: MouseMode;           // Режим мыши: "click" или "hover"
  class?: HTMLAttributes["class"]; // Дополнительные CSS классы
  shaderCode: string;              // GLSL код шейдера (обязательный)
  hue?: number;                    // Оттенок (0-360)
  saturation?: number;             // Насыщенность (0-1)
  brightness?: number;              // Яркость (0-1)
  speed?: number;                   // Скорость анимации (множитель)
  mouseSensitivity?: number;        // Чувствительность мыши (0.1-5.0)
  damping?: number;                 // Затухание движения мыши (0-0.99)
  noise?: NoiseConfig;              // Настройки шума
}

// Значения по умолчанию для пропсов
const props = withDefaults(defineProps<Props>(), {
  mouseMode: "click",
  hue: 0,
  saturation: 1,
  brightness: 1,
  speed: 1,
  mouseSensitivity: 1,
  damping: 0,
});

// ============ РЕФЕРЕНСЫ И СОСТОЯНИЕ ============
const containerRef = useTemplateRef("containerRef"); // Ссылка на DOM-контейнер
let shader: InspiraShaderToy | undefined;            // Экземпляр шейдера

// Вычисляем размер фона для шума
const backgroundSize = computed(() => `${(props.noise?.scale || 0) * 200}%`);

// ============ ЖИЗНЕННЫЙ ЦИКЛ ============
onMounted(() => {
  if (!containerRef.value) return;

  // Проверка поддержки WebGL
  const testCanvas = document.createElement('canvas');
  const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
  if (!gl) {
    console.warn('WebGL not supported, skipping ShaderToy');
    return;
  }

  // Инициализация шейдера
  try {
    shader = new InspiraShaderToy(containerRef.value, props.mouseMode);
  } catch (e) {
    console.warn('ShaderToy init failed:', e);
    return;
  }

  // Установка шейдера
  const success = shader.setShader({
    source: props.shaderCode,
  });

  if (!success) {
    console.error("Failed to compile shader");
    return;
  }

  // Применение начальных параметров
  shader.setHSV({
    hue: props.hue,
    saturation: props.saturation,
    brightness: props.brightness,
  });

  shader.setSpeed(props.speed);
  shader.setMouseSensitivity(props.mouseSensitivity);
  shader.setMouseDamping(props.damping);

  shader.play(); // Запуск анимации
});

onUnmounted(() => {
  shader?.dispose(); // Очистка ресурсов
});

// ============ НАБЛЮДАТЕЛИ (WATCHERS) ============
// Следят за изменениями пропсов и обновляют шейдер
watch(() => props.hue, (v) => v !== undefined && shader && shader.setHue(v));
watch(() => props.saturation, (v) => v !== undefined && shader && shader.setSaturation(v));
watch(() => props.brightness, (v) => v !== undefined && shader && shader.setBrightness(v));
watch(() => props.speed, (v) => v !== undefined && shader && shader.setSpeed(v));
watch(() => props.mouseSensitivity, (v) => v !== undefined && shader && shader.setMouseSensitivity(v));
watch(() => props.damping, (v) => v !== undefined && shader && shader.setMouseDamping(v));
</script>

<template>
  <!-- ============ ШАБЛОН ============ -->
  <div
    ref="containerRef"
    class="shadertoy-container isolate"
    :class="[props.class]"
  >
    <!-- Слой шума поверх шейдера -->
    <div
      v-if="props.noise && props.noise.opacity > 0"
      :key="props.noise.toString()"
      class="absolute inset-0 z-10 bg-[url(https://framerusercontent.com/images/g0QcWrxr87K0ufOxIUFBakwYA8.png)] bg-repeat"
      :style="{
        backgroundSize,
        backgroundPosition: 'center',
        opacity: props.noise.opacity / 2,
      }"
    />
  </div>
</template>

<style scoped>
/* ============ СТИЛИ ============ */
.shadertoy-container {
  display: block;
  position: relative;
  height: 100%;
  width: 100%;
}

.shadertoy-container canvas {
  display: block;
  max-width: 100%;
  width: 100%;
  height: 100%;
  cursor: pointer;
  z-index: 0;
}
</style>