import { page, PageProps } from "fresh";
import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import { getPosts, Post } from "../lib/posts.ts";
import ThemeToggle from "../islands/ThemeToggle.tsx";

interface Data {
  posts: Post[];
}

export const handler = define.handlers<Data>({
  async GET(_ctx) {
    const posts = await getPosts();
    return page({ posts });
  },
});

export default define.page(function Home({ data }: PageProps<Data>) {
  const { posts } = data;
  const cardColors = [
    "bg-pastel-pink",
    "bg-pastel-yellow",
    "bg-pastel-blue",
    "bg-pastel-purple",
    "bg-pastel-mint",
  ];

  return (
    <>
      <Head>
        <title>My Blog</title>
      </Head>
      <ThemeToggle />
      <div class="px-4 py-12 mx-auto max-w-screen-lg">
        <div class="text-center mb-12">
          <img src="/logo.svg" class="w-24 h-24 mx-auto mb-4" alt="Logo" />
          <h1 class="text-4xl md:text-5xl lg:text-6xl text-whalies-text mb-4 drop-shadow-sm font-cartoon">
            Welcome to My Blog
          </h1>
          <p class="text-xl font-body text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            A place for thoughts, ideas, and colorful experiments.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => {
            const colorClass = cardColors[index % cardColors.length];
            return (
              <a
                href={`/${post.slug}`}
                class={`block p-6 border-4 border-whalies-navy rounded-4xl ${colorClass} shadow-cartoon hover:translate-y-1 hover:translate-x-1 hover:shadow-cartoon-hover transition-all duration-200 group`}
              >
                <div class="bg-white/50 w-fit px-3 py-1 rounded-full border-2 border-whalies-navy text-xs font-cartoon font-black mb-3 text-whalies-navy">
                  {new Date(post.date).toLocaleDateString()}
                </div>
                <h2 class="text-3xl mb-3 leading-tight font-cartoon group-hover:underline decoration-2 underline-offset-2 text-whalies-navy">
                  {post.title}
                </h2>
                <p class="font-body text-gray-800 opacity-80 line-clamp-3">
                  {post.excerpt}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
});
