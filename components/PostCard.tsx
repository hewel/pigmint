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
      class={`block p-6 border-4 border-whalies-navy rounded-4xl ${colorClass} shadow-cartoon hover:translate-y-1 hover:translate-x-1 hover:shadow-cartoon-hover transition-all duration-200 group`}
    >
      <div class="flex flex-wrap gap-x-2 gap-y-1 mb-3">
        <span class="bg-white/50 w-fit px-3 py-1 rounded-full border-2 border-whalies-navy text-xs font-cartoon font-black text-whalies-navy">
          {new Date(post.date).toLocaleDateString()}
        </span>
        {post.tags &&
          post.tags.map((tag) => (
            <Tag key={tag} name={tag} href={`/?tag=${tag}`} />
          ))}
      </div>
      <a href={`/${post.slug}`}>
        <h3 class="text-3xl mb-3 leading-tight font-cartoon group-hover:underline decoration-2 underline-offset-2 text-whalies-navy">
          {post.title}
        </h3>
      </a>
      <p class="font-body text-gray-800 opacity-80 line-clamp-3">
        {post.excerpt}
      </p>
    </article>
  );
}
