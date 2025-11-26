import { Handlers, PageProps } from "fresh/server";
import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import { getPost, Post } from "../lib/posts.ts";

interface Data {
  post: Post | null;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const { slug } = ctx.params;
    const post = await getPost(slug);
    return ctx.render({ post });
  },
};

export default define.page(function PostPage({ data }: PageProps<Data>) {
  const { post } = data;

  if (!post) {
    return <h1>404 - Post Not Found</h1>;
  }

  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <div class="px-4 py-8 mx-auto max-w-screen-md">
        <h1 class="text-4xl font-bold mb-4">{post.title}</h1>
        <p class="text-gray-600 text-sm mb-4">{new Date(post.date).toLocaleDateString()}</p>
        <div
          class="markdown-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </>
  );
});
