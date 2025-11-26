import { page, PageProps } from "fresh";
import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import { getAllTags, getPosts, Post } from "../lib/posts.ts";
import ThemeToggle from "../islands/ThemeToggle.tsx";
import Tag from "../components/Tag.tsx";
import PostCard from "../components/PostCard.tsx";

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
        <title>PigMint Blog - A Fresh Perspective on Web Dev & Design</title>
        <meta
          name="description"
          content="A fresh perspective on web development, design, and everything in between. Explore our colorful articles and dive deep into exciting topics."
        />
        <meta
          property="og:title"
          content="PigMint Blog - A Fresh Perspective on Web Dev & Design"
        />
        <meta
          property="og:description"
          content="A fresh perspective on web development, design, and everything in between. Explore our colorful articles and dive deep into exciting topics."
        />
        <meta property="og:image" content="/logo.svg" />
        <meta property="og:url" content="https://pigmint.dev" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="PigMint Blog - A Fresh Perspective on Web Dev & Design"
        />
        <meta
          name="twitter:description"
          content="A fresh perspective on web development, design, and everything in between. Explore our colorful articles and dive deep into exciting topics."
        />
        <meta name="twitter:image" content="/logo.svg" />
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
          <Tag name="All" href="/" active={!selectedTag} />
          {allTags.map((tag) => (
            <Tag
              name={tag}
              href={`/?tag=${tag}`}
              active={selectedTag === tag}
            />
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
                    <PostCard
                      key={post.slug}
                      post={post}
                      colorClass={colorClass}
                    />
                  );
                })}
              </div>
            </>
          )}
      </div>
    </>
  );
});
