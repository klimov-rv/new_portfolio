import { defineContentConfig, defineCollection } from '@nuxt/content';
import { resolve } from 'path';

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: 'page',
      source: {
        cwd: resolve(__dirname, 'data/content/pages'),
        include: '**/*.md',
      },
    }),
  },
});
