import { parse } from "@std/toml";

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  readingTime: number;
  tags: string[];
  author?: string;
}

interface PostsConfig {
  posts: Post[];
}

let cachedPosts: Post[] | null = null;

async function loadPosts(): Promise<Post[]> {
  if (cachedPosts) return cachedPosts;

  try {
    const configText = await Deno.readTextFile("config.toml");
    const config = parse(configText) as { base?: { postsDir?: string } };
    const postsDir = config.base?.postsDir || "./posts";
    const text = await Deno.readTextFile(`${postsDir}/posts.toml`);
    const data = parse(text) as unknown as PostsConfig;
    cachedPosts = data.posts;
    return cachedPosts;
  } catch (e) {
    console.error("Failed to load posts.toml", e);
    return [];
  }
}

export async function getPosts(tag?: string): Promise<Post[]> {
  const posts = await loadPosts();
  if (tag) {
    return posts.filter((post) => post.tags.includes(tag));
  }
  return posts;
}

export async function getAllTags(): Promise<string[]> {
  const posts = await loadPosts();
  const tags = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags).sort();
}

export async function getPost(slug: string): Promise<Post | null> {
  const posts = await loadPosts();
  const post = posts.find((p) => p.slug === slug);
  return post || null;
}
