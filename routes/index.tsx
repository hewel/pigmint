import { page, PageProps } from "fresh";
import { Head } from "fresh/runtime";
import { define, SITE_BASE_URL } from "../utils.ts";
import { getAllTags, getPosts, Post } from "../lib/posts.ts";
import { getGitHubStats, GitHubStats } from "../lib/github.ts";
import PostCard from "../components/PostCard.tsx";
import Button from "../components/Button.tsx";
import Layout from "../components/Layout.tsx";
import SEO from "../components/SEO.tsx";
import TagFilter from "../islands/TagFilter.tsx";

interface Data {
  posts: Post[];
  allTags: string[];
  selectedTag?: string;
  githubStats: GitHubStats | null;
}

export const handler = define.handlers<Data>({
  async GET(ctx) {
    const url = new URL(ctx.req.url);
    const selectedTag = url.searchParams.get("tag") || undefined;
    const [posts, allTags, githubStats] = await Promise.all([
      getPosts(selectedTag),
      getAllTags(),
      getGitHubStats(),
    ]);
    return page({ posts, allTags, selectedTag, githubStats });
  },
});

export default define.page(function Home({ data }: PageProps<Data>) {
  const { posts, allTags, selectedTag, githubStats } = data;
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
          url={SITE_BASE_URL}
        />
      </Head>
      <Layout githubStats={githubStats}>
        <div class="px-4 py-16 mx-auto max-w-5xl flex flex-col items-center justify-center">
          <div class="text-center mb-24 relative">
            {/* Mascot Placeholder */}
            <div class="logo-mascot w-48 h-48 mx-auto mb-8 bg-pastel-blue rounded-full border-4 border-whalies-navy flex items-center justify-center">
              <i class="ph-duotone ph-ghost text-6xl text-whalies-navy"></i>
            </div>

            <h1 class="text-5xl md:text-6xl lg:text-7xl text-whalies-text mb-6 leading-tight font-cartoon drop-shadow-lg">
              Welcome to the PigMint Blog
            </h1>
            <Button href="#posts" className="text-xl px-8 py-4">
              Start Reading
            </Button>
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
                  <h2 class="text-4xl font-cartoon text-whalies-text mb-8 drop-shadow-sm">
                    {selectedTag
                      ? `Posts tagged #${selectedTag}`
                      : "Recent Posts"}
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
          </section>
        </div>
      </Layout>
    </>
  );
});
