import { page, PageProps } from "fresh";
import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import { getPost, Post } from "../lib/posts.ts";
import ThemeToggle from "../islands/ThemeToggle.tsx";
import MarkdownRenderer from "../components/MarkdownRenderer.tsx";

interface Data {
  post: Post | null;
}

export const handler = define.handlers<Data>({
  async GET(ctx) {
    const { slug } = ctx.params;
    const post = await getPost(slug);
    return page({ post });
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
      <ThemeToggle />
      <div class="px-4 py-12 mx-auto max-w-screen-md">
        <a
          href="/"
          class="inline-block mb-8 px-4 py-2 bg-white dark:bg-gray-800 border-2 border-whalies-navy dark:border-gray-500 rounded-button font-cartoon shadow-cartoon hover:shadow-cartoon-hover hover:translate-x-1 hover:translate-y-1 transition-all text-whalies-navy dark:text-gray-100"
        >
          ← Back to Home
        </a>

        <article class="bg-white dark:bg-gray-800 border-4 border-whalies-navy dark:border-gray-500 rounded-4xl p-6 md:p-12 shadow-card text-whalies-navy dark:text-gray-100">
          <header class="mb-8 text-center">
            <div class="flex flex-wrap justify-center gap-2 mb-4">
              <div class="bg-pastel-yellow px-4 py-1 rounded-full border-2 border-whalies-navy text-sm font-cartoon font-black text-whalies-navy">
                {new Date(post.date).toLocaleDateString()}
              </div>
              <div class="bg-pastel-blue px-4 py-1 rounded-full border-2 border-whalies-navy text-sm font-cartoon font-black text-whalies-navy">
                {post.readingTime} min read
              </div>
              <div class="bg-pastel-pink px-4 py-1 rounded-full border-2 border-whalies-navy text-sm font-cartoon font-black text-whalies-navy">
                By {post.author}
              </div>
            </div>
            <h1 class="text-4xl md:text-5xl lg:text-6xl mb-4 leading-tight font-cartoon">
              {post.title}
            </h1>
            <div class="flex justify-center gap-2 mt-4">
              {post.tags.map((tag) => (
                <span class="text-sm font-mono text-gray-500 dark:text-gray-400">
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          <MarkdownRenderer content={post.content} />
        </article>
      </div>
    </>
  );
});
