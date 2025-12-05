import { ComponentChildren } from "preact";
import Navbar from "./Navbar.tsx";
import Footer from "./Footer.tsx";
import type { GitHubStats } from "../lib/github.ts";
import type { Social } from "../utils.ts";

interface LayoutProps {
  children: ComponentChildren;
  showBackButton?: boolean;
  githubStats?: GitHubStats | null;
  social: Social[];
  repoUrl?: string;
}

export default function Layout({ children, showBackButton, githubStats, social, repoUrl }: LayoutProps) {
  return (
    <div class="flex flex-col min-h-screen">
      <Navbar showBackButton={showBackButton} />
      <main class="grow pt-24">
        {children}
      </main>
      <Footer social={social} githubStats={githubStats} repoUrl={repoUrl} />
    </div>
  );
}
