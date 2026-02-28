<script setup lang="ts">
const props = defineProps<{ currentId: string }>()
const { projects } = useProjects()

const currentIndex = computed(() => projects.findIndex(p => p.id === props.currentId))
const prevProject = computed(() => currentIndex.value > 0 ? projects[currentIndex.value - 1] : null)
const nextProject = computed(() => currentIndex.value < projects.length - 1 ? projects[currentIndex.value + 1] : null)
</script>

<template>
  <div class="border-t border-white/10 pt-8 flex justify-between items-center gap-4">
    <NuxtLink
      v-if="prevProject"
      :to="`/project/${prevProject.id}`"
      class="group flex items-center gap-3 text-white/40 hover:text-white transition-colors"
    >
      <span class="group-hover:-translate-x-1 transition-transform text-lg">←</span>
      <div>
        <div class="font-mono text-xs uppercase tracking-widest mb-1">Предыдущий</div>
        <div class="text-sm font-medium">{{ prevProject.title }}</div>
      </div>
    </NuxtLink>
    <div v-else />

    <NuxtLink
      v-if="nextProject"
      :to="`/project/${nextProject.id}`"
      class="group flex items-center gap-3 text-white/40 hover:text-white transition-colors text-right"
    >
      <div>
        <div class="font-mono text-xs uppercase tracking-widest mb-1">Следующий</div>
        <div class="text-sm font-medium">{{ nextProject.title }}</div>
      </div>
      <span class="group-hover:translate-x-1 transition-transform text-lg">→</span>
    </NuxtLink>
    <div v-else />
  </div>
</template>
