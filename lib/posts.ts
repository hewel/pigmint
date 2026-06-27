import { posts as generatedPosts } from "./posts.generated.ts";
import type { Post } from "./post_types.ts";

export type { Post } from "./post_types.ts";

let cachedPosts: Post[] | null = null;

function loadPosts(): Post[] {
  if (cachedPosts) return cachedPosts;

  cachedPosts = generatedPosts;
  return cachedPosts;
}

export function getPosts(tag?: string): Post[] {
  const posts = loadPosts();
  if (tag) {
    return posts.filter((post) => post.tags.includes(tag));
  }
  return posts;
}

export function getAllTags(): string[] {
  const posts = loadPosts();
  const tags = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags).sort();
}

export function getPost(slug: string): Post | null {
  const posts = loadPosts();
  const post = posts.find((p) => p.slug === slug);
  return post || null;
}
