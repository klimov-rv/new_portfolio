<script setup lang="ts">
const { projects } = useProjects()
</script>

<template>
  <div class="relative min-h-screen">
    <!-- Silk animated background (effect 1) - infinite animation -->
    <div class="fixed inset-0 z-0 pointer-events-none">
      <ClientOnly>
        <UiSilkBackground :hue="220" :saturation="0.3" :brightness="0.55" :speed="0.5" />
      </ClientOnly>
    </div>

    <!-- Dark overlay -->
    <div class="fixed inset-0 z-0 bg-black/65 pointer-events-none" />

    <!-- Content -->
    <div class="relative z-10 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <!-- Hero -->
      <div class="text-center mb-16 space-y-2">
        <p class="font-mono text-white/30 text-xs uppercase tracking-[0.4em]">Frontend Developer · 2015–2026</p>
        <p class="font-mono text-white/15 text-xs uppercase tracking-[0.6em]">Selected Works</p>
      </div>

      <!-- Projects grid -->
      <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
        <ProjectCard
          v-for="(project, i) in projects"
          :key="project.id"
          :project="project"
          :index="i"
        />
      </div>
    </div>
  </div>
</template>
