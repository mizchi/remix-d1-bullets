# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Development

Put `.dev.vars`

```sh
cp .dev.vars.example .dev.vars
pnpm dev
```

## Deployment

```bash
$ pnpm wrangler secret put GOOGLE_AUTH_CLIENT_ID
$ pnpm wrangler secret put GOOGLE_AUTH_CLIENT_SECRET
```
