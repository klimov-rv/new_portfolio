import { fileURLToPath } from 'url';

export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/image'],
  css: ['~/assets/css/main.css'],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  alias: {
    components: fileURLToPath(new URL('./app/components', import.meta.url)),
    shaders: fileURLToPath(new URL('./app/assets/shaders', import.meta.url)),
  },
  vite: {
    optimizeDeps: {
      include: ['ogl', 'motion-v', '@vueuse/core'],
    },
  },
});
