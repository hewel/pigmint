import { extract } from "@std/front-matter/any";

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  readingTime: number; // in minutes
  tags: string[];
  author?: string;
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export async function getPosts(tag?: string): Promise<Post[]> {
  const posts: Post[] = [];
  for await (const dirEntry of Deno.readDir("./posts")) {
    if (dirEntry.isFile && dirEntry.name.endsWith(".md")) {
      const slug = dirEntry.name.replace(".md", "");
      const path = `./posts/${dirEntry.name}`;
      const fileContent = await Deno.readTextFile(path);
      const { attrs, body } = extract(fileContent);
      const attributes = attrs as {
        title: string;
        date: string;
        excerpt: string;
        tags?: string[];
        author?: string;
      };

      // Filter by tag if provided
      if (tag && (!attributes.tags || !attributes.tags.includes(tag))) {
        continue;
      }

      posts.push({
        slug,
        title: attributes.title,
        date: attributes.date,
        excerpt: attributes.excerpt,
        content: body,
        readingTime: calculateReadingTime(body),
        tags: attributes.tags || [],
        author: attributes.author || "Anonymous",
      });
    }
  }
  return posts.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getPosts();
  const tags = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags).sort();
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const path = `./posts/${slug}.md`;
    const fileContent = await Deno.readTextFile(path);
    const { attrs, body } = extract(fileContent);
    const attributes = attrs as {
      title: string;
      date: string;
      excerpt: string;
      tags?: string[];
      author?: string;
    };
    return {
      slug,
      title: attributes.title,
      date: attributes.date,
      excerpt: attributes.excerpt,
      content: body,
      readingTime: calculateReadingTime(body),
      tags: attributes.tags || [],
      author: attributes.author || "Anonymous",
    };
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      return null;
    }
    throw e;
  }
}
