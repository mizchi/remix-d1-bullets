import type { LoaderArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { createClient } from "../db.server";
import { users } from "../schema";

export const loader = async ({ context }: LoaderArgs) => {
  try {
    const db = createClient(context.DB as D1Database);
    const results = await db.select().from(users).all();  
    return json({results, error: null});
  } catch (err) {
    return json({
      results: [],
      error: (err as any)?.message ?? JSON.stringify(err),
    });
  }
};

import { Layout } from "../components/Layout";
export default function WithServer() {
  const { results, error } = useLoaderData<typeof loader>();
  if (error) {
    return <Layout>
      <h2>With Server</h2>
      <pre><code>{JSON.stringify(results, null, 2)}</code></pre>
    </Layout>
  }
  return (
    <Layout>
      <h2>With Server</h2>
      <pre><code>{JSON.stringify(results, null, 2)}</code></pre>
    </Layout>
  );
}
