import { Layout } from '../components/Layout';
import type { V2_MetaFunction } from "@remix-run/cloudflare";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export default function Index() {
  return (
    <Layout>
      <h2>Home</h2>
    </Layout>
  );
}
