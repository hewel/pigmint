import { page, PageProps } from "fresh";
import { Head } from "fresh/runtime";
import { define, formatDateLong, getSiteBaseUrl } from "../utils.ts";
import { getPost, Post } from "../lib/posts.ts";
import { validateSlug } from "../lib/security.ts";
import MarkdownRenderer from "../components/MarkdownRenderer.tsx";
import Tag from "../components/Tag.tsx";
import Layout from "../components/Layout.tsx";
import SEO from "../components/SEO.tsx";
import { CalendarBlankIcon } from "@phosphor-icons/react/dist/ssr/CalendarBlank";
import { ClockIcon } from "@phosphor-icons/react/dist/ssr/Clock";
import { UserIcon } from "@phosphor-icons/react/dist/ssr/User";

interface Data {
  post: Post | null;
  siteBaseUrl: string;
}

export const handler = define.handlers<Data>({
  async GET(ctx) {
    const { slug } = ctx.params;

    // Validate slug to prevent path traversal
    if (!validateSlug(slug)) {
      return new Response("404 - Post Not Found", { status: 404 });
    }

    const [post, siteBaseUrl] = await Promise.all([
      getPost(slug),
      getSiteBaseUrl(),
    ]);

    if (!post) {
      return new Response("404 - Post Not Found", { status: 404 });
    }

    return page({ post, siteBaseUrl });
  },
});

export default define.page(function PostPage({ data }: PageProps<Data>) {
  const { post, siteBaseUrl } = data;

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
      <Layout showBackButton>
        <div class="px-4 py-12 mx-auto max-w-5xl relative">
          <article class="bg-white dark:bg-gray-800 border-4 border-whalies-navy dark:border-gray-500 rounded-4xl p-6 md:p-12 shadow-cartoon text-whalies-navy dark:text-gray-100">
            <header class="mb-8 text-center">
              <h1 class="text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight font-cartoon font-black text-whalies-navy dark:text-gray-100">
                {post.title}
              </h1>
              <div class="flex flex-wrap justify-center items-center gap-4 mb-6 text-whalies-navy dark:text-gray-300 font-cartoon text-sm md:text-base">
                <div class="flex items-center gap-1.5">
                  <CalendarBlankIcon weight="duotone" className="text-lg" />
                  <span>{formatDateLong(post.date)}</span>
                </div>
                <div class="hidden md:block w-1.5 h-1.5 rounded-full bg-whalies-navy/30 dark:bg-gray-500" />
                <div class="flex items-center gap-1.5">
                  <ClockIcon weight="duotone" className="text-lg" />
                  <span>{post.readingTime} min read</span>
                </div>
                <div class="hidden md:block w-1.5 h-1.5 rounded-full bg-whalies-navy/30 dark:bg-gray-500" />
                <div class="flex items-center gap-1.5">
                  <UserIcon weight="duotone" className="text-lg" />
                  <span>{post.author}</span>
                </div>
              </div>
              <div class="flex flex-wrap justify-center gap-3 mt-4">
                {post.tags.map((tag) => (
                  <Tag key={tag} name={tag} href={`/?tag=${tag}`} />
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
