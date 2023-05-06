import type { LoaderArgs } from "@remix-run/cloudflare";
export async function loader({ request, context }: LoaderArgs) {
  throw new Error("This is an error");
};
