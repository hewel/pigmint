import useSWR from "swr";
import { formatDistanceToNow } from "date-fns";
import { SocialIcons } from "../components/SocialIcons.tsx";
import { CopyrightIcon } from "@phosphor-icons/react/dist/csr/Copyright";
import { WarningIcon } from "@phosphor-icons/react/dist/csr/Warning";
import { StarIcon } from "@phosphor-icons/react/dist/csr/Star";
import { GitForkIcon } from "@phosphor-icons/react/dist/csr/GitFork";
import { ClockIcon } from "@phosphor-icons/react/dist/csr/Clock";
import { ScalesIcon } from "@phosphor-icons/react/dist/csr/Scales";

interface Social {
  name: string;
  icon: string;
  url: string;
}

interface GitHubStats {
  stars: number;
  forks: number;
  lastCommit: string | null;
  license: string | null;
}

interface ConfigData {
  social: Social[];
  github: {
    repo: string | null;
    repoUrl: string | null;
    stats: GitHubStats | null;
  };
}

function getYear(): number {
  return new Date().getFullYear();
}

function formatRelativeDate(date: string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export default function Footer() {
  const { data: config, error, isLoading } = useSWR<ConfigData>(
    "/api/config",
    (url: string) => fetch(url).then((res) => res.json()),
    {
      revalidateOnFocus: false,
    },
  );

  // Fallback social links when API fails
  const fallbackSocial: Social[] = [
    { name: "GitHub", icon: "github", url: "https://github.com" },
  ];

  const socialLinks = error ? fallbackSocial : config?.social ?? [];

  return (
    <footer class="bg-whalies-navy text-white py-12 mt-auto">
      <div class="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="text-center md:text-left">
          <h2 class="font-cartoon text-2xl mb-2">PigMint Blog</h2>
          <p class="text-gray-400 text-sm max-w-xs mx-auto md:mx-0">
            A colorful journey through web development and design. Built with
            Fresh and Tailwind CSS.
          </p>
          {/* GitHub Stats */}
          {isLoading
            ? (
              <div class="mt-4 flex items-center justify-center md:justify-start gap-4 text-sm text-gray-500">
                <span class="animate-pulse">Loading stats...</span>
              </div>
            )
            : error
            ? (
              <div class="mt-4 flex items-center justify-center md:justify-start gap-4 text-sm text-gray-500">
                <WarningIcon weight="duotone" size={18} />
                <span>Unable to load stats</span>
              </div>
            )
            : config?.github?.stats && config.github.repoUrl
            ? (
              <a
                href={config.github.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="mt-4 inline-flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-sm text-gray-400 hover:text-whalies-default transition-colors"
                title="View on GitHub"
              >
                <span class="flex items-center gap-1.5">
                  <StarIcon weight="duotone" className="text-lg" />
                  <span>{config.github.stats.stars}</span>
                </span>
                <span class="flex items-center gap-1.5">
                  <GitForkIcon weight="duotone" className="text-lg" />
                  <span>{config.github.stats.forks}</span>
                </span>
                {config.github.stats.lastCommit && (
                  <span class="flex items-center gap-1.5 whitespace-nowrap">
                    <ClockIcon weight="duotone" className="text-lg" />
                    <span>
                      {formatRelativeDate(config.github.stats.lastCommit)}
                    </span>
                  </span>
                )}
                {config.github.stats.license && (
                  <span class="flex items-center gap-1.5">
                    <ScalesIcon weight="duotone" className="text-lg" />
                    <span>{config.github.stats.license}</span>
                  </span>
                )}
              </a>
            )
            : null}
        </div>
        {/* Social Links */}
        <div class="flex gap-6">
          {isLoading
            ? (
              <div class="flex gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    class="w-8 h-8 bg-gray-700 rounded animate-pulse"
                  />
                ))}
              </div>
            )
            : (
              socialLinks.map((item) => {
                const Icon = SocialIcons[item.icon];
                return (
                  <a
                    key={item.name}
                    href={item.url}
                    class="hover:text-whalies-default transition-colors"
                    title={item.name}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {Icon && <Icon weight="duotone" className="text-2xl" />}
                  </a>
                );
              })
            )}
        </div>
      </div>
      <div class="flex justify-center items-center gap-0.5 text-center mt-8 pt-8 border-t border-white/10 text-gray-500 text-sm">
        <CopyrightIcon weight="duotone" /> {getYear()}{" "}
        PigMint. All rights reserved.
      </div>
    </footer>
  );
}
