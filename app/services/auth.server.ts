import type { AppLoadContext } from "@remix-run/cloudflare";
import {
  createCookie,
  createWorkersKVSessionStorage,
} from "@remix-run/cloudflare";

import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
}

let _authenticator: Authenticator<AuthUser> | undefined;
export function getAuthenticator(context: AppLoadContext): Authenticator<AuthUser> {
  // console.log('[auth] getAuthenticator', 'context', context);
  if (_authenticator == null) {
    // const cookie = createSessionCookie(context);
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
    /// google
    const googleAuth = new GoogleStrategy({
      clientID: context.GOOGLE_AUTH_CLIENT_ID as string,
      clientSecret: context.GOOGLE_AUTH_CLIENT_SECRET as string,
      callbackURL: context.GOOGLE_AUTH_CALLBACK_URL as string,
    }, async ({ profile }) => {
      console.log('[auth] google callback', 'profile', profile);
      return {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0].value,
      };
    });
    _authenticator.use(googleAuth);
  }
  return _authenticator;
}
