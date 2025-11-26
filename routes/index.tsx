import { page, PageProps } from "fresh";
import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import { getAllTags, getPosts, Post } from "../lib/posts.ts";
import ThemeToggle from "../islands/ThemeToggle.tsx";

interface Data {
  posts: Post[];
  allTags: string[];
  selectedTag?: string;
}

export const handler = define.handlers<Data>({
  async GET(ctx) {
    const url = new URL(ctx.req.url);
    const selectedTag = url.searchParams.get("tag") || undefined;
    const posts = await getPosts(selectedTag);
    const allTags = await getAllTags();
    return page({ posts, allTags, selectedTag });
  },
});

export default define.page(function Home({ data }: PageProps<Data>) {
  const { posts, allTags, selectedTag } = data;
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
      <div class="px-4 py-16 mx-auto max-w-screen-lg flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <div class="text-center mb-16">
          <img
            src="/logo.svg"
            class="w-32 h-32 mx-auto mb-6 drop-shadow-md"
            alt="Logo"
          />
          <h1 class="text-5xl md:text-7xl lg:text-8xl text-whalies-text mb-6 leading-tight font-cartoon drop-shadow-lg">
            Welcome to the PigMint Blog
          </h1>
          <p class="text-xl md:text-2xl font-body text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-10">
            A fresh perspective on web development, design, and everything in
            between. Explore our colorful articles and dive deep into exciting
            topics.
          </p>
        </div>

        <div class="mb-12 flex flex-wrap justify-center gap-3">
          <a
            href="/"
            class={`px-4 py-2 rounded-full border-2 border-whalies-navy font-cartoon font-bold transition-all hover:-translate-y-1 hover:shadow-cartoon-hover ${
              !selectedTag
                ? "bg-whalies-navy text-white shadow-cartoon"
                : "bg-white dark:bg-gray-800 text-whalies-navy dark:text-gray-200 shadow-sm"
            }`}
          >
            All
          </a>
          {allTags.map((tag) => (
            <a
              href={`/?tag=${tag}`}
              class={`px-4 py-2 rounded-full border-2 border-whalies-navy font-cartoon font-bold transition-all hover:-translate-y-1 hover:shadow-cartoon-hover ${
                selectedTag === tag
                  ? "bg-whalies-navy text-white shadow-cartoon"
                  : "bg-white dark:bg-gray-800 text-whalies-navy dark:text-gray-200 shadow-sm"
              }`}
            >
              #{tag}
            </a>
          ))}
        </div>

        {posts.length === 0
          ? (
            <div class="text-center py-12">
              <p class="text-2xl font-cartoon text-gray-500 dark:text-gray-400">
                No posts found for tag #{selectedTag}
              </p>
              <a
                href="/"
                class="text-whalies-DEFAULT hover:underline mt-4 inline-block"
              >
                Clear filter
              </a>
            </div>
          )
          : (
            <>
              <h2 class="text-4xl font-cartoon text-whalies-text mb-8 drop-shadow-sm">
                {selectedTag ? `Posts tagged #${selectedTag}` : "Recent Posts"}
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-screen-xl">
                {posts.map((post, index) => {
                  const colorClass = cardColors[index % cardColors.length];
                  return (
                    <a
                      href={`/${post.slug}`}
                      class={`block p-6 border-4 border-whalies-navy rounded-4xl ${colorClass} shadow-cartoon hover:translate-y-1 hover:translate-x-1 hover:shadow-cartoon-hover transition-all duration-200 group`}
                    >
                      <div class="flex flex-wrap gap-x-2 gap-y-1 mb-3">
                        <span class="bg-white/50 w-fit px-3 py-1 rounded-full border-2 border-whalies-navy text-xs font-cartoon font-black text-whalies-navy">
                          {new Date(post.date).toLocaleDateString()}
                        </span>
                        {post.tags && post.tags.map((tag) => (
                          <object>
                            <a
                              href={`/?tag=${tag}`}
                              class="bg-white/50 w-fit px-3 py-1 rounded-full border-2 border-whalies-navy text-xs font-cartoon font-black text-whalies-navy hover:bg-white transition-colors"
                            >
                              #{tag}
                            </a>
                          </object>
                        ))}
                      </div>
                      <h3 class="text-3xl mb-3 leading-tight font-cartoon group-hover:underline decoration-2 underline-offset-2 text-whalies-navy">
                        {post.title}
                      </h3>
                      <p class="font-body text-gray-800 opacity-80 line-clamp-3">
                        {post.excerpt}
                      </p>
                    </a>
                  );
                })}
              </div>
            </>
          )}
      </div>
    </>
  );
});
