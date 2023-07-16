import { Layout } from '../components/Layout';
import type { V2_MetaFunction } from "@remix-run/cloudflare";
import { css } from "../../styled-system/css/index";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};


export default function Index() {
  return (
    <Layout>
      <div className={css({ fontSize: "2xl", fontWeight: 'bold' })}>Home1</div>
    </Layout>
  );
}
