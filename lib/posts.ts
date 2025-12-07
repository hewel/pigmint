import { type Post, POSTS } from "./posts.gen.ts";

export type { Post };

export function getPosts(tag?: string): Post[] {
  if (tag) {
    return POSTS.filter((post) => post.tags.includes(tag));
  }
  return POSTS;
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const post of POSTS) {
    for (const tag of post.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags).sort();
}

export function getPost(slug: string): Post | null {
  const post = POSTS.find((p) => p.slug === slug);
  return post || null;
}
