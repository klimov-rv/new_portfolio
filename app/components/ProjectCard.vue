<script setup lang="ts">
import type { Project } from '~/composables/useProjects';

const props = defineProps<{
  project: Project;
  index: number;
}>();

const router = useRouter();
const openProject = () => router.push(`/project/${props.project.id}`);

const cardStyle = computed(() => ({
  animationDelay: `${props.index * 80}ms`,
}));

// Настройки анимации для каждого элемента
const titleTransform = {
  translateX: 0,
  translateY: 0,
  translateZ: 90,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
};

const yearTransform = {
  translateX: 0,
  translateY: 0,
  translateZ: 70,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
};

const hoverTransform = {
  translateX: 0,
  translateY: 0,
  translateZ: 70,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
};
</script>

<template>
  <div
    class="project-card animate-fade-in-up"
    :style="cardStyle"
    @click="openProject"
  >
    <!-- 3D Card с изображением -->
    <FeatCardContainer>
      <FeatCardBody
        class="group/card relative w-full aspect-[4/3] rounded-xl border-0 bg-transparent p-0"
      >
        <!-- Year + subtitle label   -->
        <FeatCardBody
          class="mb-2 flex items-baseline gap-3 px-1"
          v-bind="hoverTransform"
        >
          <FeatCardItem
            v-bind="yearTransform"
            class="project-card__year font-mono text-white/30 text-xs tabular-nums"
          >
            {{ project.year }}
          </FeatCardItem>
          <FeatCardItem
            v-bind="titleTransform"
            class="project-card__subtitle font-mono text-white/50 text-xs truncate uppercase tracking-wider"
          >
            {{ project.subtitle }}
          </FeatCardItem>
        </FeatCardBody>

        <!-- Direction Aware Hover внутри 3D карточки -->
        <FeatCardItem v-bind="hoverTransform" class="w-full h-full">
          <UiDirectionAwareHover
            :image-url="project.preview"
            class="!w-full !h-full !rounded-xl"
          >
          </UiDirectionAwareHover>
        </FeatCardItem>
      </FeatCardBody>
    </FeatCardContainer>
  </div>
</template>

<style scoped lang="scss">
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out both;
}

/* Опционально: кастомные стили для CardContainer если нужно переопределить */
.project-card:hover {
  &:deep(.project-card__subtitle) {
    color: white;
  }
}

/* Для последовательной анимации при загрузке */
.animate-delay {
  animation-delay: v-bind('props.index * 80 + "ms"');
}
</style>
