import {
  createCookie,
  createWorkersKVSessionStorage,
} from "@remix-run/cloudflare";

export function createSessionCookie(context: any) {
  const cookie = createCookie("__session", {
    secrets: [context.SESSION_SECRET as string],
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    // secure: true,
  });
  return createWorkersKVSessionStorage({
    kv: context.SESSION_KV as KVNamespace,
    cookie
  });
}
