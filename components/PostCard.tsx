import { Post } from "../lib/posts.ts";
import Tag from "./Tag.tsx";

interface PostCardProps {
  post: Post;
  colorClass: string;
}

export default function PostCard({ post, colorClass }: PostCardProps) {
  return (
    <article
      aria-label={`Post titled ${post.title}`}
      class={`flex flex-col h-full p-6 border-4 border-whalies-navy rounded-4xl ${colorClass} shadow-cartoon hover:translate-y-1 hover:translate-x-1 hover:shadow-cartoon-hover transition-all duration-200 group`}
    >
      {/* Tags at the top */}
      <div class="flex flex-wrap gap-2 mb-4">
        {post.tags &&
          post.tags.map((tag) => (
            <Tag key={tag} name={tag} href={`/?tag=${tag}`} />
          ))}
      </div>

      {/* Title with mascot icon */}
      <a href={`/${post.slug}`} class="block mb-3">
        <h3 class="flex items-center gap-2 text-3xl leading-tight font-cartoon group-hover:underline decoration-2 underline-offset-2 text-whalies-navy">
          <span>{post.title}</span>
        </h3>
      </a>

      {/* Excerpt */}
      <p class="font-body text-gray-800 opacity-80 line-clamp-3 mb-4">
        {post.excerpt}
      </p>

      {/* Date badge at the bottom */}
      <div class="mt-auto flex justify-end">
        <span class="bg-white/50 px-3 py-1 rounded-full border-2 border-whalies-navy text-xs font-cartoon font-black text-whalies-navy">
          {new Date(post.date).toLocaleDateString()}
        </span>
      </div>
    </article>
  );
}
