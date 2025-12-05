import { page, PageProps } from "fresh";
import { define, getConfig, getSiteBaseUrl, Social } from "../utils.ts";
import { Head } from "fresh/runtime";
import { getGitHubStats, GitHubStats } from "../lib/github.ts";
import Layout from "../components/Layout.tsx";
import SEO from "../components/SEO.tsx";

interface Data {
  githubStats: GitHubStats | null;
  social: Social[];
  siteBaseUrl: string;
  repoUrl: string;
}

export const handler = define.handlers<Data>({
  async GET() {
    const [githubStats, config, siteBaseUrl] = await Promise.all([
      getGitHubStats(),
      getConfig(),
      getSiteBaseUrl(),
    ]);
    const repoUrl = `https://github.com/${config.github.repo}`;
    return page({ githubStats, social: config.social, siteBaseUrl, repoUrl });
  },
});

export default define.page(function AboutPage({ data }: PageProps<Data>) {
  const { githubStats, social, siteBaseUrl, repoUrl } = data;
  return (
    <>
      <Head>
        <SEO
          title="About PigMint Blog"
          description="Learn more about the PigMint Blog, our mission, and the technologies we use."
          url={`${siteBaseUrl}/about`}
        />
      </Head>
      <Layout githubStats={githubStats} social={social} repoUrl={repoUrl}>
        <div class="px-4 py-12 mx-auto max-w-5xl">
          <article class="bg-white dark:bg-gray-800 border-4 border-whalies-navy dark:border-gray-500 rounded-4xl p-6 md:p-12 shadow-cartoon text-whalies-navy dark:text-gray-100">
            <header class="mb-8 text-center">
              <h1 class="text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight font-cartoon font-black text-whalies-navy dark:text-gray-100">
                About PigMint
              </h1>
            </header>
            <div class="markdown-content mx-auto text-left">
              <p>
                Welcome to PigMint Blog! This project serves as a modern,
                playful, and educational platform built using cutting-edge web
                technologies.
              </p>
              <p>
                Our goal is to explore topics in web development, design, and
                related fields through colorful and engaging articles, all while
                demonstrating best practices and innovative approaches in
                frontend engineering.
              </p>

              <h2 class="text-3xl mt-8 mb-4 font-cartoon text-whalies-navy dark:text-gray-100">
                Technology Stack
              </h2>
              <ul>
                <li>
                  <strong>Fresh:</strong>{" "}
                  Deno's next-gen web framework, powering our server-side
                  rendering and routing.
                </li>
                <li>
                  <strong>Deno:</strong>{" "}
                  A secure runtime for JavaScript and TypeScript.
                </li>
                <li>
                  <strong>Preact:</strong>{" "}
                  A fast 3.5kB alternative to React with the same modern API.
                </li>
                <li>
                  <strong>Tailwind CSS v4:</strong>{" "}
                  For rapid and utility-first styling, enabling our unique
                  "Whalies" inspired theme.
                </li>
                <li>
                  <strong>react-markdown & rehype-highlight:</strong>{" "}
                  For robust Markdown parsing and beautiful syntax highlighting
                  of code blocks.
                </li>
                <li>
                  <strong>Phosphor Icons:</strong>{" "}
                  A flexible icon family for enhanced UI visuals.
                </li>
              </ul>

              <h2 class="text-3xl mt-8 mb-4 font-cartoon text-whalies-navy dark:text-gray-100">
                Our Vision
              </h2>
              <p>
                We believe in making learning fun and accessible. Through
                PigMint, we aim to share insights, tutorials, and experiments
                that inspire creativity and technical growth in the developer
                community.
              </p>
            </div>
          </article>
        </div>
      </Layout>
    </>
  );
});
