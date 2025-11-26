import { PageProps } from "fresh/server";
import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import { getPost, Post } from "../lib/posts.ts";

interface Data {
  post: Post | null;
}

export const handler = define.handlers<Data>({
  async GET(ctx) {
    const { slug } = ctx.params;
    const post = await getPost(slug);
    return { post };
  },
});

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
      <div class="px-4 py-12 mx-auto max-w-screen-md">
        <a href="/" class="inline-block mb-8 px-4 py-2 bg-white border-2 border-black rounded-full font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
          ← Back to Home
        </a>
        
        <article class="bg-white border-4 border-black rounded-3xl p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <header class="mb-8 text-center">
            <div class="inline-block bg-card-yellow px-4 py-1 rounded-full border-2 border-black text-sm font-black mb-4">
              {new Date(post.date).toLocaleDateString()}
            </div>
            <h1 class="text-5xl md:text-6xl mb-4 leading-tight">{post.title}</h1>
          </header>
          
          <div
            class="markdown-body"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </>
  );
});
