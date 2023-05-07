# Setup

## Steps

- Google OAuth
- Cloudflare
- GitHub Actions
- Local

## Setup Google OAuth

- Enter https://console.cloud.google.com/
- Search "APIs & Service"
- Create "OAuth 2.0 Client IDs"

and fullfill forms.

### Authorized JavaScript origins

http://localhost:8788 and `your-deploy-url`

### Authorized redirect URIs

http://localhost:8788/auth/google/callback and `your-deploy-url/auth/google/callback`

## Setup cloudflare project

Now `wrangler pages publish ...` does not read `wrangler.toml` bindings. So you should put values on cloudflare pages dashboard by hand.

### Create a project

If you does not create project, create at first.

https://dash.cloudflare.com > Pages > Create a Project

### Setting environments and bindings

https://dash.cloudflare.com > Pages > `ProjectName` > Settings > Environment variables

Fullfil production values like `.dev.vars`

```
GOOGLE_AUTH_CALLBACK_URL="..."
GOOGLE_AUTH_CLIENT_ID="..."
GOOGLE_AUTH_CLIENT_SECRET="..."
SESSION_SECRET="..." # random hash you choice
```

and copy them to local `.dev.vars`

### KV bindings

KV for session storage.

```
$ pnpm wrangler kv:namespace create session-kv
$ pnpm wrangler kv:namespace create session-kv-preview --preview
```

https://dash.cloudflare.com > Pages > `ProjectName` > Settings > Functions > KV namespace bindings

```
SESSION_KV=<your-created-kv>
```

and put to `wrangler toml` for local dev.

```toml
kv_namespaces = [
  {binding = "SESSION_KV", id = "...", preview_id = "..." }
]
```

### D1 database bindings

https://dash.cloudflare.com > Pages > `ProjectName` > Settings > Functions > D1

```bash
$ pnpm wrangler d1 create mydb
```

```
DB=mydb
```

and put it to `wrangler.toml` for local dev.

```toml
[[ d1_databases ]]
binding = "DB"
database_name = "mydb"
database_id = "mydb-id"
```

## GitHub Actions

Generate cloudflare token to GitHub Actions Secrets with pages publish permission.

```
CLOUDFLARE_API_TOKEN=...
```

## Setup local

```bash
$ pnpm install
$ cp .dev.vars.example .dev.vars
```

`wrangler.toml` for local bindings

```toml
compatibility_date = "2023-04-30"
compatibility_flags = ["streams_enable_constructors"]

kv_namespaces = [
  {binding = "SESSION_KV", id = "...", preview_id = "..." }
]

[[ d1_databases ]]
binding = "DB"
database_name = "mydb"
database_id = "mydb-id"
```

`.dev.vars` for local dev

```
GOOGLE_AUTH_CALLBACK_URL="..."
GOOGLE_AUTH_CLIENT_ID="..."
GOOGLE_AUTH_CLIENT_SECRET="..."
SESSION_SECRET="..." # random hash you choice
```

Run first migration.

```bash
# Check app/schema.ts and migrations/0000_conscious_ironclad.sql
# If you want to use your schema, fix src/schema.ts and remove migrations/*.

$ pnpm gen:migrate
$ pnpm wrangler d1 migrations apply mydb --local
```
