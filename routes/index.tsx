import { PageProps } from "fresh/server";
import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import { getPosts, Post } from "../lib/posts.ts";

interface Data {
  posts: Post[];
}

export const handler = define.handlers<Data>({
  async GET(ctx) {
    const posts = await getPosts();
    return ctx.render({ posts });
  },
});

export default define.page(function Home({ data }: PageProps<Data>) {
  const { posts } = data;
  const cardColors = ["bg-card-pink", "bg-card-yellow", "bg-card-blue", "bg-card-purple"];

  return (
    <>
      <Head>
        <title>My Blog</title>
      </Head>
      <div class="px-4 py-12 mx-auto max-w-screen-lg">
        <div class="text-center mb-12">
           <img src="/logo.svg" class="w-24 h-24 mx-auto mb-4" alt="Logo" />
           <h1 class="text-6xl text-brand-text mb-4 drop-shadow-sm">Welcome to My Blog</h1>
           <p class="text-xl font-bold text-gray-500 max-w-lg mx-auto">A place for thoughts, ideas, and colorful experiments.</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => {
            const colorClass = cardColors[index % cardColors.length];
            return (
              <a 
                href={`/${post.slug}`} 
                class={`block p-6 border-4 border-black rounded-2xl ${colorClass} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all duration-200 group`}
              >
                <div class="bg-white/50 w-fit px-3 py-1 rounded-full border-2 border-black text-xs font-black mb-3">
                  {new Date(post.date).toLocaleDateString()}
                </div>
                <h2 class="text-3xl mb-3 leading-tight group-hover:underline decoration-2 underline-offset-2">{post.title}</h2>
                <p class="font-bold text-gray-800 opacity-80 line-clamp-3">{post.excerpt}</p>
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
});
