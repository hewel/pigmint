import { extract } from "@std/front-matter/any";

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string; // Raw markdown content
}

export async function getPosts(): Promise<Post[]> {
  const posts: Post[] = [];
  for await (const dirEntry of Deno.readDir("./posts")) {
    if (dirEntry.isFile && dirEntry.name.endsWith(".md")) {
      const slug = dirEntry.name.replace(".md", "");
      const path = `./posts/${dirEntry.name}`;
      const fileContent = await Deno.readTextFile(path);
      const { attrs, body } = extract(fileContent);
      const attributes = attrs as { title: string; date: string; excerpt: string };
      posts.push({
        slug,
        title: attributes.title,
        date: attributes.date,
        excerpt: attributes.excerpt,
        content: body, // Return raw markdown
      });
    }
  }
  return posts.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const path = `./posts/${slug}.md`;
    const fileContent = await Deno.readTextFile(path);
    const { attrs, body } = extract(fileContent);
    const attributes = attrs as { title: string; date: string; excerpt: string };
    return {
      slug,
      title: attributes.title,
      date: attributes.date,
      excerpt: attributes.excerpt,
      content: body, // Return raw markdown
    };
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      return null;
    }
    throw e;
  }
}
