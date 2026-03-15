<script setup lang="ts">
const route = useRoute();
const { getProject } = useProjects();

const project = computed(() => getProject(route.params.id as string));

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found' });
}

const isVideoPlaying = ref(false);
const videoRef = ref<HTMLVideoElement | null>(null);

const toggleVideo = () => {
  if (!videoRef.value) return;
  if (isVideoPlaying.value) {
    videoRef.value.pause();
    isVideoPlaying.value = false;
  } else {
    videoRef.value.play();
    isVideoPlaying.value = true;
  }
};

useSeoMeta({
  title: () => `${project.value?.title} — KlimovProject`,
});
</script>

<template>
  <div v-if="project" class="relative min-h-screen">
    <div class="fixed inset-0 z-0 bg-black/78 pointer-events-none" />

    <div class="relative z-10 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-5xl mx-auto">
        <!-- Back button -->
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 font-mono text-xs text-white/30 hover:text-white/70 transition-colors mb-12 group"
        >
          <span
            class="group-hover:-translate-x-1 transition-transform inline-block"
            >←</span
          >
          <span>Все проекты</span>
        </NuxtLink>

        <!-- Project header -->
        <div class="mb-10 animate-slide-in">
          <div class="flex items-center gap-4 mb-4">
            <span class="font-mono text-white/25 text-xs">{{
              project.year
            }}</span>
            <span
              class="font-mono text-white/25 text-xs uppercase tracking-widest"
              >{{ project.type }}</span
            >
          </div>
          <h1
            class="text-3xl sm:text-5xl font-bold text-white leading-tight mb-5"
          >
            {{ project.title }}
          </h1>
          <p class="text-white/55 text-lg max-w-2xl leading-relaxed">
            {{ project.description }}
          </p>
        </div>

        <!-- Preview / Video block -->
        <div
          class="relative rounded-2xl overflow-hidden mb-14 bg-black/30 aspect-video animate-slide-in"
          style="animation-delay: 100ms;"
        >
          <template v-if="project.video">
            <video
              ref="videoRef"
              :src="project.video"
              :poster="project.video_preview || project.preview"
              class="w-full h-full object-cover"
              loop
              muted
              playsinline
              @ended="isVideoPlaying = false"
            />
            <Transition name="fade">
              <button
                v-show="!isVideoPlaying"
                class="absolute inset-0 flex items-center justify-center"
                @click="toggleVideo"
              >
                <div
                  class="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all hover:scale-110 hover:bg-white/20"
                >
                  <svg
                    class="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </button>
            </Transition>
            <button
              v-if="isVideoPlaying"
              class="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
              @click="toggleVideo"
            >
              <svg
                class="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            </button>
          </template>

          <template v-else>
            <img
              :src="project.preview"
              :alt="project.title"
              class="w-full h-full object-cover"
            />
          </template>
        </div>

        <!-- Project details grid -->
        <div
          class="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-14 animate-slide-in"
          style="animation-delay: 200ms;"
        >
          <!-- Main description -->
          <div class="lg:col-span-2">
            <h2
              class="font-mono text-xs uppercase tracking-widest text-white/30 mb-5"
            >
              О проекте
            </h2>
            <p class="text-white/75 leading-relaxed text-base">
              {{ project.details }}
            </p>
          </div>

          <!-- Sidebar -->
          <div class="space-y-8">
            <div>
              <h3
                class="font-mono text-xs uppercase tracking-widest text-white/30 mb-4"
              >
                Технологии
              </h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in project.tags"
                  :key="tag"
                  class="font-mono text-xs px-3 py-1.5 rounded-full bg-white/8 text-white/60 border border-white/10 hover:border-white/25 transition-colors"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <div v-if="project.links?.length">
              <h3
                class="font-mono text-xs uppercase tracking-widest text-white/30 mb-4"
              >
                Ссылки
              </h3>
              <div class="space-y-2">
                <a
                  v-for="link in project.links"
                  :key="link.label"
                  :href="link.url"
                  target="_blank"
                  class="flex items-center gap-2 font-mono text-sm text-white/50 hover:text-white transition-colors group"
                >
                  <span
                    class="group-hover:translate-x-1 transition-transform inline-block"
                    >→</span
                  >
                  {{ link.label }}
                </a>
              </div>
            </div>

            <div>
              <h3
                class="font-mono text-xs uppercase tracking-widest text-white/30 mb-2"
              >
                Тип работы
              </h3>
              <p class="text-white/60 text-sm">{{ project.type }}</p>
            </div>
          </div>
        </div>

        <!-- Navigation between projects -->
        <ProjectNav :current-id="project.id" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in {
  animation: slide-in 0.5s ease-out both;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
