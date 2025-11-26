import { page, PageProps } from "fresh";
import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import { getPost, Post } from "../lib/posts.ts";
import MarkdownRenderer from "../components/MarkdownRenderer.tsx";
import Button from "../components/Button.tsx";
import Tag from "../components/Tag.tsx";
import Layout from "../components/Layout.tsx";

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
        <title>{post.title} - PigMint Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content="/logo.svg" />{" "}
        {/* TODO: Replace with post-specific image if available */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://pigmint.dev/${post.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content="/logo.svg" />{" "}
        {/* TODO: Replace with post-specific image if available */}
      </Head>
      <Layout>
        <div class="px-4 py-12 mx-auto max-w-5xl relative">
          <Button
            href="/"
            className="inline-flex items-center fixed top-6 left-4 md:left-8 z-40"
            variant="secondary"
          >
            <i class="ph-duotone ph-arrow-left mr-1"></i> Back to Home
          </Button>

          <article class="bg-white dark:bg-gray-800 border-4 border-whalies-navy dark:border-gray-500 rounded-4xl p-6 md:p-12 shadow-cartoon text-whalies-navy dark:text-gray-100">
            <header class="mb-8 text-center">
              <div class="flex flex-wrap justify-center gap-3 mb-4">
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
              <h1 class="text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight font-cartoon font-black text-whalies-navy dark:text-gray-100">
                {post.title}
              </h1>
              <div class="flex justify-center gap-3 mt-4">
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
