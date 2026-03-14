<script setup lang="ts">
interface Props {
  size?: number;
  displace?: number;
  border?: number;
  lightness?: number;
  blend?: string;
  xChannel?: 'R' | 'G' | 'B';
  yChannel?: 'R' | 'G' | 'B';
  alpha?: number;
  blur?: number;
  rOffset?: number;
  gOffset?: number;
  bOffset?: number;
  scale?: number;
  frost?: number;
}

const props = withDefaults(defineProps<Props>(), {
  size: 40,
  displace: 2.5,
  border: 0.1,
  lightness: 60,
  blend: 'screen',
  xChannel: 'R',
  yChannel: 'B',
  alpha: 0.7,
  blur: 5,
  rOffset: 0,
  gOffset: 5,
  bOffset: 10,
  scale: -30,
  frost: 0.1,
});

const filterId = `displacementFilter_${Math.random()
  .toString(36)
  .substr(2, 9)}`;
const liquidGlassRoot = ref<HTMLElement | null>(null);
const dimensions = reactive({
  width: props.size,
  height: props.size,
});

// Для маленького размера не нужен ResizeObserver
// Используем фиксированные размеры

const baseStyle = computed(() => {
  return {
    '--frost': props.frost,
    'border-radius': '50%', // Всегда круг для курсора
    width: `${props.size}px`,
    height: `${props.size}px`,
  };
});

// Computed displacement image с учетом малого размера
const displacementImage = computed(() => {
  const border = props.size * (props.border * 0.5);

  return `
    <svg viewBox="0 0 ${props.size} ${
    props.size
  }" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="red" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#0000"/>
          <stop offset="100%" stop-color="red"/>
        </linearGradient>
        <linearGradient id="green" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#0000"/>
          <stop offset="100%" stop-color="lime"/>
        </linearGradient>
        <linearGradient id="blue" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0000"/>
          <stop offset="100%" stop-color="blue"/>
        </linearGradient>
        <radialGradient id="radial" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="white"/>
          <stop offset="100%" stop-color="black"/>
        </radialGradient>
      </defs>
      
      <!-- Базовый черный фон -->
      <rect width="${props.size}" height="${props.size}" fill="black"/>
      
      <!-- Красный канал (горизонтальное смещение) -->
      <circle cx="${props.size / 2}" cy="${props.size / 2}" r="${
    props.size / 2 - border
  }" fill="url(#red)"/>
      
      <!-- Зеленый канал (диагональное смещение) -->
      <circle cx="${props.size / 2}" cy="${props.size / 2}" r="${
    props.size / 2 - border
  }" fill="url(#green)"/>
      
      <!-- Синий канал (вертикальное смещение) -->
      <circle cx="${props.size / 2}" cy="${props.size / 2}" r="${
    props.size / 2 - border
  }" fill="url(#blue)"/>
      
      <!-- Основной слой с размытием для эффекта стекла -->
      <circle 
        cx="${props.size / 2}" 
        cy="${props.size / 2}" 
        r="${props.size / 2 - border * 2}" 
        fill="hsl(0 0% ${props.lightness}% / ${props.alpha})" 
        style="filter:blur(${props.blur}px)" 
      />
    </svg>
  `;
});

// Data URI для SVG фильтра
const displacementDataUri = computed(() => {
  const encoded = encodeURIComponent(displacementImage.value);
  return `data:image/svg+xml,${encoded}`;
});

// Масштабируем displace для маленького размера
const displaceValue = computed(() => props.displace);
</script>

<template>
  <div ref="liquidGlassRoot" class="liquid-glass-cursor" :style="baseStyle">
    <svg class="filter" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter
          :id="filterId"
          color-interpolation-filters="sRGB"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <!-- Карта смещения -->
          <feImage
            x="0"
            y="0"
            width="100%"
            height="100%"
            :href="displacementDataUri"
            result="map"
          />

          <!-- Красный канал смещения -->
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            :xChannelSelector="xChannel"
            :yChannelSelector="yChannel"
            :scale="scale + rOffset"
            result="dispRed"
          />

          <!-- Зеленый канал смещения -->
          <feDisplacementMap
            in="dispRed"
            in2="map"
            :xChannelSelector="xChannel"
            :yChannelSelector="yChannel"
            :scale="scale + gOffset"
            result="dispGreen"
          />

          <!-- Синий канал смещения -->
          <feDisplacementMap
            in="dispGreen"
            in2="map"
            :xChannelSelector="xChannel"
            :yChannelSelector="yChannel"
            :scale="scale + bOffset"
            result="dispBlue"
          />

          <!-- Финальное размытие для эффекта стекла -->
          <feGaussianBlur
            in="dispBlue"
            :stdDeviation="displaceValue"
            result="output"
          />

          <!-- Смешиваем с оригиналом для сохранения яркости -->
          <feComposite
            in="output"
            in2="SourceGraphic"
            operator="arithmetic"
            k1="0.7"
            k2="0.3"
            k3="0"
            k4="0"
          />
        </filter>
      </defs>
    </svg>

    <!-- Слот для контента, если нужен -->
    <div class="liquid-glass-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.liquid-glass-cursor {
  position: relative;
  display: block;
  border-radius: 50%;
  backdrop-filter: url(#displacementFilter);
  -webkit-backdrop-filter: url(#displacementFilter);
  background: light-dark(
    hsl(0 0% 100% / var(--frost, 0.1)),
    hsl(0 0% 0% / var(--frost, 0.1))
  );
  box-shadow: 0 0 2px 1px rgba(255, 255, 255, 0.3) inset,
    0 0 5px 2px rgba(0, 0, 0, 0.1) inset, 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.filter {
  position: absolute;
  inset: -50%;
  width: 200%;
  height: 200%;
  pointer-events: none;
  opacity: 0; /* Скрываем SVG, но фильтр работает */
}

.liquid-glass-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
