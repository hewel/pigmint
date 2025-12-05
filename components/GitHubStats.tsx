import { GitHubStats as Stats } from "../lib/github.ts";
import { formatRelativeDate } from "../utils.ts";

interface GitHubStatsProps {
  stats: Stats;
  repoUrl: string;
}

export default function GitHubStats({ stats, repoUrl }: GitHubStatsProps) {
  return (
    <a
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-sm text-gray-400 hover:text-whalies-default transition-colors"
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
        <span class="flex items-center gap-1.5 whitespace-nowrap">
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
