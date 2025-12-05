import { page, PageProps } from "fresh";
import { Head } from "fresh/runtime";
import { define, formatDateLong, getConfig, getSiteBaseUrl, Social } from "../utils.ts";
import { getPost, Post } from "../lib/posts.ts";
import { getGitHubStats, GitHubStats } from "../lib/github.ts";
import MarkdownRenderer from "../components/MarkdownRenderer.tsx";
import Tag from "../components/Tag.tsx";
import Layout from "../components/Layout.tsx";
import SEO from "../components/SEO.tsx";

interface Data {
  post: Post | null;
  githubStats: GitHubStats | null;
  social: Social[];
  siteBaseUrl: string;
  repoUrl: string;
}

export const handler = define.handlers<Data>({
  async GET(ctx) {
    const { slug } = ctx.params;
    const [post, githubStats, config, siteBaseUrl] = await Promise.all([
      getPost(slug),
      getGitHubStats(),
      getConfig(),
      getSiteBaseUrl(),
    ]);
    const repoUrl = `https://github.com/${config.github.repo}`;
    return page({ post, githubStats, social: config.social, siteBaseUrl, repoUrl });
  },
});

export default define.page(function PostPage({ data }: PageProps<Data>) {
  const { post, githubStats, social, siteBaseUrl, repoUrl } = data;

  if (!post) {
    return <h1>404 - Post Not Found</h1>;
  }

  return (
    <>
      <Head>
        <SEO
          title={post.title}
          description={post.excerpt}
          url={`${siteBaseUrl}/${post.slug}`}
          type="article"
          author={post.author}
          publishedTime={post.date}
        />
      </Head>
      <Layout showBackButton githubStats={githubStats} social={social} repoUrl={repoUrl}>
        <div class="px-4 py-12 mx-auto max-w-5xl relative">
          <article class="bg-white dark:bg-gray-800 border-4 border-whalies-navy dark:border-gray-500 rounded-4xl p-6 md:p-12 shadow-cartoon text-whalies-navy dark:text-gray-100">
            <header class="mb-8 text-center">
              <div class="flex flex-wrap justify-center gap-3 mb-4">
                <div class="bg-pastel-yellow px-4 py-1 rounded-full border-2 border-whalies-navy text-sm font-cartoon font-black text-whalies-navy">
                  {formatDateLong(post.date)}
                </div>
                <div class="bg-pastel-blue px-4 py-1 rounded-full border-2 border-whalies-navy text-sm font-cartoon font-black text-whalies-navy">
                  {post.readingTime} min read
                </div>
                <div class="bg-pastel-pink px-4 py-1 rounded-full border-2 border-whalies-navy text-sm font-cartoon font-black text-whalies-navy">
                  By {post.author}
                </div>
              </div>
              <h1 class="text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight font-cartoon font-black text-whalies-navy dark:text-gray-100">
                {post.title}
              </h1>
              <div class="flex flex-wrap justify-center gap-3 mt-4">
                {post.tags.map((tag) => (
                  <Tag name={tag} href={`/?tag=${tag}`} />
                ))}
              </div>
            </header>

            <div class="markdown-content mx-auto text-left">
              <MarkdownRenderer content={post.content} />
            </div>
          </article>
        </div>
      </Layout>
    </>
  );
});
