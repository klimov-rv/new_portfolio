import { fileURLToPath } from 'url';

export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  ssr: false, // SPA mode - avoids WebGL/OGL SSR issues
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  alias: {
    '@': fileURLToPath(new URL('./', import.meta.url)),
    '~': fileURLToPath(new URL('./app', import.meta.url)),
    components: fileURLToPath(new URL('./app/components', import.meta.url)),
  },
  vite: {
    optimizeDeps: {
      include: ['ogl', 'motion-v', '@vueuse/core'],
    },
  },
});
