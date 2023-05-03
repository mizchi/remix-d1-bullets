// app/routes/login.tsx
import type { ActionArgs } from "@remix-run/cloudflare";
import { getAuthenticator } from "../services/auth.server";

export async function action({ request, context }: ActionArgs) {
  const authenticator = getAuthenticator(context);
  return authenticator.logout(request, {
    redirectTo: '/login'
  });
};
