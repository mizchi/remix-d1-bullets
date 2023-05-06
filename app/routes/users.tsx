// app/routes/login.tsx
import { LoaderArgs, redirect } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Form, useLoaderData } from "@remix-run/react";
import { getAuthenticator } from "../services/auth.server";
import { Layout } from "../components/Layout";
import { createClient } from "../db.server";
import { users } from "../schema";
import { eq } from "drizzle-orm";

export async function loader({ request, context, params }: LoaderArgs) {
  const db = createClient(context.DB as D1Database);
  const userList = await db.select({
    id: users.id,
    displayName: users.displayName,
    serviceId: users.serviceId,
    iconUrl: users.iconUrl,
  }).from(users).orderBy(users.id).all();

  return json({
    users: userList,
  });
};

export default function UserPage() {
  const { users } = useLoaderData<typeof loader>();
  return (
    <Layout>
      <h2>Users List</h2>
      <pre><code>{JSON.stringify({users}, null, 2)}</code></pre>
    </Layout>
  );
}

