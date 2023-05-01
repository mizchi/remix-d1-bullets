import type { LoaderArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { createClient } from "../db.server";
import { users } from "../schema";

export const loader = async ({ context }: LoaderArgs) => {
  const db = createClient(context.DB as D1Database);
  const results = await db.select().from(users).all();
  return json({results});
};

import { Layout } from "../components/Layout";
export default function WithServer() {
  const { results } = useLoaderData<typeof loader>();
  console.log("schema", users);
  return (
    <Layout>
      <h2>With Server</h2>
      <pre><code>{JSON.stringify(results, null, 2)}</code></pre>
    </Layout>
  );
}
