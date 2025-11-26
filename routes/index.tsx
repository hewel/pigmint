import { Handlers, PageProps } from "fresh/server";
import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import { getPosts, Post } from "../lib/posts.ts";

interface Data {
  posts: Post[];
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const posts = await getPosts();
    return ctx.render({ posts });
  },
};

export default define.page(function Home({ data }: PageProps<Data>) {
  const { posts } = data;
  return (
    <>
      <Head>
        <title>My Blog</title>
      </Head>
      <div class="px-4 py-8 mx-auto max-w-screen-md">
        <h1 class="text-4xl font-bold mb-8">Welcome to My Blog</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <a href={`/${post.slug}`} class="block p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <h2 class="text-2xl font-bold mb-2">{post.title}</h2>
              <p class="text-gray-600 text-sm mb-2">{new Date(post.date).toLocaleDateString()}</p>
              <p class="text-gray-700">{post.excerpt}</p>
            </a>
          ))}
        </div>
      </div>
    </>
  );
});
