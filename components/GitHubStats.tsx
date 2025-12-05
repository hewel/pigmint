import { GitHubStats as Stats } from "../lib/github.ts";
import { config, formatRelativeDate } from "../utils.ts";

interface GitHubStatsProps {
  stats: Stats;
}

export default function GitHubStats({ stats }: GitHubStatsProps) {
  const repoUrl = `https://github.com/${config.github.repo}`;

  return (
    <a
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      class="flex flex-wrap items-center gap-4 text-sm text-gray-400 hover:text-whalies-default transition-colors"
      title="View on GitHub"
    >
      <span class="flex items-center gap-1.5">
        <i class="ph-duotone ph-star text-lg"></i>
        <span>{stats.stars}</span>
      </span>
      <span class="flex items-center gap-1.5">
        <i class="ph-duotone ph-git-fork text-lg"></i>
        <span>{stats.forks}</span>
      </span>
      {stats.lastCommit && (
        <span class="flex items-center gap-1.5">
          <i class="ph-duotone ph-clock text-lg"></i>
          <span>{formatRelativeDate(stats.lastCommit)}</span>
        </span>
      )}
      {stats.license && (
        <span class="flex items-center gap-1.5">
          <i class="ph-duotone ph-scales text-lg"></i>
          <span>{stats.license}</span>
        </span>
      )}
    </a>
  );
}
