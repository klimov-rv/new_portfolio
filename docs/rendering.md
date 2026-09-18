# Rendering

## Current modes

- `/` is prerendered by `routeRules`.
- `/cv` is prerendered and includes the Nuxt Content document in generated HTML.
- `/project/[id]` is prerendered for every id in the static project catalog.

The project data is a static array in `app/composables/useProjects.ts`. The route list in `nuxt.config.ts` must be updated when a project is added or removed.

## Verification

```bash
npm run generate
npx nuxi analyze
```

Inspect `.output/public/` after generation. The generated `/index.html`, `/cv/index.html`, and `/project/*/index.html` files confirm the current static routes.
