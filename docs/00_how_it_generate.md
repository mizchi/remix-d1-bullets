# How this project generates

from bare to this project.

```bash
$ npx create-remix@latest remix-d1-bullets
# Select TypeScript / CloudflarePages
$ cd remix-d1-bullets
$ rm -r node_modules package-lock.json
$ pnpm install
$ pnpm add drizzle-kit drizzle-orm better-sqlite3 remix-auth remix-auth-google -D
```

## Put Schema

app/schema.ts

```ts
/*
  DO NOT RENAME THIS FILE FOR DRIZZLE-ORM TO WORK
*/
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey().notNull(),
  googleProfileId: text('googleProfileId').notNull(),
  iconUrl: text('iconUrl'),
  displayName: text('displayName').notNull(),
  registeredAt: integer('registeredAt', { mode: 'timestamp' }).notNull(),
});
```

and generate migaration.

```bash
$ pnpm drizzle-kit generate:sqlite --out migrations --schema src/schema.ts
```

## Auth Service

app/services/auth.server.ts

```ts
import type { AppLoadContext } from "@remix-run/cloudflare";
import {
  createCookie,
  createWorkersKVSessionStorage,
} from "@remix-run/cloudflare";

import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";
import { users } from "../schema"
import { InferModel } from "drizzle-orm";
import { createClient } from "~/db.server";

export type AuthUser = {
  id: number;
};

type CreateUser = InferModel<typeof users, 'insert'>

let _authenticator: Authenticator<AuthUser> | undefined;
export function getAuthenticator(context: AppLoadContext): Authenticator<AuthUser> {
  if (_authenticator == null) {
    const cookie = createCookie("__session", {
      secrets: [context.SESSION_SECRET as string],
      path: "/",
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV ==  "production",
    });
    console.log('[auth.server] cookie', cookie);
    const sessionStorage = createWorkersKVSessionStorage({
      kv: context.SESSION_KV as KVNamespace,
      cookie
    });    
    _authenticator = new Authenticator<AuthUser>(sessionStorage);
    const googleAuth = new GoogleStrategy({
      clientID: context.GOOGLE_AUTH_CLIENT_ID as string,
      clientSecret: context.GOOGLE_AUTH_CLIENT_SECRET as string,
      callbackURL: context.GOOGLE_AUTH_CALLBACK_URL as string,
    }, async ({ profile }) => {
      const db = createClient(context.DB as D1Database);
      const newUser: CreateUser = {
        googleProfileId: profile.id,
        iconUrl: profile.photos?.[0].value,
        displayName: profile.displayName,
        registeredAt: new Date(),
      };
      const ret = await db.insert(users).values(newUser).returning().get();
      return {
        id: ret.id,
      };
    });
    _authenticator.use(googleAuth);
  }
  return _authenticator;
}
```

`.dev.vars` and production enviroments require them.

```
GOOGLE_AUTH_CALLBACK_URL="http://localhost:8788/auth/google/callback"
GOOGLE_AUTH_CLIENT_ID=""
GOOGLE_AUTH_CLIENT_SECRET=""
SESSION_SECRET=""
```

usage example

```tsx
// app/routes/*
import type { LoaderArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { getAuthenticator } from "../services/auth.server";

export async function loader({ request, context }: LoaderArgs) {
  const authenticator = getAuthenticator(context);
  const user = await authenticator.isAuthenticated(request);
  return json({
    user,
  });
};
```

and put API and callback

- `app/routes/auth.google.tsx`
- `app/routes/auth.google.callback.tsx`

Implement login page.

```tsx
// app/routes/login.tsx
import type { LoaderArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Form } from "@remix-run/react";
import { getAuthenticator } from "../services/auth.server";
import { Layout } from "../components/Layout";

export async function loader({ request, context }: LoaderArgs) {
  const authenticator = getAuthenticator(context);
  const user = await authenticator.isAuthenticated(request);
  return json({
    user,
  });
};

export default function Login() {
  const { user } = useLoaderData<typeof loader>();

  if (user) {
    return (
      <Layout>
        <pre><code>{JSON.stringify(user)}</code></pre>
        <Form method="post" action="/auth/logout">
          <button>Logout</button>
        </Form>
      </Layout>
    );
  }
  return (
    <Layout>
      <Form action="/auth/google" method="post">
        <button>Login with Google</button>
      </Form>
    </Layout>
  );
}
```