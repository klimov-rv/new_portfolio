<script setup lang="ts"></script>

<template>
  <div class="min-h-screen text-white overflow-hidden">
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
          <NuxtLink to="/" class="logo-text">
            klimovproject<span class="dash">_</span>
          </NuxtLink>
          <span
            class="font-mono uppercase tracking-widest text-xs text-white/60"
          >
            <FeatNavMenu />
          </span>
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

      <!-- Filter overlay  -->
      <!-- <UiFilterOverlay /> -->

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
</template>
<style lang="scss">
.overflow-hidden {
  overflow: hidden;
  position: relative;
}

.logo-text {
  font-family: ui-monospace, 'Courier New', monospace;
  font-size: 14px;
  font-weight: bold;
  .dash {
    color: #21b3a9;
  }
}
</style>
