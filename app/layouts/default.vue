<script setup lang="ts"></script>

<template>
  <div class="min-h-screen bg-black text-white overflow-hidden">
    <!-- Liquid Glass Navigation (effect 3) -->
    <header
      class="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl"
    >
      <UiLiquidGlass
        :radius="999"
        :blur="14"
        :scale="-160"
        :frost="0.08"
        container-class="w-full"
        class="px-6 py-3"
      >
        <nav class="flex items-center justify-between">
          <!-- Logo with TextGlitch effect (effect 2) -->
          <NuxtLink to="/" class="block">
            <UiTextGlitch
              text="klimovproject_"
              :speed="0.4"
              :enable-on-hover="true"
              :enable-shadows="true"
              class="!text-sm !font-bold !font-mono !text-white"
            />
          </NuxtLink>
          <span
            class="font-mono uppercase tracking-widest text-xs text-white/60"
          >
            Portfolio
          </span>
          <div class="flex items-center gap-6">
            <a
              href="https://klimov.mssg.me/"
              class="font-mono text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Связаться →
            </a>
          </div>
        </nav>
      </UiLiquidGlass>
    </header>

    <!-- Main content -->
    <main>
      <!-- Silk animated background (effect 1) - infinite animation -->
      <div class="fixed z-0">
        <ClientOnly>
          <UiSilkBackground
            :hue="50"
            :saturation="0"
            :brightness="0.7"
            :speed="0.3"
          />
        </ClientOnly>
      </div>

      <!-- Dark overlay bg-black/35 -->
      <div class="filter-overlay fixed inset-0 z-0 pointer-events-none" />

      <slot />
    </main>

    <!-- Footer -->
    <footer
      class="relative z-10 text-center py-8 text-white/20 text-xs font-mono border-t border-white/5"
    >
      ©{{ new Date().getFullYear() }} by
      <a
        href="https://t.me/klimovrv"
        target="_blank"
        class="hover:text-white/60 transition-colors"
        >@klimovrv</a
      >
    </footer>

    <!-- Smooth Cursor (effect 5) - desktop only -->
    <ClientOnly>
      <UiSmoothCursor />
    </ClientOnly>
  </div>
  <ShaderControls />
</template>
<style>
.overflow-hidden {
  overflow: hidden;
  position: relative;
}
.filter-overlay {
  /* background: linear-gradient(45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab) 0 0 /
    500% 1500%; */
  background: black;
  animation: 35s infinite gradientBG;
  opacity: 0.7;
  filter: contrast(0.1) brightness(0.1);
}

@keyframes gradientBG {
  0% {
    background-position: 0%;
  }

  50% {
    background-position: 100%;
  }

  to {
    background-position: 0%;
  }
}
</style>
