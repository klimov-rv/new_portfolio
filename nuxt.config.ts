// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  compatibilityDate: "2025-01-01",
  devtools: { enabled: true },
  ssr: false, // SPA mode - avoids WebGL/OGL SSR issues
  modules: ["@nuxt/ui"],
  css: ["~/assets/css/main.css"],
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  vite: {
    optimizeDeps: {
      include: ["ogl", "motion-v", "@vueuse/core"],
    },
  },
})
