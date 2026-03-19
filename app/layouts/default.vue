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
          <NuxtLink to="/" class="logo-text">
            klimovproject<span class="dash">_</span>
          </NuxtLink>
          <span
            class="hidden sm:block font-mono uppercase tracking-widest text-xs text-white/60"
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
              <!-- <svg width="18" height="18" viewBox="0 0 24 24"><use xlink:href="#outsideLink2"></use></svg> -->

              <!-- <div class="organize-svg">
                <svg width="18" height="18" viewBox="0 0 172 172">
                  <g
                    id="outsideLink"
                    stroke="none"
                    stroke-width="1"
                    stroke-linecap="butt"
                    stroke-linejoin="miter"
                    stroke-miterlimit="10"
                    stroke-dashoffset="0"
                    font-family="none"
                    font-weight="none"
                    font-size="none"
                    text-anchor="none"
                    style="mix-blend-mode: normal;"
                  >
                    <path d="M0 172V0h172v172z" fill="none"></path>
                    <g fill="#eee">
                      <path
                        d="M143.193 21.43a7.168 7.168 0 0 0-.797.07H107.5a7.167 7.167 0 1 0 0 14.333h18.533l-66.6 66.6a7.167 7.167 0 1 0 10.134 10.134l66.6-66.6V64.5a7.167 7.167 0 1 0 14.333 0V29.577a7.167 7.167 0 0 0-7.307-8.147zm-107.36.07C28 21.5 21.5 28 21.5 35.833v100.334C21.5 144 28 150.5 35.833 150.5h100.334c7.833 0 14.333-6.5 14.333-14.333v-43a7.167 7.167 0 1 0-14.333 0v43H35.833V35.833h43a7.167 7.167 0 1 0 0-14.333z"
                      ></path>
                    </g>
                  </g>
                </svg>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    id="outsideLink2"
                    vector-effect="non-scaling-stroke"
                    d="M18.25 15.5a.75.75 0 0 0 .75-.75v-9a.75.75 0 0 0-.75-.75h-9a.75.75 0 0 0 0 1.5h7.19L6.22 16.72a.75.75 0 1 0 1.06 1.06L17.5 7.56v7.19c0 .414.336.75.75.75z"
                  ></path>
                </svg>
                <svg width="15" height="15">
                  <path
                    id="soc_tg"
                    d="M25.154 3.984a2.718 2.718 0 0 0-.894.217c-.25.1-1.204.51-2.707 1.154-1.505.646-3.497 1.5-5.621 2.415-4.25 1.827-9.028 3.884-11.475 4.937-.092.04-.413.142-.754.408-.34.266-.703.818-.703 1.432 0 .495.236.987.533 1.281.297.294.612.44.881.549l4.58 1.873c.202.617 1.298 3.973 1.553 4.795.168.543.327.883.535 1.152.104.135.225.253.371.346.059.037.123.066.188.092l.004.002c.014.006.027.016.043.021.028.01.047.011.085.02.153.049.307.08.444.08.585 0 .943-.322.943-.322l.022-.016 3.01-2.604 3.65 3.454c.051.072.53.73 1.588.73.627 0 1.125-.315 1.445-.65.32-.336.519-.688.604-1.131v-.002c.079-.419 3.443-17.69 3.443-17.69l-.006.024c.098-.45.124-.868.016-1.281a1.748 1.748 0 0 0-.75-1.022 1.798 1.798 0 0 0-1.028-.264zm-.187 2.09c-.005.03.003.015-.004.049l-.002.012-.002.011s-3.323 17.05-3.445 17.7c.009-.05-.032.048-.075.107-.06-.04-.181-.094-.181-.094l-.02-.021-4.986-4.717-3.525 3.047 1.048-4.2s6.557-6.786 6.952-7.18c.318-.317.384-.427.384-.536 0-.146-.076-.252-.246-.252-.153 0-.359.149-.469.219-1.433.913-7.724 4.58-10.544 6.22-.449-.183-3.562-1.458-4.618-1.888l.014-.006 11.473-4.938 5.62-2.414c1.48-.634 2.51-1.071 2.626-1.119z"
                  ></path>
                </svg>
              </div> -->
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

      <!-- Filter overlay  -->
      <UiFilterOverlay />

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
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    'Liberation Mono', 'Courier New', monospace;
  font-size: 14px;
  font-weight: bold;
  .dash {
    color: #21b3a9;
  }
}
</style>
