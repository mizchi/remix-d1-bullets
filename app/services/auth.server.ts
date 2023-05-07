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
