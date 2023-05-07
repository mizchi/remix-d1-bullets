# Release

## How migration works

TBD

## GitHub Release Flow

```bash
# edit app/schema.ts
$ pnpm gen:migrate
$ pnpm wrangler d1 migrations apply mydb --local
$ git add app/schema.ts
$ git commit -m "xxx"
# PR to release/xxx branch
# $ git push origin main:release/$(date +%s)
```

When PR merged, run `.github/workflows/release.yml`

## Release from local

```bash
$ pnpm wrangler d1 migrations apply mydb
$ pnpm build:prod
$ pnpm wrangler pages publish ./public
```

