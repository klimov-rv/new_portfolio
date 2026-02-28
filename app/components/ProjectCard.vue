<script setup lang="ts">
import type { Project } from '~/composables/useProjects'

const props = defineProps<{
  project: Project
  index: number
}>()

const router = useRouter()
const openProject = () => router.push(`/project/${props.project.id}`)

const cardStyle = computed(() => ({
  animationDelay: `${props.index * 80}ms`,
}))
</script>

<template>
  <div
    class="group cursor-pointer animate-fade-in-up"
    :style="cardStyle"
    @click="openProject"
  >
    <!-- Year + subtitle label -->
    <div class="mb-2 flex items-baseline gap-3 px-1">
      <span class="font-mono text-white/30 text-xs tabular-nums">{{ project.year }}</span>
      <span class="font-mono text-white/50 text-xs truncate uppercase tracking-wider">{{ project.subtitle }}</span>
    </div>

    <!-- Direction Aware Hover card (effect 4) wrapped to override fixed sizes -->
    <div class="relative w-full aspect-[4/3] overflow-hidden rounded-xl">
      <UiDirectionAwareHover
        :image-url="project.preview"
        class="!w-full !h-full !rounded-xl"
      >
        <div class="flex flex-col gap-0.5">
          <span class="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">детали →</span>
          <span class="font-semibold text-white text-sm leading-snug">{{ project.title }}</span>
        </div>
      </UiDirectionAwareHover>
    </div>
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
</style>
