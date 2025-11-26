import { marked } from "marked";
import matter from "gray-matter";

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

export async function getPosts(): Promise<Post[]> {
  const posts: Post[] = [];
  for await (const dirEntry of Deno.readDir("./posts")) {
    if (dirEntry.isFile && dirEntry.name.endsWith(".md")) {
      const slug = dirEntry.name.replace(".md", "");
      const path = `./posts/${dirEntry.name}`;
      const fileContent = await Deno.readTextFile(path);
      const { data, content } = matter(fileContent);
      const htmlContent = marked(content);
      posts.push({
        slug,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        content: htmlContent,
      });
    }
  }
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const path = `./posts/${slug}.md`;
    const fileContent = await Deno.readTextFile(path);
    const { data, content } = matter(fileContent);
    const htmlContent = marked(content);
    return {
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      content: htmlContent,
    };
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      return null;
    }
    throw e;
  }
}
