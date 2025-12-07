import { define, getConfig } from "../utils.ts";
import { getPosts } from "../lib/posts.ts";

export const handler = define.handlers({
  async GET() {
    const [posts, config] = await Promise.all([
      getPosts(),
      getConfig(),
    ]);

    const baseUrl = config.base.url;

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  ${
      posts
        .map((post) => {
          return `
  <url>
    <loc>${baseUrl}/${post.slug}</loc>
    <lastmod>${new Date(post.date).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
        })
        .join("")
    }
</urlset>`;

    return new Response(sitemap, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  },
});
