// app/routes/login.tsx
import { LoaderArgs, redirect } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { getAuthenticator } from "../services/auth.server";
import { Layout } from "../components/Layout";
import { createClient } from "../db.server";
import { users, posts, tags, tagOwnerships } from "../schema";
import { eq, desc, inArray } from "drizzle-orm";
import { useEffect, useState } from "react";
import { QueryBuilder } from "drizzle-orm/sqlite-core";

export async function loader({ request, context, params }: LoaderArgs) {
  const authenticator = getAuthenticator(context);
  const auth = await authenticator.isAuthenticated(request);
  const isMine = auth?.id.toString() === params.uid;
  const db = createClient(context.DB as D1Database);

  // const user = await db.select({
  //   id: users.id,
  //   displayName: users.displayName,
  //   serviceId: users.serviceId,
  //   iconUrl: users.iconUrl,
  // })
  //   .from(users)
  //   .where(eq(users.id, Number(params.uid)))
  //   .get();
  // const userPosts = await db.select()
  //   .from(posts)
  //   .where(eq(posts.ownerId, Number(params.uid)))
  //   .orderBy(desc(posts.createdAt))
  //   .all();

  // const userAndPosts = await db.select({
  //   user: users,
  //   post: posts,
  // })
  //   .from(posts)
  //   .leftJoin(users, eq(posts.ownerId, users.id))
  //   .where(eq(users.id, Number(params.uid)))
  //   .where(eq(users.id, posts.ownerId))
  //   .limit(3)
  //   .all();

  const userAndPosts = await db
    .select({
      user: {
        // id: users.id,
        displayName: users.displayName,
      },
      post: {
        id: posts.id,
        ownerId: posts.ownerId,
        title: posts.title,
        content: posts.content,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
      }
      // post: posts,
    })
    .from(users)
    .leftJoin(posts, eq(posts.ownerId, users.id))
    .orderBy(desc(posts.createdAt))
    // .where(eq(users.id, Number(params.uid)))
    // .where(eq(users.id, posts.ownerId))
    // .limit(3)
    .all();
  const user = {...userAndPosts[0].user, id: Number(params.uid)};
  const userPosts = userAndPosts.map(({ post }) => post);

  // console.log('userAndPosts', userAndPostsQuery.toSQL(), userAndPosts );
  
  return json({
    auth: auth!,
    user: user!,
    userPosts,
    isMine
  });
};

export const action = async ({ request, context, params }: LoaderArgs) => {
  const authenticator = getAuthenticator(context);
  const auth = await authenticator.isAuthenticated(request);
  const isMine = auth?.id.toString() === params.uid;
  if (auth == null || !isMine) {
    return json({
      ok: false as const
    });
  }
  const db = createClient(context.DB as D1Database);
  const formData = await request.formData();
  const tagsExpr = formData.get('tags') as string;
  const tagNames = tagsExpr.split(',').map((tag) => tag.trim()).filter((tag) => tag !== '');

  const newPost = await db.insert(posts).values({
    title: formData.get('title') as string,
    content: formData.get ('content') as string,
    ownerId: auth.id!,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning().get();

  // ensure tags
  await Promise.all(tagNames.map(async (tagName) => {
    await db.insert(tags).values({ name: tagName }).onConflictDoNothing().run();
  }));
  const tagList = await db.select().from(tags).where(inArray(tags.name, tagNames)).all();
  await Promise.all(tagList.map(async (tag) => {
    await db.insert(tagOwnerships).values({ tagId: tag.id, postId: newPost.id }).onConflictDoNothing().run();
  }));

  return json({ ok: true as const, newPost })
}

export default function UserPage() {
  const { user, isMine, userPosts } = useLoaderData<typeof loader>();
  const [ posts, setPosts ] = useState(userPosts);
  const actionData = useActionData<typeof action>();
  // console.log('user.posts', user.posts)
  const navigation = useNavigation();
  useEffect(() => {
    if (actionData?.ok) {
      setPosts((posts) => {
        return [
          actionData.newPost,
          ...posts
        ]
      })
    }
  }, [actionData, setPosts]);
  return (
    <Layout>
      <h2>User Page</h2>
      {/* <pre><code>{JSON.stringify({user, isMine, userPosts}, null, 2)}</code></pre> */}
      {
        isMine && (
          <>
            <Form method="post">
              <fieldset disabled={navigation.state === 'submitting'}>
                <legend>Post</legend>
                <div>
                  <label htmlFor="title">title</label>
                  &nbsp;
                  <input name="title" defaultValue={''} />
                </div>
                <div>
                  <label htmlFor="tags">tags</label>
                  &nbsp;
                  <input name="tags" defaultValue={''} />
                </div>

                {/* <label htmlFor="content"></label> */}
                <textarea name="content" defaultValue={''} style={{width: '50vw', height: '30vh'}} />
                <div>

                </div>
                <input type="submit" value="submit" />
              </fieldset>
            </Form>
          </>
        )
      }
      {
        userPosts.map((post) => {
          return <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <p>{post.createdAt}</p>
            <hr />
          </div>
        })
      }
    </Layout>
  );
}

