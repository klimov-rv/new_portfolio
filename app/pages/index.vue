<script setup lang="ts">
const { projects } = useProjects();
</script>

<template>
  <div class="relative min-h-screen">
    <div class="relative z-10 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 space-y-2">
        <p class="font-mono text-white/50 text-xs uppercase tracking-[0.4em]">
          Frontend Developer · 2015–2026
        </p>
        <p class="font-mono text-white/30 text-xs uppercase tracking-[0.6em]">
          Selected Works
        </p>
      </div>

      <!-- Projects grid -->
      <div
        class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10"
      >
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
