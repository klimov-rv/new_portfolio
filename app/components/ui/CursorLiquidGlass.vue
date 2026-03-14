<script setup lang="ts">
interface Props {
  size?: number;
  radius?: number;
  blend?: string;
  border?: number;
  lightness?: number;
  xChannel?: 'R' | 'G' | 'B';
  yChannel?: 'R' | 'G' | 'B';
  blur?: number;
  alpha?: number;
  rOffset?: number;
  gOffset?: number;
  bOffset?: number;
  scale?: number;
  displace?: number;
}

const props = withDefaults(defineProps<Props>(), {
  size: 5,
  radius: 1,
  blend: 'difference',
  border: 1,
  lightness: 30,
  xChannel: 'R',
  yChannel: 'B',
  blur: 1,
  alpha: 50.33,
  rOffset: 55,
  gOffset: 35,
  bOffset: 15,
  scale: 1,
  displace: 1.3,
});

const dimensions = reactive({
  width: props.size,
  height: props.size,
});

const displacementImage = computed(() => {
  const border =
    Math.min(dimensions.width, dimensions.height) * (props.border * 0.5);
  const yBorder =
    Math.min(dimensions.width, dimensions.height) * (props.border * 0.5);
  return `
    <svg viewBox="0 0 ${dimensions.width} ${
    dimensions.height
  }" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="red" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#0000"/>
          <stop offset="100%" stop-color="red"/>
        </linearGradient>
        <linearGradient id="blue" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0000"/>
          <stop offset="100%" stop-color="blue"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="${dimensions.width}" height="${
    dimensions.height
  }" fill="black"></rect>
      <rect x="0" y="0" width="${dimensions.width}" height="${
    dimensions.height
  }" rx="${props.radius}" fill="url(#red)" />
      <rect x="0" y="0" width="${dimensions.width}" height="${
    dimensions.height
  }" rx="${props.radius}" fill="url(#blue)" style="mix-blend-mode: ${
    props.blend
  }" />
      <rect 
        x="${border}" 
        y="${yBorder}" 
        width="${dimensions.width - border * 2}" 
        height="${dimensions.height - border * 2}" 
        rx="${props.radius}" 
        fill="hsl(0 0% ${props.lightness}% / ${props.alpha})" 
        style="filter:blur(${props.blur}px)" 
      />
    </svg>
  `;
});

const displacementDataUri = computed(() => {
  return `data:image/svg+xml,${encodeURIComponent(displacementImage.value)}`;
});
</script>

<template>
  <div
    class="liquid-glass-cursor"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
    }"
  >
    <svg class="filter-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter
          id="cursorFilterGlass"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feImage
            x="0"
            y="0"
            width="100%"
            height="100%"
            :href="displacementDataUri"
            result="displacementMap"
          />
          <feDisplacementMap
            id="redchannel"
            in="SourceGraphic"
            in2="displacementMap"
            :xChannelSelector="xChannel"
            :yChannelSelector="yChannel"
            :scale="scale + rOffset"
            result="dispRed"
          />
          <feColorMatrix
            in="dispRed"
            type="matrix"
            values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
            result="red"
          />
          <feDisplacementMap
            id="greenchannel"
            in="SourceGraphic"
            in2="displacementMap"
            :xChannelSelector="xChannel"
            :yChannelSelector="yChannel"
            :scale="scale + gOffset"
            result="dispGreen"
          />
          <feColorMatrix
            in="dispGreen"
            type="matrix"
            values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0"
            result="green"
          />
          <feDisplacementMap
            id="bluechannel"
            in="SourceGraphic"
            in2="displacementMap"
            :xChannelSelector="xChannel"
            :yChannelSelector="yChannel"
            :scale="scale + bOffset"
            result="dispBlue"
          />
          <feColorMatrix
            in="dispBlue"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0"
            result="blue"
          />
          <feBlend in="red" in2="green" mode="screen" result="rg" />
          <feBlend in="rg" in2="blue" mode="screen" result="output" />
          <feGaussianBlur :stdDeviation="displace" />
        </filter>
      </defs>
    </svg>
  </div>
</template>

<style scoped>
.liquid-glass-cursor {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
  backdrop-filter: url(#cursorFilterGlass);
  -webkit-backdrop-filter: url(#cursorFilterGlass);
  transform: translate(-50%, -50%);
}

.filter-svg {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}
</style>
