# Deployment

The static site is deployed to GitHub Pages through the repository configured in `scripts/deploy.js`.

## Local deployment

```bash
npm ci
npm run deploy
```

The script generates `.output/public`, copies it into `dist_gh`, preserves the deployment repository metadata, and pushes the generated files to its configured branch. Do not put tokens or credentials in source files; Git credentials are provided by the local GitHub setup or CI secret configuration.

## CI deployment

The deployment workflow runs only after a successful CI workflow on `main`. GitHub Actions should use Node from `.nvmrc`, install with `npm ci`, run lint, typecheck, tests, and `npm run generate`, then execute the deployment script with repository credentials supplied by GitHub Secrets.

## Rollback

Rollback by reverting the production merge on `main` and rerunning the deployment workflow. The generated `dist_gh` branch is an artifact and should not be edited manually.
