<script setup lang="ts">
import type { Project } from '~/composables/useProjects'
import { CardBody, CardContainer, CardItem } from '~/components/inspira/ui/card-3d'

const props = defineProps<{
  project: Project
  index: number
}>()

const router = useRouter()
const openProject = () => router.push(`/project/${props.project.id}`)

const cardStyle = computed(() => ({
  animationDelay: `${props.index * 80}ms`,
}))

// Настройки анимации для каждого элемента
const titleTransform = {
  translateX: 0,
  translateY: 0,
  translateZ: 50,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0
}

const subtitleTransform = {
  translateX: 0,
  translateY: 0,
  translateZ: 40,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0
}

const yearTransform = {
  translateX: 0,
  translateY: 0,
  translateZ: 30,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0
}

const hoverTransform = {
  translateX: 0,
  translateY: 0,
  translateZ: 70,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0
}
</script>

<template>
  <div
    class="cursor-pointer animate-fade-in-up"
    :style="cardStyle"
    @click="openProject"
  >
    <!-- Year + subtitle label (вне 3D карточки) -->
    <div class="mb-2 flex items-baseline gap-3 px-1">
      <CardContainer class="!p-0 !bg-transparent" :class="{ 'animate-delay': index }">
        <CardItem v-bind="yearTransform" class="font-mono text-white/30 text-xs tabular-nums">
          {{ project.year }}
        </CardItem>
      </CardContainer>
      <CardContainer class="!p-0 !bg-transparent">
        <CardItem v-bind="subtitleTransform" class="font-mono text-white/50 text-xs truncate uppercase tracking-wider">
          {{ project.subtitle }}
        </CardItem>
      </CardContainer>
    </div>

    <!-- 3D Card с изображением -->
    <CardContainer>
      <CardBody class="group/card relative w-full aspect-[4/3] rounded-xl border-0 bg-transparent p-0">
        <!-- Direction Aware Hover внутри 3D карточки -->
        <CardItem v-bind="hoverTransform" class="w-full h-full">
          <UiDirectionAwareHover
            :image-url="project.preview"
            class="!w-full !h-full !rounded-xl"
          >
            <div class="flex flex-col gap-0.5">
              <span class="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">детали →</span>
              <CardItem v-bind="titleTransform" class="font-semibold text-white text-sm leading-snug !bg-transparent !p-0">
                {{ project.title }}
              </CardItem>
            </div>
          </UiDirectionAwareHover>
        </CardItem>
      </CardBody>
    </CardContainer>
  </div>
</template>

<style scoped>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out both;
}

/* Опционально: кастомные стили для CardContainer если нужно переопределить */
:deep(.card-container) {
  transition: all 0.2s ease-out;
}

/* Для последовательной анимации при загрузке */
.animate-delay {
  animation-delay: v-bind('props.index * 80 + "ms"');
}
</style>