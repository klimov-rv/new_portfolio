# Contributing

## Branches

- `main` is production.
- `develop` is integration.
- `feature/*` branches start from `develop`.
- `hotfix/*` branches start from `main` and merge back into both branches.

## Commits and pull requests

Use Conventional Commits, for example `feat: add project page` or `fix: correct CV metadata`. Open a pull request into `develop` for normal work and into `main` only for a release or hotfix.

Before opening a pull request:

```bash
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
```

Update the README or relevant docs when scripts, rendering, deployment, or public behavior changes.
