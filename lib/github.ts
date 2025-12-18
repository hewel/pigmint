import { config } from "../utils.ts";
import { validateGitHubRepo } from "./security.ts";

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

interface CachedGitHubStats {
  data: GitHubStats;
  timestamp: number;
}

const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

let kv: Deno.Kv | null = null;
async function getKv(): Promise<Deno.Kv | null> {
  if (kv) return kv;
  // Check if running in an environment where Deno.openKv is available
  // @ts-ignore: Deno might not be defined in browser
  if (typeof Deno === "undefined" || typeof Deno.openKv !== "function") {
    return null;
  }
  try {
    kv = await Deno.openKv();
    return kv;
  } catch (error) {
    console.warn("Failed to open KV:", error);
    return null;
  }
}

export async function getGitHubStats(): Promise<GitHubStats | null> {
  // Check KV cache first
  const currentKv = await getKv();
  let entry = null;

  if (currentKv) {
    try {
      entry = await currentKv.get<CachedGitHubStats>(["github", "stats"]);
    } catch (e) {
      console.warn("Error reading from KV:", e);
    }
  }

  if (entry?.value && Date.now() - entry.value.timestamp < CACHE_TTL) {
    return entry.value.data;
  }

  try {
    // Validate GitHub repository format
    if (!validateGitHubRepo(config.github.repo)) {
      console.error("Invalid GitHub repository format:", config.github.repo);
      return null;
    }

    const [owner, repo] = config.github.repo.split("/");

    // Get GitHub token from environment variable
    const token = Deno.env.get("GITHUB_TOKEN");

    // Build headers with authentication if available
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "PigMint-Blog",
    };

    if (token) {
      headers["Authorization"] = `token ${token}`;
    }

    // Fetch repo data
    const repoRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers },
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
    if (currentKv) {
      try {
        await currentKv.set(["github", "stats"], {
          data: stats,
          timestamp: Date.now(),
        });
      } catch (e) {
        console.warn("Error writing to KV:", e);
      }
    }

    return stats;
  } catch (error) {
    console.error("Failed to fetch GitHub stats:", error);
    return null;
  }
}
