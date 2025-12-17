import { config } from "../utils.ts";

export interface GitHubStats {
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  lastCommit: string | null;
  license: string | null;
  description: string | null;
  language: string | null;
}

const kv = await Deno.openKv();

interface CachedGitHubStats {
  data: GitHubStats;
  timestamp: number;
}

const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

export async function getGitHubStats(): Promise<GitHubStats | null> {
  // Check KV cache first
  const entry = await kv.get<CachedGitHubStats>(["github", "stats"]);

  if (entry.value && Date.now() - entry.value.timestamp < CACHE_TTL) {
    return entry.value.data;
  }

  try {
    const [owner, repo] = config.github.repo.split("/");

    // Fetch repo data
    const repoRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "PigMint-Blog",
        },
      },
    );

    if (!repoRes.ok) {
      console.error("GitHub API error:", repoRes.status);
      return null;
    }

    const repoData = await repoRes.json();

    const stats: GitHubStats = {
      stars: repoData.stargazers_count ?? 0,
      forks: repoData.forks_count ?? 0,
      watchers: repoData.subscribers_count ?? 0,
      openIssues: repoData.open_issues_count ?? 0,
      lastCommit: repoData.pushed_at || null,
      license: repoData.license?.spdx_id || null,
      description: repoData.description || null,
      language: repoData.language || null,
    };

    // Update KV cache
    await kv.set(["github", "stats"], { data: stats, timestamp: Date.now() });

    return stats;
  } catch (error) {
    console.error("Failed to fetch GitHub stats:", error);
    return null;
  }
}
