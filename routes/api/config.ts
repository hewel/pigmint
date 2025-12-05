import { define, getConfig } from "../../utils.ts";
import { getGitHubStats } from "../../lib/github.ts";

export const handler = define.handlers({
  async GET() {
    const [config, githubStats] = await Promise.all([
      getConfig(),
      getGitHubStats(),
    ]);

    const repoUrl = config.github?.repo
      ? `https://github.com/${config.github.repo}`
      : null;

    return new Response(
      JSON.stringify({
        social: config.social,
        github: {
          repo: config.github?.repo,
          repoUrl,
          stats: githubStats,
        },
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=300", // Cache for 5 minutes
        },
      },
    );
  },
});
