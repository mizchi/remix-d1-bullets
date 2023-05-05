// import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";


// Impl
export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext: (context) => context.env,
  mode: process.env.NODE_ENV,
});

// export const onRequest = handler;

// export const onRequest = async (context: any) => {
//   console.log("===onRequest===");
//   try {
//     const res = await handler(context);
//     console.log("===onRequestEnd===");
//     return res;
//   } catch (err) {
//     if (err instanceof Error) {
//       console.error(err.stack);
//     };
//     // console.error(err);
//     return new Response("Internal Error", { status: 500 });
//   }
// };

// @remix-run/cloudflare-pages source
import type { AppLoadContext, ServerBuild } from "@remix-run/cloudflare";
import { createRequestHandler as createRemixRequestHandler } from "@remix-run/cloudflare";

/**
 * A function that returns the value to use as `context` in route `loader` and
 * `action` functions.
 *
 * You can think of this as an escape hatch that allows you to pass
 * environment/platform-specific values through to your loader/action.
 */
export type GetLoadContextFunction<Env = unknown> = (
  context: Parameters<PagesFunction<Env>>[0]
) => Promise<AppLoadContext> | AppLoadContext;

export type RequestHandler<Env = any> = PagesFunction<Env>;

export interface createPagesFunctionHandlerParams<Env = any> {
  build: ServerBuild;
  getLoadContext?: GetLoadContextFunction<Env>;
  mode?: string;
}

export function createRequestHandler<Env = any>({
  build,
  getLoadContext,
  mode,
}: createPagesFunctionHandlerParams<Env>): RequestHandler<Env> {
  let handleRequest = createRemixRequestHandler(build, mode);
  console.log("===createRequestHandler===");

  return async (context) => {
    console.log("===handleRequest===", context);
    try {
      let loadContext = await getLoadContext?.(context);
      return handleRequest(context.request, loadContext);
    } catch(err) {
      console.log('~~~getLoadContext error', err);
      throw err;
    }
  };
}

// declare const process: any;

export function createPagesFunctionHandler<Env = any>({
  build,
  getLoadContext,
  mode,
}: createPagesFunctionHandlerParams<Env>) {
  let handleRequest = createRequestHandler<Env>({
    build,
    getLoadContext,
    mode,
  });

  let handleFetch = async (context: EventContext<Env, any, any>) => {
    let response: Response | undefined;

    // https://github.com/cloudflare/wrangler2/issues/117
    context.request.headers.delete("if-none-match");

    try {
      response = await (context.env as any).ASSETS.fetch(
        context.request.url,
        context.request.clone()
      );
      response =
        response && response.status >= 200 && response.status < 400
          ? new Response(response.body, response)
          : undefined;
    } catch {}

    if (!response) {
      try {
        console.log('handleRequest in fetch')
        response = await handleRequest(context);
      } catch (err) {
        console.log('handleRequest error in fetch')
      }
    }

    return response;
  };

  return async (context: EventContext<Env, any, any>) => {
    try {
      // console.log("===onRequest===");
      return await handleFetch(context);
    } catch (error: unknown) {
      console.log("===onRequestError===", error);
      if (process.env.NODE_ENV === "development" && error instanceof Error) {
        console.error('captured', error);
        return new Response(error.message || error.toString(), {
          status: 500,
        });
      }

      return new Response("Internal Error", {
        status: 500,
      });
    }
  };
}
