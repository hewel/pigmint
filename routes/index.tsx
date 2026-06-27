import { page, PageProps } from "fresh";
import { Head } from "fresh/runtime";
import { define, getSiteBaseUrl } from "../utils.ts";
import { getAllTags, getPosts, Post } from "../lib/posts.ts";
import PostCard from "../components/PostCard.tsx";
import Button from "../components/Button.tsx";
import Layout from "../components/Layout.tsx";
import SEO from "../components/SEO.tsx";
import TagFilter from "../islands/TagFilter.tsx";
import { GhostIcon } from "@phosphor-icons/react/dist/ssr/Ghost";

interface Data {
  posts: Post[];
  allTags: string[];
  selectedTag?: string;
  siteBaseUrl: string;
}

export const handler = define.handlers<Data>({
  async GET(ctx) {
    const url = new URL(ctx.req.url);
    const selectedTag = url.searchParams.get("tag") || undefined;
    const [posts, allTags, siteBaseUrl] = await Promise.all([
      getPosts(selectedTag),
      getAllTags(),
      getSiteBaseUrl(),
    ]);
    return page({ posts, allTags, selectedTag, siteBaseUrl });
  },
});

export default define.page(function Home({ data }: PageProps<Data>) {
  const { posts, allTags, selectedTag, siteBaseUrl } = data;
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
        <SEO
          title="PigMint Blog - A Fresh Perspective on Web Dev & Design"
          description="A fresh perspective on web development, design, and everything in between. Explore our colorful articles and dive deep into exciting topics."
          url={siteBaseUrl}
        />
      </Head>
      <Layout>
        <div class="w-full px-4 sm:px-6 lg:px-8 py-12 md:py-16 mx-auto max-w-5xl xl:max-w-7xl 2xl:max-w-[92rem] flex flex-col items-center justify-center">
          <div class="w-full mb-20 xl:mb-24 relative grid items-center gap-10 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <div class="text-center xl:text-left xl:max-w-3xl">
              <h1 class="text-5xl md:text-6xl lg:text-7xl text-whalies-text mb-6 leading-tight font-cartoon drop-shadow-lg text-balance">
                Welcome to the PigMint Blog
              </h1>
              <p class="max-w-2xl mx-auto xl:mx-0 mb-8 text-lg md:text-xl font-body font-bold text-whalies-navy/70 dark:text-gray-300 text-pretty">
                Playful notes on web development, design, and the bits between.
              </p>
              <Button href="#posts" className="text-xl px-8 py-4">
                Start Reading
              </Button>
            </div>

            <div class="logo-mascot w-44 h-44 md:w-48 md:h-48 xl:w-72 xl:h-72 mx-auto bg-pastel-blue rounded-full border-4 border-whalies-navy flex items-center justify-center">
              <GhostIcon
                weight="duotone"
                size={144}
                className="text-whalies-navy w-24 h-24 xl:w-36 xl:h-36"
              />
            </div>
          </div>

          <section
            id="posts"
            class="w-full flex flex-col items-center scroll-mt-32"
          >
            <div class="mb-12 w-full max-w-xl mx-auto md:max-w-none">
              <TagFilter allTags={allTags} selectedTag={selectedTag} />
            </div>

            {posts.length === 0
              ? (
                <div class="text-center py-12">
                  <p class="text-2xl font-cartoon text-gray-500 dark:text-gray-400">
                    No posts found for tag #{selectedTag}
                  </p>
                  <a
                    href="/"
                    class="text-whalies-default hover:underline mt-4 inline-block"
                  >
                    Clear filter
                  </a>
                </div>
              )
              : (
                <>
                  <h2 class="text-4xl font-cartoon text-whalies-text mb-8 drop-shadow-sm text-center text-balance">
                    {selectedTag
                      ? `Posts tagged #${selectedTag}`
                      : "Recent Posts"}
                  </h2>
                  <div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),21rem))] justify-center gap-6 xl:gap-8 w-full">
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
          </section>
        </div>
      </Layout>
    </>
  );
});
