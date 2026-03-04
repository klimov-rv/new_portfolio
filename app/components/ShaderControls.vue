<script setup lang="ts">
import { useShaderState } from '~/composables/useShaderState';

const shaderState = useShaderState();

const localSpeed = ref(0);
const localHue = ref(0);
const localSaturation = ref(0);
const localBrightness = ref(0);

const locMouseForce = ref(1.0);
const locMouseSize = ref(0.25);

watch(localSpeed, (val) => shaderState.setSpeed(val));
watch(localHue, (val) => shaderState.setHue(val));
watch(localSaturation, (val) => shaderState.setSaturation(val));
watch(localBrightness, (val) => shaderState.setBrightness(val));
watch(locMouseForce, (val) => shaderState.setMouseForce(val));
watch(locMouseSize, (val) => shaderState.setMouseSize(val));

onMounted(() => {
  localSpeed.value = shaderState.speed.value;
  localHue.value = shaderState.hue.value;
  localSaturation.value = shaderState.saturation.value;
  localBrightness.value = shaderState.brightness.value;
});
</script>

<template>
  <div class="fixed top-0 right-0 z-50 bg-black/50 p-4 text-white">
    <div>
      <button
        @click="shaderState.pause()"
        class="px-3 py-1 bg-blue-500 rounded mr-2"
      >
        ⏸️ Пауза
      </button>
      <button
        @click="shaderState.play()"
        class="px-3 py-1 bg-green-500 rounded mr-2"
      >
        ▶️ Старт
      </button>
      <button
        @click="shaderState.restart()"
        class="px-3 py-1 bg-yellow-500 rounded"
      >
        🔄 Сброс
      </button>

      <div class="mt-2">
        <label>Оттенок: {{ localHue }}</label>
        <input
          type="range"
          v-model.number="localHue"
          min="0"
          max="360"
          class="w-full"
        />
      </div>
      <div class="mt-2">
        <label>Интенсивность: {{ localSaturation }}</label>
        <input
          type="range"
          v-model.number="localSaturation"
          min="0"
          max="5"
          step="0.1"
          class="w-full"
        />
      </div>
      <div class="mt-2">
        <label>Яркость: {{ localBrightness }}</label>
        <input
          type="range"
          v-model.number="localBrightness"
          min="0"
          max="5"
          step="0.1"
          class="w-full"
        />
      </div>

      <div class="mt-2">
        <label>Скорость: {{ localSpeed }}</label>
        <input
          type="range"
          v-model.number="localSpeed"
          min="0"
          max="5"
          step="0.1"
          class="w-full"
        />
      </div>

      <div class="mt-2">
        <label>Сила мыши: {{ locMouseForce }}</label>
        <input
          type="range"
          v-model.number="locMouseForce"
          min="0"
          max="2"
          step="0.1"
          class="w-full"
        />
      </div>

      <div class="mt-2">
        <label>Радиус мыши: {{ locMouseSize }}</label>
        <input
          type="range"
          v-model.number="locMouseSize"
          min="0.1"
          max="0.5"
          step="0.01"
          class="w-full"
        />
      </div>
    </div>
  </div>
</template>
