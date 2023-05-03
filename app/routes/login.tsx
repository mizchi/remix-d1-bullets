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
  return json({ user, cb: context.GOOGLE_AUTH_CALLBACK_URL as any, len: (context.GOOGLE_AUTH_CLIENT_ID as string).length });
};

export default function Login() {
  const { user, cb, len } = useLoaderData<typeof loader>();

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
      Callback: {cb} {len}
    </Layout>
  );
}

